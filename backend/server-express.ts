import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const db = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) {
      return res.status(400).json({ success: false, error: 'Invalid phone number' });
    }

    // Find or create user
    let user = await db.user.findUnique({ where: { phone: `+91${phone}` } });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await db.user.create({
        data: {
          phone: `+91${phone}`,
          verified: false,
          trustScore: 0,
          role: 'user',
        },
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpires },
    });

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      isNewUser,
      userId: user.id,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Example verify OTP route
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const user = await db.user.findUnique({ where: { phone: `+91${phone}` } });
  if (!user || user.otpCode !== otp) {
    return res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
  res.json({ success: true, user });
});

app.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
