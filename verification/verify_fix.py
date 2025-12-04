
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

        # Check CPM Display Alignment
        cpm = page.locator('#totalCpmDisplay')
        box = cpm.bounding_box()

        # Get viewport size or menu box size for centering check
        menu_box = page.locator('#clickerMenu .menu-box')
        menu_box_box = menu_box.bounding_box()

        # Calculate center
        menu_center = menu_box_box['x'] + (menu_box_box['width'] / 2)
        cpm_center = box['x'] + (box['width'] / 2)

        print(f'Menu Center X: {menu_center}')
        print(f'CPM Center X: {cpm_center}')

        diff = abs(menu_center - cpm_center)
        if diff < 5:
            print('CPM Text appears CENTERED.')
        else:
            print(f'CPM Text NOT CENTERED. Off by {diff}px')

        # Check Level Text Shadow
        level_text = page.locator('.level-text').first
        shadow = level_text.evaluate('el => window.getComputedStyle(el).textShadow')
        print(f'Level Text Shadow: {shadow}')

        if shadow == 'none':
            print('Level text shadow successfully removed.')
        else:
            print('Level text shadow still present.')

        page.screenshot(path='verification/fixed_clicker_ui.png')
        browser.close()

if __name__ == '__main__':
    run()
