from playwright.sync_api import sync_playwright, expect
import time

def verify_goombette_effect(page):
    # Navigate to the game
    page.goto("http://localhost:8080/index.html")

    # Wait for the start menu to be visible
    expect(page.locator("#startMenu")).to_be_visible()

    # Click on the start button/custom game to access the board easier
    # Or I can inject JS to simulate the match directly to save time and avoid playing the game

    # Let's inject JS to set up a specific scenario or just call the function directly
    # calling triggerGoombetteEffect() directly is the easiest way to verify the visual effect

    # Wait for game to be "ready" (scripts loaded)
    page.wait_for_load_state("networkidle")

    # Inject code to trigger the effect
    page.evaluate("triggerGoombetteEffect()")

    # Wait a bit for the animation to start
    time.sleep(0.5)

    # Verify hearts are present
    hearts = page.locator(".heart-particle")
    expect(hearts.first).to_be_visible()

    # Take a screenshot
    page.screenshot(path="verification/goombette_effect.png")
    print("Screenshot taken: verification/goombette_effect.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_goombette_effect(page)
        finally:
            browser.close()
