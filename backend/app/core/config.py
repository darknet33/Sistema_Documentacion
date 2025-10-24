# app/core/config.py
from pydantic_settings import BaseSettings
from pydantic import computed_field

class Settings(BaseSettings):
    # --- Configuración Base de Datos ---
    DB_ENGINE: str = "sqlite"
    DB_NAME: str = "test.db"
    DB_USER: str | None = None
    DB_PASSWORD: str | None = None
    DB_HOST: str | None = None
    DB_PORT: int | None = None
    DATABASE_URL: str | None = None

    # --- Configuración JWT ---
    SECRET_KEY: str = "your_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 días

    # --- Configuración Adicional (opcional) ---
    APP_NAME: str = "Sistema Documentación"
    DEBUG: bool = True

    @computed_field(return_type=str)
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        """Construye la URL de conexión automáticamente."""
        if self.DATABASE_URL:
            return self.DATABASE_URL

        if self.DB_ENGINE == "sqlite":
            return f"sqlite:///{self.DB_NAME}"

        # SQL Server con pyodbc
        if "mssql+pyodbc" in self.DB_ENGINE:
            driver = "ODBC Driver 18 for SQL Server"
            return (
                f"mssql+pyodbc://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
                f"?driver={driver.replace(' ', '+')}&TrustServerCertificate=yes"
            )
            
        if "mysql+pymysql" in self.DB_ENGINE:
            return (
                f"{self.DB_ENGINE}://{self.DB_USER}:{self.DB_PASSWORD}@"
                f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            )

        # Otros motores (PostgreSQL, MySQL, etc.)
        return (
            f"{self.DB_ENGINE}://{self.DB_USER}:{self.DB_PASSWORD}@"
            f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instancia global
settings = Settings()
