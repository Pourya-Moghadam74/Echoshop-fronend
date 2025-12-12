import React from 'react';

const PROPS = [
  { title: 'Free Shipping', detail: 'On all orders over $75.', icon: '🚚' },
  { title: 'Secure Payments', detail: 'All transactions are 100% encrypted.', icon: '💳' },
  { title: 'Dedicated Support', detail: '24/7 assistance for all your inquiries.', icon: '📞' },
  { title: 'Money-Back Guarantee', detail: '30-day refund policy.', icon: '💰' },
];

export default function ValuePropositionBanner() {
  return (
    <div className="bg-gray-100 py-10 flex-grow">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map((prop, index) => (
            <div
              key={index}
              className="h-full rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <div className="text-4xl">{prop.icon}</div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{prop.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{prop.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
