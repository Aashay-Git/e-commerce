import { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Loader } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                // Handle Spring Data REST Page format or plain list
                setProducts(data.content || data);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader className="spin" size={48} style={{ color: 'var(--primary)' }} />
        </div>
    );

    if (error) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'inline-block' }}>
                <p style={{ color: 'var(--danger)' }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', margin: '2rem 0', fontWeight: 'bold' }}>
                Featured Products
            </h2>

            {products.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    No products found. Check back later!
                </p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
