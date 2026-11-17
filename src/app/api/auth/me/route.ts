import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: 'Missing user identifier' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query.email = email.trim().toLowerCase();
    if (id) query._id = id;

    const user = await UserModel.findOne(query);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user.toJSON()
    });
  } catch (err: any) {
    console.error('[Auth Me API Error]:', err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
