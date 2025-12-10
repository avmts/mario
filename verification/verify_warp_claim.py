
from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Open index.html directly since it is a static file
        cwd = os.getcwd()
        page.goto(f'file://{cwd}/index.html')

        print('Page loaded')

        # Force a warp zone state to be ready to claim
        # We need to set warpZoneData in localStorage and reload
        # Green pipe ready
        page.evaluate("""
            const data = {
                green: { active: true, endTime: Date.now() - 1000 },
                yellow: { active: false, endTime: 0 },
                red: { active: false, endTime: 0 }
            };
            localStorage.setItem('mario_warp_zone', JSON.stringify(data));
            localStorage.setItem('mario_total_coins', '100000');
            location.reload();
        """)
        time.sleep(1) # wait reload

        # Open Warp Zone
        warp_btn = page.locator('.btn-warp')
        warp_btn.click()

        # Wait for menu
        page.locator('#warpZoneMenu').wait_for(state='visible')

        # Check Cursor on Ready Pipe
        # Playwright doesn't easily screenshot cursor, but we can verify computed style
        pipe_img = page.locator('#warp-green .pipe-img')
        cursor_style = pipe_img.evaluate("el => window.getComputedStyle(el).cursor")
        print(f'Pipe Image Cursor Style: {cursor_style}')

        # Ideally it should contain 'pointer.cur' or 'pointer'

        # Click to Claim
        claim_btn = page.locator('#btn-green')
        claim_btn.click()

        # Wait for Floating Text
        floating_text = page.locator('.floating-text').first
        floating_text.wait_for(state='visible')

        # Check animation duration
        anim_duration = floating_text.evaluate("el => window.getComputedStyle(el).animationDuration")
        print(f'Floating Text Animation Duration: {anim_duration}')

        if '4s' in anim_duration:
             print('SUCCESS: Animation duration is 4s')
        else:
             print('FAILURE: Animation duration is incorrect')

        # Take screenshot
        page.screenshot(path='verification/warp_zone_claim.png')
        print('Screenshot saved')

        browser.close()

if __name__ == '__main__':
    run()
