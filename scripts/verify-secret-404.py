"""Check the built secret 404's HTTP status, metadata and useful server shell."""
import argparse
import http.client
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


class Shell(HTMLParser):
    def __init__(self):
        super().__init__()
        self.titles = []
        self.robots = []
        self.links = []
        self.ids = set()
        self.video_count = 0
        self._title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self._title = True
            self.titles.append('')
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.robots.append(attrs.get('content', ''))
        if tag == 'a':
            self.links.append(attrs.get('href'))
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'video':
            self.video_count += 1

    def handle_data(self, data):
        if self._title:
            self.titles[-1] += data

    def handle_endtag(self, tag):
        if tag == 'title':
            self._title = False


def main():
    args_parser = argparse.ArgumentParser(description=__doc__)
    args_parser.add_argument('--base-url', default='http://127.0.0.1:3003')
    args_parser.add_argument('--report', default='output/secret-404/http.json')
    args = args_parser.parse_args()
    base = urlparse(args.base_url)
    allowed = (base.scheme == 'http' and base.hostname in ('localhost', '127.0.0.1')) or (
        base.scheme == 'https' and base.hostname == 'tomas-garbarino.vercel.app')
    if not allowed or base.path not in ('', '/') or base.query or base.fragment:
        args_parser.error('Use a local HTTP build or the canonical production HTTPS origin.')
    results = []
    for route in ('/404', '/off-the-grid', '/en/absent-page'):
        client = (http.client.HTTPSConnection if base.scheme == 'https' else http.client.HTTPConnection)(base.netloc, timeout=20)
        try:
            client.request('GET', route)
            response = client.getresponse()
            shell = Shell()
            shell.feed(response.read().decode('utf-8'))
            checks = {
                'real_404': response.status == 404,
                'noindex': any('noindex' in robots for robots in shell.robots),
                'one_descriptive_title': len(shell.titles) == 1 and '404' in shell.titles[0] and 'Off the grid' in shell.titles[0],
                'server_shell': {'missing-page', 'lost-signals'} <= shell.ids,
                'return_link': '/' in shell.links,
                'no_video': shell.video_count == 0,
            }
            results.append({'route': route, 'status': response.status, 'titles': shell.titles, 'checks': checks})
        finally:
            client.close()
    passed = sum(sum(result['checks'].values()) for result in results)
    report = {'base_url': args.base_url, 'routes': results, 'passed': passed, 'failed': 18 - passed}
    target = Path(args.report)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if report['failed'] == 0 else 1


if __name__ == '__main__':
    raise SystemExit(main())
