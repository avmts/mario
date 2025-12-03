
import os
from playwright.sync_api import sync_playwright

def verify_shop():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page locally
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Open Shop Menu
        page.click("button:has-text('TOAD SHOP')")

        # Wait for animation
        page.wait_for_timeout(1000)

        # Verify text prices
        # We can find them by the text content in the .price div

        prices_to_check = [
            "1500", # Mushroom
            "500",  # Clock
            "3000", # Star
            "1200", # Fireflower
            "1000", # Iceflower
            "800"   # Mysteryblock
        ]

        for price in prices_to_check:
            # We look for a div with class price containing the text
            # Note: The text also contains an image, but innerText should contain the number
            loc = page.locator(f".price:has-text('{price}')")
            count = loc.count()
            print(f"Found price {price}: {count} times")
            if count == 0:
                print(f"ERROR: Price {price} not found!")

        # Take screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/shop_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_shop()
