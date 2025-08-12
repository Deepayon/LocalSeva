import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  role: string;
}

// Middleware to verify the token and check if the user is an admin
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err || (user as JwtPayload).role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required.' });
        }
        (req as any).user = user;
        next();
    });
};

// A protected route to get all necessary admin data in one call
router.get('/data', requireAdmin, async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                neighborhood: true,
                _count: {
                    select: {
                        waterSchedules: true,
                        powerOutages: true,
                        lostItems: true,
                        foundItems: true,
                        skills: true,
                        parkingSpots: true,
                        reviews: true,
                    }
                }
            }
        });

        const neighborhoods = await prisma.neighborhood.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });

        const summary = {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            verifiedUsers: users.filter(u => u.verified).length,
            adminUsers: users.filter(u => u.role === 'admin').length,
            totalNeighborhoods: neighborhoods.length
        };

        res.status(200).json({ success: true, users, neighborhoods, summary });
    } catch (error) {
        console.error('[Backend] Admin Data Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

export default router;