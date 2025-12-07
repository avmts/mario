
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # 1. Start tracking some stats
        page.click('text=FACILE')
        page.wait_for_timeout(1000)

        cards = page.locator('.select-item')
        for i in range(6):
            cards.nth(i).click()

        page.click('#btnStartGame')

        page.wait_for_timeout(4000) # Countdown

        # Flip two cards
        memory_cards = page.locator('.memory-card')
        # Ensure we actually click them
        if memory_cards.count() > 0:
            memory_cards.nth(0).click()
            page.wait_for_timeout(500)
            memory_cards.nth(1).click()
            page.wait_for_timeout(500)
        else:
            print('No cards found!')

        page.click('button.hud-btn:has-text("MENU")')
        page.wait_for_timeout(500)

        page.click('#pauseMenu button:has-text("MENU PRINCIPAL")')
        page.wait_for_timeout(500)

        page.click('.btn-stats')
        page.wait_for_timeout(500)

        flips_text = page.locator('#statTotalFlips').inner_text()
        print(f'Total Flips: {flips_text}')

        browser.close()

if __name__ == '__main__':
    run()
