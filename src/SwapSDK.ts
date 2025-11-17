import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  AuthToken,
  SwapSDKOptions,
  APIError,
  Currency,
  ExchangeEstimate,
  ExchangeRange,
  CreateExchangeRequest,
  CreateExchangeResponse,
  SwapStatusResponse,
  Swap,
} from './types';

/**
 * Custom error class for Swap API errors
 */
export class SwapAPIError extends Error {
  public code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'SwapAPIError';
    this.code = code;
  }
}

/**
 * Main SDK class for interacting with the Swap API
 */
export class SwapSDK {
  private client: AxiosInstance;
  private authToken?: AuthToken;

  /**
   * Create a new SwapSDK instance
   * @param options SDK configuration options
   */
  constructor(options: SwapSDKOptions = {}) {
    const {
      baseURL = 'https://zos.computer/',
      timeout = 10000,
      headers = {},
    } = options;

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers['x-auth-token'] = this.authToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          const message = data?.message || data?.error || 'Unknown error occurred';
          const code = data?.code;
          throw new SwapAPIError(message, code);
        } else if (error.request) {
          throw new SwapAPIError('Network error: No response received from server');
        } else {
          throw new SwapAPIError(`Request error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Set the authentication token for API requests
   * @param token Authentication token (JWT or base64 encoded Privy token)
   */
  public setAuthToken(token: AuthToken): void {
    this.authToken = token;
  }

  /**
   * Clear the authentication token
   */
  public clearAuthToken(): void {
    this.authToken = undefined;
  }

  /**
   * Get the current authentication token
   * @returns Current authentication token or undefined
   */
  public getAuthToken(): AuthToken | undefined {
    return this.authToken;
  }

  /**
   * Make a GET request to the API
   * @param endpoint API endpoint
   * @param params Query parameters
   * @returns Promise resolving to the response data
   */
  private async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = { params };
    const response: AxiosResponse<T> = await this.client.get(endpoint, config);
    return response.data;
  }

  /**
   * Make a POST request to the API
   * @param endpoint API endpoint
   * @param data Request body data
   * @returns Promise resolving to the response data
   */
  private async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data);
    return response.data;
  }

  /**
   * Get available currencies (filtered to ZEC and SOL only)
   * @returns Promise resolving to an array of currencies
   */
  public async getCurrencies(): Promise<Currency[]> {
    return this.get<Currency[]>('/swap/currencies');
  }

  /**
   * Get exchange rate estimate
   * @param fromCurrency Source currency symbol
   * @param toCurrency Target currency symbol
   * @param amount Amount to exchange
   * @returns Promise resolving to exchange estimate
   */
  public async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<ExchangeEstimate> {
    return this.post<ExchangeEstimate>('/swap/estimate', {
      fromCurrency,
      toCurrency,
      amount,
    });
  }

  /**
   * Get exchange range (min and max amounts)
   * @param fromCurrency Source currency symbol
   * @param toCurrency Target currency symbol
   * @returns Promise resolving to exchange range
   */
  public async getExchangeRange(
    fromCurrency: string,
    toCurrency: string
  ): Promise<ExchangeRange> {
    return this.get<ExchangeRange>('/swap/range', {
      fromCurrency,
      toCurrency,
    });
  }

  /**
   * Create a new exchange
   * @param exchangeData Exchange creation data
   * @returns Promise resolving to created exchange details
   */
  public async createExchange(exchangeData: CreateExchangeRequest): Promise<CreateExchangeResponse> {
    return this.post<CreateExchangeResponse>('/swap/create', exchangeData);
  }

  /**
   * Get exchange status
   * @param swapId Swap ID
   * @returns Promise resolving to swap status
   */
  public async getExchangeStatus(swapId: string): Promise<SwapStatusResponse> {
    return this.get<SwapStatusResponse>(`/swap/status/${swapId}`);
  }

  /**
   * Get user's swap history
   * @returns Promise resolving to an array of user's swaps
   */
  public async getSwapHistory(): Promise<Swap[]> {
    return this.get<Swap[]>('/swap/history');
  }

  /**
   * Get specific swap details
   * @param swapId Swap ID
   * @returns Promise resolving to swap details
   */
  public async getSwapDetails(swapId: string): Promise<Swap> {
    return this.get<Swap>(`/swap/${swapId}`);
  }
}
