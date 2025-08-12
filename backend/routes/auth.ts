import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Handle POST requests to /api/auth/send-otp
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const fullPhoneNumber = `+91${phone}`;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Invalid 10-digit phone number.' });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

    const user = await prisma.user.upsert({
      where: { phone: fullPhoneNumber },
      update: { otpCode: otp, otpExpires },
      create: { phone: fullPhoneNumber, otpCode: otp, otpExpires },
    });

    // In a real application, you would send the OTP via an SMS service here.
    console.log(`[Backend] OTP for ${fullPhoneNumber} is: ${otp}`);

    return res.status(200).json({
        success: true,
        message: 'OTP sent successfully.',
        // IMPORTANT: Only send OTP in response for development
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });

  } catch (error) {
    console.error('[Backend] Send OTP Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Handle POST requests to /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    const fullPhoneNumber = `+91${phone}`;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP are required.' });
    }

    const user = await prisma.user.findUnique({ where: { phone: fullPhoneNumber } });

    if (!user || user.otpCode !== otp || (user.otpExpires && user.otpExpires < new Date())) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP.' });
    }

    await prisma.user.update({
      where: { phone: fullPhoneNumber },
      data: {
        verified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: token,
    });

  } catch (error) {
    console.error('[Backend] Verify OTP Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

export default router;