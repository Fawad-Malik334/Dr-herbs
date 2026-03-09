import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetaConfigPublic } from '@/api/api';

/**
 * @typedef {Object} MetaValueEvent
 * @property {string=} contentId
 * @property {string=} contentName
 * @property {number=} value
 * @property {string=} currency
 */

/**
 * @typedef {Object} MetaPurchaseEvent
 * @property {number=} value
 * @property {string=} currency
 * @property {string=} eventId
 */

/**
 * @typedef {Object} MetaCheckoutEvent
 * @property {number=} value
 * @property {string=} currency
 * @property {number=} numItems
 */

const ensureFbq = (pixelId) => {
  if (!pixelId) return;

  /** @type {any} */
  const w = window;

  if (!w.fbq) {
    // eslint-disable-next-line no-unused-expressions
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  try {
    w.fbq('init', pixelId);
  } catch {
    // ignore
  }
};

/** @param {MetaCheckoutEvent=} payload */
export const trackMetaInitiateCheckout = (payload = {}) => {
  /** @type {any} */
  const w = window;
  if (!w.fbq) return;
  const { value, currency = 'PKR', numItems } = payload;
  try {
    w.fbq('track', 'InitiateCheckout', {
      currency,
      value: value == null ? undefined : Number(value),
      num_items: numItems == null ? undefined : Number(numItems),
    });
  } catch {
    // ignore
  }
};

export function MetaPixelTracker() {
  const location = useLocation();
  const [pixelId, setPixelId] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await getMetaConfigPublic();
        const id = String(cfg?.pixel_id || '').trim();
        if (!mounted) return;
        setPixelId(id);
        ensureFbq(id);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!pixelId) return;
    /** @type {any} */
    const w = window;
    if (!w.fbq) return;

    try {
      w.fbq('track', 'PageView');
    } catch {
      // ignore
    }
  }, [pixelId, location.pathname, location.search]);

  return null;
}

/** @param {MetaPurchaseEvent=} payload */
export const trackMetaPurchase = (payload = {}) => {
  /** @type {any} */
  const w = window;
  if (!w.fbq) return;
  const { value, currency = 'PKR', eventId } = payload;
  try {
    w.fbq('track', 'Purchase', { value: Number(value || 0), currency }, { eventID: eventId });
  } catch {
    // ignore
  }
};

/** @param {MetaValueEvent=} payload */
export const trackMetaViewContent = (payload = {}) => {
  /** @type {any} */
  const w = window;
  if (!w.fbq) return;
  const { contentId, contentName, value, currency = 'PKR' } = payload;
  try {
    w.fbq('track', 'ViewContent', {
      content_ids: contentId ? [String(contentId)] : undefined,
      content_name: contentName ? String(contentName) : undefined,
      currency,
      value: value == null ? undefined : Number(value),
    });
  } catch {
    // ignore
  }
};

/** @param {MetaValueEvent=} payload */
export const trackMetaAddToCart = (payload = {}) => {
  /** @type {any} */
  const w = window;
  if (!w.fbq) return;
  const { contentId, contentName, value, currency = 'PKR' } = payload;
  try {
    w.fbq('track', 'AddToCart', {
      content_ids: contentId ? [String(contentId)] : undefined,
      content_name: contentName ? String(contentName) : undefined,
      currency,
      value: value == null ? undefined : Number(value),
    });
  } catch {
    // ignore
  }
};
