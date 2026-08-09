"use client";

import Link from 'next/link';
import React from 'react';

interface Product {
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  brand: string | null;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const renderImageContent = () => {
    if (product.image_url) {
      return <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />;
    } else {
      // Placeholder emoji per kategori (deterministik, hindari hydrate mismatch)
      const placeholderEmoji =
        product.category === "laptop" ? "💻"
        : product.category === "smartphone" ? "📱"
        : product.category === "monitor" ? "🖥️"
        : product.category === "gpu" ? "🎮"
        : product.category === "cpu" ? "🧠"
        : product.category === "ram" ? "💾"
        : "🛒";

      return (
        <div className="bg-slate-800 flex items-center justify-center h-48 text-5xl">
          {placeholderEmoji}
        </div>
      );
    }
  };

  const StockBadge = () => {
    if (product.stock > 0) {
      return <span className="text-emerald-400 font-medium">Stok: {product.stock}</span>;
    }
    return <span className="text-red-400 font-medium">Habis</span>;
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="glow-card bg-[#1a1a22] rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col">
        {/* Image Area */}
        <div className="w-full h-48 relative">
          {renderImageContent()}
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            {/* Name */}
            <h3 className="text-lg font-semibold text-slate-200 line-clamp-1 mb-1">{product.name}</h3>

            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-slate-400 mb-3">Brand: {product.brand}</p>
            )}

            {/* Price and Stock */}
            <div className="flex justify-between items-center mb-4 pt-2 border-t border-slate-800">
              <span className="text-xl font-bold text-emerald-300">{formattedPrice}</span>
              <StockBadge />
            </div>
          </div>

          {/* Button */}
          <button className="w-full py-2 rounded-lg text-white transition duration-150 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
            Lihat Detail
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;