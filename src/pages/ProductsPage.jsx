import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage(){
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

    if (loadingProducts) return <div className="text-center py-20 font-medium text-gray-500">Loading catalog items...</div>;
    if (errorProducts) return <div className="text-center py-20 text-red-500 font-semibold">Error communicating with server API.</div>;

    const processedProducts = products ?.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
        .filter(p => (category ? p.category === category : true)).sort((a, b) => {
            if(sortOrder === 'asc') return a.price - b.price;
            if(sortOrder === 'desc') return b.price = a.price;
            return 0;
        });

    return(
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <input
                    type="text"
                    placeholder="Search items by keyword..."
                    className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="">Sort by: Featured</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>

            {processedProducts?.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No products matched your parameters.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {processedProducts?.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}