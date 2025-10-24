import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, MinusSmallIcon } from '@heroicons/react/24/solid'

interface CarouselSliderProps {
  items: Array<{
    id: string | number
    imageUrl: string
    alt?: string
  }>
  className?: string
}

const MOVE_THRESHOLD = 30

/**
 * Carousel slider component for campaigns
 */
export function CarouselSlider({ items, className = '' }: CarouselSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)
  const [diffX, setDiffX] = useState(0)
  const hasItems = items.length > 0

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 + items.length) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const selectSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const getItem = (index: number) => {
    return items[(index + items.length) % items.length]
  }

  const onTouchMove = (event: MouseEvent | TouchEvent) => {
    if (startX === null) return
    const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX
    setDiffX(currentX - startX)
  }

  const onTouchEnd = () => {
    if (startX === null) return
    if (diffX > MOVE_THRESHOLD) {
      prevSlide()
    } else if (diffX < -MOVE_THRESHOLD) {
      nextSlide()
    }
    setStartX(null)
    setDiffX(0)
  }

  const onTouchStart = (event: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    setStartX(clientX)
  }

  useEffect(() => {
    if (!hasItems) return

    const handleMouseMove = (e: MouseEvent) => onTouchMove(e)
    const handleTouchMove = (e: TouchEvent) => onTouchMove(e)
    const handleMouseUp = () => onTouchEnd()
    const handleTouchEnd = () => onTouchEnd()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [hasItems, startX, diffX])

  if (!hasItems) return null

  return (
    <div data-test="body" className={`container touch-pan-y ${className}`}>
      <div
        className="flex items-center justify-center"
        onTouchStart={onTouchStart}
        onMouseDown={onTouchStart}
      >
        <ChevronLeftIcon
          className="h-10 w-10 text-gray-300 hover:text-gray-500"
          data-test="left-arrow"
          onClick={prevSlide}
        />
        {items.map((item, index) => (
          index === currentIndex && (
            <div
              key={index}
              data-test="slider"
              style={{
                transform: `translate3d(${diffX}px, 0, 0)`,
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.alt || 'Special Contents'}
                className="pointer-events-none m-auto max-h-90 min-w-0"
              />
            </div>
          )
        ))}
        <ChevronRightIcon
          className="h-10 w-10 text-gray-300 hover:text-gray-500"
          data-test="right-arrow"
          onClick={nextSlide}
        />
      </div>
      <div className="flex justify-center">
        {items.map((_, index) => (
          <MinusSmallIcon
            key={index}
            className={`h-10 w-10 ${index === currentIndex ? 'text-gray-500' : 'text-gray-300'}`}
            data-test={index !== currentIndex ? 'page-indicator' : undefined}
            onClick={() => index !== currentIndex && selectSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
