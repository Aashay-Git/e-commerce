import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                Manage your e-commerce platform
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {/* Products Management Card */}
                <Link
                    to="/admin/products"
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <Package size={30} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Products
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Add, edit, or remove products from your catalog
                    </p>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Manage Products →
                    </span>
                </Link>

                {/* Orders Management Card */}
                <Link
                    to="/admin/orders"
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <ShoppingCart size={30} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Orders
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        View and manage all customer orders and statuses
                    </p>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                        Manage Orders →
                    </span>
                </Link>

                {/* Statistics Card */}
                <Link
                    to="/admin/statistics"
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <BarChart3 size={30} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Statistics
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        View detailed analytics and business insights
                    </p>
                    <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                        View Statistics →
                    </span>
                </Link>

                {/* Users Management Card */}
                <Link
                    to="/admin/users"
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <Users size={30} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Users
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Manage user accounts and permissions
                    </p>
                    <span style={{ color: '#8b5cf6', fontWeight: 600 }}>
                        Manage Users →
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
