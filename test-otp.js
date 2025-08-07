// Test script for OTP functionality
// Run this in the browser console to test the auth flow

async function testOTPFlow() {
  console.log("Testing OTP flow...");
  
  try {
    // Step 1: Send OTP
    console.log("1. Sending OTP...");
    const sendResponse = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: '9876543210' }),
    });
    
    const sendData = await sendResponse.json();
    console.log('Send OTP Response:', sendData);
    
    if (sendData.success) {
      const otp = sendData.otp || '123456'; // Use the returned OTP or default
      console.log(`OTP to use: ${otp}`);
      
      // Step 2: Verify OTP
      console.log("2. Verifying OTP...");
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: '9876543210', otp }),
      });
      
      const verifyData = await verifyResponse.json();
      console.log('Verify OTP Response:', verifyData);
      
      if (verifyData.success) {
        console.log("3. Completing profile...");
        // Step 3: Complete profile
        const profileResponse = await fetch('/api/auth/complete-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: verifyData.user.id,
            name: 'Test User',
            email: 'test@example.com',
            neighborhood: 'Sector 15, Noida'
          }),
        });
        
        const profileData = await profileResponse.json();
        console.log('Complete Profile Response:', profileData);
        
        if (profileData.success) {
          console.log("✅ OTP flow test completed successfully!");
        } else {
          console.error("❌ Profile completion failed:", profileData.error);
        }
      } else {
        console.error("❌ OTP verification failed:", verifyData.error);
      }
    } else {
      console.error("❌ OTP sending failed:", sendData.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Run the test
testOTPFlow();