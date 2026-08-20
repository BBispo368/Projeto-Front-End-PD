import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersHistoryPage({ orders, formatPrice }) {
    const navigate = useNavigate();
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);

    const toggleDetails = (orderId) => {
        setExpandedOrderIds(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId) 
                : [...prev, orderId]
        );
    };

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h2>Meus Pedidos</h2>
                <p>Acompanhe o histórico de suas compras</p>
            </div>
            
            {orders.length === 0 ? (
                <div className="checkout-page__empty">
                    <div className="empty-state-icon">📦</div>
                    <h2>Nenhum pedido encontrado</h2>
                    <p>Você ainda não realizou compras em nossa loja.</p>
                    <button type="button" className="button button--primary" onClick={() => navigate('/')}>
                        Ir às Compras
                    </button>
                </div>
            ) : (
                <div className="premium-orders-list">
                    {orders.map((order) => {
                        const isExpanded = expandedOrderIds.includes(order.id);
                        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                        return (
                            <div key={order.id} className={`premium-order-card ${isExpanded ? 'expanded' : ''}`}>
                                <div className="order-card-header" onClick={() => toggleDetails(order.id)}>
                                    <div className="order-info-col">
                                        <span className="order-label">Pedido</span>
                                        <strong>#{order.id.slice(-6)}</strong>
                                    </div>
                                    <div className="order-info-col hide-mobile">
                                        <span className="order-label">Data</span>
                                        <strong>{new Date(order.date).toLocaleDateString('pt-BR')}</strong>
                                    </div>
                                    <div className="order-info-col">
                                        <span className="order-label">Total</span>
                                        <strong>{formatPrice(order.total)}</strong>
                                    </div>
                                    <div className="order-info-col align-right">
                                        <div className="order-status-badge">Confirmado</div>
                                        <span className="expand-hint">{isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}</span>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="order-card-body animated-slide-down">
                                        <div className="order-timeline">
                                            <div className="timeline-step active">Pedido Realizado</div>
                                            <div className="timeline-step active">Pagamento Aprovado</div>
                                            <div className="timeline-step">Preparando Envio</div>
                                        </div>
                                        
                                        <div className="order-items-mini-list">
                                            <h4>Itens do Pedido ({totalItems})</h4>
                                            {order.items.map(item => (
                                                <div key={item.id} className="mini-item-row">
                                                    <div className="mini-item-image">
                                                        <img src={item.image} alt={item.title} />
                                                    </div>
                                                    <div className="mini-item-details">
                                                        <span className="mini-item-title">{item.title}</span>
                                                        <span className="mini-item-qty">Qtd: {item.quantity}</span>
                                                    </div>
                                                    <div className="mini-item-price">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="order-payment-info">
                                            <span>Forma de pagamento utilizada: </span>
                                            <strong>
                                                {order.payment === 'credit_card' ? 'Cartão de Crédito' :
                                                 order.payment === 'pix' ? 'Pix' : 'Boleto Bancário'}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default OrdersHistoryPage;
