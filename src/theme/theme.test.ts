import { describe, expect, it } from 'vitest'
import { getTheme, setTheme } from './theme.ts'

function fakeRoot() {
  const attrs = new Map<string, string>()
  return {
    getAttribute: (name: string) => attrs.get(name) ?? null,
    setAttribute: (name: string, value: string) => {
      attrs.set(name, value)
    },
  }
}

describe('theme', () => {
  it('defaults to light when no data-theme is set', () => {
    expect(getTheme(fakeRoot())).toBe('light')
  })

  it('round-trips the data-theme attribute', () => {
    const root = fakeRoot()
    setTheme('dark', root)
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(getTheme(root)).toBe('dark')
    setTheme('light', root)
    expect(getTheme(root)).toBe('light')
  })
})
