import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, Users } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Fetch all data needed for statistics
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products?size=1000'),
                    api.get('/orders/all')
                ]);

                const products = productsRes.data.content || [];
                const orders = ordersRes.data || [];

                // Calculate statistics
                const totalProducts = products.length;
                const totalOrders = orders.length;
                const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
                const processingOrders = orders.filter(o => o.status === 'PROCESSING').length;
                const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length;
                const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
                const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

                const totalRevenue = orders
                    .filter(o => o.status !== 'CANCELLED')
                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                const lowStockProducts = products.filter(p => p.stock < 10);
                const outOfStockProducts = products.filter(p => p.stock === 0);

                setStats({
                    totalProducts,
                    totalOrders,
                    pendingOrders,
                    processingOrders,
                    shippedOrders,
                    deliveredOrders,
                    cancelledOrders,
                    totalRevenue,
                    lowStockProducts,
                    outOfStockProducts: outOfStockProducts.length,
                    recentOrders: orders.slice(0, 10) // Last 10 orders
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
                toast.error('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading statistics...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--danger)' }}>Failed to load statistics</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Statistics & Analytics</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Comprehensive business insights</p>

            {/* Key Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Revenue</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>
                                ${stats.totalRevenue.toFixed(2)}
                            </h2>
                        </div>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            background: 'var(--success)20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <DollarSign size={24} color="var(--success)" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Orders</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{stats.totalOrders}</h2>
                        </div>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            background: 'var(--primary)20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ShoppingCart size={24} color="var(--primary)" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Products</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{stats.totalProducts}</h2>
                        </div>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            background: '#8b5cf620',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Package size={24} color="#8b5cf6" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pending Orders</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)', margin: 0 }}>{stats.pendingOrders}</h2>
                        </div>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            background: 'var(--warning)20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp size={24} color="var(--warning)" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Breakdown */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Order Status Breakdown</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--warning)' }}>{stats.pendingOrders}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Processing</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>{stats.processingOrders}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Shipped</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#3b82f6' }}>{stats.shippedOrders}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Delivered</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>{stats.deliveredOrders}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Cancelled</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--danger)' }}>{stats.cancelledOrders}</p>
                    </div>
                </div>
            </div>

            {/* Inventory Alerts */}
            {stats.lowStockProducts.length > 0 && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '2px solid var(--danger)40' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--danger)' }}>
                        ⚠️ Inventory Alerts ({stats.lowStockProducts.length})
                    </h2>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                        The following products have low stock (less than 10 units):
                    </p>
                    <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {stats.lowStockProducts.map(product => (
                            <div
                                key={product.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img
                                        src={product.imageUrl || 'https://placehold.co/50x50?text=No+Image'}
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{product.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.category?.name}</div>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    background: product.stock === 0 ? 'var(--danger)20' : 'var(--warning)20',
                                    color: product.stock === 0 ? 'var(--danger)' : 'var(--warning)',
                                    fontWeight: 600
                                }}>
                                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Orders</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Order ID</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Customer</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>Total</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map(order => {
                                const statusColors = {
                                    'PENDING': { bg: 'var(--warning)20', color: 'var(--warning)' },
                                    'PROCESSING': { bg: 'var(--primary)20', color: 'var(--primary)' },
                                    'SHIPPED': { bg: '#3b82f620', color: '#3b82f6' },
                                    'DELIVERED': { bg: 'var(--success)20', color: 'var(--success)' },
                                    'CANCELLED': { bg: 'var(--danger)20', color: 'var(--danger)' }
                                };
                                const style = statusColors[order.status] || {};

                                return (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: 500 }}>#{order.id}</td>
                                        <td style={{ padding: '0.75rem' }}>{order.shippingFullName}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                                            ${order.totalAmount?.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                background: style.bg,
                                                color: style.color
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;
