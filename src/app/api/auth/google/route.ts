import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { decodeJwtPayload } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { credential, profile, mode = 'signin' } = body;

    let email = '';
    let name = '';
    let googleId = '';
    let avatar = '';

    // 1. Process Google JWT Credential from Google Identity Services
    if (credential) {
      // First, attempt official Google tokeninfo verification if reachable
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );
        if (verifyRes.ok) {
          const verified = await verifyRes.json();
          email = verified.email;
          name = verified.name || verified.given_name;
          googleId = verified.sub;
          avatar = verified.picture || '';
        }
      } catch (err) {
        console.warn('[Google Tokeninfo Warning]: Falling back to JWT decoding');
      }

      // If tokeninfo wasn't reachable, decode standard JWT payload
      if (!email) {
        const decoded = decodeJwtPayload(credential);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.given_name || email.split('@')[0];
          googleId = decoded.sub || '';
          avatar = decoded.picture || '';
        }
      }
    } else if (profile && profile.email) {
      // Direct Google profile data
      email = profile.email;
      name = profile.name || email.split('@')[0];
      googleId = profile.googleId || profile.sub || `google-${Date.now()}`;
      avatar = profile.avatar || profile.picture || '';
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Unable to extract email from Google Sign-In.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Check if user already exists in MongoDB Atlas
    let user = await UserModel.findOne({
      $or: [{ email: cleanEmail }, ...(googleId ? [{ googleId }] : [])]
    });

    // If attempting to Sign In on /login, but user is NOT registered:
    if (mode === 'signin' && !user) {
      return NextResponse.json(
        {
          success: false,
          notFound: true,
          message: 'No user found with this Google account. Please sign up first.'
        },
        { status: 404 }
      );
    }

    // If user exists: sign them in
    if (user) {
      let changed = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        changed = true;
      }
      if (changed) {
        await user.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Welcome back! Signed in with Google successfully.',
        user: user.toJSON(),
        isNewUser: false
      });
    }

    // 3. Mode is 'signup' and user does not exist: direct signup in MongoDB
    const newUser = await UserModel.create({
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      provider: 'google',
      googleId: googleId || `gid-${Date.now()}`,
      avatar: avatar || '',
      addresses: []
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created and signed in with Google successfully.',
        user: newUser.toJSON(),
        isNewUser: true
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Google Auth API Error]:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}
