
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useCatalog } from './hooks/useCatalog.js';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import ProductList from './components/ProductList.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import LoadingOverlay from './components/LoadingOverlay.jsx';
import Alert from './components/Alert.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrdersHistoryPage from './pages/OrdersHistoryPage.jsx';

function App() {
    const { state, toggleTheme, toggleCart, handleSearch, handleCategory, addToCart, removeFromCart, changeQuantity, formatPrice, placeOrder } = useCatalog();
    const navigate = useNavigate();

    const handleShowDetails = (productId) => navigate(`/product/${productId}`);

    const visibleProducts = state.products.filter((product) => {
        const matchesCategory = state.filteredCategory === 'all' || product.category === state.filteredCategory;
        const matchesSearch = product.title.toLowerCase().includes(state.searchTerm.toLowerCase().trim());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={`page-shell ${state.cartOpen ? 'page-shell--cart-open' : ''}`}>
            <Header
                theme={state.theme}
                cartCount={state.cart.reduce((sum, item) => sum + item.quantity, 0)}
                onToggleTheme={toggleTheme}
                onToggleCart={toggleCart}
            />

            <Routes>
                <Route
                    path="/"
                    element={
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
                                products={visibleProducts}
                                onAddToCart={addToCart}
                                formatPrice={formatPrice}
                                onShowDetails={handleShowDetails}
                            />
                        </>
                    }
                />
                <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} formatPrice={formatPrice} />} />
                <Route path="/checkout" element={<CheckoutPage cart={state.cart} formatPrice={formatPrice} placeOrder={placeOrder} />} />
                <Route path="/orders" element={<OrdersHistoryPage orders={state.orders} formatPrice={formatPrice} />} />
            </Routes>

            <CartDrawer cart={state.cart} cartOpen={state.cartOpen} onToggleCart={toggleCart} onRemoveFromCart={removeFromCart} onChangeQuantity={changeQuantity} formatPrice={formatPrice} />
            {state.loading && <LoadingOverlay />}
        </div>
    );
}

export default App;
