import DomPortfolio from '@/components/DomPortfolio'
import ExperienceRouter from '@/components/ExperienceRouter'

/**
 * The DOM portfolio is rendered on the server unconditionally, then the router
 * decides on the client whether to layer the 3D world over it. That order is
 * what keeps the page indexable and keeps the first paint fast - the world's
 * three.js chunk is never part of the initial payload.
 */
export default function Home() {
  return (
    <ExperienceRouter>
      <DomPortfolio />
    </ExperienceRouter>
  )
}
