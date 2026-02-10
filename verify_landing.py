from playwright.sync_api import sync_playwright

def verify_landing_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Correct path from App.tsx
            page.goto("http://localhost:5174/noleggio-ledwall-venezia-eventi")
            page.wait_for_timeout(3000)
            page.screenshot(path="ledwall_landing_verification_v2.png", full_page=True)
            print("Screenshot taken: ledwall_landing_verification_v2.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_landing_page()
