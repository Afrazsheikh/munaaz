/**
 * Cashfree Client-side SDK Helper
 * Handles dynamic SDK script loading and modal checkout
 */

declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_modal' | '_self' | '_blank';
      }) => Promise<{
        error?: { message: string; code?: string };
        paymentDetails?: any;
        redirect?: boolean;
      }>;
    };
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadCashfreeScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Cashfree) return Promise.resolve(true);

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.getElementById('cashfree-sdk-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'cashfree-sdk-script';
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Cashfree SDK] Failed to load Cashfree JS SDK script from CDN.');
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export interface CheckoutResult {
  status: 'SUCCESS' | 'FAILED' | 'DROPPED';
  paymentId?: string;
  error?: string;
}

export async function openCashfreeModal(
  paymentSessionId: string,
  mode: 'sandbox' | 'production' = 'sandbox'
): Promise<CheckoutResult> {
  const loaded = await loadCashfreeScript();

  if (!loaded || !window.Cashfree) {
    throw new Error('Cashfree JS SDK could not be initialized.');
  }

  const cashfree = window.Cashfree({ mode });

  const result = await cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_modal'
  });

  if (result.error) {
    return {
      status: 'FAILED',
      error: result.error.message || 'Payment was not completed'
    };
  }

  if (result.paymentDetails) {
    return {
      status: 'SUCCESS',
      paymentId: result.paymentDetails.paymentMessage || result.paymentDetails.cfPaymentId
    };
  }

  // If closed or user dropped
  return {
    status: 'SUCCESS'
  };
}
