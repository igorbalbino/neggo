export function redirectToStripeCheckout(checkoutUrl: string | undefined | null): boolean {
  if (!checkoutUrl || typeof checkoutUrl !== 'string') {
    return false;
  }

  try {
    const url = new URL(checkoutUrl);
    const allowedHosts = ['checkout.stripe.com'];
    if (!allowedHosts.includes(url.hostname)) {
      console.error('Blocked non-Stripe checkout redirect:', url.hostname);
      return false;
    }
    window.location.href = checkoutUrl;
    return true;
  } catch {
    return false;
  }
}
