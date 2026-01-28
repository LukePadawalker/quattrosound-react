import asyncio
from playwright.async_api import async_playwright

async def main():
    async_playwright_instance = await async_playwright().start()
    browser = await async_playwright_instance.chromium.launch()
    page = await browser.new_page()

    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    # Go to login page
    print("Navigating to /login...")
    try:
        await page.goto("http://localhost:5173/login", wait_until="networkidle")
        print("Page loaded.")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="/home/jules/verification/login_page.png")
        print("Screenshot saved.")
    except Exception as e:
        print(f"Error: {e}")

    await browser.close()
    await async_playwright_instance.stop()

if __name__ == "__main__":
    asyncio.run(main())
