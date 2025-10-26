/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// GET single product
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authHeader = request.headers.get('authorization');
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${EXTERNAL_API_URL}/api/web/v1/product?product_id=${product_id}`,
      {
        headers: {
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    console.log('=== POST PRODUCT DEBUG ===');
    console.log('Auth Header:', authHeader);
    console.log('Body:', body);

    const response = await axios.post(
      `${EXTERNAL_API_URL}/api/web/v1/product`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    console.log('POST Response:', response.data);
    console.log('==========================');

    return NextResponse.json(response.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating product:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create product', message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const response = await axios.put(
      `${EXTERNAL_API_URL}/api/web/v1/product`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    const product_id = body.product_id || body.productId;

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }

    const response = await axios.delete(
      `${EXTERNAL_API_URL}/api/web/v1/product`,
      {
        data: { product_id },
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}