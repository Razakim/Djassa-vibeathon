// Broad module fallbacks to silence missing-type errors during build
declare module '@/*' {
  const anyExport: any
  export = anyExport
}

declare module '*'

// Allow CSS module imports
declare module '*.module.css'
declare module '*.module.scss'
