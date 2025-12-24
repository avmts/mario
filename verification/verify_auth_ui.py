from playwright.sync_api import sync_playwright
import time

def verify_auth_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page
        page.goto("http://localhost:8000/index.html")

        # Check for Connexion button
        btn_auth = page.locator("#btnAuth")
        if not btn_auth.count():
            print("FAILED: Connection button not found.")
            return

        print("Connection button found.")

        # Click Connexion button
        # Force click because sometimes overlays might interfere slightly or animation frames
        btn_auth.click(force=True)

        # Wait for animation
        time.sleep(1)

        # Check if Auth Menu is visible
        auth_menu = page.locator("#authMenu")

        # Check class
        classes = auth_menu.get_attribute("class")
        print(f"Auth Menu Classes: {classes}")

        if "active" in classes:
             print("Auth menu has active class.")
        else:
             print("FAILED: Auth menu does not have active class.")

        # Check for inputs
        if page.locator("#authEmail").is_visible() and page.locator("#authPassword").is_visible():
            print("Auth inputs visible.")
        else:
            print("FAILED: Auth inputs not visible.")

        page.screenshot(path="verification/auth_ui_fix.png")
        print("Screenshot saved to verification/auth_ui_fix.png")

        browser.close()

if __name__ == "__main__":
    verify_auth_ui()
