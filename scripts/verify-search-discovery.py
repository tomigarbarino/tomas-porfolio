"""Verify public SEO and structured-data contracts from HTTP HTML, before hydration."""
import argparse
import http.client
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree


SITE = 'https://tomas-garbarino.vercel.app'
PERSON_ID = SITE + '/#person'
WEBSITE_ID = SITE + '/#website'
PAPER = 'https://www.flocklabs.ar/research/como-decide-jev-en-agora-probabilidades-umbrales-y-revision-humana'
ROUTES = ('/', '/en/agora', '/en/trainly')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None
        self.canonical = None
        self.meta = {}
        self.links = set()
        self.h1 = 0
        self.text = []
        self.json_ld = []
        self._script = False
        self._style = False
        self._json_buffer = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'html':
            self.lang = attrs.get('lang')
        if tag == 'h1':
            self.h1 += 1
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')
        if tag == 'a' and 'href' in attrs:
            self.links.add(attrs['href'])
        if tag == 'script':
            self._script = True
            if attrs.get('type') == 'application/ld+json':
                self._json_buffer = []
        if tag == 'style':
            self._style = True

    def handle_data(self, data):
        if self._json_buffer is not None:
            self._json_buffer.append(data)
        if not self._script and not self._style:
            self.text.append(data)

    def handle_endtag(self, tag):
        if tag == 'script':
            if self._json_buffer is not None:
                self.json_ld.append(''.join(self._json_buffer))
                self._json_buffer = None
            self._script = False
        if tag == 'style':
            self._style = False


