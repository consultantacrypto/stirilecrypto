/** True only when the env var is exactly "true" (case-insensitive). Unset means off. */
export function envFlag(name: string): boolean {
  return process.env[name]?.trim().toLowerCase() === 'true';
}

/** Unused AI chat route. Off unless AI_CHAT_ENABLED=true. */
export function aiChatEnabled(): boolean {
  return envFlag('AI_CHAT_ENABLED');
}

/**
 * Card payments. Off unless PAYMENTS_ENABLED=true and STRIPE_SECRET_KEY is set.
 * There is no Stripe SDK in the repo; checkout uses the Stripe REST API.
 */
export function paymentsEnabled(): boolean {
  return envFlag('PAYMENTS_ENABLED') && Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}
