import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection by importing and using the db
    const { db } = await import('@/lib/db-real');
    
    // Simple test query
    const userCount = await db.user.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      message: error.message 
    }, { status: 500 });
  }
}