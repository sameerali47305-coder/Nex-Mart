import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Container from "@/components/ui/Container";

const products = [
  {
    id: "1",
    name: "Classic Leather Sneakers",
    price: 89.99,
    oldPrice: 120,
    rating: 4.5,
    emoji: "👟",
  },
  {
    id: "2",
    name: "Wireless Noise-Cancelling Headphones",
    price: 149.99,
    oldPrice: null,
    rating: 4.8,
    emoji: "🎧",
  },
  {
    id: "3",
    name: "Minimalist Analog Watch",
    price: 65.0,
    oldPrice: 80,
    rating: 4.3,
    emoji: "⌚",
  },
  {
    id: "4",
    name: "Everyday Canvas Backpack",
    price: 54.5,
    oldPrice: null,
    rating: 4.6,
    emoji: "🎒",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-gray-50 py-16">
      <Container>

        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="mt-2 text-gray-500">
              Hand-picked items our customers love
            </p>
          </div>

          <Link
            href="/products"
            className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-lg"
            >

              <button
                aria-label="Add to wishlist"
                className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition hover:text-red-500"
              >
                <Heart size={16} />
              </button>

              <Link
                href={`/products/${product.id}`}
                className="flex h-40 items-center justify-center bg-gray-100 text-6xl"
              >
                {product.emoji}
              </Link>

              <div className="flex flex-1 flex-col gap-2 p-4">

                <Link
                  href={`/products/${product.id}`}
                  className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                >
                  {product.name}
                </Link>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  {product.rating}
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    aria-label="Add to cart"
                    className="rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
