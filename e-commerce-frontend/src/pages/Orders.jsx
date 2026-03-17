import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelled, setShowCancelled] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (!user) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <Package size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Please Login</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        You need to be logged in to view your orders
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
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading orders...</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <Package size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>No Orders Yet</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        You haven't placed any orders yet. Start shopping!
                    </p>
                    <Link to="/" className="btn-primary">
                        <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'var(--warning)';
            case 'PROCESSING':
                return 'var(--primary)';
            case 'SHIPPED':
                return '#3b82f6';
            case 'DELIVERED':
                return 'var(--success)';
            case 'CANCELLED':
                return 'var(--danger)';
            default:
                return 'var(--text-muted)';
        }
    };

    // Filter orders based on showCancelled toggle
    const filteredOrders = showCancelled
        ? orders
        : orders.filter(order => order.status !== 'CANCELLED');

    const cancelledCount = orders.filter(order => order.status === 'CANCELLED').length;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>My Orders</h1>

                {cancelledCount > 0 && (
                    <button
                        onClick={() => setShowCancelled(!showCancelled)}
                        className="btn-secondary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        {showCancelled ? <EyeOff size={18} /> : <Eye size={18} />}
                        {showCancelled ? 'Hide' : 'Show'} Cancelled Orders ({cancelledCount})
                    </button>
                )}
            </div>

            {filteredOrders.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Package size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '0.5rem' }}>No Active Orders</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        All your orders have been cancelled. Click "Show Cancelled Orders" to view them.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {filteredOrders.map(order => (
                        <div
                            key={order.id}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                opacity: order.status === 'CANCELLED' ? 0.6 : 1
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        marginBottom: '0.5rem',
                                        fontWeight: 600,
                                        textDecoration: order.status === 'CANCELLED' ? 'line-through' : 'none'
                                    }}>
                                        Order #{order.id}
                                    </h3>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        background: order.status === 'CANCELLED'
                                            ? 'var(--danger)20'
                                            : order.status === 'DELIVERED'
                                                ? 'var(--success)20'
                                                : 'var(--warning)20',
                                        color: order.status === 'CANCELLED'
                                            ? 'var(--danger)'
                                            : order.status === 'DELIVERED'
                                                ? 'var(--success)'
                                                : 'var(--warning)',
                                    }}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'var(--bg-detail)',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Total Amount
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        ${order.totalAmount?.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Items
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                        {order.items?.length || 0} items
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Payment
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                    </div>
                                </div>
                            </div>

                            {/* Preview of order items (first 3) */}
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                    Order Items:
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {order.items?.slice(0, 3).map(item => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '6px',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <img
                                                src={item.product?.imageUrl || 'https://placehold.co/40x40?text=No+Image'}
                                                alt={item.product?.name}
                                                style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                            />
                                            <span>{item.product?.name}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            +{order.items.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link
                                to={`/orders/${order.id}`}
                                className="btn-primary"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem'
                                }}
                            >
                                <Eye size={16} />
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
