import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar(){
    const { totalItems } = useCart();

    return(
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold tracking-wider"> QuickShop </Link>
                <div className="flex space-x-6 items-center font-medium">
                    <Link to="/" className="hover:text-blue-200 transition">Products</Link>
                    <Link to="/cart" className="relative hover:text-blue-200 transition flex items-center">
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}