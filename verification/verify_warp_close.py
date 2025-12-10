
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

        # Open Warp Zone
        warp_btn = page.locator('.btn-warp')
        warp_btn.wait_for(state='visible')
        warp_btn.click()

        # Wait for Warp Menu
        warp_menu = page.locator('#warpZoneMenu')
        warp_menu.wait_for(state='visible')
        print('Warp Zone menu visible')

        # Take screenshot of open menu
        page.screenshot(path='verification/warp_zone_open.png')

        # Click Return Button
        # The return button calls goToMainMenu()
        return_btn = warp_menu.locator('.btn-menu').get_by_text('RETOUR')
        return_btn.click()

        # Wait for Warp Menu to disappear
        # We check if the class 'active' is removed
        # Since we modified goToMainMenu to remove 'active' from warpZoneMenu

        # Small delay to allow transition
        time.sleep(0.5)

        if not warp_menu.is_visible():
             print('Warp Zone menu closed successfully')
        else:
             # Check class
             classes = warp_menu.get_attribute('class')
             if 'active' not in classes:
                 print('Warp Zone menu is hidden (active class removed)')
             else:
                 print('ERROR: Warp Zone menu is still active!')

        # Take screenshot of main menu (warp zone should be gone)
        page.screenshot(path='verification/warp_zone_closed.png')
        print('Screenshots saved')

        browser.close()

if __name__ == '__main__':
    run()
