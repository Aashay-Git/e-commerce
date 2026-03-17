import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ProductForm = ({ isOpen, onClose, product, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        imageUrl: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch categories for dropdown
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();

            // Pre-fill form if editing existing product
            if (product) {
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    stock: product.stock || '',
                    categoryId: product.category?.id || '',
                    imageUrl: product.imageUrl || ''
                });
            } else {
                // Reset form for new product
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    categoryId: '',
                    imageUrl: ''
                });
            }
        }
    }, [isOpen, product]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.categoryId || !formData.imageUrl) {
            toast.error('Please fill in all fields');
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            toast.error('Price must be greater than 0');
            return;
        }

        if (parseInt(formData.stock) < 0) {
            toast.error('Stock cannot be negative');
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: { id: parseInt(formData.categoryId) },
                imageUrl: formData.imageUrl
            };

            if (product) {
                // Update existing product
                await api.put(`/products/${product.id}`, payload);
                toast.success('Product updated successfully!');
            } else {
                // Create new product
                await api.post('/products', payload);
                toast.success('Product added successfully!');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2rem'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 600, margin: 0 }}>
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Product Name <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-input"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Description <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="form-input"
                            placeholder="Enter product description"
                            rows="4"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Price ($) <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="form-input"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Stock <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="form-input"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Category <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="form-input"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Image URL <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            style={{ padding: '0.75rem 1.5rem' }}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.5rem' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
