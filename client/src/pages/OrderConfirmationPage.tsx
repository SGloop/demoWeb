import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thank you for your order!</h1>
      <p className="text-gray-500 mb-8">
        Your order reference is <span className="font-mono text-gray-900 font-semibold">{orderId}</span>.
      </p>

      {order && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="divide-y divide-gray-100">
            {order.orderItems?.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between text-sm">
                <span>{item.product?.title} &times; {item.quantity}</span>
                <span className="font-medium">
                  {((item.unitPrice * item.quantity) / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-base mt-2">
            <span>Total Paid</span>
            <span>
              {((order.totalAmount) / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-xl transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};
