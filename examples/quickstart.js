import { FraudShield } from '../src/index.js';

const client = new FraudShield({
  apiKey: process.env.RAPIDAPI_KEY || 'demo_key'
});

async function run() {
  try {
    console.log('Testing FraudShield verification...');
    const result = await client.verify('test@mailinator.com', false);
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
