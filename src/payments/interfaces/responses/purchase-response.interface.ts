
export interface PurchaseResponse {
  checkoutUrl: string;
  checkoutId: string;
  response: Record<string, unknown>;
}