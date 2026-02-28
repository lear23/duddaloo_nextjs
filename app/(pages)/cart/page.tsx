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

  // Hämta varukorg
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
        console.error('Fel vid hämtning av varukorg:', error);
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [cartId]);

  // Uppdatera kvantitet
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
      console.error('Fel vid uppdatering av kvantitet:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Ta bort artikel
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
      console.error('Fel vid borttagning av artikel:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Gå till kassan
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
        alert('Fel vid start av betalning: ' + (data.error || 'okänt fel'));
        setIsRedirecting(false);
      }
    } catch {
      alert('Nätverksfel vid anslutning till betaltjänst');
      setIsRedirecting(false);
    }
  };

  // Laddar
  if (loading) return <LoadingCart />;

  // Tom varukorg
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Varukorg</h1>
          <p className="text-gray-600 mt-2">
            {cart.totalItems} {cart.totalItems === 1 ? 'artikel' : 'artiklar'} i din varukorg
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produktlista */}
          <div className="lg:col-span-2">
            <CartItems
              items={cart.items}
              updatingItem={updatingItem}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          </div>

          {/* Ordersammanfattning */}
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
