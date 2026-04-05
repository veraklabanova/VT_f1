'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ImageLightboxProps {
  src: string
  alt?: string
  className?: string
  thumbnailClassName?: string
}

export function ImageLightbox({ src, alt = 'Ilustrace', className, thumbnailClassName }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${thumbnailClassName || 'w-32 h-32 object-cover rounded-lg shrink-0'} cursor-pointer hover:opacity-80 transition-opacity ${className || ''}`}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
