"""Verify local migration entry points and server-rendered metadata (stdlib only)."""
import argparse
import http.client
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None
        self.canonical = None
        self.description = None
        self.h1 = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical = attrs.get('href')
        if tag == 'meta' and attrs.get('name') == 'description': self.description = attrs.get('content')
        if tag == 'h1': self.h1 += 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://localhost:3000')
    parser.add_argument('--report', default='output/portfolio-design-2027/arena-route-final.json')
    args = parser.parse_args()
    base = urlparse(args.base_url)
    if base.hostname not in ('localhost', '127.0.0.1') or base.scheme != 'http':
        parser.error('Use the already-running local HTTP preview.')
    checks = []

    def get(path):
        connection = http.client.HTTPConnection(base.hostname, base.port or 80, timeout=20)
        connection.request('GET', path)
        response = connection.getresponse()
        result = response.status, dict(response.getheaders()), response.read().decode('utf-8', errors='replace')
        connection.close()
        return result

    for route, target in {'/en': '/', '/es': '/', '/trainly': '/en/trainly', '/es/trainly': '/en/trainly', '/trainyl': '/en/trainly'}.items():
        status, headers, _ = get(route)
        location = headers.get('Location', headers.get('location'))
        checks.append({'check': route, 'passed': status == 308 and location == target, 'status': status, 'location': location})
    for route in ('/', '/en/trainly'):
        status, _, html = get(route)
        head = Head()
        head.feed(html)
        expected = 'https://tomas-garbarino.vercel.app' + (route if route != '/' else '/')
        canonical_matches = (head.canonical or '').rstrip('/') == expected.rstrip('/')
        checks.append({'check': route + ' metadata', 'passed': status == 200 and head.lang == 'en' and head.h1 == 1 and bool(head.description) and canonical_matches, 'status': status, 'canonical': head.canonical, 'lang': head.lang, 'h1': head.h1})
    for route in ('/robots.txt', '/sitemap.xml'):
        status, _, body = get(route)
        checks.append({'check': route, 'passed': status == 200 and 'https://tomas-garbarino.vercel.app' in body, 'status': status})
    status, _, _ = get('/route-that-does-not-exist')
    checks.append({'check': 'unknown route', 'passed': status == 404, 'status': status})
    report = {'base_url': args.base_url, 'checks': checks, 'passed': sum(item['passed'] for item in checks), 'failed': sum(not item['passed'] for item in checks)}
    dest = Path(args.report)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2))
    return int(report['failed'] > 0)


if __name__ == '__main__':
    raise SystemExit(main())
