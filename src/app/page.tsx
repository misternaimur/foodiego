import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import FoodCategories from "@/components/FoodCategories";

export default function Home() {
  return (
    <main className="flex-1" suppressHydrationWarning>
      <Hero />
      <SearchBar />
      <FoodCategories />
    </main>
  );
}
