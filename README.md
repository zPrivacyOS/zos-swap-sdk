# ZOS Swap SDK

A TypeScript SDK for interacting with the ZOS Swap API, providing a clean and type-safe interface for cryptocurrency exchanges between ZEC and SOL.

## Installation

```bash
npm install zos-swap-sdk
```

or

```bash
yarn add zos-swap-sdk
```

## Usage

### Basic Setup

```typescript
import { SwapSDK } from 'zos-swap-sdk';

// Initialize the SDK
const sdk = new SwapSDK();
```

### Available Currencies

The API currently supports exchanges between ZEC (Zcash) and SOL (Solana).

### API Methods

#### Get Available Currencies

```typescript
try {
  const currencies = await sdk.getCurrencies();
  console.log('Available currencies:', currencies);
} catch (error) {
  console.error('Error fetching currencies:', error.message);
}
```

#### Get Exchange Rate Estimate

```typescript
try {
  const estimate = await sdk.getExchangeRate('zec', 'sol', 1);
  console.log('Exchange estimate:', estimate);
  // Example output:
  // {
  //   currency_from: 'zec',
  //   currency_to: 'sol',
  //   amount: 1,
  //   amount_to: 10,
  //   estimated_time: 10,
  //   rate: 10
  // }
} catch (error) {
  console.error('Error getting exchange rate:', error.message);
}
```

#### Get Exchange Range (Min/Max Amounts)

```typescript
try {
  const range = await sdk.getExchangeRange('zec', 'sol');
  console.log('Exchange range:', range);
  // Example output:
  // {
  //   min: 0.001,
  //   max: 100
  // }
} catch (error) {
  console.error('Error getting exchange range:', error.message);
}
```

#### Create a New Exchange

```typescript
try {
  const exchangeData = {
    fromCurrency: 'zec',
    toCurrency: 'sol',
    amount: 1,
    recipientAddress: '0x1234567890abcdef', // Your SOL address
    refundAddress: '0xabcdef1234567890', // Optional: Your ZEC refund address
  };

  const result = await sdk.createExchange(exchangeData);
  console.log('Exchange created:', result);
  // Example output:
  // {
  //   success: true,
  //   swap: {
  //     id: 'swap-uuid',
  //     fromCurrency: 'zec',
  //     toCurrency: 'sol',
  //     fromAmount: 1,
  //     toAmount: 10,
  //     status: 'waiting',
  //     // ... other swap details
  //   },
  //   exchange: {
  //     depositAddress: '0xabcdef1234567890', // Address to send ZEC to
  //     amount: 1,
  //     amountTo: 10
  //   }
  // }
} catch (error) {
  console.error('Error creating exchange:', error.message);
}
```

#### Get Exchange Status

```typescript
try {
  const status = await sdk.getExchangeStatus('swap-uuid');
  console.log('Exchange status:', status);
  // Example output:
  // {
  //   id: 'swap-uuid',
  //   status: 'waiting', // 'waiting', 'confirming', 'exchanging', 'sending', 'finished', 'failed', 'refunded', 'expired'
  //   fromCurrency: 'zec',
  //   toCurrency: 'sol',
  //   fromAmount: 1,
  //   toAmount: 10,
  //   // ... other status details
  // }
} catch (error) {
  console.error('Error getting exchange status:', error.message);
}
```

#### Get Swap History

```typescript
try {
  const history = await sdk.getSwapHistory();
  console.log('Swap history:', history);
  // Returns an array of your past swaps
} catch (error) {
  console.error('Error getting swap history:', error.message);
}
```

#### Get Specific Swap Details

```typescript
try {
  const details = await sdk.getSwapDetails('swap-uuid');
  console.log('Swap details:', details);
  // Returns detailed information about a specific swap
} catch (error) {
  console.error('Error getting swap details:', error.message);
}
```

### Error Handling

The SDK provides custom error handling with the `SwapAPIError` class:

```typescript
import { SwapSDK, SwapAPIError } from 'zos-swap-sdk';

const sdk = new SwapSDK();
sdk.setAuthToken('your-token');

try {
  const currencies = await sdk.getCurrencies();
} catch (error) {
  if (error instanceof SwapAPIError) {
    console.error('API Error:', error.message);
    console.error('Error Code:', error.code);
  } else {
    console.error('Unexpected Error:', error.message);
  }
}
```
## Types

The SDK provides TypeScript types for all API responses:

```typescript
import { 
  Currency, 
  ExchangeEstimate, 
  ExchangeRange, 
  CreateExchangeRequest,
  CreateExchangeResponse,
  Swap,
  SwapStatus,
  SwapStatusResponse
} from 'zos-swap-sdk';
```

## Examples

See the `examples/` directory for complete usage examples.

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request
