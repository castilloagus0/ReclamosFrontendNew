/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACK_AUTH_DEV: string;
  readonly VITE_BACK_RECLAMOS_DEV: string;
  readonly VITE_JWT_BACK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
