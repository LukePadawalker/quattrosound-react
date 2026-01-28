import asyncio
from playwright.async_api import async_playwright

async def main():
    async_playwright_instance = await async_playwright().start()
    browser = await async_playwright_instance.chromium.launch()
    page = await browser.new_page()

    # Mock Supabase responses
    await page.route("**/rest/v1/products*", lambda route: route.fulfill(
        status=200,
        body='[]'
    ))
    await page.route("**/auth/v1/user", lambda route: route.fulfill(
        status=200,
        body='{"id": "user-id", "email": "admin@quattrosound.it"}'
    ))

    # Go to admin page (bypass protection as I did before for screenshots)
    print("Navigating to /admin...")
    await page.goto("http://localhost:5173/admin", wait_until="networkidle")

    # Click on Inventario tab
    print("Clicking on Inventario tab...")
    await page.click("button:has-text('Inventario')")
    await page.wait_for_timeout(500)

    # Click on + Articolo button
    print("Clicking on + Articolo button...")
    await page.click("button:has-text('Articolo')")
    await page.wait_for_timeout(500)

    # Check if form is visible
    is_form_visible = await page.is_visible("text=Nuova Attrezzatura")
    print(f"Form visible: {is_form_visible}")

    # Fill the form
    print("Filling form...")
    await page.fill("input[placeholder='Es: RCF Subwoofer']", "Test Product")
    await page.fill("input[placeholder='Roma / Chiarano']", "Test Location")
    # price is index 0 or something? Let's use labels or more specific selectors if possible.
    # Actually I used labels in my latest changes.
    await page.fill("label:has-text('Prezzo') + input", "100")
    await page.fill("label:has-text('Quantità') + input", "5")

    await page.screenshot(path="/home/jules/verification/product_form_filled.png")

    await browser.close()
    await async_playwright_instance.stop()

if __name__ == "__main__":
    asyncio.run(main())
