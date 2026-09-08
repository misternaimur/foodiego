import Layout from '@/components/Layout';
import Image from 'next/image';
import { Package } from 'lucide-react';

export const metadata = {
  title: 'Products · Foodiego',
};

const products = [
  { id: 1, name: 'Truffle Smashburger', price: 18.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200', status: 'Available' },
  { id: 2, name: 'Woodfired Margherita', price: 22.0, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200', status: 'Available' },
  { id: 3, name: 'Crispy Truffle Fries', price: 8.0, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200', status: 'Sold Out' },
  { id: 4, name: 'Iced Caramel Latte', price: 5.5, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200', status: 'Available' },
];

export default function ProductsPage() {
  return (
    <Layout
      user={{
        name: 'abid',
        email: 'user@example.com',
        role: 'restaurant',
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your menu items and product listings.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-[#C8481A] hover:bg-[#b93815] text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors">
          <Package size={16} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#E8E2D5]/70 shadow-sm overflow-hidden">
            <div className="relative h-36 w-full">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
              <span
                className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                  p.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {p.status}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{p.name}</h3>
              <p className="text-lg font-extrabold text-[#b93815] mt-1">${p.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
