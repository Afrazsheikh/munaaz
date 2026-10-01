import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import AdminUserModel from '@/models/AdminUser';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { action, password, oldPassword, newPassword } = body;

    let admin = await AdminUserModel.findOne({ email: 'admin@munaaz.com' });
    if (!admin) {
      admin = await AdminUserModel.create({
        email: 'admin@munaaz.com',
        passcode: 'munaaz2026',
        updatedAt: new Date().toISOString()
      });
    }

    if (action === 'login') {
      if (password === admin.passcode) {
        return NextResponse.json({
          success: true,
          message: 'Authenticated successfully',
          email: admin.email
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid passcode'
        }, { status: 401 });
      }
    }

    if (action === 'updatePassword') {
      if (oldPassword !== admin.passcode) {
        return NextResponse.json({
          success: false,
          message: 'Current passcode is incorrect'
        }, { status: 400 });
      }
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({
          success: false,
          message: 'New passcode must be at least 6 characters'
        }, { status: 400 });
      }

      admin.passcode = newPassword;
      admin.updatedAt = new Date().toISOString();
      await admin.save();

      return NextResponse.json({
        success: true,
        message: 'Admin passcode updated successfully in MongoDB'
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
