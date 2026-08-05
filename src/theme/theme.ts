export type ThemeName = 'light' | 'dark'

/* Structural subset of Element so the logic stays testable without a DOM. */
type ThemeRoot = Pick<Element, 'getAttribute' | 'setAttribute'>

export function setTheme(theme: ThemeName, root: ThemeRoot = document.documentElement): void {
  root.setAttribute('data-theme', theme)
}

export function getTheme(root: ThemeRoot = document.documentElement): ThemeName {
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function systemTheme(): ThemeName {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applySystemTheme(): void {
  setTheme(systemTheme())
}
