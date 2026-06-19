/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AdZone } from '../types';

interface AdBlockProps {
  zoneId: string;
  format: 'Banner 728x90' | 'Banner 320x50' | 'Square 300x250' | 'Native';
  activeZoneConfig?: AdZone;
  onAdClick?: () => void;
}

export default function AdBlock({ zoneId, format }: AdBlockProps) {
  // Return the specific placeholders matching the requested formats with no hardcoded fake ads
  if (format === 'Banner 728x90') {
    return (
      <div 
        id="adsterra-leaderboard" 
        style={{ minHeight: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
      </div>
    );
  }

  if (format === 'Square 300x250' || format === 'Native') {
    return (
      <div 
        id="adsterra-rectangle" 
        style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
      </div>
    );
  }

  if (format === 'Banner 320x50') {
    return (
      <div 
        id="adsterra-rectangle" 
        style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
      </div>
    );
  }

  return (
    <div id="adsterra-popunder"></div>
  );
}
