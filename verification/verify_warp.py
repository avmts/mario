
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

        print('Page loaded')

        # Verify Warp Zone button exists
        warp_btn = page.locator('.btn-warp')
        print('Checking Warp Zone button...')
        warp_btn.wait_for(state='visible')

        # Click Warp Zone button
        print('Clicking Warp Zone button...')
        warp_btn.click()

        # Wait for Warp Menu
        warp_menu = page.locator('#warpZoneMenu')
        warp_menu.wait_for(state='visible')
        print('Warp Zone menu visible')

        # Take screenshot of the menu
        page.screenshot(path='verification/warp_zone_menu.png')
        print('Screenshot saved')

        browser.close()

if __name__ == '__main__':
    run()
