// Accessibility utilities for keyboard navigation and screen reader support

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Trap focus within a modal/dialog
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus()
        e.preventDefault()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  return () => element.removeEventListener('keydown', handleTabKey)
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof window === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Get accessible label for form field
export function getAccessibleLabel(field: string, required: boolean = false): string {
  const labels: Record<string, string> = {
    teamName: 'Team name',
    leaderName: 'Team leader full name',
    leaderEmail: 'Team leader email address',
    leaderPhone: 'Team leader phone number',
    institution: 'Institution or college name',
    robotName: 'Robot name',
    weight: 'Robot weight in kilograms',
    dimensions: 'Robot dimensions in centimeters',
    weaponType: 'Weapon type for RoboWars',
  }

  const label = labels[field] || field
  return required ? `${label}, required` : label
}

// Keyboard shortcut handler
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  if (typeof window === 'undefined') return

  const handleKeyPress = (e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    const key = e.key.toLowerCase()
    const withCtrl = e.ctrlKey || e.metaKey
    const withShift = e.shiftKey

    let shortcutKey = key
    if (withCtrl) shortcutKey = `ctrl+${key}`
    if (withShift) shortcutKey = `shift+${key}`
    if (withCtrl && withShift) shortcutKey = `ctrl+shift+${key}`

    const handler = shortcuts[shortcutKey]
    if (handler) {
      e.preventDefault()
      handler()
    }
  }

  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}

// Focus first error field
export function focusFirstError(errors: Array<{ field: string; message: string }>) {
  if (errors.length === 0) return

  const firstErrorField = errors[0].field
  const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
  
  if (element) {
    element.focus()
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Create skip link for keyboard users
export function createSkipLink(targetId: string, label: string = 'Skip to main content') {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = label
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded'
  
  document.body.insertBefore(skipLink, document.body.firstChild)
}
