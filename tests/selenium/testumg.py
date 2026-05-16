import os
import shutil
import tempfile
import time
import unittest
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import urlopen

from pyunitreport import HTMLTestRunner
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


WAIT_TIMEOUT = 20
STEP_DELAY = float(os.environ.get("SIRA_STEP_DELAY", "0"))
DEBUG_PAUSE_BEFORE_SUBMIT = os.environ.get(
    "SIRA_DEBUG_PAUSE_BEFORE_SUBMIT",
    "0",
).lower() in {"1", "true", "yes"}


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


class SiraFlowTests(unittest.TestCase):
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
        cls.test_user = {
            "nombre": "Usuario Selenium SIRA",
            "correo": f"sira.selenium.{int(time.time())}@example.com",
            "password": "selenium123",
        }
        cls.reservation_data = {
            "fecha": "2026-12-15",
            "hora_inicio": "08:00",
            "hora_fin": "10:00",
            "motivo": "Prueba automatizada Selenium",
        }

    def open_path(self, path):
        self.driver.get(f"{self.base_url}{path}")
        self.pause()

    def current_path(self):
        return urlparse(self.driver.current_url).path

    def wait_for_id(self, element_id):
        return self.wait.until(EC.visibility_of_element_located((By.ID, element_id)))

    def wait_for_clickable_xpath(self, xpath):
        return self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))

    def wait_for_text(self, text):
        return self.wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, f"//*[contains(normalize-space(), '{text}')]")
            )
        )

    def pause(self):
        if STEP_DELAY > 0:
            time.sleep(STEP_DELAY)

    def click_button(self, label):
        button = self.wait_for_clickable_xpath(
            f"//button[normalize-space()='{label}']"
        )
        button.click()
        self.pause()

    def fill_input(self, element_id, value):
        field = self.wait_for_id(element_id)
        field.clear()
        field.send_keys(value)
        self.pause()

    def set_react_input_value(self, element_id, value):
        field = self.wait_for_id(element_id)
        self.driver.execute_script(
            """
            const element = arguments[0];
            const value = arguments[1];
            const prototype = Object.getPrototypeOf(element);
            const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

            element.focus();
            descriptor.set.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
            """,
            field,
            value,
        )
        self.wait.until(lambda _: field.get_attribute("value") == value)
        self.pause()

    def read_feedback_message(self):
        try:
            container = self.driver.find_element(
                By.XPATH,
                "//div[.//*[contains(normalize-space(), 'Formulario incompleto') "
                "or contains(normalize-space(), 'Reserva no creada') "
                "or contains(normalize-space(), 'Conflicto detectado') "
                "or contains(normalize-space(), 'Reserva creada') "
                "or contains(normalize-space(), 'Error de conexion')]]",
            )
            return container.text.strip()
        except Exception:
            return ""

    def register_user(self):
        self.open_path("/register")
        self.wait_for_text("Crea tu usuario en SIRA")
        self.fill_input("nombre", self.test_user["nombre"])
        self.fill_input("correo", self.test_user["correo"])
        self.fill_input("password", self.test_user["password"])
        self.click_button("Crear cuenta")
        self.wait_for_text("Cuenta creada")
        self.wait_for_text("Tu usuario fue registrado correctamente")

    def login_user(self):
        self.open_path("/login")
        self.wait_for_text("Inicia sesion en SIRA")
        self.fill_input("correo", self.test_user["correo"])
        self.fill_input("password", self.test_user["password"])
        self.click_button("Entrar al dashboard")
        self.wait.until(lambda driver: urlparse(driver.current_url).path == "/dashboard")
        self.wait_for_text("Dashboard")

    def open_reserva_page(self):
        self.open_path("/reserva")
        self.wait.until(lambda driver: urlparse(driver.current_url).path == "/reserva")
        self.wait_for_text("Nueva reserva academica")

    def fill_reservation_form(self, motivo=None):
        self.wait.until(EC.presence_of_element_located((By.ID, "espacio")))
        select = Select(self.driver.find_element(By.ID, "espacio"))
        self.assertGreater(len(select.options), 0, "No hay espacios disponibles para reservar.")
        select.select_by_index(0)
        self.pause()

        self.set_react_input_value("fecha", self.reservation_data["fecha"])
        self.set_react_input_value("horaInicio", self.reservation_data["hora_inicio"])
        self.set_react_input_value("horaFin", self.reservation_data["hora_fin"])
        self.fill_input("motivo", motivo or self.reservation_data["motivo"])

    def create_reservation(self, motivo=None):
        self.fill_reservation_form(motivo=motivo)
        if DEBUG_PAUSE_BEFORE_SUBMIT:
            input(
                "Revisa el formulario en el navegador y presiona Enter para continuar con Crear reserva..."
            )
        self.click_button("Crear reserva")

    def test_register_login_and_reservation_conflict_flow(self):
        self.register_user()
        self.login_user()
        self.assertEqual(self.current_path(), "/dashboard")
        self.wait_for_text("Catalogo de espacios activos")

        self.open_reserva_page()
        self.create_reservation()
        try:
            self.wait_for_text("Reserva creada")
        except TimeoutException as error:
            feedback = self.read_feedback_message()
            self.fail(
                "No aparecio el mensaje de reserva creada. "
                f"Feedback visible: {feedback or 'sin mensaje visible'}"
            )
        self.wait_for_text("La reserva se registro correctamente en el sistema.")

        self.create_reservation(motivo="Intento duplicado para validar conflicto")
        try:
            self.wait_for_text("Conflicto detectado")
        except TimeoutException as error:
            feedback = self.read_feedback_message()
            self.fail(
                "No aparecio el mensaje de conflicto detectado. "
                f"Feedback visible: {feedback or 'sin mensaje visible'}"
            )
        self.wait_for_text("Ya existe una reserva en conflicto")

        try:
            self.wait_for_text("Bloque ocupado")
        except TimeoutException:
            self.wait_for_text("Sin reservas para este dia")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        shutil.rmtree(cls.profile_dir, ignore_errors=True)


if __name__ == "__main__":
    unittest.main(
        verbosity=2,
        testRunner=HTMLTestRunner(output="reportes", report_name="sira-flow-report"),
    )
