import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogOut, User, ShoppingCart, Package, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();
    const cartItemsCount = getTotalItems();

    // Check if user is admin (roles can be strings or objects)
    const isAdmin = user && user.roles?.some(role =>
        role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
    );

    return (
        <nav style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingBag /> E-Shop
                </Link>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user && (
                        <>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    style={{
                                        position: 'relative',
                                        padding: '0.5rem',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 600
                                    }}
                                    title="Admin Dashboard"
                                >
                                    <Shield size={20} />
                                    <span>Admin</span>
                                </Link>
                            )}

                            <Link
                                to="/orders"
                                style={{
                                    position: 'relative',
                                    padding: '0.5rem',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem'
                                }}
                                title="My Orders"
                            >
                                <Package size={20} />
                                <span>Orders</span>
                            </Link>

                            <Link
                                to="/cart"
                                style={{
                                    position: 'relative',
                                    padding: '0.5rem',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Shopping Cart"
                            >
                                <ShoppingCart size={24} />
                                {cartItemsCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-2px',
                                        right: '-2px',
                                        background: 'var(--primary)',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    {user ? (
                        <>
                            <span style={{ color: 'var(--text-secondary)' }}>Hello, {user.name || user.email || 'User'}</span>
                            <button onClick={logout} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
