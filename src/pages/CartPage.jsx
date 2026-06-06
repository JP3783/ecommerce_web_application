import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage(){
    const { cart, updateQuantity, removeFromCart, clearCart, totalPrice} = useCart();

    if(cart.length === 0){
        return(
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto p-8">
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition inline-block">Go Shopping</Link>
            </div>
        );
    }

    return(
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Your Shopping Cart</h1>
                <button onClick={clearCart} className="text-sm text-red-500 font-semibold hover:underline">Clear Container</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-1/2">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-contain bg-gray-50 p-1 rounded" />
                        <div>
                            <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{item.title}</h3>
                            <span className="text-xs text-gray-400 capitalize">{item.category}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full sm:w-1/2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, -1, item.stock)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600">-</button>
                                <span className="px-4 text-sm font-semibold text-gray-800">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1, item.stock)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600">+</button>
                        </div>
                        <div className="text-right">
                            <div className="font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 mt-1">Remove</button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <span className="text-sm text-gray-400 block font-medium">Estimated Total:</span>
                    <span className="text-3xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="w-full sm:w-auto bg-blue-600 text-white text-center font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
}