import os
import shutil
import tempfile
import unittest
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import urlopen

from pyunitreport import HTMLTestRunner
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


WAIT_TIMEOUT = 20


def resolve_base_url():
    configured_url = os.environ.get("SIRA_BASE_URL")
    candidate_urls = [configured_url] if configured_url else [
        "http://localhost:3001",
        "http://localhost:3000",
    ]

    for candidate in candidate_urls:
        if not candidate:
            continue

        normalized = candidate.rstrip("/")

        try:
            with urlopen(f"{normalized}/", timeout=5) as response:
                if response.status < 500:
                    return normalized
        except URLError:
            continue

    raise RuntimeError(
        "No fue posible conectarse a SIRA. Levanta la app y, si usa otro puerto, "
        "define la variable SIRA_BASE_URL antes de ejecutar la prueba."
    )


def remove_old_chromedriver_from_path():
    path_parts = os.environ.get("PATH", "").split(os.pathsep)
    os.environ["PATH"] = os.pathsep.join(
        part
        for part in path_parts
        if os.path.normcase(os.path.normpath(part)) != os.path.normcase(r"C:\Python")
    )


class SiraSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        remove_old_chromedriver_from_path()
        options = Options()
        cls.profile_dir = tempfile.mkdtemp()
        options.add_argument(f"--user-data-dir={cls.profile_dir}")
        options.add_argument("--remote-debugging-port=0")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        cls.driver = webdriver.Chrome(options=options)
        cls.driver.implicitly_wait(2)
        cls.wait = WebDriverWait(cls.driver, WAIT_TIMEOUT)
        cls.base_url = resolve_base_url()

    def open_path(self, path):
        self.driver.get(f"{self.base_url}{path}")

    def assert_path(self, expected_path):
        parsed = urlparse(self.driver.current_url)
        self.assertEqual(parsed.path, expected_path)

    def wait_for_heading(self, heading_text):
        return self.wait.until(
            EC.visibility_of_element_located(
                (
                    By.XPATH,
                    f"//*[self::h1 or self::h2][contains(normalize-space(), '{heading_text}')]",
                )
            )
        )

    def test_homepage_loads(self):
        self.open_path("/")
        self.wait.until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    "//*[contains(normalize-space(), 'SIRA') or contains(normalize-space(), 'reservas academicas')]",
                )
            )
        )
        self.assert_path("/")

    def test_login_page_loads(self):
        self.open_path("/login")
        self.wait_for_heading("Inicia sesion en SIRA")
        self.assert_path("/login")

    def test_register_page_loads(self):
        self.open_path("/register")
        self.wait_for_heading("Crea tu usuario en SIRA")
        self.assert_path("/register")

    def test_dashboard_redirects_to_login_without_session(self):
        self.open_path("/dashboard")
        self.wait_for_heading("Inicia sesion en SIRA")
        self.assert_path("/login")

    def test_reserva_redirects_to_login_without_session(self):
        self.open_path("/reserva")
        self.wait_for_heading("Inicia sesion en SIRA")
        self.assert_path("/login")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        shutil.rmtree(cls.profile_dir, ignore_errors=True)


if __name__ == "__main__":
    unittest.main(
        verbosity=2,
        testRunner=HTMLTestRunner(output="reportes", report_name="sira-smoke-report"),
    )
