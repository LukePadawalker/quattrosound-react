import asyncio
from playwright.async_api import async_playwright

async def main():
    async_playwright_instance = await async_playwright().start()
    browser = await async_playwright_instance.chromium.launch()
    page = await browser.new_page()

    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    # Go to admin page
    print("Navigating to /admin...")
    try:
        await page.goto("http://localhost:5173/admin", wait_until="networkidle")
        print("Page loaded.")
        await page.wait_for_timeout(2000)

        # Take screenshot of Portfolio tab (default)
        await page.screenshot(path="/home/jules/verification/admin_portfolio.png")
        print("Portfolio screenshot saved.")

        # Click on Inventario tab
        print("Clicking on Inventario tab...")
        # Use a more robust selector. It's a button with text "Inventario"
        await page.click("button:has-text('Inventario')")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/home/jules/verification/admin_inventario.png")
        print("Inventario screenshot saved.")

    except Exception as e:
        print(f"Error: {e}")

    await browser.close()
    await async_playwright_instance.stop()

if __name__ == "__main__":
    asyncio.run(main())
