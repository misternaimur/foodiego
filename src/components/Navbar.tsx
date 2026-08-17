export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">
              Foodiego
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:underline">
              Home
            </a>
            <a href="/menu" className="text-sm font-medium hover:underline">
              Menu
            </a>
            <a href="/orders" className="text-sm font-medium hover:underline">
              Orders
            </a>
            <a href="/cart" className="text-sm font-medium hover:underline">
              Cart
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
