import React from 'react';

function CartDrawer({ cart, cartOpen, onToggleCart, onRemoveFromCart, onChangeQuantity, formatPrice }) {
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <aside className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`}>
            <div className="cart-header">
                <h2>Seu carrinho</h2>
                <button type="button" className="button button--ghost button--icon" onClick={onToggleCart} aria-label="Fechar carrinho">
                    ×
                </button>
            </div>
            <div className="cart-body">
                {cart.length === 0 ? (
                    <div className="cart-empty">Seu carrinho ainda está vazio.</div>
                ) : (
                    cart.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <img src={item.image} alt={item.title} />
                            <div className="cart-item__info">
                                <strong>{item.title}</strong>
                                <span>{formatPrice(item.price)}</span>
                                <div className="cart-item__quantity">
                                    <button type="button" onClick={() => onChangeQuantity(item.id, -1)}>
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => onChangeQuantity(item.id, 1)}>
                                        +
                                    </button>
                                </div>
                            </div>
                            <button type="button" className="cart-item__remove" onClick={() => onRemoveFromCart(item.id)}>
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="cart-footer">
                <div>
                    <span>Total</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                </div>
                <button type="button" className="button button--primary" disabled={cart.length === 0}>
                    Comprar
                </button>
            </div>
        </aside>
    );
}

export default CartDrawer;