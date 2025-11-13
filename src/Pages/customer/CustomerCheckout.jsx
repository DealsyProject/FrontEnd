import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from '../../Components/utils/axiosInstance';

export default function CheckoutPage() {
  const { checkoutId } = useParams();
  const [checkout, setCheckout] = useState(null);
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
    country: "",
    address: "",
  });

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const res = await axiosInstance.get(`/Checkout/${checkoutId}`);
        setCheckout(res.data);
      } catch (error) {
        console.error("❌ Error fetching checkout:", error);
      }
    };
    fetchCheckout();
  }, [checkoutId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async () => {
    try {
      await axiosInstance.post(`/Payment/confirm`, { checkoutId });
      alert("✅ Payment Successful!");
    } catch (error) {
      console.error("❌ Payment failed:", error);
    }
  };

  if (!checkout) return <div className="flex justify-center items-center min-h-screen">Loading checkout...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-start px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-6xl p-8">
          <div className="border border-gray-200 rounded-md p-4 inline-block mb-8">
            <p className="text-sm text-gray-500 mb-2">Payment Method</p>
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="w-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/MasterCard_Logo.svg" className="w-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Amex_logo.svg" className="w-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Credit Card Details</h3>
              <div className="space-y-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name on card" className="w-full border rounded-md px-4 py-2 text-sm" />
                <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" className="w-full border rounded-md px-4 py-2 text-sm" />
                <div className="flex gap-3">
                  <select name="month" value={form.month} onChange={handleChange} className="w-1/2 border rounded-md px-4 py-2 text-sm">
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                  </select>
                  <select name="year" value={form.year} onChange={handleChange} className="w-1/2 border rounded-md px-4 py-2 text-sm">
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => <option key={i}>{2025 + i}</option>)}
                  </select>
                </div>
                <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="CVV" className="w-full border rounded-md px-4 py-2 text-sm" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Billing Address</h3>
              <div className="space-y-4">
                <select name="country" value={form.country} onChange={handleChange} className="w-full border rounded-md px-4 py-2 text-sm">
                  <option value="">Country</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border rounded-md px-4 py-2 text-sm" />
              </div>
              <div className="mt-8 border-t pt-4">
                <p className="text-gray-800 font-medium mb-4">
                  Total Amount : <span className="font-semibold">₹{checkout.totalAmount}</span>
                </p>
                <button onClick={handlePay} className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                  Pay
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
