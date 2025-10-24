import Navbar from './Navbar';
import Footer from './Footer';

export default function Home() {
  const feedbacks = [
    { quote: 'A terrific piece of praise', name: 'Name', description: 'Description', img: '/avatar1.jpg' },
    { quote: 'A fantastic bit of feedback', name: 'Name', description: 'Description', img: '/avatar2.jpg' },
    { quote: 'A genuinely glowing review', name: 'Name', description: 'Description', img: '/avatar3.jpg' }
  ];

  const products = [
    { img: '/product1.jpg', title: 'Subheading', text: "Body text for whatever you'd like to add more to the subheading." },
    { img: '/product2.jpg', title: 'Subheading', text: "Body text for whatever you'd like to expand on the main point." },
    { img: '/product3.jpg', title: 'Subheading', text: "Body text for whatever you'd like to share more." }
  ];

  const brands = [
    "/logo1.png", "/logo2.png", "/logo3.png", "/logo4.png", "/logo5.png", "/logo6.png"
  ];

  return (
    <div className="bg-white min-h-screen">
     <Navbar/>
     <section className="relative bg-white flex flex-col items-center py-0 overflow-hidden min-h-[400px]">
      {/* Green backgrounds (left & right) */}
      <div className="absolute left-0 bottom-0 h-[270px] w-[46%] md:w-[40%] bg-[#88946B] rounded-tl-2xl rounded-bl-2xl z-0"></div>
      <div className="absolute right-0 bottom-0 h-[270px] w-[46%] md:w-[40%] bg-[#88946B] rounded-tr-2xl rounded-br-2xl z-0"></div>
      
      {/* Heading */}
      <h1 className="relative z-10 pt-8 text-5xl md:text-6xl font-serif font-bold text-center leading-none mb-2">
        Buy Your Product.
      </h1>

      {/* Product image in device/mockup-style border */}
      <div className="relative z-10 w-full flex justify-center pb-0 pt-2">
        <div className="bg-black overflow-hidden border-t-10 border-x-10 border-b-0 border-black w-[35vw] max-w-3xl min-w-[350px] rounded-t-xl rounded-b-none">
          <img 
            src="public\browseSection.png"  // <-- Use your actual imagefilename here!
            alt="Product Display"
            className="block w-full h-80 md:h-80 object-cover rounded-t-xl rounded-b-none"
          />
        </div>
      </div>
    </section>
      {/* Trusted Brands */}
      <section className="py-8">
        <div className="mb-6 text-sm text-gray-500 pl-5">Trusted by:</div>
        <div className="flex flex-wrap items-center justify-center gap-12">
          {brands.map((src, idx) => (
            <img key={idx} src={src} alt="Brand logo" className="h-10 opacity-70" />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <h2 className="text-3xl font-serif font-bold mb-6 pl-5">Check The Products.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
          {products.map((item, idx) => (
            <div key={idx} className="rounded-lg shadow p-4 bg-white">
              <img src={item.img} alt={item.title} className="rounded mb-4 w-full h-56 object-cover" />
              <div className="font-semibold mb-1">{item.title}</div>
              <div className="text-gray-700 text-sm">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fair Price Section */}
      <section className="py-12 flex flex-col md:flex-row items-center gap-8 px-5">
        <div className="flex-1 space-y-4">
          <div>
            <div className="font-semibold">Subheading</div>
            <div className="text-gray-700 text-sm">Body text for whatever you'd like to expand on the main point.</div>
          </div>
          <div>
            <div className="font-semibold">Subheading</div>
            <div className="text-gray-700 text-sm">
              Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes.
            </div>
          </div>
          <div>
            <div className="font-semibold">Subheading</div>
            <div className="text-gray-700 text-sm">
              Body text for whatever you'd like to add more to the main point. It provides details, explanations, and context.
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="bg-black text-white px-4 py-2 rounded">Button</button>
            <button className="bg-gray-200 text-black px-4 py-2 rounded">Secondary button</button>
          </div>
        </div>
        <img src="/cart-image.jpg" alt="Shopping Cart" className="rounded w-full md:w-1/2 h-72 object-cover" />
      </section>

      {/* Feedback Section */}
      <section className="py-12 bg-white px-5">
        <h2 className="text-3xl font-serif font-bold mb-8">Check The Feedbacks.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((fb, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white">
              <p className="mb-4 text-lg italic">"{fb.quote}"</p>
              <div className="flex items-center space-x-4">
                <img src={fb.img} alt={fb.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium">{fb.name}</div>
                  <div className="text-sm text-gray-500">{fb.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-12 flex flex-col items-center bg-white">
        <h2 className="text-3xl font-serif font-bold mb-4">Connect with us</h2>
        <p className="mb-6 text-gray-700 text-center max-w-lg">
          Schedule a quick call to learn how Axis can turn your regional data into a powerful advantage.
        </p>
        <button className="bg-[#586330] text-white px-8 py-3 rounded-full font-medium">Learn More &rarr;</button>
      </section>

        <Footer />
    </div>
  );
}
