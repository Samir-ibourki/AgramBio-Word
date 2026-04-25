import { useRef, memo } from 'react'
import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import bg from '../assets/bg2.webp'
import { useAnimation } from '../context/AnimationContext'

const Hero = memo(function Hero() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const bgRef        = useRef(null)
  const overlayRef   = useRef(null)
  const tagRef       = useRef(null)
  const titleRef     = useRef(null)
  const dividerRef   = useRef(null)
  const descRef      = useRef(null)
  const btnsRef      = useRef(null)
  
  const { isReady } = useAnimation();

  useGSAP(() => {
    if (!isReady) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    gsap.fromTo(bgRef.current,
      { scale: 1.1 },
      { scale: 1, duration: 6, ease: 'power1.out' }
    )

    tl.from(overlayRef.current, { opacity: 0, duration: 1.5 }, 0)
    tl.from(tagRef.current, { opacity: 0, y: 30, duration: 0.9 }, 0.6)
    tl.from(titleRef.current.querySelectorAll('.word'), {
      opacity: 0, y: 60, rotateX: -40, stagger: 0.12, duration: 1, ease: 'power4.out',
    }, 1)
    tl.from(dividerRef.current, { scaleX: 0, transformOrigin: 'center', duration: 0.8, ease: 'power2.inOut' }, 1.6)
    tl.from(descRef.current, { opacity: 0, y: 20, duration: 0.8 }, 1.9)
    tl.fromTo(btnsRef.current.children, 
      { opacity: 0, y: 10 },          
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 }, 
      2.1)
  }, { scope: containerRef, dependencies: [isReady] })

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center font-cormorant">
      <div ref={bgRef} className="absolute inset-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }} />
      <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-[rgba(5,3,0,0.3)] via-[rgba(5,3,0,0.62)] to-[rgba(5,3,0,0.88)]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full">
        <span ref={tagRef} className="font-montserrat text-[0.62rem] tracking-[0.38em] text-gold uppercase font-semibold mb-8">
          {t('hero.tag')}
        </span>

        <h1 ref={titleRef} className="text-[clamp(3.2rem,8vw,7.5rem)] font-light text-cream leading-[1.05] tracking-[-0.01em] [perspective:600px]">
          <span className="word inline-block italic font-light">{t('hero.title_1')}&nbsp;</span>
          <span className="word inline-block font-bold text-gold drop-shadow-[0_0_80px_rgba(201,168,76,0.35)]">{t('hero.title_2')}&nbsp;</span> 
          <span className="word inline-block font-bold">{t('hero.title_3')}</span>
        </h1>

        <div ref={dividerRef} className="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent my-8 mx-auto" />

        <p ref={descRef} className="font-montserrat text-[clamp(0.8rem,1.4vw,0.97rem)] text-cream/70 max-w-[460px] leading-[1.9] font-light tracking-wide mb-[2.8rem]">
          {t('hero.description')}
        </p>

        <div ref={btnsRef} className="flex flex-wrap gap-4 justify-center">
          <a className="cursor-pointer px-8 py-4 bg-gold text-black font-medium rounded-full hover:bg-gold/90 transition-all">
            {t('hero.shop_now')}
          </a>
          <a className="cursor-pointer px-8 py-4 border border-gold text-cream font-medium rounded-full hover:bg-gold/10 transition-all">
            {t('hero.our_story')}
          </a>
        </div>
      </div>
    </section>
  )
})

export default Hero
