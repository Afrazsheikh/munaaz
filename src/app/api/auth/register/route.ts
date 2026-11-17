import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists. Please sign in.'
        },
        { status: 409 }
      );
    }

    const { salt, hash } = hashPassword(password);

    const newUser = await UserModel.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hash,
      salt,
      provider: 'credentials',
      addresses: []
    });

    const userJson = newUser.toJSON();

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: userJson
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Register API Error]:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
