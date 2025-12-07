
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # Navigate to Clicker
        page.click('text=MARIO CLICKER')
        page.wait_for_timeout(500)

        # Check CPS Display
        cps = page.locator('#totalCpsDisplay')

        # Wait for CPS to be visible
        cps.wait_for(state='visible', timeout=5000)

        if cps.count() > 0:
            print(f'CPS Text: {cps.inner_text()}')

            # Check font size
            font_size = cps.evaluate('el => window.getComputedStyle(el).fontSize')
            print(f'CPS Font Size: {font_size}')

            # Check centering
            text_align = cps.evaluate('el => window.getComputedStyle(el).textAlign')
            print(f'CPS Text Align: {text_align}')
        else:
            print('CPS Display NOT FOUND')

        # Buy Goomba to see if CPS updates
        # Cheat money first
        page.evaluate('totalCoins = 100; updateWalletDisplay(); updateClickerUI();')
        page.click('#btnBuyGoomba')
        page.wait_for_timeout(200)

        print(f'CPS Text after upgrade: {cps.inner_text()}')

        page.screenshot(path='verification/cps_verification.png')
        browser.close()

if __name__ == '__main__':
    run()
