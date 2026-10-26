import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/" className="text-blue-600 hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formattedPrice = (product.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-sm uppercase tracking-wider font-semibold text-blue-600">
              {product.category?.name}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{product.title}</h1>
            <div className="text-2xl font-bold text-gray-900 mt-4">{formattedPrice}</div>
            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            <div className="mt-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
              <Check className="w-4 h-4" />
              <span>In Stock ({product.inventoryCount} units available)</span>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-medium text-white transition-colors ${
                added ? 'bg-green-600' : 'bg-gray-900 hover:bg-blue-600'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
