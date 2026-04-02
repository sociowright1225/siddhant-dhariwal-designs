export default async function ProductDetailPage({ params }) {
  const { slug } = params;
  const res = await fetch(`http://localhost:5000/api/products/details/${slug}`, { cache: 'no-store' });
  const product = await res.json();

  if (!product) return <div className="p-20 text-center uppercase font-bold">Product not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-[10px] font-mono text-gray-300 mb-4">app/Product/[CategoryName]/[ProductName]</h1>
      
      <div className="border border-black p-8 flex flex-col md:flex-row gap-12 bg-white">
        
        {/* Left Side: Large Image Area (Matching the M-shape sketch) */}
        <div className="w-full md:w-1/2 aspect-square border-2 border-dashed border-gray-200 relative bg-gray-50 flex items-center justify-center overflow-hidden">
          <img 
            src={product.mainImage?.url} 
            alt={product.title} 
            className="w-full h-full object-contain p-4 z-10"
          />
          {/* Subtle "O" watermark like in your drawing */}
          <span className="absolute text-[150px] font-serif opacity-5 select-none">O</span>
        </div>

        {/* Right Side: Product Info */}
        <div className="flex flex-col justify-center space-y-6 flex-1">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">
              {product.title}
            </h1>
            <p className="text-2xl font-mono text-gray-600">₹{product.price}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
              {product.category}
            </p>
          </div>

          <div className="pt-6">
            <button className="w-full md:w-64 border-2 border-black py-4 px-6 font-black uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}