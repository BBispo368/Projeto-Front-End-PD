import React from 'react';
import ProductCard from './ProductCard.jsx';

function ProductList({ products, onAddToCart, onShowDetails, formatPrice }) {
    if (products.length === 0) {
        return <div className="empty-state">Nenhum produto encontrado para essa busca.</div>;
    }

    return (
        <section className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onShowDetails={onShowDetails} formatPrice={formatPrice} />
            ))}
        </section>
    );
}

export default ProductList;