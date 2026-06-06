import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';

export default function CheckoutPage(){
    const { cart, totalPrice, clearCart } = useCart();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '', postcode: '' });
    const [errors, setErrors] = useState({});

    const mutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => clearCart(),
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

        mutation.mutate({
            customer: formData,
            items: cart,
            total: totalPrice
        });
    };

    if(mutation.isSuccess){
        return(
            <div className="max-w-md mx-auto text-center py-16 bg-white shadow-xl border border-gray-100 rounded-2xl p-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500 text-3xl font-bold">Done</div>
                <h2 className="text-2xl font-black text-gray-800">Order Confirmed</h2>
                <p className="text-sm text-gray-500 leading-relaxed">Your routing payload has successfully integrated with the localized backend server environment.</p>
            </div>
        );
    }

    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            <form onSubmit={handleFormSubmission} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 md:col-span-2">
                <h2 className="text-xl font-bold border-b border-gray-100 pb-2 text-gray-800">Shipping Architecture Data</h2>
                
                {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel'], ['address', 'Delivery Address', 'text'], ['city', 'City', 'text'], ['postcode', 'Postcode', 'text']].map(([key, label, type]) => (
                <div key={key}>
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

                <button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition disabled:bg-gray-300"
                >
                {mutation.isPending ? 'Processing Matrix payload...' : 'Authorize Checkout Order'}
                </button>
                {mutation.isError && <p className="text-red-500 text-center text-xs font-bold">Post transaction processing fault triggered on system node.</p>}
            </form>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
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