import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ProductForm from '../../components/admin/ProductForm';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products?size=100');
            setProducts(response.data.content || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading products...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{products.length} total products</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem'
                    }}
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Search Bar */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Image</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {searchTerm ? 'No products found matching your search' : 'No products available'}
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(product => (
                                <tr
                                    key={product.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <img
                                            src={product.imageUrl || 'https://placehold.co/60x60?text=No+Image'}
                                            alt={product.name}
                                            style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{product.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            {product.description?.substring(0, 60)}{product.description?.length > 60 ? '...' : ''}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            background: 'var(--primary)20',
                                            color: 'var(--primary)'
                                        }}>
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                                        ${product.price?.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <span style={{
                                            color: product.stock < 10 ? 'var(--danger)' : 'inherit',
                                            fontWeight: product.stock < 10 ? 600 : 400
                                        }}>
                                            {product.stock}
                                            {product.stock < 10 && ' (Low)'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn-secondary"
                                                style={{
                                                    padding: '0.5rem',
                                                    minWidth: 'unset',
                                                    borderRadius: '6px'
                                                }}
                                                title="Edit product"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                style={{
                                                    padding: '0.5rem',
                                                    minWidth: 'unset',
                                                    borderRadius: '6px',
                                                    background: 'var(--danger)20',
                                                    color: 'var(--danger)',
                                                    border: 'none',
                                                    cursor: 'pointer',
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
                                                title="Delete product"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Product Form Modal */}
            <ProductForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
};

export default AdminProducts;
