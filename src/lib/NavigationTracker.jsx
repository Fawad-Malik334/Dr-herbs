import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { base44 } from '@/api/base44Client';
import { pagesConfig } from '@/pages.config';

export default function NavigationTracker() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];

    const TRACKING_STORAGE_KEY = 'tracking_data';
    const TRACKING_TTL_MS = 7 * 24 * 60 * 60 * 1000;

    // Log user activity when navigating to a page
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const incomingTracking = {
            ad_code: params.get('ad_code') || '',
            fbclid: params.get('fbclid') || '',
            utm_source: params.get('utm_source') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_medium: params.get('utm_medium') || '',
        };

        const hasIncoming = Object.values(incomingTracking).some((v) => String(v || '').trim());

        const readStoredTracking = () => {
            try {
                const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (!parsed || typeof parsed !== 'object') return null;

                const savedAt = Number(parsed.saved_at || 0);
                if (!savedAt || Date.now() - savedAt > TRACKING_TTL_MS) return null;

                const data = parsed.data;
                if (!data || typeof data !== 'object') return null;
                return data;
            } catch {
                return null;
            }
        };

        const writeStoredTracking = (data) => {
            try {
                localStorage.setItem(
                    TRACKING_STORAGE_KEY,
                    JSON.stringify({ saved_at: Date.now(), data })
                );
            } catch {
                // ignore
            }
        };

        if (hasIncoming) {
            const existing = readStoredTracking() || {};
            const merged = { ...existing };
            for (const [k, v] of Object.entries(incomingTracking)) {
                const val = String(v || '').trim();
                if (val) merged[k] = val;
            }
            writeStoredTracking(merged);

            if (incomingTracking.ad_code) {
                localStorage.setItem('drherbs_ad_code', String(incomingTracking.ad_code));
            }
        }

        // Extract page name from pathname
        const pathname = location.pathname;
        let pageName;

        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            // Remove leading slash and get the first segment
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];

            // Try case-insensitive lookup in Pages config
            const pageKeys = Object.keys(Pages);
            const matchedKey = pageKeys.find(
                key => key.toLowerCase() === pathSegment.toLowerCase()
            );

            pageName = matchedKey || null;
        }

        if (isAuthenticated && pageName) {
            base44.appLogs.logUserInApp(pageName).catch(() => {
                // Silently fail - logging shouldn't break the app
            });
        }
    }, [location, isAuthenticated, Pages, mainPageKey]);

    return null;
}