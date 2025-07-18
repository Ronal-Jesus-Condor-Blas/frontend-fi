// components/ui/Button.tsx
import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  asChild?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      default: 'bg-green-400 text-black hover:bg-green-300 font-semibold',
      ghost: 'hover:bg-gray-800 hover:text-green-400 text-gray-300',
      outline: 'border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-green-400'
    }
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      default: 'h-10 px-4 py-2',
      lg: 'h-12 px-8 text-lg'
    }

    if (asChild) {
      return (
        <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
          {props.children}
        </span>
      )
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
