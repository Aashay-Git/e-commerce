import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart, getTotalPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    if (!user) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <ShoppingBag size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Please Login</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        You need to be logged in to view your cart
                    </p>
                    <Link to="/login" className="btn-primary">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading cart...</div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <ShoppingBag size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Add some products to get started!
                    </p>
                    <Link to="/" className="btn-primary">
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateQuantity(itemId, newQuantity);
    };

    const handleRemove = async (itemId) => {
        await removeFromCart(itemId);
    };

    const totalPrice = getTotalPrice();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Cart Items */}
                <div>
                    {cart.items.map((item) => {
                        const product = item.product;
                        const price = product?.price || item.price || 0;
                        const subtotal = price * item.quantity;

                        return (
                            <div key={item.id} className="glass-panel" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                                    {/* Product Image */}
                                    <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
                                        <img
                                            src={product?.imageUrl || 'https://placehold.co/200x200?text=No+Image'}
                                            alt={product?.name || 'Product'}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {product?.name || 'Unknown Product'}
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            ${price.toFixed(2)} each
                                        </p>

                                        {/* Quantity Controls */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'var(--bg-detail)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: 'var(--text-primary)',
                                                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                                    opacity: item.quantity <= 1 ? 0.5 : 1
                                                }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 500 }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'var(--bg-detail)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: 'var(--text-primary)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'var(--danger)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    marginLeft: '1rem'
                                                }}
                                                title="Remove from cart"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                            ${subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 600 }}>Order Summary</h3>

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

                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }}
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-muted)',
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            <ArrowLeft size={16} />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
