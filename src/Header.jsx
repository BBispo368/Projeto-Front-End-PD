import React from 'react';

function Header({ theme, cartCount, onToggleTheme, onToggleCart }) {
    return (
        <header className="topbar">
            <div>
                <span className="brand-badge">Catálogo</span>
                <h1>Portal de Compras Simples</h1>
                <p>Descubra produtos reais e gerencie seu carrinho em uma única página.</p>
            </div>
            <div className="topbar__actions">
                <button type="button" className="button button--ghost topbar__theme" onClick={onToggleTheme} aria-label="Mudar tema">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button type="button" className="button button--ghost topbar__cart" onClick={onToggleCart} aria-label="Abrir carrinho">
                    🛒 <span className="badge">{cartCount}</span>
                </button>
            </div>
        </header>
    );
}

export default Header;