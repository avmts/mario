
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
        # We need to select exact number of cards. Easy mode requires 6 pairs?
        # levels.easy = 6 pairs -> 6 chars?
        # In script.js:
        # const levels = { easy: { pairs: 6, cols: 4, ... } }
        # targetPairCount = levels[levelKey].pairs;
        # So we need to select 6 chars.

        # Click 6 different cards
        for i in range(6):
            cards.nth(i).click()

        page.wait_for_timeout(500)

        # Now click start
        page.click('#btnStartGame')

        page.wait_for_timeout(4000) # Countdown

        # Flip two cards
        memory_cards = page.locator('.memory-card')
        memory_cards.nth(0).click()
        memory_cards.nth(1).click()

        page.wait_for_timeout(1000)

        page.click('button.hud-btn:has-text("MENU")')
        page.wait_for_timeout(500)

        page.click('#pauseMenu button:has-text("MENU PRINCIPAL")')
        page.wait_for_timeout(500)

        page.click('.btn-stats')
        page.wait_for_timeout(500)

        flips_text = page.locator('#statTotalFlips').inner_text()
        print(f'Total Flips: {flips_text}')

        char_text = page.locator('#statFavChar').inner_text()
        print(f'Fav Char: {char_text}')

        browser.close()

if __name__ == '__main__':
    run()
