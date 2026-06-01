'use client';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  is_featured: boolean;
  spice_level?: string;
  image_url?: string;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all duration-300">
      {item.image_url && (
        <div className="mb-4 h-48 rounded-lg overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition">
          {item.name}
        </h2>
        {item.is_featured && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
      
      {item.spice_level && item.spice_level !== 'none' && (
        <div className="mb-3">
          <span className="text-xs text-orange-400">🌶️ {item.spice_level}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-yellow-400">
          ${item.price}
        </span>
        <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full capitalize">
          {item.category}
        </span>
      </div>
      
      {onAddToCart && (
        <button
          onClick={() => onAddToCart(item)}
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition"
        >
          Add to Cart 🛒
        </button>
      )}
    </div>
  );
}