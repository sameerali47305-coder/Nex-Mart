import Link from "next/link";
import Container from "@/components/ui/Container";

const categories = [
  { name: "Men's Fashion", slug: "mens-fashion", emoji: "👔" },
  { name: "Women's Fashion", slug: "womens-fashion", emoji: "👗" },
  { name: "Electronics", slug: "electronics", emoji: "🎧" },
  { name: "Home & Living", slug: "home-living", emoji: "🛋️" },
  { name: "Beauty", slug: "beauty", emoji: "💄" },
  { name: "Sports", slug: "sports", emoji: "⚽" },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16">
      <Container>

        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="mt-2 text-gray-500">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <Link
            href="/categories"
            className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
          >
            View all categories
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="text-4xl transition group-hover:scale-110">
                {category.emoji}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

      </Container>
    </section>
  );
}
