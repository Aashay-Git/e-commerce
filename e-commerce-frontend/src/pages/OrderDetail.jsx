import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            setCancelling(true);
            await api.put(`/orders/${id}/cancel`);
            toast.success('Order cancelled successfully');
            fetchOrder(); // Refresh order data
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <h2>Order Not Found</h2>
                    <Link to="/orders" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status, isActive) => {
        const size = 24;
        const color = isActive ? 'var(--primary)' : 'var(--text-muted)';

        switch (status) {
            case 'PENDING':
                return <Clock size={size} style={{ color }} />;
            case 'PROCESSING':
                return <Package size={size} style={{ color }} />;
            case 'SHIPPED':
                return <Truck size={size} style={{ color }} />;
            case 'DELIVERED':
                return <CheckCircle size={size} style={{ color }} />;
            case 'CANCELLED':
                return <XCircle size={size} style={{ color: 'var(--danger)' }} />;
            default:
                return <Package size={size} style={{ color }} />;
        }
    };

    const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = statusSteps.indexOf(order.status);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
                <ArrowLeft size={18} />
                Back to Orders
            </Link>

            {/* Order Header */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Order #{order.id}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            ${order.totalAmount?.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                {order.status !== 'CANCELLED' && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            {/* Progress Line */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '0',
                                    right: '0',
                                    height: '2px',
                                    background: 'var(--bg-detail)',
                                    zIndex: 0
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        background: 'var(--primary)',
                                        width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </div>

                            {statusSteps.map((status, index) => {
                                const isActive = index <= currentStatusIndex;
                                return (
                                    <div
                                        key={status}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            position: 'relative',
                                            zIndex: 1,
                                            flex: 1
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                background: isActive ? 'var(--primary)' : 'var(--bg-detail)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '0.5rem',
                                                border: `2px solid ${isActive ? 'var(--primary)' : 'var(--bg-detail)'}`
                                            }}
                                        >
                                            {getStatusIcon(status, isActive)}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.85rem',
                                                fontWeight: isActive ? 600 : 400,
                                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {status}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {order.status === 'CANCELLED' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--danger)20', borderRadius: '8px', marginTop: '1rem' }}>
                        <XCircle size={24} style={{ color: 'var(--danger)' }} />
                        <span style={{ color: 'var(--danger)', fontWeight: 600 }}>This order has been cancelled</span>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Order Items */}
                <div>
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                            <Package size={20} /> Order Items ({order.items?.length || 0})
                        </h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {order.items?.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'var(--bg-detail)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <img
                                        src={item.product?.imageUrl || 'https://placehold.co/100x100?text=No+Image'}
                                        alt={item.product?.name}
                                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {item.product?.name}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            {item.product?.description?.substring(0, 100)}...
                                        </p>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            ${item.price?.toFixed(2)} × {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    {/* Shipping Address */}
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                            <MapPin size={18} /> Shipping Address
                        </h3>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <div style={{ fontWeight: 600 }}>{order.shippingFullName}</div>
                            <div>{order.shippingAddressLine1}</div>
                            {order.shippingAddressLine2 && <div>{order.shippingAddressLine2}</div>}
                            <div>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</div>
                            <div>{order.shippingCountry}</div>
                            <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                Phone: {order.shippingPhone}
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                            <CreditCard size={18} /> Payment
                        </h3>
                        <div style={{ fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Method:</span>
                                <span style={{ fontWeight: 500 }}>
                                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                                <span style={{ fontWeight: 500, color: order.payment?.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)' }}>
                                    {order.payment?.status || 'PENDING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                                <span style={{ fontWeight: 500 }}>${order.totalAmount?.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                                <span style={{ fontWeight: 500, color: 'var(--success)' }}>Free</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--bg-detail)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Total:</span>
                                    <span style={{ color: 'var(--primary)' }}>${order.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Order Button */}
                    {order.status === 'PENDING' && (
                        <button
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                            className="btn-secondary"
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                background: 'var(--danger)',
                                color: 'white',
                                fontWeight: 600,
                                opacity: cancelling ? 0.6 : 1,
                                cursor: cancelling ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
