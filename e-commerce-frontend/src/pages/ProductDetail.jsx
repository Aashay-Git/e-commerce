import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const success = await addToCart(product.id, quantity);
        if (success) {
            setQuantity(1); // Reset quantity after adding
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Product not found</div>
            </div>
        );
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={20}
                fill={index < Math.floor(rating) ? 'var(--primary)' : 'none'}
                stroke={index < rating ? 'var(--primary)' : 'var(--text-muted)'}
            />
        ));
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
                <ArrowLeft size={18} />
                Back to Products
            </Link>

            <div className="glass-panel" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Product Image */}
                    <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}>
                        <img
                            src={product.imageUrl || 'https://placehold.co/600x450?text=No+Image'}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>{product.name}</h1>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {renderStars(4)}
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>(4.0)</span>
                        </div>

                        {/* Price */}
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            ${product.price?.toFixed(2)}
                        </div>

                        {/* Description */}
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {product.stock > 0 ? (
                                <span style={{ color: 'var(--success)', fontSize: '0.95rem', fontWeight: 500 }}>
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span style={{ color: 'var(--danger)', fontSize: '0.95rem', fontWeight: 500 }}>
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Quantity:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--bg-detail)',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        width: '100px'
                                    }}
                                />
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            className="btn-primary"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: product.stock === 0 ? 0.5 : 1,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
