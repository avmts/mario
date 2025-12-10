
from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Open index.html directly since it is a static file
        cwd = os.getcwd()
        page.goto(f'file://{cwd}/index.html')

        # Set some coins in localStorage to verify shared wallet
        page.evaluate("localStorage.setItem('mario_total_coins', '9999'); location.reload();")
        time.sleep(1) # wait reload

        print('Page loaded with coins')

        # Verify Main Menu Wallet
        menu_wallet = page.locator('#menuWallet')
        print(f'Menu Wallet: {menu_wallet.inner_text()}')

        # Open Warp Zone
        warp_btn = page.locator('.btn-warp')
        warp_btn.click()

        # Wait for Warp Menu
        warp_menu = page.locator('#warpZoneMenu')
        warp_menu.wait_for(state='visible')

        # Verify Warp Zone Wallet
        warp_wallet = page.locator('#warpWallet')
        warp_wallet_text = warp_wallet.inner_text()
        print(f'Warp Wallet: {warp_wallet_text}')

        if warp_wallet_text == '9999':
            print('SUCCESS: Warp Wallet matches shared coins.')
        else:
            print('FAILURE: Warp Wallet does not match shared coins.')

        # Take screenshot
        page.screenshot(path='verification/warp_zone_wallet.png')
        print('Screenshot saved')

        browser.close()

if __name__ == '__main__':
    run()
