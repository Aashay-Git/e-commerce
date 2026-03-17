import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, Truck, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { cart, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        paymentMethod: 'COD'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!cart || !cart.items || cart.items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            const orderRequest = {
                shippingAddress: {
                    fullName: formData.fullName,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod
            };

            const response = await api.post('/orders', orderRequest);
            const order = response.data;

            // Clear local cart
            clearCart();

            toast.success('Order placed successfully!');

            // Navigate to order confirmation
            navigate(`/order-confirmation/${order.id}`);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    // Redirect if not logged in
    if (!user) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <ShoppingBag size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Please Login</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        You need to be logged in to checkout
                    </p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Login
                    </button>
                </div>
            </div>
        );
    }

    // Redirect if cart is empty
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <ShoppingBag size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Add some products before checking out
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = getTotalPrice();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Checkout Form */}
                <div>
                    <form onSubmit={handleSubmit}>
                        {/* Shipping Address */}
                        <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                                <MapPin size={20} /> Shipping Address
                            </h3>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${errors.fullName ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    {errors.fullName && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.fullName}</span>}
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Address Line 1 *
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        placeholder="Street address, P.O. box"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${errors.addressLine1 ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    {errors.addressLine1 && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.addressLine1}</span>}
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                        placeholder="Apartment, suite, unit (optional)"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--bg-detail)',
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: `1px solid ${errors.city ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        {errors.city && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.city}</span>}
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: `1px solid ${errors.state ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        {errors.state && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.state}</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: `1px solid ${errors.postalCode ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        {errors.postalCode && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.postalCode}</span>}
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: `1px solid ${errors.country ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        {errors.country && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.country}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${errors.phone ? 'var(--danger)' : 'var(--bg-detail)'}`,
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.phone}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                                <CreditCard size={20} /> Payment Method
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '8px', border: '1px solid var(--bg-detail)', cursor: 'pointer', background: formData.paymentMethod === 'COD' ? 'var(--bg-detail)' : 'transparent' }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleChange}
                                        style={{ marginRight: '0.75rem' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>Cash on Delivery</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay when you receive the order</div>
                                    </div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '8px', border: '1px solid var(--bg-detail)', cursor: 'pointer', background: formData.paymentMethod === 'ONLINE' ? 'var(--bg-detail)' : 'transparent', opacity: 0.6 }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="ONLINE"
                                        checked={formData.paymentMethod === 'ONLINE'}
                                        onChange={handleChange}
                                        disabled
                                        style={{ marginRight: '0.75rem' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>Online Payment (Razorpay)</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coming Soon</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 600 }}>Order Summary</h3>

                        {/* Cart Items */}
                        <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                            {cart.items.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-detail)' }}>
                                    <img
                                        src={item.product?.imageUrl || 'https://placehold.co/80x80?text=No+Image'}
                                        alt={item.product?.name}
                                        style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.product?.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>
                                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <span style={{ fontWeight: 500 }}>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                                <span style={{ fontWeight: 500, color: 'var(--success)' }}>Free</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--bg-detail)', marginTop: '1rem', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Truck size={20} />
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
