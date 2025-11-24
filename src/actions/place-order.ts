'use server';

import { prisma } from '@/server/db/prisma';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

interface CheckoutData {
  customerName: string;
  customerEmail: string;
  addressLine: string;
  city: string;
  zipCode: string;
}

interface CartItem {
  variantId: string;
  quantity: number;
}

interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function placeOrder(
  checkoutData: CheckoutData,
  cartItems: CartItem[]
): Promise<OrderResult> {
  try {
    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Check for user session
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value || null;

    // Fetch real prices and stock from database
    const variantIds = cartItems.map((item) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      select: { id: true, price: true, stock: true, sku: true },
    });

    if (variants.length !== cartItems.length) {
      return { success: false, error: 'Some products are no longer available' };
    }

    // Create variant map for easy lookup
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // Validate stock and calculate total
    let calculatedTotal = new Prisma.Decimal(0);
    const orderItems: Array<{ variantId: string; quantity: number; price: Prisma.Decimal }> = [];

    for (const cartItem of cartItems) {
      const variant = variantMap.get(cartItem.variantId);
      
      if (!variant) {
        return { success: false, error: `Product ${cartItem.variantId} not found` };
      }

      if (variant.stock < cartItem.quantity) {
        return { 
          success: false, 
          error: `Insufficient stock for ${variant.sku}. Only ${variant.stock} available.` 
        };
      }

      const itemPrice = new Prisma.Decimal(variant.price);
      const itemTotal = itemPrice.mul(cartItem.quantity);
      calculatedTotal = calculatedTotal.add(itemTotal);

      orderItems.push({
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        price: itemPrice,
      });
    }

    // Execute transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          customerName: checkoutData.customerName,
          customerEmail: checkoutData.customerEmail,
          addressLine: checkoutData.addressLine,
          city: checkoutData.city,
          zipCode: checkoutData.zipCode,
          total: calculatedTotal,
          status: 'PENDING',
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: newOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // Decrement stock for each variant
      for (const cartItem of cartItems) {
        await tx.productVariant.update({
          where: { id: cartItem.variantId },
          data: {
            stock: { decrement: cartItem.quantity },
          },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Order placement error:', error);
    return { success: false, error: 'Failed to process order. Please try again.' };
  }
}
