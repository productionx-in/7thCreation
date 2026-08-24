// ⚠️ MOCK / PLACEHOLDER DATA — see MockPlate.tsx and Logo.tsx for why this
// site renders local placeholders instead of hotlinked images. Every entry
// below is a category label + icon for a MockPlate, not a URL. Swap for real
// stills/frames before this ships — see site/README.md.

import {
  Factory, Heart, Sparkles, Building2, Film, Radio,
  Camera, Baby, MonitorPlay, PartyPopper, Mic2, User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MockImage = { label: string; icon: LucideIcon };

export const HERO_PORTRAIT: MockImage = { label: 'Shooter portrait', icon: Camera };

export const MARQUEE_ROW_1: MockImage[] = [
  { label: 'Industrial', icon: Factory },
  { label: 'Wedding', icon: Heart },
  { label: 'Product', icon: Sparkles },
  { label: 'Corporate', icon: Building2 },
  { label: 'Documentary', icon: Film },
  { label: 'Live', icon: Radio },
];

export const MARQUEE_ROW_2: MockImage[] = [
  { label: 'Pre-Wedding', icon: Heart },
  { label: 'Baby Shoot', icon: Baby },
  { label: 'LED Wall', icon: MonitorPlay },
  { label: 'Birthday', icon: PartyPopper },
  { label: 'Podcast', icon: Mic2 },
  { label: 'Portfolio', icon: User },
];

export type ProjectImages = { col1: [MockImage, MockImage]; col2: MockImage };

export const PROJECTS: {
  n: string;
  name: string;
  category: string;
  kind: 'Client' | 'Personal';
  images: ProjectImages;
}[] = [
  {
    n: '01',
    name: 'Steel & Sparks',
    category: 'Industrial Film',
    kind: 'Client',
    images: {
      col1: [
        { label: 'Industrial, frame 1', icon: Factory },
        { label: 'Industrial, frame 2', icon: Factory },
      ],
      col2: { label: 'Industrial, hero frame', icon: Factory },
    },
  },
  {
    n: '02',
    name: 'Two Lamps, One Night',
    category: 'Wedding',
    kind: 'Client',
    images: {
      col1: [
        { label: 'Wedding, frame 1', icon: Heart },
        { label: 'Wedding, frame 2', icon: Heart },
      ],
      col2: { label: 'Wedding, hero frame', icon: Heart },
    },
  },
  {
    n: '03',
    name: 'Object of Desire',
    category: 'Product',
    kind: 'Client',
    images: {
      col1: [
        { label: 'Product, frame 1', icon: Sparkles },
        { label: 'Product, frame 2', icon: Sparkles },
      ],
      col2: { label: 'Product, hero frame', icon: Sparkles },
    },
  },
];
