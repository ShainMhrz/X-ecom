import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/server/db/prisma';
import { StorageService } from '@/server/services/storage/storage.service';

const storageService = new StorageService();

// Upload product images
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('role')?.value;

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      if (file.size === 0) continue; // Skip empty files

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `product-${id}-${Date.now()}-${file.name}`;
      
      const url = await storageService.upload(buffer, filename, file.type);

      const image = await prisma.productImage.create({
        data: {
          url,
          altText: file.name,
          productId: id,
        },
      });

      uploadedImages.push(image);
    }

    return NextResponse.json({ 
      success: true, 
      images: uploadedImages 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

// Delete product image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('role')?.value;

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Get image details before deleting
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify image belongs to this product
    if (image.productId !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete from storage
    await storageService.delete(image.url);

    // Delete from database
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
