import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutPage({ cart, formatPrice, placeOrder }) {
    const navigate = useNavigate();
    const [address, setAddress] = useState({ cep: '', street: '', number: '', complement: '', city: '', state: '' });
    const [payment, setPayment] = useState('credit_card');
    const [creditCard, setCreditCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [submitted, setSubmitted] = useState(false);

    // Formatação automática (Masks)
    const handleCepChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2');
        setAddress({ ...address, cep: val.slice(0, 9) });
    };

    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCreditCard({ ...creditCard, number: val.slice(0, 19) });
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) val = val.replace(/^(\d{2})(\d)/, '$1/$2');
        setCreditCard({ ...creditCard, expiry: val.slice(0, 5) });
    };

    const handleCvcChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        setCreditCard({ ...creditCard, cvc: val.slice(0, 3) });
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);
        setTimeout(() => {
            placeOrder({ address, payment });
            navigate('/orders');
        }, 1500);
    };

    if (cart.length === 0 && !submitted) {
        return (
            <div className="checkout-page__empty">
                <div className="empty-state-icon">🛒</div>
                <h2>Seu carrinho está vazio</h2>
                <p>Adicione alguns produtos incríveis antes de finalizar.</p>
                <button type="button" className="button button--primary" onClick={() => navigate('/')}>
                    Continuar Comprando
                </button>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="checkout-page__loading">
                <div className="premium-spinner"></div>
                <h2>Processando Pagamento</h2>
                <p>Por favor, não feche ou recarregue esta página.</p>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <h2>Finalizar Pedido</h2>
                <p>Quase lá! Preencha os dados abaixo para receber sua compra.</p>
            </div>

            <div className="checkout-grid">
                <div className="checkout-form-container">
                    <form id="checkout-form" onSubmit={handleSubmit}>

                        {/* ENDEREÇO */}
                        <div className="premium-card">
                            <div className="premium-card-header">
                                <span className="step-number">1</span>
                                <h3>Endereço de Entrega</h3>
                            </div>
                            <div className="premium-card-body">
                                <div className="input-group-seamless">
                                    <div className="input-row">
                                        <input type="text" required placeholder="CEP (00000-000)" value={address.cep} onChange={handleCepChange} />
                                    </div>
                                    <div className="input-row split-row">
                                        <input type="text" required placeholder="Endereço (Rua, Avenida...)" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} style={{ flex: 2 }} />
                                        <input type="text" required placeholder="Número" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} style={{ flex: 1 }} />
                                    </div>
                                    <div className="input-row split-row">
                                        <input type="text" placeholder="Complemento (Opcional)" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} style={{ flex: 1 }} />
                                    </div>
                                    <div className="input-row split-row">
                                        <input type="text" required placeholder="Cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} style={{ flex: 2 }} />
                                        <input type="text" required placeholder="Estado (UF)" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} style={{ flex: 1 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAGAMENTO */}
                        <div className="premium-card">
                            <div className="premium-card-header">
                                <span className="step-number">2</span>
                                <h3>Forma de Pagamento</h3>
                            </div>
                            <div className="premium-card-body">
                                <div className="payment-selector">
                                    <label className={`payment-method ${payment === 'credit_card' ? 'selected' : ''}`}>
                                        <input type="radio" name="payment" value="credit_card" checked={payment === 'credit_card'} onChange={(e) => setPayment(e.target.value)} />
                                        <div className="method-icon">💳</div>
                                        <span>Cartão</span>
                                    </label>
                                    <label className={`payment-method ${payment === 'pix' ? 'selected' : ''}`}>
                                        <input type="radio" name="payment" value="pix" checked={payment === 'pix'} onChange={(e) => setPayment(e.target.value)} />
                                        <div className="method-icon">💠</div>
                                        <span>Pix</span>
                                    </label>
                                    <label className={`payment-method ${payment === 'boleto' ? 'selected' : ''}`}>
                                        <input type="radio" name="payment" value="boleto" checked={payment === 'boleto'} onChange={(e) => setPayment(e.target.value)} />
                                        <div className="method-icon">📄</div>
                                        <span>Boleto</span>
                                    </label>
                                </div>

                                {payment === 'credit_card' && (
                                    <div className="input-group-seamless mt-4 animated-slide-down">
                                        <div className="input-row">
                                            <input type="text" required placeholder="Número do Cartão" value={creditCard.number} onChange={handleCardNumberChange} />
                                        </div>
                                        <div className="input-row split-row">
                                            <input type="text" required placeholder="Validade (MM/AA)" value={creditCard.expiry} onChange={handleExpiryChange} />
                                            <input type="text" required placeholder="CVC" value={creditCard.cvc} onChange={handleCvcChange} />
                                        </div>
                                        <div className="input-row">
                                            <input type="text" required placeholder="Nome impresso no cartão" value={creditCard.name} onChange={(e) => setCreditCard({ ...creditCard, name: e.target.value.toUpperCase() })} />
                                        </div>
                                    </div>
                                )}

                                {payment === 'pix' && (
                                    <div className="payment-alert animated-slide-down">
                                        <strong>Pagamento Instantâneo via Pix</strong>
                                        <p>O QR Code será gerado na próxima tela para você escanear pelo aplicativo do seu banco.</p>
                                    </div>
                                )}

                                {payment === 'boleto' && (
                                    <div className="payment-alert animated-slide-down">
                                        <strong>Boleto Bancário</strong>
                                        <p>O boleto será enviado para seu e-mail e pode levar até 3 dias úteis para ser compensado.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botão visível apenas em telas menores para ficar no fluxo final do mobile, telas grandes usam o do sidebar */}
                        <div className="mobile-submit-only">
                            <button type="submit" form="checkout-form" className="button button--primary button--huge w-100">
                                Pagar {formatPrice(cartTotal)}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RESUMO DO PEDIDO */}
                <aside className="checkout-sidebar">
                    <div className="premium-summary-card">
                        <h3>Resumo do Pedido</h3>

                        <div className="summary-item-list">
                            {cart.map(item => (
                                <div key={item.id} className="summary-line-item">
                                    <div className="summary-item-badge">{item.quantity}</div>
                                    <div className="summary-item-desc">
                                        <span className="name">{item.title}</span>
                                        <span className="price">{formatPrice(item.price)}</span>
                                    </div>
                                    <strong className="summary-item-total">{formatPrice(item.price * item.quantity)}</strong>
                                </div>
                            ))}
                        </div>

                        <div className="summary-calculations">
                            <div className="calc-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="calc-row">
                                <span>Frete</span>
                                <span className="free-shipping">Grátis</span>
                            </div>
                        </div>

                        <div className="summary-grand-total">
                            <span>Total a Pagar</span>
                            <strong>{formatPrice(cartTotal)}</strong>
                        </div>

                        <button type="submit" form="checkout-form" className="button button--primary button--huge w-100 desktop-submit-only">
                            Confirmar Pagamento
                        </button>

                        <div className="secure-badge">
                            🔒 Pagamento seguro e criptografado
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default CheckoutPage;
