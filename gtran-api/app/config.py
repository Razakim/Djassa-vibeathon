from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    jwt_secret: str = "gtran-dev-secret-change-in-production"
    jwt_expire_minutes: int = 60 * 24 * 7
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    cors_origin_regex: str = r"https://.*\.vercel\.app"
    store_path: str = "data/store.json"
    port: int = 8000
    environment: str = "development"
    supabase_url: str = ""
    supabase_key: str = ""

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def cors_regex(self) -> str | None:
        value = self.cors_origin_regex.strip()
        return value or None


settings = Settings()
