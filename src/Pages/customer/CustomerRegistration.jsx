import React from "react";

export default function CustomerRegistration() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400 to-indigo-100 opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-bold text-indigo-600">Dealsy</h1>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
              Customer Registration
            </h2>

            <form className="space-y-6 text-gray-900">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Street, City"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  id="pincode"
                  placeholder="600001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 shadow-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
