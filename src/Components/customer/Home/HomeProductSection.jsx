

export default function HomeProductSection() {
    const products = [
        {
            img: 'public/homepics/honeyPic.png',
            title: 'Naturally Sourced',
            text: "Body text for whatever you'd like to add more to the subheading."
        },
        {
            img: 'public/homepics/beautiProduct.png',
            title: 'Cosmetics',
            text: "Body text for whatever you'd like to expand on the main point."
        },
        {
            img: 'public/homepics/watchPic.png',
            title: 'Wearings',
            text: "Body text for whatever you'd like to share more."
        }
    ];
    return (
        < section className = "py-12" >
      <h2 className="text-3xl font-serif font-bold mb-6 pl-5">Check The Products.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
          {products.map((item, idx) => (
            <div key={idx} className="rounded-lg shadow p-4 bg-white">
              <img src={item.img} 
              alt={item.title} 
              className="rounded mb-4 w-full h-56 object-cover" 
              />
              <div className="font-semibold mb-1">{item.title}</div>
              <div className="text-gray-700 text-sm">{item.text}</div>
            </div> 
          ))}
        </div>
      </section >
    );
}; 