from playwright.sync_api import sync_playwright

def verify_selection_menu_grid():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page (assuming local file for simplicity, but can serve it if needed)
        # Using file protocol
        import os
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Open Selection Menu (click a difficulty button)
        page.click("button[onclick=\"openSelectionMenu('easy')\"]")

        # Wait for transition
        page.wait_for_timeout(1000)

        # Take screenshot of the selection menu
        page.screenshot(path="verification/selection_menu_grid.png")

        # Verify grid properties via JS
        grid_style = page.evaluate("""() => {
            const grid = document.querySelector('.select-container');
            const style = window.getComputedStyle(grid);
            return {
                display: style.display,
                gridTemplateColumns: style.gridTemplateColumns,
                justifyContent: style.justifyContent,
                marginLeft: style.marginLeft,
                marginRight: style.marginRight
            };
        }""")

        print("Grid Style:", grid_style)

        browser.close()

if __name__ == "__main__":
    verify_selection_menu_grid()
