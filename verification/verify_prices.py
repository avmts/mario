
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # 1. Verify Toad Shop Prices & Order
        page.click('text=TOAD SHOP')
        page.wait_for_timeout(500)

        shop_items = page.locator('.shop-item')
        count = shop_items.count()
        print(f'Found {count} shop items.')

        expected_prices = ['50 000', '80 000', '100 000', '120 000', '150 000', '300 000']

        for i in range(count):
            item = shop_items.nth(i)
            price_text = item.locator('.price').inner_text().strip()
            print(f'Item {i+1} price: {price_text}')
            if expected_prices[i] in price_text:
                print(f'  -> Matches expected {expected_prices[i]}')
            else:
                print(f'  -> ERROR: Expected {expected_prices[i]}')

        page.screenshot(path='verification/shop_prices.png')

        # Go back
        page.click('button:has-text("RETOUR")')
        page.wait_for_timeout(500)

        # 2. Verify Clicker Prices (Initial)
        page.click('text=MARIO CLICKER')
        page.wait_for_timeout(500)

        goomba_cost = page.locator('#goombaCost').inner_text().strip()
        print(f'Goomba Cost: {goomba_cost}')

        if '5 000' in goomba_cost or '5000' in goomba_cost:
             print('  -> Goomba cost correct (x100)')
        else:
             print('  -> ERROR: Goomba cost incorrect')

        page.screenshot(path='verification/clicker_prices.png')

        browser.close()

if __name__ == '__main__':
    run()
