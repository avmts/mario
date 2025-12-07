
from playwright.sync_api import sync_playwright
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto('file://' + os.path.abspath('index.html'))

        # Navigate to Clicker
        page.click('text=MARIO CLICKER')
        page.wait_for_timeout(500)

        # Manipulate Boss Data to force Spawn
        # Level 1, Active
        page.evaluate('''
            bossData.isActive = true;
            bossData.currentHp = 10;
            bossData.maxHp = 10;
            bossData.despawnTime = Date.now() + 100000;
            updateBossUI();
            document.getElementById('bossContainer').style.display = 'block';
        ''')
        page.wait_for_timeout(200)

        # Check UI Presence
        boss_container = page.locator('#bossContainer')
        if boss_container.is_visible():
            print('Boss Container Visible.')
        else:
            print('Boss Container NOT Visible.')

        # Check HP Text
        hp_text = page.locator('#bossHpText').inner_text()
        print(f'Boss HP: {hp_text}')

        # Click Boss to Kill
        for i in range(10):
            page.click('#bossImage')
            page.wait_for_timeout(50)

        page.wait_for_timeout(1000)

        # Check if disappeared (Victory)
        if not boss_container.is_visible():
            print('Boss Disappeared (Victory Condition Met).')
        else:
            print('Boss Still Visible (Victory Failed?).')

        # Check Level Up Data
        new_level = page.evaluate('bossData.level')
        new_max_hp = page.evaluate('bossData.maxHp')
        print(f'New Level: {new_level}')
        print(f'New Max HP: {new_max_hp}')

        if new_level == 2 and new_max_hp == 14: # 10 * 1.4 = 14
             print('Level Up Logic Correct.')
        else:
             print('Level Up Logic Incorrect.')

        page.screenshot(path='verification/boss_verification.png')
        browser.close()

if __name__ == '__main__':
    run()
