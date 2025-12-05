
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

        # 1. Check Colors
        # Level Text
        level_text = page.locator('.level-text').first
        color = level_text.evaluate('el => window.getComputedStyle(el).color')
        print(f'Level Text Color: {color}')
        # #FF1493 is rgb(255, 20, 147)

        # CPM Text
        cpm = page.locator('#totalCpmDisplay')
        cpm_color = cpm.evaluate('el => window.getComputedStyle(el).color')
        print(f'CPM Text Color: {cpm_color}')
        # #FFD700 is rgb(255, 215, 0)

        # CPS Text
        cps = page.locator('#totalCpsDisplay')
        cps_color = cps.evaluate('el => window.getComputedStyle(el).color')
        print(f'CPS Text Color: {cps_color}')

        # 2. Check Updates
        # Cheat money and buy Goomba to see if numbers update
        page.evaluate('totalCoins = 10000; updateWalletDisplay(); updateClickerUI();')

        # Buy Goomba (now costs 5000)
        # Note: Cost logic was x100 in previous turn, so base is 5000
        page.click('#btnBuyGoomba')
        page.wait_for_timeout(500)

        print(f'CPM Text after upgrade: {cpm.inner_text()}')
        print(f'CPS Text after upgrade: {cps.inner_text()}')

        page.screenshot(path='verification/fix_updates_colors.png')
        browser.close()

if __name__ == '__main__':
    run()
