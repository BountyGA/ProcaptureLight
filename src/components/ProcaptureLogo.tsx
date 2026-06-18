/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProcaptureLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  iconOnly?: boolean;
}

export default function ProcaptureLogo({ className = '', theme = 'dark', iconOnly = false }: ProcaptureLogoProps) {
  // Rich gold color for the silhouette and accents
  const goldColor = '#C5A85A'; // #C5A85A is a sophisticated matte gold, matching the logo image perfectly!
  
  const textPrimaryColor = theme === 'light' ? 'text-zinc-900' : 'text-white';
  const textSecondaryColor = theme === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Golden Woman Profile & Flower SVG Icon */}
      <div className="relative shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform hover:scale-105 transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Detailed, premium bezier curves for the woman silhouette face profile facing right */}
          <path
            d="M 32 30 
               C 36 29, 39 26, 42 27 
               C 44 28, 45 31, 46 34
               C 47 38, 48 42, 50 45
               C 51 47, 53 49, 56 47
               C 59 45, 60 41, 58 37
               C 57 32, 52 29, 49 26
               C 46 23, 43 20, 42 16
               C 41 12, 43 7, 47 5
               C 49 4, 53 6, 56 9
               C 59 12, 60 17, 61 22
               C 62 26, 64 30, 67 33
               C 70 36, 73 39, 74 43
               C 75 46, 74 49, 71 52
               C 65 57, 60 62, 53 64
               C 47 66, 41 68, 35 70
               C 28 72, 22 75, 17 80
               C 13 84, 10 90, 8 96
               C 13 97, 18 97, 23 96
               C 33 93, 41 87, 49 81
               C 57 75, 65 67, 72 58
               C 75 54, 78 49, 81 44
               C 83 40, 85 36, 88 33
               C 92 29, 97 27, 100 28"
            stroke={goldColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <path
            d="M 28 42
               C 27 50, 31 58, 38 62
               C 44 65, 51 64, 56 59
               C 61 54, 62 46, 59 39
               C 56 34, 50 31, 44 33
               C 38 35, 30 36, 28 42 Z"
            fill={goldColor}
            opacity="0.95"
          />

          {/* Golden Flower behind the ear */}
          {/* Petal 1 */}
          <path
            d="M 24 38 C 17 38, 14 30, 21 27 C 26 25, 28 32, 28 36"
            fill={goldColor}
            stroke={goldColor}
            strokeWidth="1"
          />
          {/* Petal 2 */}
          <path
            d="M 28 36 C 31 30, 39 30, 36 38 C 34 42, 29 40, 28 36"
            fill={goldColor}
            stroke={goldColor}
            strokeWidth="1"
          />
          {/* Petal 3 */}
          <path
            d="M 28 36 C 33 41, 29 49, 23 44 C 19 41, 24 38, 28 36"
            fill={goldColor}
            stroke={goldColor}
            strokeWidth="1"
          />
          {/* Petal 4 */}
          <path
            d="M 28 36 C 24 43, 15 40, 18 33 C 20 29, 25 32, 28 36"
            fill={goldColor}
            stroke={goldColor}
            strokeWidth="1"
          />
          {/* Petal 5 */}
          <path
            d="M 28 36 C 21 32, 22 23, 29 27 C 32 29, 31 34, 28 36"
            fill={goldColor}
            stroke={goldColor}
            strokeWidth="1"
          />
          {/* Flower Center Stamen outline */}
          <circle cx="28" cy="36" r="2.5" fill="#FFF" opacity="0.8" />
          <path d="M 28 36 L 35 34" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />
          <circle cx="35" cy="34" r="1" fill="#FFF" />
          
          {/* Aesthetic flowing line (the golden swoosh at bottom) */}
          <path
            d="M 12 60 Q 25 78 50 82 T 95 83"
            stroke={goldColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Elegant Serif & Sans Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          {/* serif typography 'capture' in lower case as on original logo */}
          <span className={`font-serif text-xl sm:text-2xl font-light tracking-normal leading-none lowercase ${textPrimaryColor}`}>
            capture
          </span>
          
          {/* 'PRO | LIGHT' sub-logo centered / block font */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[8px] sm:text-[9.5px] font-extrabold tracking-[0.25em] uppercase font-sans ${textSecondaryColor}`}>
              PRO
            </span>
            <span className="w-[1.2px] h-2.5 bg-yellow-500/60" />
            <span className="text-[8px] sm:text-[9.5px] font-extrabold tracking-[0.25em] uppercase text-yellow-500 font-sans">
              LIGHT
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
