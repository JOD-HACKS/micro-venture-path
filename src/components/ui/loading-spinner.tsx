import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-border border-t-primary", sizeClasses[size], className)} />
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0ms'}} />
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '150ms'}} />
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '300ms'}} />
    </div>
  )
}

interface LoadingStateProps {
  message?: string
  children?: React.ReactNode
  className?: string
}

export function LoadingState({ message = "Loading...", children, className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <LoadingSpinner size="lg" className="mb-4" />
      {children || (
        <div>
          <p className="text-muted-foreground mb-2">{message}</p>
          <LoadingDots />
        </div>
      )}
    </div>
  )
}