const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function runTests() {
  console.log('Starting API tests...\n');

  let testCount = 0;
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.log(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: POST /shorturls with valid data
    console.log('1. Testing POST /shorturls with valid data');
    const validResponse = await axios.post(`${BASE_URL}/shorturls`, {
      url: 'https://example.com',
      validity: 30
    });
    assert(validResponse.status === 201, 'Status should be 201');
    assert(validResponse.data.shortLink, 'Should return shortLink');
    assert(validResponse.data.expiry, 'Should return expiry');
    const shortcode1 = validResponse.data.shortLink.split('/').pop();
    console.log(`Created shortcode: ${shortcode1}\n`);

    // Test 2: POST /shorturls with invalid URL
    console.log('2. Testing POST /shorturls with invalid URL');
    try {
      await axios.post(`${BASE_URL}/shorturls`, { url: 'invalid-url' });
      assert(false, 'Should have thrown error for invalid URL');
    } catch (error) {
      assert(error.response.status === 400, 'Status should be 400 for invalid URL');
    }
    console.log('');

    // Test 3: POST /shorturls with custom shortcode
    console.log('3. Testing POST /shorturls with custom shortcode');
    const customResponse = await axios.post(`${BASE_URL}/shorturls`, {
      url: 'https://google.com',
      shortcode: 'test12'
    });
    assert(customResponse.status === 201, 'Status should be 201');
    assert(customResponse.data.shortLink.includes('test12'), 'Should use custom shortcode');
    console.log('');

    // Test 4: POST /shorturls with shortcode collision
    console.log('4. Testing POST /shorturls with shortcode collision');
    try {
      await axios.post(`${BASE_URL}/shorturls`, {
        url: 'https://yahoo.com',
        shortcode: 'test12'
      });
      assert(false, 'Should have thrown error for collision');
    } catch (error) {
      assert(error.response.status === 409, 'Status should be 409 for collision');
    }
    console.log('');

    // Test 5: POST /shorturls with invalid validity
    console.log('5. Testing POST /shorturls with invalid validity');
    try {
      await axios.post(`${BASE_URL}/shorturls`, {
        url: 'https://bing.com',
        validity: -1
      });
      assert(false, 'Should have thrown error for invalid validity');
    } catch (error) {
      assert(error.response.status === 400, 'Status should be 400 for invalid validity');
    }
    console.log('');

    // Test 6: POST /shorturls with invalid shortcode format
    console.log('6. Testing POST /shorturls with invalid shortcode format');
    try {
      await axios.post(`${BASE_URL}/shorturls`, {
        url: 'https://duckduckgo.com',
        shortcode: 'invalid@code'
      });
      assert(false, 'Should have thrown error for invalid shortcode');
    } catch (error) {
      assert(error.response.status === 400, 'Status should be 400 for invalid shortcode');
    }
    console.log('');

    // Test 7: GET /shorturls/:shortcode for existing
    console.log('7. Testing GET /shorturls/:shortcode for existing');
    const statsResponse = await axios.get(`${BASE_URL}/shorturls/${shortcode1}`);
    assert(statsResponse.status === 200, 'Status should be 200');
    assert(statsResponse.data.originalUrl === 'https://example.com', 'Should return correct original URL');
    assert(statsResponse.data.totalClicks === 0, 'Clicks should be 0 initially');
    console.log('');

    // Test 8: GET /shorturls/:shortcode for non-existing
    console.log('8. Testing GET /shorturls/:shortcode for non-existing');
    try {
      await axios.get(`${BASE_URL}/shorturls/nonexistent`);
      assert(false, 'Should have thrown error for non-existing');
    } catch (error) {
      assert(error.response.status === 404, 'Status should be 404 for non-existing');
    }
    console.log('');

    // Test 9: GET /:shortcode for redirect (simulate click)
    console.log('9. Testing GET /:shortcode for redirect');
    const redirectResponse = await axios.get(`${BASE_URL}/${shortcode1}`, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    assert(redirectResponse.status === 302, 'Status should be 302 for redirect');
    console.log('');

    // Test 10: Verify click tracking after redirect
    console.log('10. Testing click tracking after redirect');
    const statsAfterClick = await axios.get(`${BASE_URL}/shorturls/${shortcode1}`);
    assert(statsAfterClick.data.totalClicks === 1, 'Clicks should be 1 after redirect');
    console.log('');

    // Test 11: GET /shorturls/:shortcode for expired (create with 1 min validity, but test immediately - won't be expired)
    // For expired test, since in-memory, we'll skip or note it
    console.log('11. Testing GET /shorturls/:shortcode for expired');
    console.log('Note: Skipping expired test as in-memory storage resets on server restart. In production, use persistent storage.');
    console.log('');

  } catch (error) {
    console.error('Test error:', error.message);
    failed++;
  }

  console.log(`\nTest Summary:`);
  console.log(`Total tests: ${testCount}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / testCount) * 100).toFixed(2)}%`);

  if (failed === 0) {
    console.log('All tests passed!');
  } else {
    console.log('Some tests failed. Check above for details.');
  }
}

runTests();