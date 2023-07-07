import { ReactNode } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperProps } from 'swiper/react'

export function CustomSwiper({ children, nextRef, previousRef, ...props}: {
  children: ReactNode
  nextRef?: any
  previousRef?: any
} & SwiperProps) {
  const onBeforeInit = (sp: SwiperClass) => {
    if (typeof sp.params.navigation !== 'boolean') {
      const { navigation } = sp.params

      navigation!.prevEl = previousRef.current
      navigation!.nextEl = nextRef.current
    }
  }

  return (
    <Swiper autoplay modules={[Navigation]} onBeforeInit={onBeforeInit} {...props} >
      {children}
    </Swiper>
  )
}
