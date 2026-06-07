import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const { data: products, isLoading: loadingProducts, isError: errorProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (loadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium tracking-wide">Loading exclusive catalog...</p>
      </div>
    );
  }

  if (errorProducts) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-red-50 rounded-2xl border border-red-100 p-8 my-10">
        <p className="text-red-600 font-semibold">Unable to establish connection to the core data catalog.</p>
      </div>
    );
  }

  const processedProducts = products
    ?.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => (category ? p.category === category : true))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 my-6">
      
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-slate-900 to-slate-900">
        <div className="max-w-xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-900/50 inline-block">
            New Season Arrivals
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Next-gen gear. <br />Engineered for you.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-sm">
            Discover precision-crafted products built to elevate your daily productivity and lifestyle ecosystem.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3 relative">
          <input 
            type="text" 
            placeholder="Search our catalog collections..." 
            className="w-full bg-slate-50 border border-slate-200 pl-4 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-stretch w-full md:justify-end">
          <select 
            className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
          </select>

          <select 
            className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort: Featured</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {processedProducts?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-sm font-medium">No inventory items match your filtered search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {processedProducts?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}