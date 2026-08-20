import React from 'react';
import { Link } from 'react-router-dom';

function Header({ theme, cartCount, onToggleTheme, onToggleCart }) {
    return (
        <header className="topbar">
            <div>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="brand-badge">Catálogo</span>
                    <h1>Portal de Compras Simples</h1>
                </Link>
                <p>Descubra produtos reais e gerencie seu carrinho em uma única página.</p>
            </div>
            <div className="topbar__actions">
                <button type="button" className="button button--ghost topbar__theme" onClick={onToggleTheme} aria-label="Mudar tema">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <Link to="/orders" className="button button--ghost">
                    📦 Pedidos
                </Link>
                <button type="button" className="button button--ghost topbar__cart" onClick={onToggleCart} aria-label="Abrir carrinho">
                    🛒 <span className="badge">{cartCount}</span>
                </button>
            </div>
        </header>
    );
}

export default Header;