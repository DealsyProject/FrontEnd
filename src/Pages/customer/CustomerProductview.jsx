import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerProductView() {
  const { id } = useParams();
  const [wishlist, setWishlist] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/Product/${id}`);
        const data = response.data;

        if (data.images?.length > 0) {
          setMainImage(data.images[0].imageData);
        }

        setProduct(data);
        setLoading(false);

        // Notify vendor if out of stock
        if (data.quantity === 0) {
          await axiosInstance.post(`/Notification/vendor-out-of-stock`, {
            productId: data.id,
            vendorId: data.vendorId,
          });
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const customerId = localStorage.getItem("userId");
      await axiosInstance.post(`/Cart`, {
        customerId,
        productId: product.id,
        quantity: 1,
      });
      alert("✅ Product added to cart!");
    } catch (error) {
      console.error("❌ Add to cart failed:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleWishlist = async () => {
    try {
      const customerId = localStorage.getItem("userId");
      if (!wishlist) {
        await axiosInstance.post(`/Wishlist`, {
          customerId,
          productId: product.id,
        });
      } else {
        // remove from wishlist — backend handles this too
      }
      setWishlist(!wishlist);
    } catch (error) {
      console.error("❌ Wishlist update failed:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fde7e7]">
      <Navbar />
      <main className="flex-grow flex flex-col items-center py-10 px-5">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Product Image */}
            <div className="relative flex flex-col items-center">
              <img
                src={mainImage}
                alt={product.productName}
                className="w-full h-80 object-cover rounded-lg shadow-sm"
              />
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
              >
                {wishlist ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-600 text-xl" />}
              </button>
              <div className="flex gap-4 mt-5">
                {product.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.imageData}
                    alt="thumb"
                    onClick={() => setMainImage(img.imageData)}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                      img.imageData === mainImage ? "border-[#3b450d]" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-semibold mb-2">{product.productName}</h1>
              <p className="text-gray-500 mb-2">By {product.vendorName}</p>
              <p className="text-gray-600 mb-4">{product.productCategory}</p>

              <p className="text-2xl font-semibold text-[#3b450d] mb-4">₹{product.price}</p>
              <p className={`mb-4 text-sm font-medium ${product.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.quantity > 0 ? `In Stock: ${product.quantity}` : "Out of Stock"}
              </p>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex gap-3">
                <button
                  onClick={handleWishlist}
                  className={`flex-1 px-6 py-2 rounded-md ${
                    wishlist ? "bg-red-500 text-white" : "border border-[#3b450d] text-[#3b450d]"
                  }`}
                >
                  {wishlist ? "Added to Wishlist ❤️" : "Add to Wishlist"}
                </button>

                <button
                  disabled={product.quantity === 0}
                  onClick={handleAddToCart}
                  className={`flex-1 px-6 py-2 rounded-md ${
                    product.quantity === 0
                      ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                      : "bg-[#3b450d] text-white hover:bg-[#2e350b]"
                  }`}
                >
                  {product.quantity === 0 ? "Out of Stock" : "Add to Cart 🛒"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
