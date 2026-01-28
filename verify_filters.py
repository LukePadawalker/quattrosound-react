import asyncio
from playwright.async_api import async_playwright

async def main():
    async_playwright_instance = await async_playwright().start()
    browser = await async_playwright_instance.chromium.launch()
    page = await browser.new_page()

    # Go to admin page
    print("Navigating to /admin...")
    await page.goto("http://localhost:5173/admin", wait_until="networkidle")

    # Click on Inventario tab
    print("Clicking on Inventario tab...")
    await page.click("button:has-text('Inventario')")
    await page.wait_for_timeout(500)

    # Click on Filtra button
    print("Clicking on Filtra button...")
    await page.click("button:has-text('Filtra')")
    await page.wait_for_timeout(500)

    await page.screenshot(path="/home/jules/verification/admin_filters.png")
    print("Filters screenshot saved.")

    await browser.close()
    await async_playwright_instance.stop()

if __name__ == "__main__":
    asyncio.run(main())
