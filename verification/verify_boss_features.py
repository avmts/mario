
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

        # 1. Check Cooldown Visibility (Boss should be inactive initially unless Date.now > 0, which is true, but check logic)
        # In script.js logic, if bossData.nextSpawnTime is Date.now(), it spawns immediately.
        # But wait, nextSpawnTime is Date.now() on init.
        # So boss should be ACTIVE immediately on first load.

        # Let's force it to be inactive to check cooldown.
        page.evaluate('''
            bossData.isActive = false;
            bossData.nextSpawnTime = Date.now() + 1000000;
            checkBossStatus();
        ''')
        page.wait_for_timeout(200)

        cooldown = page.locator('#bossCooldownContainer')
        if cooldown.is_visible():
            print('Cooldown Container Visible.')
            timer_text = page.locator('#bossCooldownTimer').inner_text()
            print(f'Timer Text: {timer_text}')
        else:
            print('Cooldown Container NOT Visible.')

        # 2. Force Spawn and Check Random Image
        # We need to see if it picks a random boss.
        # We can try spawning multiple times and checking the image src.

        bosses_seen = set()

        for i in range(5):
            page.evaluate('''
                bossData.nextSpawnTime = Date.now() - 1000;
                bossData.isActive = false;
                checkBossStatus(); # Trigger spawn
            ''')
            page.wait_for_timeout(100)

            img_src = page.locator('#bossImage').get_attribute('src')
            bosses_seen.add(img_src)
            print(f'Spawn {i+1}: {img_src}')

        if len(bosses_seen) > 1:
            print('Random boss selection appears to work (different images seen).')
        else:
            print('Warning: Same boss seen every time (might be random chance, but unlikely for 5 tries if list is big).')

        page.screenshot(path='verification/boss_features.png')
        browser.close()

if __name__ == '__main__':
    run()
