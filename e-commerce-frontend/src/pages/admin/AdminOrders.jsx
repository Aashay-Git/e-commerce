import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Package, ChevronDown, ChevronUp, Ban } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/all');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await api.put(`/orders/${orderId}/cancel-admin`);
            toast.success('Order cancelled successfully!');
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return { bg: 'var(--warning)20', color: 'var(--warning)' };
            case 'PROCESSING':
                return { bg: 'var(--primary)20', color: 'var(--primary)' };
            case 'SHIPPED':
                return { bg: '#3b82f620', color: '#3b82f6' };
            case 'DELIVERED':
                return { bg: 'var(--success)20', color: 'var(--success)' };
            case 'CANCELLED':
                return { bg: 'var(--danger)20', color: 'var(--danger)' };
            default:
                return { bg: 'var(--bg-secondary)', color: 'var(--text-muted)' };
        }
    };

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter(order => order.status === filter);

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading orders...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Order Management</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{orders.length} total orders</p>

            {/* Status Filter Tabs */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilter('ALL')}
                        className={filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        All ({orders.length})
                    </button>
                    {statuses.map(status => {
                        const count = orders.filter(o => o.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={filter === status ? 'btn-primary' : 'btn-secondary'}
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                {status} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredOrders.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Package size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const statusStyle = getStatusColor(order.status);
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <div key={order.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                {/* Order Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                            Order #{order.id}
                                        </h3>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            Customer: {order.shippingFullName} | Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                background: statusStyle.bg,
                                                color: statusStyle.color
                                            }}
                                        >
                                            {order.status}
                                        </span>

                                        <button
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem', minWidth: 'unset' }}
                                        >
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Order Summary (always visible) */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'var(--bg-detail)',
                                    borderRadius: '8px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>
                                            ${order.totalAmount?.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Items</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 500 }}>{order.items?.length || 0} items</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Payment</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                        {/* Order Items */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Order Items:</h4>
                                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                {order.items?.map(item => (
                                                    <div
                                                        key={item.id}
                                                        style={{
                                                            display: 'flex',
                                                            gap: '1rem',
                                                            padding: '0.75rem',
                                                            background: 'var(--bg-secondary)',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        <img
                                                            src={item.product?.imageUrl || 'https://placehold.co/60x60?text=No+Image'}
                                                            alt={item.product?.name}
                                                            style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                                                        />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                                Quantity: {item.quantity} × ${item.price?.toFixed(2)}
                                                            </div>
                                                        </div>
                                                        <div style={{ fontWeight: 600 }}>
                                                            ${(item.quantity * item.price)?.toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Shipping Address:</h4>
                                            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', lineHeight: '1.6' }}>
                                                <div style={{ fontWeight: 500 }}>{order.shippingFullName}</div>
                                                <div>{order.shippingAddressLine1}</div>
                                                {order.shippingAddressLine2 && <div>{order.shippingAddressLine2}</div>}
                                                <div>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</div>
                                                <div>{order.shippingCountry}</div>
                                                <div style={{ marginTop: '0.5rem' }}>Phone: {order.shippingPhone}</div>
                                            </div>
                                        </div>

                                        {/* Admin Actions */}
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {order.status !== 'CANCELLED' && (
                                                <>
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Update Status:</label>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            className="form-input"
                                                            style={{ padding: '0.5rem 1rem', minWidth: '150px' }}
                                                        >
                                                            {statuses.filter(s => s !== 'CANCELLED').map(status => (
                                                                <option key={status} value={status}>{status}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.5rem 1rem',
                                                            background: 'var(--danger)20',
                                                            color: 'var(--danger)',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: 500,
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'var(--danger)';
                                                            e.currentTarget.style.color = 'white';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'var(--danger)20';
                                                            e.currentTarget.style.color = 'var(--danger)';
                                                        }}
                                                    >
                                                        <Ban size={16} />
                                                        Cancel Order
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'CANCELLED' && (
                                                <div style={{ color: 'var(--danger)', fontStyle: 'italic' }}>
                                                    This order has been cancelled
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
