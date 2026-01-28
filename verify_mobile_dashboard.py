import asyncio
from playwright.async_api import async_playwright

async def main():
    async_playwright_instance = await async_playwright().start()
    browser = await async_playwright_instance.chromium.launch()
    context = await browser.new_context(viewport={'width': 390, 'height': 844})
    page = await context.new_page()

    await page.route("**/auth/v1/user", lambda route: route.fulfill(
        status=200,
        body='{"id": "user-id", "email": "admin@quattrosound.it"}'
    ))

    print("Navigating to /admin on mobile...")
    await page.goto("http://localhost:5173/admin", wait_until="networkidle")
    await page.wait_for_timeout(2000)

    # Try to open sidebar
    print("Opening sidebar...")
    # The hamburger button has Menu icon
    await page.click("button:has(svg.lucide-menu)")
    await page.wait_for_timeout(1000)
    await page.screenshot(path="/home/jules/verification/admin_mobile_sidebar.png")

    # Close sidebar
    print("Closing sidebar...")
    await page.click("button:has(svg.lucide-x)")
    await page.wait_for_timeout(500)

    # Open form
    print("Opening form...")
    await page.click("button:has-text('Articolo')")
    await page.wait_for_timeout(1000)
    await page.screenshot(path="/home/jules/verification/admin_mobile_form.png")

    await browser.close()
    await async_playwright_instance.stop()

if __name__ == "__main__":
    asyncio.run(main())
