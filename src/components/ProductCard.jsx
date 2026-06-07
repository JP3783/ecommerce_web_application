import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }){
    //pull the cart array along with addToCart to track items already selected
    const { addToCart, cart } = useCart();

    //Find if this specific product is already in the cart
    const cartItem = cart?.find((item) => item.id === product.id);
    const currentQtyInCart = cartItem ? cartItem.quantity : 0;

    //product is unavailable if global stock is 0 OR if the user added the maximum stock to their cart
    const isOutOfStock = product.stock <= 0 || currentQtyInCart >= product.stock;

    return(
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
            <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <span className="text-xs uppercase tracking-wide font-semibold text-gray-400 block mb-1">{product.category}</span>
                    <h3 className="font-bold text-gray-800 text-base line-clamp-2 mb-2">{product.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-yellow-500 font-medium mb-2">
                        <span> {product.rating?.rate || product.rating}</span>
                        <span className="text-gray-400 font-normal">({product.stock} left)</span>
                    </div>
                </div>
                <div>
                    <div className="text-xl font-extrabold text-blue-600 mb-4">${product.price.toFixed(2)}</div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link to={`/product/${product.id}`} className="text-center border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                            Details
                        </Link>
                        <button onClick={() => addToCart(product)} disabled={product.stock <= 0} className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}