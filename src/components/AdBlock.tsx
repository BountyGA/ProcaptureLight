/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Sparkles, X, ShieldCheck } from 'lucide-react';
import { AdZone } from '../types';

interface AdBlockProps {
  zoneId: string;
  format: 'Banner 728x90' | 'Banner 320x50' | 'Square 300x250' | 'Native';
  activeZoneConfig?: AdZone;
  onAdClick?: () => void;
}

export default function AdBlock({ zoneId, format, activeZoneConfig, onAdClick }: AdBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [simulatedLoad, setSimulatedLoad] = useState(false);

  // Simulated Ad details for high quality aesthetics
  const getMockAdData = () => {
    switch (format) {
      case 'Banner 728x90':
        return {
          title: 'PROCAPTURE ULTRA GLOW LENS SYSTEM',
          subtitle: 'The Ultimate Cinema Prime Kit — Now 20% Off',
          promo: 'Sponsor: CinemaLight & Co.',
          cta: 'Secure Yours Now',
          bg: 'from-zinc-900 via-stone-900 to-zinc-950',
          image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=400&auto=format&fit=crop'
        };
      case 'Banner 320x50':
        return {
          title: 'Upgrade to 4K Wireless transmitter',
          subtitle: '₦40,000 Special Deal',
          promo: 'Sponsor: CineLink',
          cta: 'Get Deal',
          bg: 'from-amber-950 via-zinc-900 to-zinc-950',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=150&auto=format&fit=crop'
        };
      case 'Square 300x250':
        return {
          title: 'MASTERCLASS: STUDIO LIGHTING WITH PROCAPTURE',
          subtitle: 'Join 12,000+ photographers & creators mastering color contrast, soft diffusion, and flash modifiers.',
          promo: 'Sponsored Editorial',
          cta: 'Enroll Free (₦0.00)',
          bg: 'from-neutral-900 via-neutral-900 to-stone-950',
          image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop'
        };
      case 'Native':
      default:
        return {
          title: 'Premium V-Mount Dual Charger',
          subtitle: 'Charge 2 batteries at 3.0A simultaneously. Pro grade reliability.',
          promo: 'Featured Gear Partner',
          cta: 'Shop Accessory',
          bg: 'from-zinc-900 to-slate-950',
          image: 'https://images.unsplash.com/photo-1585336139058-b409f67459ae?q=80&w=300&auto=format&fit=crop'
        };
    }
  };

  const adData = getMockAdData();

  useEffect(() => {
    // Simulate loading for nice visual transition
    const timer = setTimeout(() => {
      setSimulatedLoad(true);
    }, 400 + Math.random() * 600);

    return () => clearTimeout(timer);
  }, []);

  // Run or inject the AdSterra Script if code is provided
  useEffect(() => {
    if (activeZoneConfig?.htmlCode && activeZoneConfig.isActive && containerRef.current) {
      try {
        // Clear previous children
        containerRef.current.innerHTML = '';
        
        // Build range logic or script execution safely
        const range = document.createRange();
        const documentFragment = range.createContextualFragment(activeZoneConfig.htmlCode);
        containerRef.current.appendChild(documentFragment);
      } catch (err) {
        console.error('Failed to inject custom ad script:', err);
      }
    }
  }, [activeZoneConfig, simulatedLoad]);

  if (isDismissed) return null;

  // Render original client-supplied AdSterra code if configured and active
  const hasExternalScript = activeZoneConfig?.isActive && activeZoneConfig?.htmlCode;

  const handleAdInteraction = () => {
    if (onAdClick) {
      onAdClick();
    }
    // Simulate ad click-through
    if (format === 'Square 300x250') {
      window.open('https://adsterra.com', '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://procapture-light.com/sponsored', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full my-6 flex justify-center">
      <div 
        id={`ad-container-${zoneId}`}
        className="w-full max-w-4xl relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/70 shadow-2xl transition-all duration-300"
      >
        {/* Ad Tag Badge */}
        <div className="absolute top-1.5 left-3 flex items-center gap-1.5 z-10">
          <span className="text-[9px] font-mono tracking-wider text-amber-500 uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
            <Sparkles size={8} /> {adData.promo}
          </span>
          <span className="text-[8px] font-sans text-zinc-500">AdSterra Monetized Slot</span>
        </div>

        {/* Ad Dismiss Close button */}
        <button 
          onClick={() => setIsDismissed(true)} 
          className="absolute top-1 right-1.5 p-1 text-zinc-500 hover:text-white hover:bg-zinc-800/40 rounded transition-colors z-20"
          title="Hide advertising"
        >
          <X size={12} />
        </button>

        {/* If user pasted real AdSterra code, output inside this ref */}
        {hasExternalScript ? (
          <div 
            ref={containerRef} 
            className="flex justify-center items-center min-h-[90px] py-4 px-2"
          />
        ) : (
          /* High-Fidelity Simulated Ad Design to keep app looking breathtaking */
          <div 
            onClick={handleAdInteraction}
            className={`cursor-pointer group flex relative transition-all duration-300 ${
              !simulatedLoad ? 'blur-sm pointer-events-none opacity-40' : 'opacity-100'
            }`}
          >
            {format === 'Banner 728x90' && (
              <div className={`w-full flex md:flex-row flex-col items-center justify-between p-4 pt-7 px-6 bg-gradient-to-r ${adData.bg} gap-4`}>
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 hidden sm:block shadow-inner">
                    <img 
                      src={adData.image} 
                      alt="Sponsor Gear" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100 tracking-wide leading-snug group-hover:text-amber-400 transition-colors">
                      {adData.title}
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-xl line-clamp-1">
                      {adData.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-zinc-500 font-mono hidden lg:inline flex items-center gap-1">
                    <ShieldCheck size={10} className="text-emerald-500" /> Secure Link
                  </span>
                  <div className="px-3.5 py-1.5 text-xs text-black font-semibold bg-amber-400 rounded-lg shadow-lg group-hover:bg-amber-300 shadow-amber-950/20 flex items-center gap-1 transition-all">
                    <span>{adData.cta}</span>
                    <ExternalLink size={10} />
                  </div>
                </div>
              </div>
            )}

            {format === 'Banner 320x50' && (
              <div className={`w-full flex items-center justify-between p-2 pt-6 px-4 bg-gradient-to-r ${adData.bg} gap-2 min-h-[50px]`}>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="h-7 w-7 rounded bg-zinc-850 border border-zinc-700/50 overflow-hidden shrink-0 shadow-inner">
                    <img 
                      src={adData.image} 
                      alt="Sponsor Clip" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-zinc-150 uppercase tracking-wider truncate group-hover:text-amber-400 transition-colors">
                      {adData.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {adData.subtitle}
                    </p>
                  </div>
                </div>
                <div className="px-2 py-1 text-[10px] text-black font-semibold bg-amber-400 rounded group-hover:bg-amber-300 shrink-0 flex items-center gap-0.5">
                  <span>Go</span>
                  <ExternalLink size={8} />
                </div>
              </div>
            )}

            {format === 'Square 300x250' && (
              <div className={`w-full flex flex-col justify-between p-5 pt-8 bg-gradient-to-b ${adData.bg} min-h-[250px] aspect-square`}>
                <div className="space-y-3.5">
                  <div className="h-28 w-full rounded-lg bg-zinc-850 border border-zinc-800 overflow-hidden relative shadow-inner">
                    <img 
                      src={adData.image} 
                      alt="Sponsor Square" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-sans font-medium text-amber-400 uppercase tracking-widest">
                        Flash Offer
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
                      {adData.title}
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans mt-1 line-clamp-2">
                      {adData.subtitle}
                    </p>
                  </div>
                </div>
                <div className="pt-2 w-full">
                  <div className="w-full py-2 px-3 text-xs text-black font-bold bg-amber-400 rounded-lg text-center hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-md">
                    <span>{adData.cta}</span>
                    <ExternalLink size={11} />
                  </div>
                </div>
              </div>
            )}

            {format === 'Native' && (
              <div className={`w-full flex items-center gap-4 p-4 pt-7 bg-gradient-to-br ${adData.bg} rounded-xl`}>
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-lg bg-zinc-800 border border-zinc-700/80 overflow-hidden shrink-0 shadow-inner">
                  <img 
                    src={adData.image} 
                    alt="Sponsor Native" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-amber-400 transition-colors">
                    {adData.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {adData.subtitle}
                  </p>
                  <div className="pt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest">Sponsored</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[10px] text-zinc-500 hover:underline flex items-center gap-0.5">
                      Visit Partner <ExternalLink size={8} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
