import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/community/feed
router.get('/feed', async (req: Request, res: Response) => {
  try {
    // Fetch a variety of recent items for the feed
    const lostItems = await prisma.lostItem.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, avatar: true } } },
    });

    const foundItems = await prisma.foundItem.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, avatar: true } } },
    });

    // Combine and sort all feed items by date
    const feed = [...lostItems, ...foundItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Use a more descriptive name for the frontend
    res.status(200).json({ success: true, activities: feed });
  } catch (error) {
    console.error('[Backend] Feed Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch community feed.' });
  }
});

// GET /api/community/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Fetch aggregate counts for community stats
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const totalNeighborhoods = await prisma.neighborhood.count();
    const lostItemsCount = await prisma.lostItem.count({ where: { status: 'lost' } });
    const foundItemsCount = await prisma.foundItem.count({ where: { status: 'available' } });
    const servicesOffered = await prisma.skill.count({ where: { isOffering: true } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalNeighborhoods,
        recentActivity: {
            lostItems: lostItemsCount,
            foundItems: foundItemsCount,
            skills: servicesOffered,
        }
      },
    });
  } catch (error) {
    console.error('[Backend] Stats Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch community stats.' });
  }
});

// GET /api/alerts
router.get('/alerts', async (req: Request, res: Response) => {
    try {
        // Fetch recent important alerts
        const powerOutages = await prisma.powerOutage.findMany({
            take: 5,
            orderBy: { startTime: 'asc' },
        });

        const waterSchedules = await prisma.waterSchedule.findMany({
            take: 5,
            orderBy: { startTime: 'asc' },
        });

        // Add a 'type' to each alert and combine them
        const typedPowerOutages = powerOutages.map(alert => ({ ...alert, type: 'power' }));
        const typedWaterSchedules = waterSchedules.map(alert => ({ ...alert, type: 'water' }));

        // Combine into a single array and sort by start time
        const combinedAlerts = [...typedPowerOutages, ...typedWaterSchedules].sort(
            (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        res.status(200).json({
            success: true,
            alerts: combinedAlerts,
        });
    } catch (error) {
        console.error('[Backend] Alerts Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch alerts.' });
    }
});

export default router;
