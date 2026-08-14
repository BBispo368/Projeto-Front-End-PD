import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCatalog } from './hooks/useCatalog';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import LoadingOverlay from './components/LoadingOverlay';
import Alert from './components/Alert';
import ProductDetailPage from './pages/ProductDetailPage'; // Importa a nova página

function App() {
    const { state, toggleTheme, toggleCart, handleSearch, handleCategory, addToCart, removeFromCart, changeQuantity, formatPrice } = useCatalog();

    return (
        <BrowserRouter>
            <div className={`page-shell ${state.cartOpen ? 'page-shell--cart-open' : ''}`}>
                <Header
                    theme={state.theme}
                    cartCount={state.cart.reduce((sum, item) => sum + item.quantity, 0)}
                    onToggleTheme={toggleTheme}
                    onToggleCart={toggleCart}
                />

                <Routes>
                    <Route path="/" element={
                        <>
                            <section className="panel panel--hero">
                                <div>
                                    <h2>Bem-vindo ao catálogo</h2>
                                    <p>Filtre por categoria, pesquise produtos e finalize suas compras com persistência no navegador.</p>
                                </div>
                            </section>

                            <section className="toolbar">
                                <SearchBar searchTerm={state.searchTerm} onSearch={handleSearch} />
                                <CategoryFilter
                                    categories={state.categories}
                                    filteredCategory={state.filteredCategory}
                                    onSelectCategory={handleCategory}
                                />
                            </section>

                            {state.error && <Alert message={state.error} />}

                            <ProductList
                                products={state.products}
                                onAddToCart={addToCart}
                                formatPrice={formatPrice}
                            />
                        </>
                    } />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>

                <CartDrawer cart={state.cart} cartOpen={state.cartOpen} onToggleCart={toggleCart} onRemoveFromCart={removeFromCart} onChangeQuantity={changeQuantity} formatPrice={formatPrice} />
                {state.loading && <LoadingOverlay />}
            </div>
        </BrowserRouter>
    );
}

export default App;