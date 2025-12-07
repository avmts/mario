
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        page.click('text=MARIO CLICKER')
        page.wait_for_timeout(500)

        # Force inactive to check cooldown
        page.evaluate('bossData.isActive = false; bossData.nextSpawnTime = Date.now() + 1000000; checkBossStatus();')
        page.wait_for_timeout(200)

        cooldown = page.locator('#bossCooldownContainer')
        if cooldown.is_visible():
            print('Cooldown Container Visible.')
            print(f'Timer Text: {page.locator("#bossCooldownTimer").inner_text()}')
        else:
            print('Cooldown Container NOT Visible.')

        bosses_seen = set()

        for i in range(5):
            # Force spawn logic
            # We set nextSpawnTime to past, isActive to false, then call checkBossStatus
            page.evaluate('bossData.nextSpawnTime = Date.now() - 1000; bossData.isActive = false; checkBossStatus();')
            page.wait_for_timeout(100)

            img_src = page.locator('#bossImage').get_attribute('src')
            bosses_seen.add(img_src)
            print(f'Spawn {i+1}: {img_src}')

        if len(bosses_seen) > 1:
            print('Random boss selection appears to work.')
        else:
            print('Warning: Same boss seen every time.')

        page.screenshot(path='verification/boss_features_retry.png')
        browser.close()

if __name__ == '__main__':
    run()
