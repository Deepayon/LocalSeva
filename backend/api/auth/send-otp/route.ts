import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await db.user.findUnique({
      where: { phone: `+91${phone}` }
    });

    let isNewUser = false;
    
    // If user doesn't exist, create one
    if (!user) {
      isNewUser = true;
      user = await db.user.create({
        data: {
          phone: `+91${phone}`,
          verified: false,
          trustScore: 0
        }
      });
    }

    // Generate OTP (in production, use a proper OTP service)
    // For demo purposes, we'll use a fixed OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await db.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpires: otpExpires
      }
    });

    // In production, you would send OTP via SMS service
    // For demo purposes, we'll log it to console
    console.log(`OTP for ${phone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: isNewUser ? 'OTP sent for registration' : 'OTP sent for login',
      userId: user.id,
      isNewUser: isNewUser,
      // For demo purposes, return the OTP in development
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}