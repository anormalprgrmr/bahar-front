import { Reveal } from '@/components/ui/Reveal/Reveal'
import { Hero } from '@/features/home/Hero/Hero'
import { WeeklyDeals } from '@/features/home/WeeklyDeals/WeeklyDeals'
import { FeaturedProducts } from '@/features/home/FeaturedProducts/FeaturedProducts'

export function HomePage() {
  return (
    <>
      <Hero />
      <Reveal>
        <WeeklyDeals />
      </Reveal>
      <Reveal delay={80}>
        <FeaturedProducts />
      </Reveal>
    </>
  )
}