def normalized_url(value):
    return (value or '').rstrip('/')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:3001')
    parser.add_argument('--report', default='output/accessibility-ai-search/search-discovery.json')
    args = parser.parse_args()
    base = urlparse(args.base_url)
    local = base.hostname in ('localhost', '127.0.0.1') and base.scheme == 'http'
    production = base.hostname == 'tomas-garbarino.vercel.app' and base.scheme == 'https'
    if not (local or production) or base.path not in ('', '/') or base.query or base.fragment:
        parser.error('Use a local HTTP preview or the canonical production HTTPS origin.')
    checks = []

    def check(name, passed, **evidence):
        checks.append({'check': name, 'passed': bool(passed), **evidence})

    def get(path):
        cls = http.client.HTTPSConnection if base.scheme == 'https' else http.client.HTTPConnection
        connection = cls(base.hostname, base.port, timeout=30)
        try:
            connection.request('GET', path, headers={'User-Agent': 'PortfolioSearchVerification/1.0'})
            response = connection.getresponse()
            return response.status, {key.lower(): value for key, value in response.getheaders()}, response.read()
        finally:
            connection.close()

    images = set()
    for route in ROUTES:
        status, headers, body = get(route)
        page = Page()
        page.feed(body.decode('utf-8'))
        canonical = SITE + (route if route != '/' else '/')
        server_text = ' '.join(' '.join(page.text).split())
        check(route + ' public HTML', status == 200 and page.lang == 'en' and page.h1 == 1,
              status=status, lang=page.lang, h1=page.h1)
        check(route + ' canonical and social URL',
              normalized_url(page.canonical) == normalized_url(canonical)
              and normalized_url(page.meta.get('og:url')) == normalized_url(canonical),
              canonical=page.canonical, og_url=page.meta.get('og:url'))
        check(route + ' descriptive share metadata',
              bool(page.meta.get('description')) and bool(page.meta.get('og:title'))
              and bool(page.meta.get('og:description')) and bool(page.meta.get('og:site_name'))
              and page.meta.get('twitter:card') == 'summary_large_image'
              and bool(page.meta.get('twitter:image')),
              twitter_card=page.meta.get('twitter:card'), site_name=page.meta.get('og:site_name'))
        check(route + ' no indexing block',
              'noindex' not in page.meta.get('robots', '').lower()
              and 'noindex' not in headers.get('x-robots-tag', '').lower())
        check(route + ' visible role and employer in initial HTML',
              'Flock I+D' in server_text and 'Product ' in server_text)

        documents = []
        parse_errors = []
        for raw in page.json_ld:
            try:
                documents.append(json.loads(raw))
            except json.JSONDecodeError as error:
                parse_errors.append(str(error))
        nodes = [node for document in documents for node in document.get('@graph', [])]
        by_id = {node.get('@id'): node for node in nodes}
        check(route + ' parseable schema.org graph', len(documents) == 1 and not parse_errors
              and documents[0].get('@context') == 'https://schema.org'
              and len(by_id) == len(nodes), node_count=len(nodes), errors=parse_errors)
        person = by_id.get(PERSON_ID, {})
        website = by_id.get(WEBSITE_ID, {})
        check(route + ' stable person and website identity',
              person.get('@type') == 'Person' and person.get('name') == 'Tomás Garbarino'
              and person.get('jobTitle') == 'Product Engineer / Applied AI'
              and person.get('worksFor', {}).get('name') == 'Flock I+D'
              and set(person.get('sameAs', [])) == {
                  'https://www.linkedin.com/in/tomas-garbarino/', 'https://github.com/tomigarbarino'}
              and website.get('@type') == 'WebSite'
              and website.get('publisher', {}).get('@id') == PERSON_ID)

        if route == '/':
            profile = by_id.get(SITE + '/#profile', {})
            check('home profile graph and case links', profile.get('@type') == 'ProfilePage'
                  and profile.get('mainEntity', {}).get('@id') == PERSON_ID
                  and profile.get('isPartOf', {}).get('@id') == WEBSITE_ID
                  and {'/en/agora', '/en/trainly'}.issubset(page.links))
            check('home attribution distinguishes Flock and Batech',
                  'Flock I+D' in page.meta.get('description', '')
                  and 'Former Frontend Lead at Batech' in page.meta.get('description', ''))
        else:
            case = by_id.get(canonical + '#case-study', {})
            expected_name = 'Agora' if route.endswith('agora') else 'Trainly'
            check(route + ' case narrative authorship graph', case.get('@type') == 'CreativeWork'
                  and case.get('url') == canonical and case.get('mainEntityOfPage') == canonical
                  and case.get('author', {}).get('@id') == PERSON_ID
                  and case.get('about') == {'@type': 'Thing', 'name': expected_name}
                  and case.get('isPartOf', {}).get('@id') == WEBSITE_ID
                  and 'Flock I+D' in case.get('description', ''))
            image = case.get('image', '')
            check(route + ' actual case screenshot in graph', image == page.meta.get('og:image')
                  and image.startswith(SITE + '/media/' + expected_name.lower() + '/'), image=image)
            if route.endswith('agora'):
                check('Agora research citation and bounded evidence', case.get('citation') == PAPER
                      and PAPER in page.links and '80.9%' in server_text and '54.1%' in server_text
                      and 'hiring outcomes were not measured' in server_text)
        for name in ('og:image', 'twitter:image'):
            image = page.meta.get(name, '')
            if image.startswith(SITE + '/'):
                images.add(urlparse(image).path)

    for path in sorted(images):
        status, headers, _ = get(path)
        check(path + ' share image available', status == 200
              and headers.get('content-type', '').startswith('image/'), status=status)
    status, _, raw = get('/robots.txt')
    robots = raw.decode('utf-8')
    check('robots preserves public crawl access', status == 200 and 'User-agent: *' in robots
          and 'Allow: /' in robots and 'Sitemap: ' + SITE + '/sitemap.xml' in robots)
    status, _, raw = get('/sitemap.xml')
    try:
        root = ElementTree.fromstring(raw)
        locations = [element.text for element in root.findall('{*}url/{*}loc')]
    except ElementTree.ParseError:
        locations = []
    check('sitemap has canonical public routes', status == 200
          and set(locations) == {SITE + route for route in ROUTES}, locations=locations)
    status, _, _ = get('/search-verification-unknown-route')
    check('unknown route returns HTTP 404', status == 404, status=status)
    report = {
        'base_url': args.base_url,
        'scope': 'HTTP HTML and graph contracts; not indexing, AI citation or WCAG certification',
        'checks': checks,
        'passed': sum(item['passed'] for item in checks),
        'failed': sum(not item['passed'] for item in checks),
    }
    destination = Path(args.report)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return int(report['failed'] > 0)


if __name__ == '__main__':
    raise SystemExit(main())
