'use client';

const categories = ['all', 'breakfast', 'lunch', 'dinner', 'drinks', 'desserts'];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full transition ${
            selectedCategory === category
              ? 'bg-yellow-500 text-black font-semibold'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}