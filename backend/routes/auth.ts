import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Define a custom interface for the decoded JWT payload for type safety
interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

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

    console.log(`[Backend] OTP for ${fullPhoneNumber} is: ${otp}`);

    return res.status(200).json({
        success: true,
        message: 'OTP sent successfully.',
        isNewUser: user.createdAt.getTime() === user.updatedAt.getTime(),
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

    const updatedUser = await prisma.user.update({
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
      isNewUser: user.name === null,
      user: updatedUser,
    });

  } catch (error) {
    console.error('[Backend] Verify OTP Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Handle GET requests for session data
router.get('/session', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided.' });
      }
  
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined on the server.');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { neighborhood: true },
      });
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }
  
      return res.status(200).json({
        success: true,
        user,
        sessionToken: token,
      });
  
    } catch (error) {
      console.error('[Backend] Session Error:', error);
      return res.status(401).json({ success: false, error: 'Invalid or expired session.' });
    }
});

// Handle POST requests to complete a user's profile
router.post('/complete-profile', async (req: Request, res: Response) => {
    try {
        const { name, email, state, city, pincode } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided.' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined on the server.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        const userId = decoded.userId;

        // --- UPDATED NEIGHBORHOOD LOGIC ---
        let neighborhoodRecord;
        if (state && city && pincode) {
            // First, check if a neighborhood with this PIN code already exists.
            neighborhoodRecord = await prisma.neighborhood.findFirst({
                where: { pincode: pincode.trim() }
            });

            // If no neighborhood exists for this PIN code, create a new one.
            if (!neighborhoodRecord) {
                // Standardize the city name (e.g., "asansol" becomes "Asansol")
                const formattedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
                const neighborhoodName = `${formattedCity}, ${state}, ${pincode.trim()}`;

                neighborhoodRecord = await prisma.neighborhood.create({
                    data: {
                        name: neighborhoodName,
                        city: formattedCity,
                        state: state,
                        pincode: pincode.trim(),
                        latitude: 0, // Placeholder
                        longitude: 0, // Placeholder
                    }
                });
            }
        }

        // Update the user's profile with their name, email, and the correct neighborhood ID
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                neighborhoodId: neighborhoodRecord ? neighborhoodRecord.id : null,
            },
            include: { neighborhood: true }
        });

        // Create a new token with the updated user info
        const newToken = jwt.sign(
            { userId: updatedUser.id, role: updatedUser.role, name: updatedUser.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ success: true, user: updatedUser, token: newToken });

    } catch (error) {
        console.error('[Backend] Profile Completion Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

export default router;