import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { decodeJwtPayload } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error || 'Google sign-in was cancelled.')}`
      );
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.id_token) {
      console.error('[Google OAuth Token Error]:', tokenData);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(tokenData.error_description || 'Token exchange failed')}`
      );
    }

    const decoded = decodeJwtPayload(tokenData.id_token);
    if (!decoded || !decoded.email) {
      return NextResponse.redirect(
        `${origin}/login?error=Invalid Google authentication response`
      );
    }

    const cleanEmail = decoded.email.trim().toLowerCase();
    const name = decoded.name || decoded.given_name || cleanEmail.split('@')[0];
    const googleId = decoded.sub;
    const avatar = decoded.picture || '';

    // Find or create in MongoDB Atlas
    let user = await UserModel.findOne({
      $or: [{ email: cleanEmail }, { googleId }]
    });

    if (!user) {
      user = await UserModel.create({
        name,
        email: cleanEmail,
        provider: 'google',
        googleId,
        avatar,
        addresses: []
      });
    } else {
      let changed = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        changed = true;
      }
      if (changed) await user.save();
    }

    const userJson = encodeURIComponent(JSON.stringify(user.toJSON()));

    return NextResponse.redirect(`${origin}/login?google_user=${userJson}`);
  } catch (err: any) {
    console.error('[Google Callback Exception]:', err);
    return NextResponse.redirect(
      `${new URL(req.url).origin}/login?error=${encodeURIComponent(err.message)}`
    );
  }
}
