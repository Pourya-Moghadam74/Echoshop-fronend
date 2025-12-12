import React from 'react';

const PROPS = [
  { title: 'Free Shipping', detail: 'On all orders over $75.', icon: '🚚' },
  { title: 'Secure Payments', detail: 'All transactions are 100% encrypted.', icon: '🔒' },
  { title: 'Dedicated Support', detail: '24/7 assistance for your inquiries.', icon: '🤝' },
  { title: 'Money-Back Guarantee', detail: '30-day refund policy.', icon: '💳' },
];

export default function ValuePropositionBanner() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map((prop, index) => (
            <div
              key={index}
              className="h-full rounded-xl border border-gray-200 bg-white/10 p-4 text-center shadow-sm backdrop-blur-sm"
            >
              <div className="text-3xl">{prop.icon}</div>
              <h3 className="mt-3 text-base font-semibold text-black">{prop.title}</h3>
              <p className="mt-1 text-sm text-black">{prop.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
