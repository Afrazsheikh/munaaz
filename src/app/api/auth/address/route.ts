import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { Address } from '@/types/order';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, email, address } = body;

    if ((!userId && !email) || !address) {
      return NextResponse.json(
        { success: false, message: 'Missing required user or address information.' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query.email = email.trim().toLowerCase();
    if (userId) query._id = userId;

    const user = await UserModel.findOne(query);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const newAddress: Address = {
      id: address.id || `addr-${Date.now()}`,
      fullName: address.fullName || user.name,
      street: address.street,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || 'IN',
      phone: address.phone || user.phone || '',
      isDefault: Boolean(address.isDefault)
    };

    // If marked default, unset others
    if (newAddress.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully.',
      addresses: user.addresses,
      user: user.toJSON()
    });
  } catch (err: any) {
    console.error('[Add Address API Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, email, addressId } = body;

    if ((!userId && !email) || !addressId) {
      return NextResponse.json(
        { success: false, message: 'Missing user identifier or addressId.' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query.email = email.trim().toLowerCase();
    if (userId) query._id = userId;

    const user = await UserModel.findOne(query);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address removed successfully.',
      addresses: user.addresses,
      user: user.toJSON()
    });
  } catch (err: any) {
    console.error('[Delete Address API Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
