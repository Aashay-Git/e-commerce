import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

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
                    <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate estimated delivery (5 days from order date)
    const orderDate = new Date(order.createdAt);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            {/* Success Message */}
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                <CheckCircle size={80} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>Order Placed Successfully!</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Order Number: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>#{order.id}</span>
                </p>
                <p style={{ color: 'var(--text-muted)' }}>
                    Thank you for your order! We'll send you a confirmation email shortly.
                </p>
            </div>

            {/* Order Summary */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Order Summary</h3>

                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Order Date:</span>
                        <span style={{ fontWeight: 500 }}>{orderDate.toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                        <span style={{ fontWeight: 500 }}>
                            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <span style={{ fontWeight: 500, color: 'var(--warning)' }}>{order.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Est. Delivery:</span>
                        <span style={{ fontWeight: 500, color: 'var(--success)' }}>
                            {estimatedDelivery.toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--bg-detail)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold' }}>
                        <span>Total Amount:</span>
                        <span style={{ color: 'var(--primary)' }}>${order.totalAmount?.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
                    <Truck size={20} /> Shipping Address
                </h3>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 500 }}>{order.shippingFullName}</div>
                    <div>{order.shippingAddressLine1}</div>
                    {order.shippingAddressLine2 && <div>{order.shippingAddressLine2}</div>}
                    <div>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</div>
                    <div>{order.shippingCountry}</div>
                    <div style={{ marginTop: '0.5rem' }}>Phone: {order.shippingPhone}</div>
                </div>
            </div>

            {/* Items */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
                    <Package size={20} /> Items ({order.items?.length || 0})
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {order.items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                                src={item.product?.imageUrl || 'https://placehold.co/80x80?text=No+Image'}
                                alt={item.product?.name}
                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Quantity: {item.quantity}
                                </div>
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--bg-detail)' }}>
                    <Home size={18} />
                    Continue Shopping
                </Link>
                <Link to="/orders" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                    <Package size={18} />
                    View Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
