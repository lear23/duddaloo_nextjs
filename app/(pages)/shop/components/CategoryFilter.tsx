// app/(pages)/shop/components/CategoryFilter.tsx
'use client';

import Link from 'next/link';

interface CategoryFilterProps {
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
  currentCategory?: string;
}

const CategoryFilter = ({ categories, currentCategory }: CategoryFilterProps) => {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <Link
        href="/shop"
        className={`px-4 py-2 rounded-full border transition-colors ${
          !currentCategory || currentCategory === 'alla'
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }`}
      >
        Alla
      </Link>
      
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={`/shop?category=${cat.slug}`}
          className={`px-4 py-2 rounded-full border transition-colors ${
            currentCategory === cat.slug
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;