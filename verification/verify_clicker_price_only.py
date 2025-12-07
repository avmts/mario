
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # 2. Verify Clicker Prices (Initial)
        page.click('text=MARIO CLICKER')
        page.wait_for_timeout(500)

        goomba_cost = page.locator('#goombaCost').inner_text().strip()
        print(f'Goomba Cost: {goomba_cost}')

        if '5 000' in goomba_cost or '5000' in goomba_cost:
             print('  -> Goomba cost correct (x100)')
        else:
             print('  -> ERROR: Goomba cost incorrect')

        page.screenshot(path='verification/clicker_prices_final.png')

        browser.close()

if __name__ == '__main__':
    run()
