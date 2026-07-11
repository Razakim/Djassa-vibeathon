/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE?: string
  readonly DEV?: boolean
  readonly PROD?: boolean
  // add custom env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vite/client' {}
