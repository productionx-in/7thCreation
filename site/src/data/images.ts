// Marquee tile data. Four categories (Industrial, Wedding, Product, Live)
// use real licensed Adobe Stock reference photography — see RealImage.tsx.
// The rest are still local icon placeholders pending real stills; see
// site/README.md for what to swap and how.

import {
  Factory, Heart, Sparkles, Building2, Film, Radio,
  Baby, MonitorPlay, PartyPopper, Mic2, User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';
import liveImg from '@/assets/stock/live-event.jpg';

export type MockImage = { label: string; icon: LucideIcon; photo?: string };

export const MARQUEE_ROW_1: MockImage[] = [
  { label: 'Industrial', icon: Factory, photo: industrialImg },
  { label: 'Wedding', icon: Heart, photo: weddingImg },
  { label: 'Product', icon: Sparkles, photo: productImg },
  { label: 'Corporate', icon: Building2 },
  { label: 'Documentary', icon: Film },
  { label: 'Live', icon: Radio, photo: liveImg },
];

export const MARQUEE_ROW_2: MockImage[] = [
  { label: 'Pre-Wedding', icon: Heart },
  { label: 'Baby Shoot', icon: Baby },
  { label: 'LED Wall', icon: MonitorPlay },
  { label: 'Birthday', icon: PartyPopper },
  { label: 'Podcast', icon: Mic2 },
  { label: 'Portfolio', icon: User },
];
