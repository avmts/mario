
import os
from playwright.sync_api import sync_playwright

def verify_clicker():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page locally
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Inject coins into localStorage to allow buying
        page.evaluate("localStorage.setItem('mario_total_coins', '100000')")
        page.reload()

        # Open Clicker Menu
        page.click("button:has-text('MARIO CLICKER')")

        # Wait for animation
        page.wait_for_timeout(1000)

        # Verify Goomba exists and check cost
        goomba_cost = page.locator("#goombaCost").inner_text()
        print(f"Goomba Cost: {goomba_cost}")

        yoshi_cost = page.locator("#yoshiCost").inner_text()
        print(f"Yoshi Cost: {yoshi_cost}")

        # Buy Goomba
        page.click("#btnBuyGoomba")
        page.wait_for_timeout(500)

        # Check new cost (should be 50 * 1.2 = 60)
        new_goomba_cost = page.locator("#goombaCost").inner_text()
        print(f"New Goomba Cost: {new_goomba_cost}")

        # Check rate display (should be 4*5*(1.2-1) = 4)
        goomba_rate = page.locator("#goombaRateDisplay").inner_text()
        print(f"Goomba Rate: {goomba_rate}")

        # Take screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/clicker_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_clicker()
