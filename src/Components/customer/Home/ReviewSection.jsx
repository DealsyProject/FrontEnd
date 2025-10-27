

export default function ReviewsSection() {
  const Reviews = [
    { quote: 'A terrific piece of praise', name: 'Name', description: 'Description', img: '/avatar1.jpg' },
    { quote: 'A fantastic bit of feedback', name: 'Name', description: 'Description', img: '/avatar2.jpg' },
    { quote: 'A genuinely glowing review', name: 'Name', description: 'Description', img: '/avatar3.jpg' }
  ];
  return (
    <section className="py-12 bg-white px-5">
      <h2 className="text-3xl font-serif font-bold mb-8">Check The Reviews.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Reviews.map((fb, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
          >
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
  );
}
