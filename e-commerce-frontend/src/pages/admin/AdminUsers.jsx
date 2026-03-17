import { useState, useEffect } from 'react';
import { Users as UsersIcon, Shield, UserX } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Note: We would need a /api/users endpoint, but for now we'll show a placeholder
                // const response = await api.get('/users');
                // setUsers(response.data);

                // For now, show a message that this feature needs backend implementation
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading users...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>User Management</h1>

            {/* Placeholder for future implementation */}
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <UsersIcon size={80} style={{ color: 'var(--text-muted)', margin: '0 auto 2rem' }} />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>User Management Coming Soon</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    User management functionality will be available in a future update.
                    This will include features to view all users, manage roles, and handle user permissions.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '3rem',
                    maxWidth: '800px',
                    margin: '3rem auto 0'
                }}>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        <UsersIcon size={32} style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>View Users</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Browse all registered users
                        </p>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        <Shield size={32} style={{ color: 'var(--success)', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Manage Roles</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Assign admin privileges
                        </p>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        <UserX size={32} style={{ color: 'var(--danger)', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>User Actions</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Deactivate or manage users
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
