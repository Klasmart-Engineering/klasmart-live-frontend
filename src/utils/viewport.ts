import { useEffect, useState } from "react"

export function isElementInViewport(ref: React.RefObject<HTMLElement>): boolean {

    const [isIntersecting, setIntersecting] = useState(false)
    const observer = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    )
  
    useEffect(() => {
        if(ref.current) {
            observer.observe(ref.current)
        }
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect() }
    }, [])
  
    return isIntersecting
  }
