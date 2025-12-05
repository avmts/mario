
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # Cheat money to buy Goomba (Cost 50)
        page.evaluate('totalCoins = 100; updateWalletDisplay(); updateClickerUI();')

        page.click('text=MARIO CLICKER')
        page.wait_for_timeout(500)

        # Buy Goomba
        page.click('#btnBuyGoomba')
        page.wait_for_timeout(200)

        # Check CPM
        cpm = page.locator('#totalCpmDisplay')
        print(f'CPM Text after buying Goomba: {cpm.inner_text()}')

        browser.close()

if __name__ == '__main__':
    run()
