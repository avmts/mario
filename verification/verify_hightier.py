
import os
from playwright.sync_api import sync_playwright

def verify_high_tier():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page locally
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Inject coins to check high tiers
        # Need enough for Harmonie (250000)
        page.evaluate("localStorage.setItem('mario_total_coins', '1000000')")
        page.reload()

        # Open Clicker Menu
        page.click("button:has-text('MARIO CLICKER')")

        # Wait for animation
        page.wait_for_timeout(1000)

        # Verify New Characters Existence and Base Costs

        # Wario
        wario_cost = page.locator("#warioCost").inner_text()
        print(f"Wario Cost: {wario_cost}") # Should be 15000

        # Bowser
        bowser_cost = page.locator("#bowserCost").inner_text()
        print(f"Bowser Cost: {bowser_cost}") # Should be 50000

        # Harmonie
        harmony_cost = page.locator("#harmonyCost").inner_text()
        print(f"Harmonie Cost: {harmony_cost}") # Should be 250000

        # Test 1.4 scaling for Wario
        page.click("#btnBuyWario") # Buy 1
        page.wait_for_timeout(500)
        new_wario_cost = page.locator("#warioCost").inner_text()
        print(f"New Wario Cost: {new_wario_cost}")
        # 15000 * 1.4 = 21000

        # Test 1.4 scaling for Bowser
        page.click("#btnBuyBowser")
        page.wait_for_timeout(500)
        new_bowser_cost = page.locator("#bowserCost").inner_text()
        print(f"New Bowser Cost: {new_bowser_cost}")
        # 50000 * 1.4 = 70000

        # Test 1.4 scaling for Harmonie
        page.click("#btnBuyHarmony")
        page.wait_for_timeout(500)
        new_harmony_cost = page.locator("#harmonyCost").inner_text()
        print(f"New Harmonie Cost: {new_harmony_cost}")
        # 250000 * 1.4 = 350000

        # Test Production Rate display (Linear)
        # Wario Lvl 1 -> 500
        wario_rate = page.locator("#warioRateDisplay").inner_text()
        print(f"Wario Rate (Lvl 1): {wario_rate}")

        # Screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/clicker_hightier.png")

        browser.close()

if __name__ == "__main__":
    verify_high_tier()
