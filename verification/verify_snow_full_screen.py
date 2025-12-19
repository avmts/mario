
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the local index.html
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Open BG Menu
        page.click("text=FOND D'ÉCRAN")

        # Wait for menu to be visible
        page.wait_for_selector("#bgMenu.active", state="visible")

        btn = page.locator("#btnSnow")
        # Ensure button is visible before checking text
        btn.wait_for(state="visible")

        text = btn.inner_text()
        print(f"Button text: '{text}'")

        if "LET IT SNOW" in text:
            print("Clicking snow button...")
            btn.click()

        # Wait a bit for snow to generate
        page.wait_for_timeout(2000)

        # Check snowflakes
        snowflakes = page.locator('.snowflake')
        count = snowflakes.count()
        print(f"Snowflakes count: {count}")

        if count > 0:
            page.screenshot(path="verification/snow_full_screen.png")

            left_count = 0
            right_count = 0
            viewport_width = page.viewport_size['width']

            for i in range(count):
                box = snowflakes.nth(i).bounding_box()
                if box:
                    # bounding_box returns x relative to viewport usually?
                    center_x = box['x'] + box['width'] / 2
                    if center_x < viewport_width / 2:
                        left_count += 1
                    else:
                        right_count += 1

            print(f"Left side: {left_count}, Right side: {right_count}")
        else:
            print("No snowflakes found!")

        browser.close()

if __name__ == "__main__":
    run()
