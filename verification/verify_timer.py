
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Charger le fichier index.html directement
        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # Ouvrir le menu Mario Clicker
        page.click("button[onclick='openClickerMenu()']")

        # Forcer l'état de recharge (cooldown) en injectant du JS
        page.evaluate('''() => {
            const now = Date.now();
            bossData.isActive = false;
            bossData.nextSpawnTime = now + 1000000;
            checkBossStatus();
        }''')

        # Attendre que le conteneur de recharge soit visible
        page.wait_for_selector('#bossCooldownContainer', state='visible')

        # Prendre une capture d'écran du conteneur de recharge
        element = page.locator('#bossCooldownContainer')
        element.screenshot(path='verification/boss_timer.png')

        browser.close()

if __name__ == '__main__':
    run()
