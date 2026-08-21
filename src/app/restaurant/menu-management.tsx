"use client";

import { useState, useEffect } from 'react';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
};

type Props = {
  onNavigate?: (page: string) => void;
};

export default function MenuManagement({ onNavigate }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');

  useEffect(() => {
    setMenuItems([
      { id: 1, name: 'Spicy Chicken Tacos', price: 12.99, category: 'Main', description: 'Tacos with spicy chicken and fresh toppings' },
      { id: 2, name: 'Mango Smoothie', price: 6.99, category: 'Drinks', description: 'Fresh mango blended with ice' },
      { id: 3, name: 'Beef Burrito', price: 10.99, category: 'Main', description: 'Large burrito with seasoned beef and beans' },
    ]);
  }, []);

  const handleAddItem = () => {
    if (newItemName.trim() && Number(newItemPrice) > 0) {
      setMenuItems([
        ...menuItems,
        {
          id: Date.now(),
          name: newItemName,
          price: parseFloat(newItemPrice),
          category: newItemCategory || 'Main',
          description: `${newItemName} - added via menu management`,
        },
      ]);
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">Menu Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            onClick={() => onNavigate?.('dashboard')}
          >
            Dashboard
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            onClick={() => onNavigate?.('ai')}
          >
            AI Food Studio
          </button>
        </div>
        <button
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          onClick={() => onNavigate?.('menu')}
        >
          Menu Management
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Menu Items</h2>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.category} • ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => onNavigate?.('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => onNavigate?.('ai')}
                  >
                    AI Food Studio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Item */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Select Category</option>
                <option value="Main">Main</option>
                <option value="Drinks">Drinks</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}