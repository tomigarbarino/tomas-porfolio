"""Native, read-only-to-product Playwright QA for the approved Arena refinement.

Run only after the final production server is ready. The script owns its JSON,
screenshots and optional browser recording; it never starts/stops/builds a server.
No forced selection ranges, style overrides or application event dispatches.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]


def existing_chromium(playwright, requested):
    if requested:
        path = Path(requested)
        require(path.is_file(), f"Requested browser does not exist: {path}")
        return path, "explicit --browser-path"
    default = Path(playwright.chromium.executable_path)
    if default.is_file():
        return default, "installed Playwright default Chromium"
    cache = Path(os.environ.get("LOCALAPPDATA", str(Path.home() / "AppData/Local"))) / "ms-playwright"
    candidates = []
    for pattern in ("chromium-*/chrome-win64/chrome.exe", "chromium-*/chrome-win/chrome.exe", "chromium_headless_shell-*/chrome-headless-shell-win64/chrome-headless-shell.exe"):
        candidates.extend(path for path in cache.glob(pattern) if path.is_file())
    def revision(path):
        match = re.search(r"chromium(?:_headless_shell)?-(\d+)", str(path))
        return int(match.group(1)) if match else 0, path.name == "chrome.exe"
    if not candidates:
        raise RuntimeError("No installed Chromium found. Supply --browser-path for an existing browser; this script never installs one.")
    return max(candidates, key=revision), "existing LOCALAPPDATA/ms-playwright cache fallback"


def normal(value):
    return " ".join(value.split())


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def near(a, b, tolerance=1):
    return abs(a - b) <= tolerance


def settle(page, milliseconds=550):
    page.wait_for_timeout(milliseconds)


def document_box(locator):
    return locator.evaluate("""el => {
      const r=el.getBoundingClientRect();
      return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,scrollY};
    }""")


def offset(locator):
    return locator.evaluate("""el => { const s=getComputedStyle(el);
      return {x:parseFloat(s.getPropertyValue('--artifact-x'))||0,
              y:parseFloat(s.getPropertyValue('--artifact-y'))||0}; }""")


def unchanged(a, b):
    return near(a["x"], b["x"], .5) and near(a["y"], b["y"], .5)


def visible_first(locator):
    for item in locator.all():
        if item.is_visible():
            return item
    raise AssertionError("No visible matching control")


def native_focus(page, selector, limit=170):
    """Reach a control with actual Tab input; never call element.focus()."""
    for index in range(limit):
        if page.evaluate("s => document.activeElement?.matches(s) || false", selector):
            return index
        page.keyboard.press("Tab")
    raise AssertionError(f"Keyboard could not reach {selector}")


def mouse_drag(page, x, y, dx, dy):
    page.mouse.move(x, y)
    page.mouse.down()
    page.mouse.move(x + dx, y + dy, steps=14)
    page.mouse.up()
    settle(page, 220)


def touch_drag(page, x, y, dx, dy):
    """Use Chromium's input pipeline, not DOM-dispatched TouchEvents."""
    session = page.context.new_cdp_session(page)
    try:
        session.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y}]})
        for step in range(1, 13):
            session.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x + dx * step / 12, "y": y + dy * step / 12}]})
            page.wait_for_timeout(12)
        session.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    finally:
        session.detach()
    settle(page, 220)


def touch_hold_then_drag(page, x, y, dx):
    session = page.context.new_cdp_session(page)
    try:
        session.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y}]})
        settle(page, 650)
        for step in range(1, 9):
            session.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x + dx * step / 8, "y": y}]})
            settle(page, 15)
        session.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    finally:
        session.detach()
    settle(page, 150)


def glyphs(locator):
    """Read first/last glyph geometry using detached ranges, without selecting."""
    return locator.evaluate("""el => {
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      const chars=[];
      while(walker.nextNode()) {
        const n=walker.currentNode;
        for(let i=0;i<n.textContent.length;i++) {
          if(!n.textContent[i].trim()) continue;
          const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);
          const b=r.getBoundingClientRect();
          if(b.width&&b.height) chars.push({x:b.left+b.width/2,y:b.top+b.height/2,left:b.left,right:b.right});
        }
      }
      if(!chars.length) throw Error('No rendered text glyphs');
      return {first:chars[0],last:chars.at(-1),text:el.textContent.trim()};
    }""")


