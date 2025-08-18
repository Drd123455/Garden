import type { StaticImageData } from "next/image"

// Helper function to render images (handles both StaticImageData and string paths)
export const renderImage = (
  icon: StaticImageData | string | undefined, 
  alt: string, 
  width: number, 
  height: number, 
  className?: string
) => {
  if (!icon) return null
  
  if (typeof icon === 'string') {
    // Handle GIF files and other string paths
    return (
      <img 
        src={icon} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className}
      />
    )
  } else {
    // Handle StaticImageData (PNG files)
    return (
      <img 
        src={icon.src} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className}
      />
    )
  }
}

// Function to load image data for canvas rendering
export const loadImageForCanvas = (icon: StaticImageData | string | undefined): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!icon) {
      resolve(null)
      return
    }

    const img = new Image()
    
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    
    if (typeof icon === 'string') {
      img.src = icon
    } else {
      img.src = icon.src
    }
  })
}

// Function to draw image on canvas context
export const drawImageOnCanvas = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  try {
    ctx.drawImage(image, x, y, width, height)
  } catch (error) {
    console.error('Error drawing image on canvas:', error)
    // Fallback to colored rectangle if image fails to draw
    ctx.fillStyle = '#888'
    ctx.fillRect(x, y, width, height)
  }
}

// Function to get image dimensions
export const getImageDimensions = (icon: StaticImageData | string | undefined) => {
  if (!icon) return { width: 0, height: 0 }
  
  if (typeof icon === 'string') {
    // For string paths, we can't determine dimensions without loading
    // Return default dimensions
    return { width: 40, height: 40 }
  } else {
    // For StaticImageData, we can get dimensions
    return { width: icon.width, height: icon.height }
  }
}

// Function to create a canvas pattern from an image
export const createImagePattern = async (
  ctx: CanvasRenderingContext2D,
  icon: StaticImageData | string | undefined
): Promise<CanvasPattern | null> => {
  try {
    const image = await loadImageForCanvas(icon)
    if (!image) return null
    
    return ctx.createPattern(image, 'no-repeat')
  } catch (error) {
    console.error('Error creating image pattern:', error)
    return null
  }
}
