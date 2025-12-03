from playwright.sync_api import sync_playwright, expect
import time

def verify_offline_popup(page):
    # Set up local storage to simulate offline time and upgrades
    # We need to do this BEFORE navigating to the page

    # 1. Navigate to the game page (doesn't matter if it loads without data first)
    # Actually, we need to be on the same origin to access localStorage
    page.goto("http://localhost:8080/index.html")

    # 2. Set localStorage data and reload
    # Simulate: 10 Yoshi (10 coins/min) and 1 hour passed (60 mins) => 600 coins
    last_time = int(time.time() * 1000) - (60 * 60 * 1000) # 1 hour ago

    clicker_data = {
        "yoshiCount": 10,
        "yoshiCost": 250,
        "peachCount": 0,
        "toadCount": 0,
        "luigiCount": 0,
        "lastTime": last_time,
        "coinBuffer": 0
    }

    import json
    page.evaluate(f"localStorage.setItem('mario_clicker_data', '{json.dumps(clicker_data)}');")
    page.evaluate("localStorage.setItem('mario_total_coins', '0');")

    # 3. Reload the page to trigger DOMContentLoaded with the new data
    page.reload()

    # 4. Wait for the popup to appear
    popup = page.locator(".offline-popup")
    expect(popup).to_be_visible(timeout=5000)

    # 5. Verify text content (roughly)
    # 10 yoshis * 1 coin/min * 60 min = 600 coins
    expect(popup).to_contain_text("600")

    # 6. Take screenshot
    time.sleep(1) # Wait for animation to settle a bit
    page.screenshot(path="verification/offline_popup.png")
    print("Screenshot taken: verification/offline_popup.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_offline_popup(page)
        finally:
            browser.close()
