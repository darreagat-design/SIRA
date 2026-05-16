# Pruebas Selenium de SIRA

Estas pruebas automatizan flujos de la interfaz web de `SIRA` usando `Python`, `Selenium` y `HTMLTestRunner`.

## Archivos

- `hello_world01.py`: Verifica carga de páginas principales y redirecciones a `/login` cuando no hay sesión.
- `testumg.py`: Registra un usuario nuevo, hace login, crea una reserva y valida el conflicto al intentar duplicarla.

## Requisitos

- `SIRA` corriendo en `http://localhost:3001` o `http://localhost:3000`
- base de datos levantada con migraciones y seed aplicados
- `Python` instalado
- dependencias Python instaladas:

```bash
pip install selenium pyunitreport
```

- `Chrome` y `ChromeDriver` disponibles en la máquina

## Comandos para ejecutar

Desde la raíz de `SIRA`:

```bash
python tests/selenium/hello_world01.py
python tests/selenium/testumg.py
```

Si necesitas apuntar a otra URL o puerto:

```bash
set SIRA_BASE_URL=http://localhost:3005
python tests/selenium/testumg.py
```

## Modo depuracion visual

Si quieres que la prueba avance mas despacio:

```bash
set SIRA_STEP_DELAY=1.5
python tests/selenium/testumg.py
```

Si quieres que se detenga justo antes de enviar la reserva:

```bash
set SIRA_DEBUG_PAUSE_BEFORE_SUBMIT=1
python tests/selenium/testumg.py
```

Puedes combinar ambas opciones:

```bash
set SIRA_STEP_DELAY=1
set SIRA_DEBUG_PAUSE_BEFORE_SUBMIT=1
python tests/selenium/testumg.py
```

## Resultado

Cada script genera un reporte HTML en la carpeta `reportes` con el resultado de la ejecución.