def native_copy(page):
    page.keyboard.press("Control+c")
    settle(page, 100)
    try:
        return {"status": "available", "text": page.evaluate("navigator.clipboard.readText()")}
    except Exception as error:
        return {"status": "unavailable", "reason": str(error).splitlines()[0]}


def flow_snapshot(page):
    return page.locator(".agora-flow").evaluate("""flow => {
      const box=el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
      const nodes=Object.fromEntries([...flow.querySelectorAll('[data-agora-node]')].map(el=>[el.dataset.agoraNode,box(el)]));
      const edges=[...flow.querySelectorAll('[data-agora-edge]')].map(path=>{
        const visible=getComputedStyle(path).visibility!=='hidden';
        const result={id:path.dataset.agoraEdge,visible,d:path.getAttribute('d')};
        if(visible&&path.getTotalLength()) {
          const matrix=path.getScreenCTM();
          const start=path.getPointAtLength(0).matrixTransform(matrix);
          const end=path.getPointAtLength(path.getTotalLength()).matrixTransform(matrix);
          result.start={x:start.x,y:start.y};result.end={x:end.x,y:end.y};
        }
        return result;
      });
      return {nodes,edges,figure:box(flow)};
    }""")


def border_distance(point, box):
    x, y = point["x"], point["y"]
    if box["left"] - 1 <= x <= box["right"] + 1 and box["top"] - 1 <= y <= box["bottom"] + 1:
        return min(abs(x - box["left"]), abs(x - box["right"]), abs(y - box["top"]), abs(y - box["bottom"]))
    return math.inf


def check_edges(snapshot, minimum_visible=0):
    visible = 0
    errors = []
    for edge in snapshot["edges"]:
        if not edge["visible"]:
            continue
        visible += 1
        source, target = edge["id"].split("-", 1)
        for end, name in (("start", source), ("end", target)):
            distance = border_distance(edge[end], snapshot["nodes"][name])
            if distance > 1:
                errors.append(f"{edge['id']} {end} misses {name} border by {distance}px")
    require(not errors, "; ".join(errors))
    require(visible >= minimum_visible, f"Only {visible} visible edges; expected at least {minimum_visible}")
    return {"visible": visible, "endpoint_tolerance_px": 1}


def overlaps(a, b):
    return a["left"] < b["right"] and a["right"] > b["left"] and a["top"] < b["bottom"] and a["bottom"] > b["top"]


