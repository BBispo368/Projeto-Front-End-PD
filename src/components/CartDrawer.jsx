import React from 'react';
import { useNavigate } from 'react-router-dom';

function CartDrawer({ cart, cartOpen, onToggleCart, onRemoveFromCart, onChangeQuantity, formatPrice }) {
    const navigate = useNavigate();
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        onToggleCart();
        navigate('/checkout');
    };

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
                                    <input
                                        type="number"
                                        className="cart-item__input"
                                        min="1"
                                        max="999"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value, 10);
                                            if (!isNaN(val) && val > 0) {
                                                if (val > 999) val = 999;
                                                onChangeQuantity(item.id, val - item.quantity);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <button type="button" onClick={() => item.quantity < 999 && onChangeQuantity(item.id, 1)}>
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
                <button type="button" className="button button--primary" disabled={cart.length === 0} onClick={handleCheckout}>
                    Comprar
                </button>
            </div>
        </aside>
    );
}

export default CartDrawer;