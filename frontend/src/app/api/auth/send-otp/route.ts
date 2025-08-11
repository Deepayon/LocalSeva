import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Generates a random 6-digit OTP.
 * @returns {string} The generated OTP.
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'A valid 10-digit phone number is required' },
        { status: 400 }
      );
    }

    const fullPhoneNumber = `+91${phone}`;

    // Generate OTP and its expiration time (10 minutes from now)
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Find user or create a new one if they don't exist
    const user = await db.user.upsert({
      where: { phone: fullPhoneNumber },
      update: {
        otpCode: otp,
        otpExpires: otpExpires,
      },
      create: {
        phone: fullPhoneNumber,
        otpCode: otp,
        otpExpires: otpExpires,
      },
    });

    // In a real application, you would send the OTP via an SMS service here.
    // For development and testing, we log it and send it in the response.
    console.log(`OTP for ${fullPhoneNumber}: ${otp}`);

    return NextResponse.json({
      success: true,
      isNewUser: user.createdAt.getTime() === user.updatedAt.getTime(), // Check if the user was just created
      userId: user.id,
      // IMPORTANT: Only send the OTP in the response for development environments
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
}