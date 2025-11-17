import { SwapSDK, SwapAPIError } from '../src';

async function basicUsageExample() {
  // Initialize the SDK
  const sdk = new SwapSDK({
    baseURL: 'https://your-api-domain.com/api',
    timeout: 10000,
  });

  // Set authentication token
  sdk.setAuthToken('your-jwt-or-privy-token');

  try {
    // Get available currencies
    console.log('Fetching available currencies...');
    const currencies = await sdk.getCurrencies();
    console.log('Available currencies:', currencies);

    // Get exchange rate estimate
    console.log('\nGetting exchange rate estimate...');
    const estimate = await sdk.getExchangeRate('zec', 'sol', 1);
    console.log('Exchange estimate:', estimate);

    // Get exchange range
    console.log('\nGetting exchange range...');
    const range = await sdk.getExchangeRange('zec', 'sol');
    console.log('Exchange range:', range);

    // Create a new exchange
    console.log('\nCreating a new exchange...');
    const exchangeData = {
      fromCurrency: 'zec',
      toCurrency: 'sol',
      amount: 1,
      recipientAddress: '0x1234567890abcdef', // Your SOL address
      refundAddress: '0xabcdef1234567890', // Optional: Your ZEC refund address
    };

    const createResult = await sdk.createExchange(exchangeData);
    console.log('Exchange created:', createResult);

    // Get exchange status
    if (createResult.success) {
      console.log('\nGetting exchange status...');
      const status = await sdk.getExchangeStatus(createResult.swap.id);
      console.log('Exchange status:', status);
    }

    // Get swap history
    console.log('\nGetting swap history...');
    const history = await sdk.getSwapHistory();
    console.log('Swap history:', history);

    // Get specific swap details
    if (history.length > 0) {
      console.log('\nGetting swap details...');
      const details = await sdk.getSwapDetails(history[0].id);
      console.log('Swap details:', details);
    }

  } catch (error) {
    if (error instanceof SwapAPIError) {
      console.error('API Error:', error.message);
      console.error('Error Code:', error.code);
    } else {
      console.error('Unexpected Error:', error);
    }
  }
}

// Run the example
basicUsageExample();
