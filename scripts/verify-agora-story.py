"""Native browser journeys for the Agora dossier and named career story.

Use a running local production preview. Reuses the existing geometry, native
selection and flow checks; never installs a browser or changes app styles/state
through JavaScript. Browser evaluation is read-only.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('arena_qa', ROOT / 'scripts/verify-arena-refinement.py')
arena_qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(arena_qa)
Suite, existing_chromium, require, normal = arena_qa.Suite, arena_qa.existing_chromium, arena_qa.require, arena_qa.normal


def healthy(page):
    require(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Horizontal overflow")


def story(suite):
    page = suite.page
    geometry = suite.story()
    episodes = page.locator('.origin-story__journey-list > li')
    require(episodes.count() == 5, 'Expected five visible career steps')
    names = episodes.locator('h4').all_text_contents()
    require(names == ['Minecraft files', 'Digital menus', 'Hogarth Worldwide', 'Batech', 'Flock I+D'], f'Wrong career order: {names}')
    for episode in episodes.all():
        episode.scroll_into_view_if_needed()
        require(episode.is_visible(), 'Career step is hidden')
    projects = episodes.last.locator('.origin-story__projects article')
    require(projects.count() == 2, 'Agora and Trainly must be inside the Flock step')
    require(projects.locator('a[href="/en/agora"]').count() == 1, 'Agora case link missing')
    require(projects.locator('a[href="/en/trainly"]').count() == 1, 'Trainly case link missing')
    screenshot = suite.shot('career-flock')
    card = projects.first
    card.scroll_into_view_if_needed()
    box = card.bounding_box()
    if suite.width < 768:
        arena_qa.touch_drag(page, box['x'] + 8, box['y'] + 12, 12, 0)
    else:
        arena_qa.mouse_drag(page, box['x'] + 8, box['y'] + 12, 18, 12)
    moved = arena_qa.offset(card)
    require(abs(moved['x']) + abs(moved['y']) > .5, 'Career project card cannot move from its surface')
    arena_qa.native_focus(page, '.origin-story__projects article:first-child > .artifact-drag')
    page.keyboard.press('Home')
    restored = arena_qa.offset(card)
    require(abs(restored['x']) + abs(restored['y']) < .5, 'Career card keyboard reset failed')
    tabs = page.get_by_role('tablist', name='Story chapters').get_by_role('tab')
    tabs.last.click()
    page.keyboard.press('Home')
    require(tabs.first.get_attribute('aria-selected') == 'true', 'Home did not select first chapter')
    page.keyboard.press('ArrowRight')
    require(tabs.nth(1).get_attribute('aria-selected') == 'true', 'ArrowRight did not select second chapter')
    healthy(page)
    return {'names': names, 'stage_geometry': geometry, 'career_card_surface_move': moved, 'career_card_reset': restored, 'keyboard': 'Home / ArrowRight passed', 'screenshot': screenshot}


def case_reading(suite):
    page = suite.page
    suite.pause()
    require(page.locator('h1').count() == 1, 'Expected one case heading')
    require('Agora' in page.locator('h1').inner_text(), 'Wrong case heading')
    require(page.locator('link[rel="canonical"]').get_attribute('href') == 'https://tomas-garbarino.vercel.app/en/agora', 'Wrong canonical')
    require(page.locator('.site-header__back').get_attribute('href') == '/#agora', 'Wrong return section')
    require('Product Owner' in page.locator('main').inner_text(), 'Personal role missing')
    suite.shot('agora-hero')
    source = page.locator('.ad-design--hero a')
    source.scroll_into_view_if_needed()
    require(source.evaluate('''link => {
      const r = link.getBoundingClientRect();
      return link.contains(document.elementFromPoint(r.x + r.width/2, r.y + r.height/2));
    }'''), 'Hero source link is covered by decoration')
    rail = page.locator('nav').filter(has=page.locator('a[href="#decision"]'))
    require(rail.count() == 1, 'Case section navigation missing/ambiguous')
    visited = []
    for target in ('overview', 'flow', 'decision', 'experience', 'system', 'next'):
        link = rail.locator(f'a[href="#{target}"]')
        link.click()
        page.wait_for_function('(target) => location.hash === "#" + target', arg=target)
        page.wait_for_function('(target) => document.querySelector(`nav a[href="#${target}"]`)?.getAttribute("aria-current") === "location"', arg=target)
        require(page.locator(f'#{target}').is_visible(), f'{target} is hidden')
        healthy(page)
        visited.append(target)
    page.mouse.move(min(500, suite.width - 25), 420)
    delta = page.locator('#system').evaluate('section => section.getBoundingClientRect().top - innerHeight*.16')
    page.mouse.wheel(0, delta)
    page.wait_for_function("(target) => document.querySelector(`.ad-nav a[href='#${target}']`)?.getAttribute('aria-current') === 'location'", arg='system')
    page.locator('#decision').scroll_into_view_if_needed()
    decision_text = normal(page.locator('#decision').inner_text()).lower()
    require('human review' in decision_text and 'english' in decision_text, 'Decision reasoning missing')
    require('team' in decision_text and 'score' in decision_text, 'Reported bounded validation missing')
    for disclosure in page.locator('#decision details').all():
        summary = disclosure.locator('summary')
        summary.click()
        require(disclosure.get_attribute('open') is not None, 'Decision disclosure did not open')
        summary.click()
        require(disclosure.get_attribute('open') is None, 'Decision disclosure did not close')
    suite.shot('agora-decision')
    images = []
    for name in ('agora-candidate-upload', 'agora-device-check'):
        image = page.locator(f'img[src*="{name}"]').last
        image.scroll_into_view_if_needed()
        image.evaluate('(image) => image.decode()')
        require(image.evaluate('image => image.complete && image.naturalWidth > 0'), f'{name} did not load')
        images.append(image.get_attribute('alt'))
    suite.shot('agora-experience')
    healthy(page)
    return {'anchors': visited, 'native_wheel_current_section': 'system', 'hero_source_link_uncovered': True, 'design_images': images, 'disclosures_checked': page.locator('#decision details').count()}


def cross_case_motion(suite):
    page = suite.page
    suite.pause()
    page.locator('.pw-case-directory a[href="/en/agora"]').click()
    page.wait_for_url('**/en/agora')
    page.wait_for_load_state('networkidle')
    require(normal(page.locator('.motion-toggle').inner_text()) == 'Play motion', 'Pause did not persist into Agora')
    page.wait_for_function('Array.from(document.querySelectorAll("video")).every(v => v.paused && !v.controls)')
    page.locator('.site-header__back').click()
    page.wait_for_url('**/#agora')
    require(page.locator('#agora').is_visible(), 'Return to Agora preview failed')
    page.locator('#agora a[href="/en/agora"]').first.click()
    page.wait_for_url('**/en/agora')
    page.wait_for_load_state('networkidle')
    page.locator('a[href="/en/trainly"]').last.click()
    page.wait_for_url('**/en/trainly')
    page.wait_for_load_state('networkidle')
    require(normal(page.locator('.motion-toggle').inner_text()) == 'Play motion', 'Pause did not persist into Trainly')
    page.get_by_role('link', name='Next case / Agora').click()
    page.wait_for_url('**/en/agora')
    page.wait_for_load_state('networkidle')
    page.locator('.motion-toggle').click()
    page.wait_for_function('document.documentElement.dataset.motion === "playing"')
    page.wait_for_function('Array.from(document.querySelectorAll("video")).some(v => !v.paused && v.currentTime > 0)', timeout=15000)
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_function('document.documentElement.dataset.motion === "paused"')
    require(page.locator('.motion-toggle').is_disabled(), 'Reduced-motion toggle not disabled')
    page.wait_for_function('Array.from(document.querySelectorAll("video")).every(v => v.paused && !v.controls)')
    healthy(page)
    return {'journey': 'Home → Agora → Home/#agora → Agora → Trainly → Agora', 'pause_persistence': True, 'resume': True, 'reduced_motion': True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://localhost:3000')
    parser.add_argument('--app-root', type=Path, required=True)
    parser.add_argument('--build-id', required=True)
    parser.add_argument('--browser-path')
    parser.add_argument('--widths', type=int, nargs='+', default=[1440, 390, 320])
    parser.add_argument('--checks', nargs='+')
    parser.add_argument('--output', type=Path, default=ROOT / 'output/portfolio-design-2027/agora-story-native.json')
    args = parser.parse_args()
    args.output = args.output.resolve()
    require(urlparse(args.base_url).hostname in ('localhost', '127.0.0.1'), 'Use the local preview')
    artifact = args.app_root / '.next/BUILD_ID'
    require(artifact.read_text().strip() == args.build_id, 'Build identity differs from supplied checkout')
    shots = args.output.parent / args.output.stem
    shots.mkdir(parents=True, exist_ok=True)
    report = {'created_utc': datetime.now(timezone.utc).isoformat(), 'base_url': args.base_url, 'build_id': args.build_id, 'app_root': str(args.app_root.resolve()), 'method': 'Fresh context for each native-input journey; read-only DOM/geometry observations.', 'limits': ['Chromium emulation does not certify real phone selection handles or callouts.', 'No FPS or hiring conversion claim.'], 'viewports': []}
    tests = [('story-chronology-geometry', '/', story), ('agora-reading-navigation', '/en/agora', case_reading), ('agora-flow-drag', '/en/agora', lambda suite: suite.graph()), ('agora-flow-details', '/en/agora', lambda suite: suite.graph_details()), ('native-selection', '/', lambda suite: suite.selection()), ('cross-case-motion', '/', cross_case_motion)]
    if args.checks:
        tests = [test for test in tests if test[0] in args.checks]
        require(bool(tests), 'No known checks selected')
    with sync_playwright() as playwright:
        browser_path, source = existing_chromium(playwright, args.browser_path)
        browser = playwright.chromium.launch(headless=True, executable_path=str(browser_path))
        report['browser'] = {'version': browser.version, 'executable': str(browser_path), 'source': source}
        try:
            for width in args.widths:
                viewport = {'width': width, 'height': 1000 if width >= 768 else 844}
                entry = {'width': width, 'checks': []}
                report['viewports'].append(entry)
                for name, route, callback in tests:
                    context = browser.new_context(viewport=viewport, is_mobile=width < 768, has_touch=width < 768)
                    context.grant_permissions(['clipboard-read', 'clipboard-write'])
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    resource_errors = []
                    page.on('response', lambda response: resource_errors.append({'url': response.url, 'status': response.status}) if response.status >= 400 else None)
                    suite = Suite(page, width, args.output, shots)
                    def execute():
                        suite.load(args.base_url.rstrip('/') + route)
                        result = callback(suite)
                        healthy(page)
                        require(not suite.errors, f'Page errors: {suite.errors}')
                        require(not resource_errors, f'HTTP resource errors: {resource_errors}')
                        return result
                    suite.run(name, execute)
                    context.close()
                    entry['checks'].extend(suite.checks)
                    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
        finally:
            browser.close()
    report['summary'] = {status: sum(item['status'] == status for viewport in report['viewports'] for item in viewport['checks']) for status in ('passed', 'failed')}
    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(report['summary']))
    return int(report['summary']['failed'] > 0)


if __name__ == '__main__':
    raise SystemExit(main())
