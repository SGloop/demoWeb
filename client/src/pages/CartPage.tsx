import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const formattedTotal = (totalPrice() / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Discover our featured products and start shopping.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 divide-y divide-gray-200">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="py-6 flex gap-6 items-center">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-24 h-24 object-cover rounded-xl border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${product.slug}`}
                  className="text-base font-semibold text-gray-900 hover:text-blue-600 truncate block"
                >
                  {product.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {((product.price * quantity) / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-gray-500 hover:text-gray-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-gray-500 hover:text-gray-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-between">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formattedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="pt-4 flex justify-between text-base font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
