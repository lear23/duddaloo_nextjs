'use client';

import { useCartId } from '@/lib/cartUtils';
import { useEffect, useState } from 'react';
import { CartData, CartItem } from './types';
import CartItems from './components/CartItems';
import LoadingCart from './components/LoadingCart';
import EmptyCart from './components/EmtyCart';
import OrderSummary from './components/OrderSumary';

export default function CartPage() {
  const cartId = useCartId();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  // Fetch cart
  useEffect(() => {
    if (!cartId) return;
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cart?cartId=${cartId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: CartData = await res.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [cartId]);

  // Update quantity
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!cartId || newQuantity < 1) return;
    setUpdatingItem(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, productId, quantity: newQuantity }),
      });
      if (res.ok) {
        const updatedCart: CartData = await res.json();
        setCart(updatedCart);
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove item
  const removeItem = async (productId: string) => {
    if (!cartId) return;
    setUpdatingItem(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, productId }),
      });
      if (res.ok) {
        const updatedCart: CartData = await res.json();
        setCart(updatedCart);
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!cartId) return;
    try {
      setIsRedirecting(true);
      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = `${window.location.origin}/cart`;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, successUrl, cancelUrl }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error starting payment: ' + (data.error || 'unknown'));
        setIsRedirecting(false);
      }
    } catch {
      alert('Network error while connecting to Stripe');
      setIsRedirecting(false);
    }
  };

  // Loading
  if (loading) return <LoadingCart />;

  // Empty
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <CartItems
              items={cart.items}
              updatingItem={updatingItem}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              isRedirecting={isRedirecting}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
