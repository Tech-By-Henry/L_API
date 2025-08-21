import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# -------------------------
# Load environment variables
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)

def env(key, default=None):
    return os.environ.get(key, default)

def env_bool(key, default=False):
    val = os.environ.get(key)
    if val is None:
        return default
    return str(val).lower() in ("1", "true", "yes", "on")

def env_list(key, default=None, sep=","):
    raw = os.environ.get(key)
    if raw is None:
        return default if default is not None else []
    return [p.strip() for p in raw.split(sep) if p.strip()]

# -------------------------
# Core / security
# -------------------------
SECRET_KEY = env(
    "SECRET_KEY",
    "django-insecure-=h5bfjpv32^4*0b=2kfsn3i7w9gif25lmqa4m52f0r94xwb5=s",
)
DEBUG = env_bool("DEBUG", False)
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# -------------------------
# Applications & Middleware
# -------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "accounts",  # your custom user app
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # must be above CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# -------------------------
# Auth
# -------------------------
AUTH_USER_MODEL = env("AUTH_USER_MODEL", "accounts.CustomUser")

# -------------------------
# CORS
# -------------------------
# Provide comma-separated origins in .env (e.g. http://localhost:5173,http://127.0.0.1:5173)
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", default=["http://localhost:5173"])

# -------------------------
# External API config
# -------------------------
NUB_API_BASE_URL = env("NUB_API_BASE_URL", "https://nubapi.com/api/verify")
NUB_API_KEY = env("NUB_API_KEY", "")

# -------------------------
# REST Framework & JWT
# -------------------------
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": ("rest_framework.parsers.JSONParser",),
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": tuple(env_list("SIMPLE_JWT_AUTH_HEADER_TYPES", default=["Bearer"])),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(env("ACCESS_TOKEN_MINUTES", 5))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(env("REFRESH_TOKEN_DAYS", 1))),
    "ROTATE_REFRESH_TOKENS": env_bool("ROTATE_REFRESH_TOKENS", True),
    "BLACKLIST_AFTER_ROTATION": env_bool("BLACKLIST_AFTER_ROTATION", True),
    "UPDATE_LAST_LOGIN": env_bool("UPDATE_LAST_LOGIN", True),
}

# -------------------------
# Database
# -------------------------
# Default DB_ENGINE is set to Postgres (change in .env if you want sqlite).
DB_ENGINE = env("DB_ENGINE", "django.db.backends.postgresql")
# Optional: set DB_SCHEMA in .env if you want to isolate project into a Postgres schema
DB_SCHEMA = env("DB_SCHEMA", "").strip()

if DB_ENGINE == "django.db.backends.sqlite3":
    # ensure NAME is a path when using sqlite
    sqlite_name = env("DB_NAME", BASE_DIR / "db.sqlite3")
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": sqlite_name,
        }
    }
else:
    # Generic DB config for Postgres / other SQL backends
    DATABASES = {
        "default": {
            "ENGINE": DB_ENGINE,
            "NAME": env("DB_NAME", "tech_by_henry"),
            "USER": env("DB_USER", "tech_by_henry"),
            "PASSWORD": env(
                "DB_PASSWORD",
                "t5lMj8xhBScnHLtbNQ9AttzhBAJkSaQy"
            ),
            "HOST": env(
                "DB_HOST",
                "dpg-d2jm2d8dl3ps73ceo9e0-a.oregon-postgres.render.com"
            ),
            "PORT": env("DB_PORT", "5432"),
            "OPTIONS": {
                # If DB_SCHEMA is set, instruct Postgres to prefer that schema first.
                **({"options": f"-c search_path={DB_SCHEMA},public"} if DB_SCHEMA else {}),
                # "sslmode": "require",  # uncomment if provider requires SSL
            },
        }
    }

# -------------------------
# Password validation
# -------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------
# Internationalization
# -------------------------
LANGUAGE_CODE = env("LANGUAGE_CODE", "en-us")
TIME_ZONE = env("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# -------------------------
# Static files
# -------------------------
STATIC_URL = env("STATIC_URL", "/static/")
STATIC_ROOT = BASE_DIR / "staticfiles"

# -------------------------
# Default primary key field type
# -------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
