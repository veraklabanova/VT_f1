'use client'

import { DemoProvider } from '@/lib/demo/demo-context'
import type { ReactNode } from 'react'

export function DemoWrapper({ children }: { children: ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>
}
