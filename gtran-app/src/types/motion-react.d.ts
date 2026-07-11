// Minimal declaration for 'motion/react' to suppress missing-type errors
declare module "motion/react" {
  export const motion: any
  export const useScroll: any
  export const useTransform: any
  export default motion
}

declare module "motion" {
  const m: any
  export default m
}