class Suite:
    def __init__(self, page, width, output, screenshots):
        self.page = page
        self.width = width
        self.output = output
        self.screenshots = screenshots
        self.checks = []
        self.errors = []
        page.on("pageerror", lambda error: self.errors.append(str(error)))

    def shot(self, name, full_page=False):
        path = self.screenshots / f"{self.width}-{name}.png"
        self.page.screenshot(path=str(path), full_page=full_page, animations="allow")
        return str(path.relative_to(ROOT))

    def run(self, name, callback):
        print(f"[{self.width}] {name}", flush=True)
        started = time.monotonic()
        item = {"name": name}
        try:
            item["evidence"] = callback()
            item["status"] = "passed"
        except Exception as error:
            item.update(status="failed", error=str(error))
            try:
                item["screenshot"] = self.shot(f"FAIL-{name}")
            except Exception:
                pass
        item["seconds"] = round(time.monotonic() - started, 2)
        self.checks.append(item)

    def load(self, base_url):
        self.page.goto(base_url, wait_until="networkidle", timeout=45000)
        self.page.evaluate("document.fonts.ready")
        self.page.wait_for_selector("[data-agora-edge]", state="attached", timeout=12000)
        settle(self.page, 750)

    def pause(self):
        toggle = self.page.locator(".motion-toggle").first
        if normal(toggle.inner_text()) == "Pause motion":
            toggle.click()
        self.page.wait_for_function("document.documentElement.dataset.motion==='paused'")

    def story(self):
        page = self.page
        self.pause()
        tabs = page.get_by_role("tablist", name="Story chapters").get_by_role("tab")
        require(tabs.count() == 3, "Expected three story chapters")
        tabs.first.scroll_into_view_if_needed()
        settle(page)
        measurements = []
        for index in range(3):
            tabs.nth(index).click()
            settle(page)
            require(tabs.nth(index).get_attribute("aria-selected") == "true", f"Chapter {index} not selected")
            measurements.append({"chapter": page.locator("#story").get_attribute("data-chapter"), "stage": document_box(page.locator(".origin-story__stage")), "work": document_box(page.locator("#work"))})
        baseline = measurements[0]
        for measure in measurements[1:]:
            for section in ("stage", "work"):
                for axis in ("x", "y", "width", "height"):
                    require(near(baseline[section][axis], measure[section][axis]), f"Chapter changes {section}.{axis}: {baseline[section][axis]} -> {measure[section][axis]}")
        screenshot = self.shot("story-interfaces")
        return {"mode": "global pause, fixed tab-row scroll", "measurements": measurements, "tolerance_px": 1, "screenshot": screenshot}

    def discovery_focus(self):
        page = self.page
        page.locator("#top").scroll_into_view_if_needed()
        native_focus(page, ".discovery--files .discovery-object")
        require(page.locator(".discovery--files").get_attribute("data-open") == "true", "Keyboard focus did not open Minecraft")
        page.locator(".discovery--menus .discovery-object").hover()
        settle(page, 200)
        require(page.locator(".discovery--menus").get_attribute("data-open") == "true", "Hover did not preview menus")
        page.mouse.move(4, 4)
        settle(page, 180)
        require(page.locator(".discovery--files").get_attribute("data-open") == "true", "Leaving menus lost still-focused Minecraft")
        require(page.evaluate("document.activeElement.matches('.discovery--files .discovery-object')"), "Keyboard focus moved unexpectedly")
        page.keyboard.press("Escape")
        require(page.locator(".scene-discoveries").get_attribute("data-detail-open") == "false", "Escape did not dismiss discovery")
        return {"keyboard_then_hover_then_leave": "Minecraft restored", "escape": "closed with trigger focus"}

    def selection(self):
        page = self.page
        page.goto(urljoin(page.url, '/en/agora'), wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        self.pause()
        paragraph = page.locator('[data-agora-decision-step="missing-skills"]').locator('p').last
        paragraph.scroll_into_view_if_needed()
        settle(page)
        frame = paragraph.locator("xpath=..")
        before = offset(frame)
        text = glyphs(paragraph)
        first, last = text["first"], text["last"]
        page.mouse.click(first["x"], first["y"])
        page.mouse.down(click_count=2)
        page.mouse.move(last["right"] - .5, last["y"], steps=24)
        page.mouse.up()
        settle(page, 150)
        double_selected = page.evaluate("window.getSelection().toString()")
        require(normal(double_selected) == normal(text["text"]), f"Double-click drag selected {double_selected!r}; expected {text['text']!r}")
        require(unchanged(before, offset(frame)), "Double-click selection moved the card")
        copied_double = native_copy(page)
        if copied_double["status"] == "available":
            require(normal(copied_double["text"]) == normal(text["text"]), "Native Ctrl+C did not copy selected sentence")
        box = frame.bounding_box()
        page.mouse.click(box["x"] + 5, box["y"] + 5)
        first, last = glyphs(paragraph)["first"], glyphs(paragraph)["last"]
        page.keyboard.down("Alt")
        page.mouse.move(first["left"] + .5, first["y"])
        page.mouse.down()
        page.mouse.move(last["right"] - .2, last["y"], steps=24)
        page.mouse.up()
        selected_before = page.evaluate("window.getSelection().toString()")
        page.keyboard.up("Alt")
        settle(page, 150)
        selected_after = page.evaluate("window.getSelection().toString()")
        require(normal(selected_before) == normal(text["text"]), f"Alt selected incomplete text: {selected_before!r}")
        require(selected_after == selected_before, "Releasing Alt discarded the selection")
        require(unchanged(before, offset(frame)), "Alt selection moved the card")
        copied_alt = native_copy(page)
        if copied_alt["status"] == "available":
            require(normal(copied_alt["text"]) == normal(text["text"]), "Native copy after releasing Alt failed")
        screenshot = self.shot("native-text-selection")
        page.mouse.click(box["x"] + 5, box["y"] + 5)
        touch_hold = None
        if self.width < 768:
            first = glyphs(paragraph)["first"]
            touch_hold_then_drag(page, first["x"], first["y"], 18)
            touch_text = page.evaluate("window.getSelection().toString()")
            require(unchanged(before, offset(frame)), "Sustained touch text gesture activated card drag")
            touch_hold = {"hold_ms": 650, "late_horizontal_motion_px": 18, "card_position_unchanged": True, "native_selected_text": touch_text, "native_range_demonstrated_in_emulation": bool(touch_text), "real_device_callout_and_handles": "unverified"}
        return {"expected": text["text"], "double_click_selection": double_selected, "alt_before_release": selected_before, "alt_after_release": selected_after, "clipboard_double": copied_double, "clipboard_alt": copied_alt, "offset_before": before, "offset_after": offset(frame), "sustained_touch_observation": touch_hold, "screenshot": screenshot}

    def graph(self):
        page = self.page
        self.pause()
        evidence = page.locator('[data-agora-node="evidence"]')
        evidence.scroll_into_view_if_needed()
        settle(page)
        initial = flow_snapshot(page)
        initial_check = check_edges(initial, 3)
        baseline = offset(evidence)
        box = evidence.bounding_box()
        touch_pan = None
        if self.width < 768:
            scroll_before = page.evaluate("scrollY")
            touch_drag(page, box["x"] + box["width"] / 2, box["y"] + 80, 0, -110)
            scroll_after = page.evaluate("scrollY")
            require(scroll_after > scroll_before + 20, "Native vertical touch pan did not scroll the page")
            require(unchanged(baseline, offset(evidence)), "Vertical touch pan moved the artifact")
            touch_pan = {"scroll_before": scroll_before, "scroll_after": scroll_after, "artifact_position_unchanged": True}
            evidence.scroll_into_view_if_needed()
            settle(page, 250)
            box = evidence.bounding_box()
        # Node surface, outside its buttons. Touch starts promptly to express drag.
        if self.width < 768:
            touch_drag(page, box["x"] + 9, box["y"] + 12, 11, 0)
        else:
            mouse_drag(page, box["x"] + 9, box["y"] + 12, 20, 10)
        moved = offset(evidence)
        require(not unchanged(baseline, moved), "Ordinary node-surface drag did not move Evidence")
        focus_after_drag_details = page.evaluate("""() => {
          const el=document.activeElement;const chain=[];
          for(let node=el;node;node=node.parentElement) chain.push({tag:node.tagName,id:node.id,class:node.className,ariaLabel:node.getAttribute('aria-label')});
          return chain;
        }""")
        focus_after_drag = page.evaluate("document.activeElement.getAttribute('aria-label')")
        if self.width >= 768:
            require(focus_after_drag == "Move Evidence node", "Mouse drag did not leave keyboard control on node grip")
        else:
            # A browser's touch compatibility mouse focus can return to body.
            # Reach the actual accessible grip with keyboard input independently.
            native_focus(page, '[data-agora-node="evidence"] > .artifact-drag')
        after_drag = flow_snapshot(page)
        check_edges(after_drag, 1)
        page.keyboard.press("ArrowLeft")
        settle(page, 160)
        arrow = offset(evidence)
        require(not unchanged(moved, arrow), "Arrow key did not move Evidence")
        page.keyboard.press("Escape")
        settle(page, 160)
        require(unchanged(moved, offset(evidence)), "Escape did not restore start of keyboard move")
        page.keyboard.press("Home")
        settle(page, 160)
        require(unchanged({"x": 0, "y": 0}, offset(evidence)), "Home did not reset Evidence")
        home = flow_snapshot(page)
        check_edges(home, 3)
        page.keyboard.press("Escape")
        settle(page, 160)
        require(unchanged(moved, offset(evidence)), "Escape after Home did not restore previous position")
        page.keyboard.press("Home")
        settle(page, 160)
        reset = flow_snapshot(page)
        source = reset["nodes"]["requirement"]
        target = reset["nodes"]["evidence"]
        dx = (source["left"] + source["right"] - target["left"] - target["right"]) / 2
        dy = (source["top"] + source["bottom"] - target["top"] - target["bottom"]) / 2
        for direction, distance in (("ArrowLeft" if dx < 0 else "ArrowRight", dx), ("ArrowUp" if dy < 0 else "ArrowDown", dy)):
            for _ in range(round(abs(distance) / 40)):
                page.keyboard.press(f"Shift+{direction}")
                settle(page, 22)
        settle(page, 220)
        overlap = flow_snapshot(page)
        require(overlaps(overlap["nodes"]["requirement"], overlap["nodes"]["evidence"]), "Keyboard overlap setup did not overlap nodes")
        incident = next(edge for edge in overlap["edges"] if edge["id"] == "requirement-evidence")
        require(not incident["visible"], "Overlapping nodes still show their misleading connection")
        self.shot("agora-overlap")
        page.keyboard.press("Home")
        settle(page, 220)
        check_edges(flow_snapshot(page), 3)
        caption = page.locator(".agora-flow__caption")
        caption.scroll_into_view_if_needed()
        settle(page)
        box = caption.bounding_box()
        mouse_drag(page, box["x"] + box["width"] - 5, box["y"] + box["height"] - 5, -8, 28)
        group_offset = offset(page.locator(".agora-flow"))
        require(abs(group_offset["x"]) + abs(group_offset["y"]) > .5, "Whole-flow surface did not move")
        group = flow_snapshot(page)
        check_edges(group, 3)
        page.keyboard.press("Home")
        settle(page, 220)
        original_viewport = page.viewport_size
        page.set_viewport_size({"width": 1000 if self.width >= 768 else (320 if self.width == 390 else 390), "height": original_viewport["height"]})
        settle(page, 450)
        resized = flow_snapshot(page)
        check_edges(resized, 1)
        page.set_viewport_size(original_viewport)
        settle(page, 450)
        restored = flow_snapshot(page)
        check_edges(restored, 3)
        evidence.scroll_into_view_if_needed()
        settle(page)
        return {"initial": initial, "initial_check": initial_check, "vertical_touch_pan": touch_pan, "surface_offset": moved, "focus_after_surface_drag": focus_after_drag_details, "arrow_offset": arrow, "after_surface_drag": after_drag, "after_home": home, "overlap": overlap, "group_offset": group_offset, "group": group, "resized": resized, "restored": restored, "screenshot": self.shot("agora-flow")}

    def graph_details(self):
        page = self.page
        self.pause()
        evidence = page.get_by_role("button", name="Inspect evidence")
        review = page.get_by_role("button", name="Inspect review")
        region = page.locator(".agora-flow__details")
        initial_height = document_box(region)["height"]
        offsets_before = {name: offset(page.locator(f'[data-agora-node="{name}"]')) for name in ("evidence", "review")}
        if self.width >= 768:
            evidence.hover()
            require(evidence.get_attribute("aria-expanded") == "true", "Evidence hover did not reveal note")
            evidence.click()
            evidence.click()
            page.keyboard.press("Tab")
            page.keyboard.press("Shift+Tab")
            require(page.evaluate("document.activeElement.textContent.includes('Inspect evidence')"), "Native keyboard focus did not reach Evidence detail")
            require(evidence.get_attribute("aria-expanded") == "true", "Keyboard focus did not reveal Evidence note")
            review.hover()
            require(review.get_attribute("aria-expanded") == "true", "Review hover did not preview its note")
            page.mouse.move(4, 4)
            settle(page, 160)
            require(evidence.get_attribute("aria-expanded") == "true", "Hover leave did not restore focused Evidence note")
            page.keyboard.press("Escape")
            require(evidence.get_attribute("aria-expanded") == "false", "Escape did not dismiss focused detail")
        else:
            evidence.tap()
            require(evidence.get_attribute("aria-pressed") == "true", "Touch did not pin Evidence")
            page.locator(".agora-flow__caption").tap()
            require(evidence.get_attribute("aria-expanded") == "true", "Pinned note disappeared after tapping elsewhere")
            review.tap()
            require(review.get_attribute("aria-pressed") == "true", "Touch did not pin Review")
            review.tap()
            require(review.get_attribute("aria-pressed") == "false", "Second tap did not unpin Review")
            require(review.get_attribute("aria-expanded") == "false", "Second tap left unpinned Review visible")
        final_height = document_box(region)["height"]
        require(near(initial_height, final_height), "Detail visibility changed reserved panel height")
        for name, before in offsets_before.items():
            require(unchanged(before, offset(page.locator(f'[data-agora-node="{name}"]'))), f"Inspect control moved {name} node")
        return {"input": "hover + native Tab focus + Escape" if self.width >= 768 else "native touchscreen tap pin/unpin", "height_before": initial_height, "height_after": final_height, "control_drag_exclusion": "positions unchanged"}

    def dialogs(self):
        page = self.page
        self.pause()
        def activate(locator):
            if self.width < 768:
                locator.tap()
            else:
                locator.click()
        work_trigger = page.locator("#work").get_by_text("Quick profile", exact=False).first
        activate(work_trigger)
        dialog = page.locator("dialog[open]")
        dialog.wait_for(state="visible")
        work_text = normal(dialog.locator(".dialog-content").inner_text())
        require("Agora / Trainly / Batech" in work_text, "Quick profile lacks three-case summary")
        activate(dialog.get_by_role("button", name="Close dialog"))
        require(work_trigger.evaluate("el=>el===document.activeElement"), "Dialog close did not return focus to Work trigger")
        hero_trigger = visible_first(page.locator(".observatory").get_by_role("button", name=re.compile(r"^Quick profile")))
        activate(hero_trigger)
        dialog.wait_for(state="visible")
        hero_text = normal(dialog.locator(".dialog-content").inner_text())
        require(hero_text == work_text, "Hero and Work Quick profile differ")
        screenshot = self.shot("quick-profile")
        activate(dialog.get_by_role("button", name="Close dialog"))
        chapters = []
        for index, expected in enumerate(("files", "conversations", "interfaces")):
            activate(page.get_by_role("button", name="Explore side quests", exact=True))
            dialog.wait_for(state="visible")
            all_quests = dialog.get_by_role("button", name="All quests", exact=False)
            if all_quests.count():
                activate(all_quests)
            activate(dialog.locator(".quest-list > button").nth(index))
            activate(dialog.get_by_role("link", name="Explore the story", exact=False))
            page.mouse.move(4, 4)
            page.wait_for_selector("dialog[open]", state="hidden")
            settle(page)
            chapter = page.locator("#story").get_attribute("data-chapter")
            require(chapter == expected, f"Quest {index+1} opened {chapter}, expected {expected}")
            require(page.evaluate("document.activeElement.id==='story'"), "Quest did not hand focus to Story")
            chapters.append(chapter)
        return {"quick_profile_equal": True, "content": work_text, "quest_destinations": chapters, "screenshot": screenshot}

    def media(self):
        page = self.page
        toggle = page.locator(".motion-toggle").first
        toggle.scroll_into_view_if_needed()
        # Leave actual keyboard focus on the global toggle while scrolling video.
        if normal(toggle.inner_text()) == "Pause motion":
            toggle.click()
        toggle.click()
        require(normal(toggle.inner_text()) == "Pause motion", "Global play was not enabled")
        video = page.get_by_label("Batech product video", exact=True)
        video.scroll_into_view_if_needed()
        settle(page, 500)
        page.wait_for_function("(() => {const v=document.querySelector('video[aria-label=\"Batech product video\"]');return v.readyState>=2&&!v.paused;})()", timeout=12000)
        before = video.evaluate("v=>v.currentTime")
        settle(page, 800)
        after = video.evaluate("v=>v.currentTime")
        attrs = video.evaluate("v=>({muted:v.muted,loop:v.loop,playsInline:v.playsInline,controls:v.controls,readyState:v.readyState,error:v.error?.code??null})")
        require(after > before, "Visible Batech autoplay did not advance")
        require(attrs["muted"] and attrs["loop"] and attrs["playsInline"] and not attrs["controls"], "Batech silent autoplay attributes regressed")
        scroll_before = page.evaluate("scrollY")
        page.keyboard.press("Enter")
        settle(page, 250)
        require(page.evaluate("document.documentElement.dataset.motion==='paused'"), "Keyboard global toggle did not pause")
        require(video.evaluate("v=>v.paused"), "Global pause did not stop visible Batech")
        require(near(scroll_before, page.evaluate("scrollY")), "Pause verification scrolled video away")
        page.keyboard.press("Enter")
        settle(page, 450)
        require(not video.evaluate("v=>v.paused"), "Global play did not resume visible Batech")
        page.locator("#top").scroll_into_view_if_needed()
        settle(page, 550)
        require(video.evaluate("v=>v.paused"), "Offscreen Batech remained playing")
        hero = page.locator(".hero-world video")
        page.wait_for_function("(() => {const v=document.querySelector('.hero-world video');return v.readyState>=2&&!v.paused;})()", timeout=12000)
        hero_before = hero.evaluate("v=>v.currentTime")
        settle(page, 400)
        hero_after = hero.evaluate("v=>v.currentTime")
        require(hero_after > hero_before, "Visible hero ASCII did not advance")
        playing_shot = self.shot("hero-playing")
        page.emulate_media(reduced_motion="reduce")
        page.wait_for_function("document.documentElement.dataset.motion==='paused'", timeout=5000)
        require(toggle.is_disabled(), "Reduced-motion toggle must report device preference")
        require(page.locator("video").evaluate_all("videos=>videos.every(v=>v.paused)"), "A video plays under reduced motion")
        page.get_by_role("tablist", name="Story chapters").get_by_role("tab").last.click()
        require(page.locator("#story").get_attribute("data-chapter") == "interfaces", "Story inaccessible in reduced motion")
        reduced_shot = self.shot("story-reduced")
        page.emulate_media(reduced_motion="no-preference")
        settle(page, 250)
        return {"batech_current_time": [before, after], "batech_attributes": attrs, "global_pause_while_visible": True, "offscreen_pause": True, "hero_current_time": [hero_before, hero_after], "reduced_all_videos_paused": True, "screenshots": [playing_shot, reduced_shot]}

    def visuals(self):
        page = self.page
        images = []
        for name, selector in (("hero", "#hero-title"), ("work", "#work-title"), ("agora-decision", "#agora-decision-title"), ("contact", "#contact")):
            page.locator(selector).scroll_into_view_if_needed()
            settle(page, 650)
            images.append(self.shot(name))
        page.locator("#top").scroll_into_view_if_needed()
        settle(page, 650)
        images.append(self.shot("root-visual", full_page=True))
        overflow = page.evaluate("({viewport:innerWidth,document:document.documentElement.scrollWidth})")
        require(overflow["document"] <= overflow["viewport"] + 1, f"Horizontal page overflow: {overflow}")
        return {"screenshots": images, "overflow": overflow, "page_errors": self.errors}

    def motion_recording(self):
        page = self.page
        page.locator("#top").scroll_into_view_if_needed()
        settle(page, 1000)
        for _ in range(3):
            page.mouse.wheel(0, 480)
            settle(page, 800)
        tabs = page.get_by_role("tablist", name="Story chapters").get_by_role("tab")
        tabs.last.click()
        page.mouse.move(4, 4)
        settle(page, 1300)
        tabs.first.click()
        page.mouse.move(4, 4)
        settle(page, 1300)
        page.mouse.wheel(0, 700)
        settle(page, 1600)
        return {"purpose": "Qualitative actual-speed motion review only; no FPS/performance/hiring inference", "actions": "Native wheel scroll; Interfaces then Minecraft chapter clicks; scroll toward work", "page_errors": self.errors}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://localhost:3000")
    parser.add_argument("--output", type=Path, default=ROOT / "output/portfolio-design-2027/arena-native-final.json")
    parser.add_argument("--screenshots", type=Path, default=ROOT / "output/portfolio-design-2027/arena-native-final")
    parser.add_argument("--widths", nargs="+", type=int, default=[1440, 390, 320])
    parser.add_argument("--checks", nargs="+", help="Run only named logical checks, still in fresh contexts")
    parser.add_argument("--merge-existing", action="store_true", help="Replace selected checks in a report for the same build and preserve earlier attempts")
    parser.add_argument("--record-video", action="store_true", help="Record one short actual-speed qualitative desktop journey")
    parser.add_argument("--browser-path", help="Optional existing Chromium executable; no browser installation")
    parser.add_argument("--build-id", help="Production build identity supplied by the server owner")
    parser.add_argument("--app-root", help="Checkout served by the already-running production server")
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.screenshots.mkdir(parents=True, exist_ok=True)
    app_root = Path(args.app_root) if args.app_root else ROOT
    build_artifact = app_root / ".next/BUILD_ID"
    actual_build_id = build_artifact.read_text(encoding="utf-8").strip() if build_artifact.is_file() else None
    if args.build_id and args.app_root:
        identity_source = "Explicit READY build/path supplied by server owner; supplied checkout artifact verified"
        require(actual_build_id == args.build_id, "READY build ID differs from the supplied app-root build artifact")
    elif args.build_id:
        identity_source = "Explicit supplied build ID; default app-root serving relation is unverified"
    elif actual_build_id:
        identity_source = "Local app-root build artifact; relation to the running server is unverified"
    else:
        identity_source = "unknown; no supplied build ID or available app-root build artifact"
    report = {"created_utc": datetime.now(timezone.utc).isoformat(), "base_url": args.base_url, "server_build_id": args.build_id or actual_build_id or "unknown", "server_app_root": args.app_root or str(ROOT), "build_identity_source": identity_source, "method": "Each logical check uses a fresh browser context. Native Chromium mouse, keyboard, touchscreen tap and browser-input touch drag. Read-only geometry/range/clipboard observation. No app-event dispatch, forced ranges or styling overrides.", "limits": ["Emulated touch does not certify real iOS/Android long-press callouts, selection handles or clipboard integration.", "No FPS, other-engine, hidden-document or hiring-outcome claim.", "Geometry is isolated under the user-facing global pause; playback is tested separately.", "Native clipboard checks are reported unavailable if the browser cannot provide clipboard access."], "viewports": []}
    if args.merge_existing:
        existing = json.loads(args.output.read_text(encoding="utf-8"))
        for field in ("base_url", "server_build_id", "server_app_root"):
            require(existing.get(field) == report.get(field), f"Cannot merge a report for a different {field}")
        report = existing
    report.setdefault("run_history", []).append({"started_utc": datetime.now(timezone.utc).isoformat(), "widths": args.widths, "selected_checks": args.checks})
    if actual_build_id:
        report["build_artifact_verified"] = {"path": str(build_artifact), "build_id": actual_build_id}
    with sync_playwright() as playwright:
        browser_path, browser_source = existing_chromium(playwright, args.browser_path)
        launch = {"headless": True, "executable_path": str(browser_path)}
        browser = playwright.chromium.launch(**launch)
        report["browser"] = {"version": browser.version, "executable_path": str(browser_path), "source": browser_source}
        try:
            for width in args.widths:
                options = {"viewport": {"width": width, "height": 1000 if width >= 768 else 844}, "is_mobile": width < 768, "has_touch": width < 768, "reduced_motion": "no-preference"}
                entry = next((item for item in report["viewports"] if item["width"] == width), None)
                if entry is None:
                    entry = {"width": width, "touch": width < 768, "checks": [], "recording": None}
                    report["viewports"].append(entry)
                tests = [("readiness", None), ("story-geometry", "story")]
                if width >= 768:
                    tests.append(("discovery-mixed-focus", "discovery_focus"))
                tests.extend([("native-text-selection", "selection"), ("agora-connections-drag-keyboard", "graph"), ("agora-details", "graph_details"), ("profile-and-quest-navigation", "dialogs"), ("media-pause-reduced", "media"), ("root-visuals", "visuals")])
                if args.record_video and width == max(args.widths):
                    tests.append(("motion-qualitative-recording", "motion_recording"))
                if args.checks:
                    tests = [(name, method) for name, method in tests if name in args.checks]
                    require(tests, "No requested check applies to this viewport")
                for name, method in tests:
                    test_options = dict(options)
                    if method == "motion_recording":
                        test_options["record_video_dir"] = str(args.screenshots / "recordings")
                        test_options["record_video_size"] = options["viewport"]
                    context = browser.new_context(**test_options)
                    try:
                        context.grant_permissions(["clipboard-read", "clipboard-write"])
                    except Exception:
                        pass
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    suite = Suite(page, width, args.output, args.screenshots)
                    def execute():
                        suite.load(args.base_url)
                        evidence = getattr(suite, method)() if method else {"title": page.title(), "new_flow_present": True}
                        require(not suite.errors, f"Browser errors: {suite.errors}")
                        evidence["page_errors"] = suite.errors
                        return evidence
                    suite.run(name, execute)
                    video = page.video
                    context.close()
                    if video:
                        entry["recording"] = str(Path(video.path()).relative_to(ROOT))
                    item = suite.checks[0]
                    previous = next((old for old in entry["checks"] if old["name"] == name), None)
                    if previous:
                        item["previous_attempts"] = previous.get("previous_attempts", []) + [{key: value for key, value in previous.items() if key != "previous_attempts"}]
                        entry["checks"][entry["checks"].index(previous)] = item
                    else:
                        entry["checks"].append(item)
                    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        finally:
            browser.close()
    passed = sum(check["status"] == "passed" for viewport in report["viewports"] for check in viewport["checks"])
    failed = sum(check["status"] == "failed" for viewport in report["viewports"] for check in viewport["checks"])
    report["summary"] = {"passed": passed, "failed": failed}
    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"report": str(args.output), **report["summary"]}), flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
