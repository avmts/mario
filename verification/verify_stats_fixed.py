
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
        memory_cards.nth(0).click()
        memory_cards.nth(1).click()

        page.wait_for_timeout(2000)

        # Use more specific selector for HUD Menu button
        # It's a .hud-btn with text '⏸ MENU'
        page.click('button.hud-btn:has-text("MENU")')
        page.wait_for_timeout(500)

        # In Pause Menu, click MENU PRINCIPAL
        page.click('#pauseMenu button:has-text("MENU PRINCIPAL")')
        page.wait_for_timeout(500)

        # 2. Check Stats Menu
        page.click('.btn-stats')
        page.wait_for_timeout(500)

        time_text = page.locator('#statTotalTime').inner_text()
        flips_text = page.locator('#statTotalFlips').inner_text()
        char_text = page.locator('#statFavChar').inner_text()

        print(f'Total Time: {time_text}')
        print(f'Total Flips: {flips_text}')
        print(f'Fav Char: {char_text}')

        if flips_text != '0':
             print('Stats tracking confirmed.')
        else:
             print('Stats tracking failed?')

        page.screenshot(path='verification/stats_menu_fixed.png')
        browser.close()

if __name__ == '__main__':
    run()
