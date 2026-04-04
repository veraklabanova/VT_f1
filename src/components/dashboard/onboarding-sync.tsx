'use client'

import { useOnboardingTransfer } from '@/hooks/use-onboarding-transfer'

export function OnboardingSync() {
  useOnboardingTransfer()
  return null
}
