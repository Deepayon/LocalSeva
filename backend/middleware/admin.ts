// backend/middleware/admin.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Express middleware to require admin role
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.replace('Bearer ', '');
    const session = await db.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Attach user to request
    ;(req as any).user = session.user;
    return next();
  } catch (err) {
    console.error('Backend requireAdmin error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
