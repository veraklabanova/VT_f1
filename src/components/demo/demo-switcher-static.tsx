'use client'

import { DemoSwitcher } from './demo-switcher'

/**
 * Client component wrapper for DemoSwitcher.
 * Used in server components (like landing page) that need the demo switcher.
 */
export function DemoSwitcherStatic() {
  return <DemoSwitcher />
}
