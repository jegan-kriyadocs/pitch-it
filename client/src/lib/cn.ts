import { extendTailwindMerge, type ClassNameValue } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: { theme: { radius: ['base'], shadow: ['raised', 'menu', 'dialog'] } },
})

export function cn(...classes: ClassNameValue[]) {
  return twMerge(...classes)
}
