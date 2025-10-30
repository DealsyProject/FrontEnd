import React, { useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
    country: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = () => {
    alert("Payment Successful ✅");
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />

      <main className="flex-grow flex justify-center items-start px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-6xl p-8">
          {/* Payment Methods */}
          <div className="border border-gray-200 rounded-md p-4 inline-block mb-8">
            <p className="text-sm text-gray-500 mb-2">Payment Method</p>
            <div className="flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="w-10"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/MasterCard_Logo.svg"
                alt="Mastercard"
                className="w-10"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Amex_logo.svg"
                alt="Amex"
                className="w-10"
              />
            </div>
          </div>

          {/* Forms Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Credit Card Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Credit Card Details
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name on card"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={form.cardNumber}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                />

                <div className="flex gap-3">
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    className="w-1/2 border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-1/2 border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i}>{2025 + i}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="password"
                  name="cvv"
                  placeholder="Card Security Code"
                  value={form.cvv}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Billing Address
              </h3>
              <div className="space-y-4">
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                >
                  <option value="">Country</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                </select>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              {/* Total + Pay */}
              <div className="mt-8 border-t pt-4">
                <p className="text-gray-800 font-medium mb-4">
                  Total Amount : <span className="font-semibold">₹2053</span>
                </p>
                <button
                  onClick={handlePay}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                >
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
