// Temporary global JSX declarations to silence TS7026 errors
// Install @types/react and restart TS server for proper types.
declare namespace JSX {
  // Allow any intrinsic element to avoid 'JSX element implicitly has any type' errors
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export {}
