import React from 'react';

function ProductCard({ product, onAddToCart, onShowDetails, formatPrice }) {
    return (
        <article className="product-card">
            <button type="button" className="product-card__media" onClick={() => onShowDetails(product.id)}>
                <img src={product.image} alt={product.title} loading="lazy" />
            </button>
            <div className="product-card__body">
                <button type="button" className="product-card__title" onClick={() => onShowDetails(product.id)}>
                    {product.title}
                </button>
                <div className="product-card__price">{formatPrice(product.price)}</div>
                <button
                    type="button"
                    className="button button--secondary button--icon"
                    onClick={() => onAddToCart(product.id)}
                    aria-label="Adicionar ao carrinho"
                >
                    ➕
                </button>
            </div>
        </article>
    );
}

export default ProductCard;