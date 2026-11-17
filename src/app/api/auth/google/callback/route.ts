import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { decodeJwtPayload } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state') || 'signin';
    const error = searchParams.get('error');

    const htmlResponse = (script: string) =>
      new NextResponse(
        `<!DOCTYPE html><html><head><title>Authenticating with Google...</title></head><body style="background:#FFF9F1;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><p style="font-size:14px;color:#35251E;">Processing Google Sign-In, please wait...</p><script>${script}</script></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );

    if (error || !code) {
      const errMsg = error || 'Google sign-in was cancelled.';
      return htmlResponse(`
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(errMsg)} }, '*');
          window.close();
        } else {
          window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(errMsg)});
        }
      `);
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange authorization code with Google
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
      const failMsg = tokenData.error_description || 'Google token exchange failed';
      return htmlResponse(`
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(failMsg)} }, '*');
          window.close();
        } else {
          window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(failMsg)});
        }
      `);
    }

    const decoded = decodeJwtPayload(tokenData.id_token);
    if (!decoded || !decoded.email) {
      return htmlResponse(`
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: 'Invalid Google token' }, '*');
          window.close();
        } else {
          window.location.href = '/login?error=Invalid+Google+token';
        }
      `);
    }

    const cleanEmail = decoded.email.trim().toLowerCase();
    const name = decoded.name || decoded.given_name || cleanEmail.split('@')[0];
    const googleId = decoded.sub;
    const avatar = decoded.picture || '';

    // Check if user already exists in MongoDB Atlas
    let user = await UserModel.findOne({
      $or: [{ email: cleanEmail }, { googleId }]
    });

    // If on Sign-In and user does NOT exist: prompt to sign up first
    if (state === 'signin' && !user) {
      const notFoundMsg = 'No user found with this Google account. Please sign up first.';
      return htmlResponse(`
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_NOT_FOUND', error: ${JSON.stringify(notFoundMsg)}, notFound: true, email: ${JSON.stringify(cleanEmail)} }, '*');
          window.close();
        } else {
          window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(notFoundMsg)}) + '&notFound=true&email=' + encodeURIComponent(${JSON.stringify(cleanEmail)});
        }
      `);
    }

    // If on Sign-Up and user does NOT exist: create account in MongoDB
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

    const userJson = user.toJSON();

    return htmlResponse(`
      try {
        localStorage.setItem('munaaz_user_session', JSON.stringify(${JSON.stringify(userJson)}));
      } catch (e) {}
      if (window.opener) {
        window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', user: ${JSON.stringify(userJson)} }, '*');
        window.close();
      } else {
        window.location.href = '/account';
      }
    `);
  } catch (err: any) {
    console.error('[Google Callback Exception]:', err);
    return NextResponse.redirect(
      `${new URL(req.url).origin}/login?error=${encodeURIComponent(err.message)}`
    );
  }
}
