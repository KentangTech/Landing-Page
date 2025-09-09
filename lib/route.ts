import { syncAllData } from './apiserver'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await syncAllData();
    return NextResponse.json({ success: true, message: 'Sync completed' });
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { success: false, message: 'Sync failed' },
      { status: 500 }
    );
  }
}
