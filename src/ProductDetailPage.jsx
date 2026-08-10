import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJson } from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import { useCatalog } from '../hooks/useCatalog'; // Para usar formatPrice e addToCart

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { formatPrice, addToCart } = useCatalog(); // Reutiliza funções do hook principal

    useEffect(() => {
        async function getProductDetails() {
            try {
                setLoading(true);
                const fetchedProduct = await fetchJson(`/products/${id}`);
                setProduct(fetchedProduct);
                setError('');
            } catch (err) {
                setError('Não foi possível carregar os detalhes do produto.');
            } finally {
                setLoading(false);
            }
        }
        getProductDetails();
    }, [id]);

    if (loading) return <LoadingOverlay />;
    if (error) return <Alert message={error} />;
    if (!product) return <Alert message="Produto não encontrado." />;

    return (
        <div className="modal-overlay" onClick={() => navigate('/')}> {/* Reutilizando o estilo do modal para o overlay */}
            <div className="modal-card" onClick={(e) => e.stopPropagation()}> {/* Previne o fechamento ao clicar dentro */}
                <button type="button" className="modal-close" onClick={() => navigate('/')}>×</button>
                <img src={product.image} alt={product.title} />
                <div className="modal-content">
                    <span className="tag">{product.category}</span>
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <div className="modal-footer">
                        <div className="modal-price">{formatPrice(product.price)}</div>
                        <button type="button" className="button button--primary button--icon" onClick={() => addToCart(product.id)} aria-label="Adicionar ao carrinho">➕</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;