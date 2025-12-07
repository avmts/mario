
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # 1. Start tracking some stats
        # Start a game to increment time and flips
        page.click('text=FACILE')
        page.wait_for_timeout(1000)

        # Select characters
        cards = page.locator('.select-item')
        # Select 6 characters
        for i in range(6):
            cards.nth(i).click()

        page.click('#btnStartGame')

        # Wait for game to start (countdown)
        page.wait_for_timeout(4000)

        # Flip two cards
        memory_cards = page.locator('.memory-card')
        memory_cards.nth(0).click()
        memory_cards.nth(1).click()

        page.wait_for_timeout(2000) # Let timer run

        # Go back to main menu
        page.click('text=MENU')
        page.click('text=MENU PRINCIPAL')
        page.wait_for_timeout(500)

        # 2. Check Stats Menu
        page.click('.btn-stats')
        page.wait_for_timeout(500)

        # Verify stats presence
        time_text = page.locator('#statTotalTime').inner_text()
        flips_text = page.locator('#statTotalFlips').inner_text()
        char_text = page.locator('#statFavChar').inner_text()

        print(f'Total Time: {time_text}')
        print(f'Total Flips: {flips_text}')
        print(f'Fav Char: {char_text}')

        if '0h 00m' not in time_text and flips_text != '0':
             print('Stats seem to be tracking!')
        else:
             # It might be 0h 00m if played less than a minute, but flips should be > 0
             if flips_text != '0':
                 print('Stats tracking (flips) confirmed.')
             else:
                 print('Stats tracking failed?')

        page.screenshot(path='verification/stats_menu.png')
        browser.close()

if __name__ == '__main__':
    run()
