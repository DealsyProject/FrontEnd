import React from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.category}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-[#3b450d]">{product.price}</span>
          <span className="text-yellow-500 text-sm">⭐ {product.rating}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/customerproductview/${product.id}`)}
            className="flex-1 bg-[#3b450d] hover:bg-[#2e350b] text-white py-2 rounded-md text-sm font-medium transition"
          >
            View
          </button>
          <button className="flex-1 border border-[#3b450d] text-[#3b450d] hover:bg-[#f4f4f4] py-2 rounded-md text-sm font-medium transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
