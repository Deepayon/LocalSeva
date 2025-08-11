async function testOTPFlow() {
  console.log("Testing OTP flow...");

  try {
    // Step 1: Send OTP
    console.log("1. Sending OTP...");
    const sendResponse = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9876543210' }),
    });

    if (!sendResponse.ok) {
      const err = await sendResponse.json();
      throw new Error(`Send OTP failed: ${err.error || sendResponse.statusText}`);
    }

    const sendData = await sendResponse.json();
    console.log('Send OTP Response:', sendData);

    const otp = sendData.otp;
    console.log(`OTP to use: ${otp}`);

    // Step 2: Verify OTP
    console.log("2. Verifying OTP...");
    const verifyResponse = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9876543210', otp }),
    });

    if (!verifyResponse.ok) {
      const err = await verifyResponse.json();
      throw new Error(`Verify OTP failed: ${err.error || verifyResponse.statusText}`);
    }

    const verifyData = await verifyResponse.json();
    console.log('Verify OTP Response:', verifyData);

    const userId = verifyData.user.id;

    // Step 3: Complete Profile
    console.log("3. Completing profile...");
    const profileResponse = await fetch('/api/auth/complete-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        name: 'Test User',
        email: 'test@example.com',
        neighborhood: 'Sector 15, Noida',
      }),
    });

    if (!profileResponse.ok) {
      const err = await profileResponse.json();
      throw new Error(`Profile completion failed: ${err.error || profileResponse.statusText}`);
    }

    const profileData = await profileResponse.json();
    console.log('Complete Profile Response:', profileData);

    console.log("✅ OTP flow test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Run the test
testOTPFlow();
