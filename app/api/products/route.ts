/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authHeader = request.headers.get('authorization');
    
    console.log('=== GET PRODUCTS DEBUG ===');
    console.log('Auth Header from Frontend:', authHeader);
    
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const params = new URLSearchParams({
      page,
      limit,
      offset: offset.toString(),
      ...(search && { search }),
    });

    const url = `${EXTERNAL_API_URL}/api/web/v1/products?${params.toString()}`;
    
    console.log('Calling URL:', url);
    console.log('With headers:', {
      Authorization: authHeader || 'NO TOKEN',
    });

    const response = await axios.get(url, {
      headers: {
        ...(authHeader && { Authorization: authHeader }), // Forward as-is
      },
    });

    console.log('Backend Response:', response.data);
    console.log('========================');

    return NextResponse.json({
      success: true,
      data: Array.isArray(response.data.data) ? response.data.data : [],
      total: response.data.total || response.data.pagination?.total || 0,
      pagination: response.data.pagination,
    });

  } catch (error: any) {
    console.error('=== GET PRODUCTS ERROR ===');
    console.error('Error:', error.message);
    console.error('Response:', error.response?.data);
    console.error('==========================');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products', 
        message: error.response?.data?.message || error.message,
        data: [],
        total: 0,
      },
      { status: error.response?.status || 500 }
    );
  }
}