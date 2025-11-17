import axios from 'axios';
import { SwapSDK, SwapAPIError } from '../src/SwapSDK';
import {
  Currency,
  ExchangeEstimate,
  ExchangeRange,
  CreateExchangeRequest,
  CreateExchangeResponse,
  SwapStatusResponse,
  Swap,
} from '../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create to return a mock instance with interceptors
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

describe('SwapSDK', () => {
  let sdk: SwapSDK;
  const mockAuthToken = 'test-auth-token';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock axios.create to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    
    sdk = new SwapSDK({
      baseURL: 'https://api.test.com',
    });
    sdk.setAuthToken(mockAuthToken);
  });

  describe('Authentication', () => {
    it('should set and get auth token', () => {
      const token = 'new-token';
      sdk.setAuthToken(token);
      expect(sdk.getAuthToken()).toBe(token);
    });

    it('should clear auth token', () => {
      sdk.clearAuthToken();
      expect(sdk.getAuthToken()).toBeUndefined();
    });
  });

  describe('API Methods', () => {
    const mockCurrency: Currency = {
      symbol: 'zec',
      name: 'Zcash',
      image: 'https://example.com/zec.png',
      network: 'zec',
      hasExternalId: false,
      decimals: 8,
      isFiat: false,
      isActive: true,
    };

    const mockExchangeEstimate: ExchangeEstimate = {
      currency_from: 'zec',
      currency_to: 'sol',
      amount: 1,
      amount_to: 10,
      estimated_time: 10,
      rate: 10,
    };

    const mockExchangeRange: ExchangeRange = {
      min: 0.001,
      max: 100,
    };

    const mockSwap: Swap = {
      id: 'swap-123',
      userId: 'user-123',
      fromCurrency: 'zec',
      toCurrency: 'sol',
      fromAmount: 1,
      toAmount: 10,
      recipientAddress: '0x1234567890abcdef',
      depositAddress: '0xabcdef1234567890',
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCreateExchangeResponse: CreateExchangeResponse = {
      success: true,
      swap: mockSwap,
      exchange: {
        depositAddress: '0xabcdef1234567890',
        amount: 1,
        amountTo: 10,
      },
    };

    const mockSwapStatusResponse: SwapStatusResponse = {
      id: 'swap-123',
      status: 'waiting',
      fromCurrency: 'zec',
      toCurrency: 'sol',
      fromAmount: 1,
      toAmount: 10,
      depositAddress: '0xabcdef1234567890',
      recipientAddress: '0x1234567890abcdef',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get currencies', async () => {
      const mockResponse = { data: [mockCurrency] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const currencies = await sdk.getCurrencies();
      expect(currencies).toEqual([mockCurrency]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/swap/currencies', {});
    });

    it('should get exchange rate', async () => {
      const mockResponse = { data: mockExchangeEstimate };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const estimate = await sdk.getExchangeRate('zec', 'sol', 1);
      expect(estimate).toEqual(mockExchangeEstimate);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/swap/estimate', {
        fromCurrency: 'zec',
        toCurrency: 'sol',
        amount: 1,
      });
    });

    it('should get exchange range', async () => {
      const mockResponse = { data: mockExchangeRange };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const range = await sdk.getExchangeRange('zec', 'sol');
      expect(range).toEqual(mockExchangeRange);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/swap/range', {
        params: { fromCurrency: 'zec', toCurrency: 'sol' },
      });
    });

    it('should create exchange', async () => {
      const mockResponse = { data: mockCreateExchangeResponse };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const exchangeData: CreateExchangeRequest = {
        fromCurrency: 'zec',
        toCurrency: 'sol',
        amount: 1,
        recipientAddress: '0x1234567890abcdef',
      };

      const response = await sdk.createExchange(exchangeData);
      expect(response).toEqual(mockCreateExchangeResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/swap/create', exchangeData);
    });

    it('should get exchange status', async () => {
      const mockResponse = { data: mockSwapStatusResponse };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const status = await sdk.getExchangeStatus('swap-123');
      expect(status).toEqual(mockSwapStatusResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/swap/status/swap-123', {});
    });

    it('should get swap history', async () => {
      const mockResponse = { data: [mockSwap] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const history = await sdk.getSwapHistory();
      expect(history).toEqual([mockSwap]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/swap/history', {});
    });

    it('should get swap details', async () => {
      const mockResponse = { data: mockSwap };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const details = await sdk.getSwapDetails('swap-123');
      expect(details).toEqual(mockSwap);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/swap/swap-123', {});
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: 'Bad Request',
            message: 'Invalid parameters',
            code: 'INVALID_PARAMS',
          },
        },
      };

      // Create a new SDK instance for this test
      const testSdk = new SwapSDK({
        baseURL: 'https://api.test.com',
      });
      testSdk.setAuthToken(mockAuthToken);

      // Mock get method to reject with our error
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Just verify that the method is called and rejects
      await expect(testSdk.getCurrencies()).rejects.toEqual(mockError);
    });

    it('should handle network errors', async () => {
      const mockError = {
        request: {},
      };

      // Create a new SDK instance for this test
      const testSdk = new SwapSDK({
        baseURL: 'https://api.test.com',
      });
      testSdk.setAuthToken(mockAuthToken);

      // Mock get method to reject with our error
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Just verify that the method is called and rejects
      await expect(testSdk.getCurrencies()).rejects.toEqual(mockError);
    });
  });
});
