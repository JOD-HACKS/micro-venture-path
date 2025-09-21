import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeDebug() {
  const { theme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-4 bg-muted text-sm">Loading theme debug...</div>
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border rounded-lg shadow-lg text-sm z-50">
      <h3 className="font-semibold mb-2">Theme Debug</h3>
      <div className="space-y-1">
        <div>Theme: {theme}</div>
        <div>Resolved: {resolvedTheme}</div>
        <div>System: {systemTheme}</div>
        <div>HTML Class: {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}</div>
        <div className="mt-2 p-2 bg-background text-foreground border rounded">
          Test colors: Background & Foreground
        </div>
        <div className="p-2 bg-muted text-muted-foreground border rounded">
          Test colors: Muted & Muted Foreground
        </div>
      </div>
    </div>
  )
}