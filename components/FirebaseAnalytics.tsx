'use client';

import { useEffect } from 'react';
import { getAnalyticsInstance } from '@/lib/firebase';

export default function FirebaseAnalytics() {
  useEffect(() => {
    getAnalyticsInstance();
  }, []);

  return null;
}

