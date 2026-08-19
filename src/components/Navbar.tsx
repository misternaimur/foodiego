import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Foodiego
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/menu" className="text-sm font-medium hover:underline">
           Menu
            </Link>
            <Link href="/orders" className="text-sm font-medium hover:underline">
              Orders
            </Link>
            <a href="/cart" className="text-sm font-medium hover:underline ">
              Cart
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
