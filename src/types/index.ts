/**
 * Currency information
 */
export type Currency = {
  symbol: string;
  name: string;
  image: string;
  network: string;
  hasExternalId: boolean;
  contractAddress?: string;
  decimals: number;
  isFiat: boolean;
  isActive: boolean;
  floatingPrecision?: number;
  fixedPrecision?: number;
  min?: number;
  max?: number;
  warning?: string;
};

/**
 * Exchange rate estimate
 */
export type ExchangeEstimate = {
  currency_from: string;
  currency_to: string;
  amount: number;
  amount_to: number;
  estimated_time?: number;
  rate?: number;
  fee?: number;
  total_fee?: number;
  network_fee?: number;
  warning?: string;
};

/**
 * Exchange range (min and max amounts)
 */
export type ExchangeRange = {
  min: number;
  max: number;
  min_fixed?: number;
  max_fixed?: number;
  min_float?: number;
  max_float?: number;
  warning?: string;
};

/**
 * Exchange creation request
 */
export type CreateExchangeRequest = {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  recipientAddress: string;
  refundAddress?: string;
  refundExtraId?: string;
};

/**
 * Exchange creation response
 */
export type CreateExchangeResponse = {
  success: boolean;
  swap: Swap;
  exchange: {
    depositAddress: string;
    amount: number;
    amountTo: number;
  };
};

/**
 * Swap information
 */
export type Swap = {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  recipientAddress: string;
  depositAddress?: string;
  status: SwapStatus;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Swap status
 */
export type SwapStatus = 
  | 'waiting'
  | 'confirming'
  | 'exchanging'
  | 'sending'
  | 'finished'
  | 'failed'
  | 'refunded'
  | 'expired';

/**
 * Swap status response
 */
export type SwapStatusResponse = {
  id: string;
  status: SwapStatus;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  depositAddress?: string;
  recipientAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Authentication token types
 */
export type AuthToken = string;

/**
 * SDK configuration options
 */
export type SwapSDKOptions = {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
};

/**
 * API error response
 */
export type APIError = {
  error: string;
  message: string;
  code?: string;
};
