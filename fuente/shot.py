import sys, subprocess, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8765"], cwd=sys.argv[1], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width": 1400, "height": 760})
    pg.on("console", lambda m: print("console:", m.text))
    pg.goto("http://localhost:8765/index.html"); pg.wait_for_function("window.__ready === true", timeout=20000); pg.wait_for_timeout(1500)
    pg.screenshot(path=sys.argv[2]); b.close()
srv.terminate()
