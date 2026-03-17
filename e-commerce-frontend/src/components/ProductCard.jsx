import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        await addToCart(product.id, 1);
    };

    return (
        <div className="glass-panel" style={{
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ position: 'relative', paddingTop: '75%', background: '#000' }}>
                <img
                    src={product.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
                    alt={product.name}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        ${product.price?.toFixed(2)}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/products/${product.id}`} className="btn-primary" style={{ padding: '0.5rem', background: 'var(--bg-detail)' }}>
                            <Eye size={18} />
                        </Link>
                        <button className="btn-primary" style={{ padding: '0.5rem' }} onClick={handleAddToCart} title="Add to Cart">
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
