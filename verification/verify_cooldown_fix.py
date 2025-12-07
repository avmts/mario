
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

        # Force inactive to check cooldown
        page.evaluate('bossData.isActive = false; bossData.nextSpawnTime = Date.now() + 1000000; checkBossStatus();')
        page.wait_for_timeout(200)

        cooldown = page.locator('#bossCooldownContainer')
        if cooldown.is_visible():
            print('Cooldown Container Visible.')
            timer_text = page.locator('#bossCooldownTimer').inner_text()
            print(f'Timer Text: {timer_text}')

            # Check color
            color = cooldown.evaluate('el => window.getComputedStyle(el).color')
            print(f'Cooldown Color: {color}') # #ff3333 is rgb(255, 51, 51)

        else:
            print('Cooldown Container NOT Visible.')

        browser.close()

if __name__ == '__main__':
    run()
