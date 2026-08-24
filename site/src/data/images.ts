// Marquee tile data. All twelve categories now use real licensed Adobe
// Stock reference photography — see RealImage.tsx.

import {
  Factory, Heart, Sparkles, Building2, Film, Radio,
  Baby, MonitorPlay, PartyPopper, Mic2, User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';
import liveImg from '@/assets/stock/live-event.jpg';
import corporateImg from '@/assets/stock/corporate.jpg';
import documentaryImg from '@/assets/stock/documentary.jpg';
import preWeddingImg from '@/assets/stock/prewedding.jpg';
import babyShootImg from '@/assets/stock/baby-shoot.jpg';
import ledWallImg from '@/assets/stock/led-wall.jpg';
import birthdayImg from '@/assets/stock/birthday.jpg';
import podcastImg from '@/assets/stock/podcast.jpg';
import portfolioImg from '@/assets/stock/portfolio.jpg';

export type MockImage = { label: string; icon: LucideIcon; photo?: string };

export const MARQUEE_ROW_1: MockImage[] = [
  { label: 'Industrial', icon: Factory, photo: industrialImg },
  { label: 'Wedding', icon: Heart, photo: weddingImg },
  { label: 'Product', icon: Sparkles, photo: productImg },
  { label: 'Corporate', icon: Building2, photo: corporateImg },
  { label: 'Documentary', icon: Film, photo: documentaryImg },
  { label: 'Live', icon: Radio, photo: liveImg },
];

export const MARQUEE_ROW_2: MockImage[] = [
  { label: 'Pre-Wedding', icon: Heart, photo: preWeddingImg },
  { label: 'Baby Shoot', icon: Baby, photo: babyShootImg },
  { label: 'LED Wall', icon: MonitorPlay, photo: ledWallImg },
  { label: 'Birthday', icon: PartyPopper, photo: birthdayImg },
  { label: 'Podcast', icon: Mic2, photo: podcastImg },
  { label: 'Portfolio', icon: User, photo: portfolioImg },
];
