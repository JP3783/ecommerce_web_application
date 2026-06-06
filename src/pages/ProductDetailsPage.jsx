import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage(){
    const { id } = useParams();
    const { addToCart, cart } = useCart();

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
    });

    if (isLoading) return <div className="text-center py-20 text-gray-500">Gathering technical specifications...</div>;
    if (isError) return <div className="text-center py-20 text-red-500 font-bold">Failed to resolve product data.</div>;

    const cartItem = cart.find(item => item.id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const isOutOfStock = currentQty >= product.stock;

    return(
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12 max-w-4xl mx-auto">
            <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline mb-8 inline-block">Back to Catalog</Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center bg-gray-50 p-6 rounded-xl">
                    <img src={product.image} alt={product.title} className="max-h-80 object-contain"/>
                </div>
                <div className="space-y-6">
                    <span className="text-xs font-bold tracking-wider text-blue-600 uppercase px-2 py-1 bg-blue-50 rounded-md inline-block">{product.category}</span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{product.title}</h1>
                    <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                    <div className="flex items-center space-x-4 border-y border-gray-100 py-4">
                        <span className="text-3xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-400">| Stock Remaining: <strong className="text-gray-700">{product.stock - currentQty}</strong></span>
                    </div>
                    <button onClick={() => addToCart(product)} disabled={isOutOfStock || product.stock === 0}
                        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-sm hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                            {product.stock === 0 ? 'Completely Out of Stock' : isOutOfStock ? 'Maximum Stock in Cart' : 'Add to Shopping Cart'}
                        </button>
                </div>
            </div>
        </div>
    );
}