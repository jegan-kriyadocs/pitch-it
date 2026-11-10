import { Globe, ShieldCheck, Video, type LucideIcon } from 'lucide-react'

import { Badge } from '@/ui/Badge'
import { HERO_HIGHLIGHTS } from './authData'

const HIGHLIGHT_ICONS: Record<(typeof HERO_HIGHLIGHTS)[number]['id'], LucideIcon> = {
  triage: Video,
  anonymization: ShieldCheck,
  cloud: Globe,
}

const BRAND_BADGE_CLASSES = 'border border-brand-200'

export function AuthHeroPanel() {
  return (
    <aside className="hidden flex-col justify-between gap-10 bg-brand-700 px-14 py-12 lg:flex lg:w-[46%] lg:max-w-[640px] lg:shrink-0">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2">
          <Badge variant="brand" className={BRAND_BADGE_CLASSES}>
            Kriyadocs
          </Badge>
          <Badge variant="brand" className={BRAND_BADGE_CLASSES}>
            Pitch It
          </Badge>
        </div>
        <h2 className="max-w-[460px] text-3xl leading-tight font-semibold text-white">
          Transforming Academic Publishing through Video &amp; Open Science.
        </h2>
        <ul className="flex flex-col gap-5">
          {HERO_HIGHLIGHTS.map((highlight) => {
            const Icon = HIGHLIGHT_ICONS[highlight.id]
            return (
              <li key={highlight.id} className="flex gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white">
                  <Icon size={18} aria-hidden />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[15px] font-semibold text-white">{highlight.title}</h3>
                  <p className="text-[13px] leading-normal text-brand-100">{highlight.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="text-[13px] text-brand-100">Joint innovation by Kriyadocs &amp; Cadmore Media.</p>
    </aside>
  )
}
