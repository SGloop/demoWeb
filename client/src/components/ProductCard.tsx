import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const formattedPrice = (product.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/product/${product.slug}`} className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1">
          {product.category?.name || 'General'}
        </div>
        <Link to={`/product/${product.slug}`} className="text-base font-medium text-gray-900 line-clamp-1 hover:underline">
          {product.title}
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
          <button
            onClick={() => addItem(product)}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
