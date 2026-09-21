const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Fetch all menu items belonging to a specific restaurant[cite: 10]
export const fetchRestaurantMenu = async (restaurantId: string) => {
  const res = await fetch(`${API_URL}/api/menu/restaurant/${restaurantId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch restaurant menu');
  }
  const data = await res.json();
  return data.data || [];
};

// Send a new food order payload to MongoDB[cite: 11]
export const createOrder = async (orderPayload: Record<string, any>) => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to place order');
  }
  return data;
};