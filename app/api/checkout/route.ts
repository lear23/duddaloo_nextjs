// app/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Stripe from "stripe";
import { Types } from "mongoose";

// 1. Define the product interface to avoid 'any'
interface IStripeProduct {
  _id: Types.ObjectId;
  stripeId: string;
  stock?: number;
  name?: string;
}

// 2. Interface for populated cart item
interface IPopulatedCartItem {
  productId: IStripeProduct | null;
  quantity: number;
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe Secret Key missing" },
      { status: 500 },
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    await connectDB();

    const { cartId, successUrl, cancelUrl, shippingCost } =
      await request.json();

    if (!cartId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // Default shipping cost if not provided
    const finalShippingCost =
      typeof shippingCost === "number" ? shippingCost : 69;
    const shippingAmountInOre = finalShippingCost * 100; // Convert to öre (smallest unit)

    // Get cart and products
    const cart = await Cart.findOne({ sessionId: cartId }).populate(
      "items.productId",
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    // verify stock availability for each item
    const cartItems = cart.items as IPopulatedCartItem[];
    for (const item of cartItems) {
      const prod = item.productId;
      if (!prod) continue;
      if (item.quantity > (prod.stock || 0)) {
        return NextResponse.json(
          {
            error: `Only ${prod.stock || 0} units of ${prod.name || "product"} remain`,
          },
          { status: 400 },
        );
      }
    }

    // 3. Map with IPopulatedCartItem type
    type StripeLineItem = { price: string; quantity: number };
    const lineItems = cartItems.reduce(
      (acc: StripeLineItem[], item): StripeLineItem[] => {
        const product = item.productId;

        // Verificamos que el producto exista (no sea null) y tenga stripeId
        if (product && product.stripeId) {
          acc.push({
            price: product.stripeId,
            quantity: item.quantity,
          });
        }
        return acc;
      },
      [],
    );

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid products in cart" },
        { status: 400 },
      );
    }

    // Create Stripe payment session with dynamic shipping
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { cartId },
      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ["SE", "ES", "US"],
      },
      // Dynamic shipping options based on cart total
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingAmountInOre,
              currency: "sek",
            },
            display_name:
              finalShippingCost === 0
                ? "Fri frakt"
                : `Standard frakt (${finalShippingCost} SEK)`,
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    // 4. Changed 'any' to 'unknown'
    console.error("Checkout error:", err);

    // Safe error handling for TypeScript
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
