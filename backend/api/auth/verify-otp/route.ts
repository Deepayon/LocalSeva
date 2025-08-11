import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await db.user.findUnique({
      where: { phone: `+91${phone}` }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (user.otpExpires && new Date() > user.otpExpires) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.otpCode !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Mark user as verified and clear OTP
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { 
        verified: true,
        otpCode: null,
        otpExpires: null,
        lastLoginAt: new Date()
      }
    });

    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.session.create({
      data: {
        userId: updatedUser.id,
        sessionToken,
        expires: sessionExpires
      }
    });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        email: updatedUser.email,
        verified: updatedUser.verified,
        trustScore: updatedUser.trustScore,
        role: updatedUser.role,
        isNewUser: !updatedUser.name // Flag to indicate if profile completion is needed
      },
      sessionToken
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}