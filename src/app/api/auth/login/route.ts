import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No account found with this email. Please check your email or sign up.' },
        { status: 401 }
      );
    }

    // Check if this was a Google-only account without password
    if (user.provider === 'google' && !user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: 'This account is linked with Google. Please click "Continue with Google" to sign in.'
        },
        { status: 400 }
      );
    }

    if (!user.passwordHash || !user.salt) {
      return NextResponse.json(
        { success: false, message: 'Account configuration error. Please reset your password or sign in with Google.' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const userJson = user.toJSON();

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      user: userJson
    });
  } catch (err: any) {
    console.error('[Login API Error]:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
