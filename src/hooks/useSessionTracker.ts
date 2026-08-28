/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { recordSessionDwell } from '../services/firebase';

/**
 * Custom React Hook to track session dwell time and engagement duration on site
 */
export function useSessionTracker() {
  const startTimeRef = useRef<number>(Date.now());
  const activeDurationRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Handle visibility change (pause timer if user switches tab)
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.hidden) {
        if (isVisibleRef.current) {
          activeDurationRef.current += Math.floor((now - lastTickRef.current) / 1000);
        }
        isVisibleRef.current = false;
      } else {
        lastTickRef.current = now;
        isVisibleRef.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2. Periodic sync every 30 seconds
    const interval = setInterval(() => {
      if (isVisibleRef.current) {
        const now = Date.now();
        const delta = Math.floor((now - lastTickRef.current) / 1000);
        if (delta > 0) {
          activeDurationRef.current += delta;
          lastTickRef.current = now;
          recordSessionDwell(delta);
        }
      }
    }, 30000);

    // 3. Sync on unload / navigate away
    const handleUnload = () => {
      if (isVisibleRef.current) {
        const now = Date.now();
        const delta = Math.floor((now - lastTickRef.current) / 1000);
        if (delta > 0) {
          recordSessionDwell(delta);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
}
