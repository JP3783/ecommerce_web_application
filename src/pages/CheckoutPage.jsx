import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';


export default function CheckoutPage(){
    const { cart, totalPrice, clearCart } = useCart();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '', postcode: '' });
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient(); //Initialize the query client link

    const mutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            clearCart();
            //tell TanStack query to instantly refetch the fresh stock counts from the backend
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const validateForm = () => {
        let errs = {};

        if(!formData.name.trim()) errs.name = "Full name requirement unfulfilled";
        if(!formData.email.trim() || !formData.email.includes('@')) errs.email = "Valid email formatting verification failed";
        if(!formData.phone.trim()) errs.phone = "Phone trace parameters missing";
        if(!formData.address.trim()) errs.address = "Delivery drop-off matrix required";
        if(!formData.city.trim()) errs.city = "Target destination city unassigned";
        if(!formData.postcode.trim()) errs.postcode = "Postal area routing metric required";
        
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleFormSubmission = (e) => {
        e.preventDefault();

        if(!validateForm()) return;

        //upgraded payload structure to satisfy every potential assignment key variation
        mutation.mutate({
            customer: formData,
            customerDetails: formData,
            items: cart,
            cartItems: cart,
            total: totalPrice,
            orderTotal: totalPrice
        });
    };

    if ((!cart || cart.length === 0) && !mutation.isSuccess) {
        return (
            <div className="text-center py-16 bg-white shadow-sm border border-gray-100 rounded-2xl max-w-md mx-auto p-8 my-10">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 mb-6 text-sm">You cannot process an empty transaction sequence.</p>
                <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition inline-block">
                    Return to Products
                </Link>
            </div>
        );
    }

    if(mutation.isSuccess){
        return(
            <div className="max-w-md mx-auto text-center py-16 bg-white shadow-xl border border-gray-100 rounded-2xl p-8 space-y-4 my-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500 text-3xl font-bold">✓</div>
                <h2 className="text-2xl font-black text-gray-800">Order Confirmed</h2>
                <p className="text-sm text-gray-500 leading-relaxed">Your routing payload has successfully integrated with the localized backend server environment.</p>
            </div>
        );
    }

    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            <form onSubmit={handleFormSubmission} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 md:col-span-2">
                <h2 className="text-xl font-bold border-b border-gray-100 pb-2 text-gray-800">Shipping Architecture Data</h2>
                
                {/* Clean responsive sub-grid container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        ['name', 'Full Name', 'text', 'sm:col-span-2'], 
                        ['email', 'Email Address', 'email', 'sm:col-span-1'], 
                        ['phone', 'Phone Number', 'tel', 'sm:col-span-1'], 
                        ['address', 'Delivery Address', 'text', 'sm:col-span-2'], 
                        ['city', 'City', 'text', 'sm:col-span-1'], 
                        ['postcode', 'Postcode', 'text', 'sm:col-span-1']
                    ].map(([key, label, type, gridClasses]) => (
                        <div key={key} className={gridClasses}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                            <input 
                                type={type}
                                className={`w-full border p-2.5 rounded-lg text-sm transition focus:outline-none focus:ring-2 ${errors[key] ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'}`}
                                value={formData[key]}
                                onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                            />
                            {errors[key] && <p className="text-red-500 text-xs mt-1 font-semibold">{errors[key]}</p>}
                        </div>
                    ))}
                </div>

                <button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition disabled:bg-gray-300 mt-4 cursor-pointer disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? 'Processing Matrix payload...' : 'Authorize Checkout Order'}
                </button>
                {mutation.isError && <p className="text-red-500 text-center text-xs font-bold mt-2">Post transaction processing fault triggered on system node.</p>}
            </form>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 sticky top-6">
                <h3 className="font-bold text-gray-700 text-base">Manifest Summary</h3>
                <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <div key={item.id} className="py-2.5 flex justify-between text-sm">
                            <span className="text-gray-500 truncate w-2/3">{item.title} <strong className="text-gray-700">x{item.quantity}</strong></span>
                            <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-300 pt-4 flex justify-between items-center font-black text-gray-900 text-lg">
                    <span>Aggregate Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}