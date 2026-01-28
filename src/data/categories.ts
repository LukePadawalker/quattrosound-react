import {
  Speaker,
  Sliders,
  Mic2,
  Network,
  Monitor,
  Sun,
  Zap,
  Hammer,
  Layers
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'diffusori-audio', name: 'Diffusori Audio', icon: Speaker, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'mixer-regia-audio', name: 'Mixer & Regia Audio', icon: Sliders, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'microfoni-wireless', name: 'Microfoni & Wireless', icon: Mic2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'stagebox-networking', name: 'Stagebox & Networking', icon: Network, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'video-led-wall', name: 'Video & LED Wall', icon: Monitor, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 'luci-illuminazione', name: 'Luci & Illuminazione', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 'cavi-cablaggi', name: 'Cavi & Cablaggi', icon: Layers, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  { id: 'strutture-supporti', name: 'Strutture & Supporti', icon: Layers, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  { id: 'distribuzione-elettrica', name: 'Distribuzione Elettrica', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'accessori-tecnici', name: 'Accessori Tecnici', icon: Hammer, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
];
