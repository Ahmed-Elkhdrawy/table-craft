'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'

interface CalendarProps {
  className?: string
  mode?: 'single'
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
}

export function Calendar({ className, mode = 'single', selected, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => selected || new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const isSelected = (day: number) => {
    if (!selected) return false
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
    )
  }

  const handleSelect = (day: number) => {
    const date = new Date(year, month, day)
    onSelect?.(date)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className={cn('p-3', className)}>
      <div className="flex items-center justify-between mb-2">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{monthName}</span>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
        {dayNames.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              className={cn(
                'h-8 w-8 rounded-md text-sm transition-colors hover:bg-accent mx-auto flex items-center justify-center',
                isSelected(day) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isToday(day) && !isSelected(day) && 'bg-accent text-accent-foreground'
              )}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  )
}
