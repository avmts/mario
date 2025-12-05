
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Load the local HTML file
        # Assuming we are in the root and index.html is there
        page.goto('file://' + os.path.abspath('index.html'))

        # Open the Clicker Menu (since it's an overlay initially hidden)
        # We need to click the 'MARIO CLICKER' button in #startMenu
        # The button has text 'MARIO CLICKER'
        page.click('text=MARIO CLICKER')

        # Wait for animation (overlay fade in)
        page.wait_for_timeout(1000)

        # Check if the CPM display exists and has text
        cpm = page.locator('#totalCpmDisplay')
        print(f'CPM Text: {cpm.inner_text()}')

        # Check color of level text
        level_texts = page.locator('.level-text')
        count = level_texts.count()
        print(f'Found {count} level text elements')

        if count > 0:
            first_level = level_texts.first
            # Get computed style
            color = first_level.evaluate('el => window.getComputedStyle(el).color')
            print(f'Level text color: {color}')

        # Take screenshot
        page.screenshot(path='verification/clicker_ui.png')

        browser.close()

if __name__ == '__main__':
    run()
