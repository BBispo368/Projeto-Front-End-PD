import { useState, useEffect, useRef } from 'react';
import { fetchJson } from '../services/api.js';

export function useCatalog() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('catalog-cart')) || [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('catalog-theme');
        return storedTheme === 'dark' ? 'dark' : 'light';
    });

    const searchTimeoutRef = useRef(null);

    // Apply theme to HTML element
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('catalog-theme', theme);
    }, [theme]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('catalog-cart', JSON.stringify(cart));
    }, [cart]);

    // Initial data fetch
    useEffect(() => {
        async function init() {
            try {
                setLoading(true);
                const [fetchedProducts, fetchedCategories] = await Promise.all([
                    fetchJson('/products'),
                    fetchJson('/products/categories'),
                ]);
                setProducts(fetchedProducts);
                setCategories(['all', ...fetchedCategories]);
                setError('');
            } catch (err) {
                setError(err.message || 'Não foi possível carregar os produtos.');
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const formatPrice = (value) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const getVisibleProducts = () => {
        const filterText = searchTerm.trim().toLowerCase();
        return products.filter((product) => {
            const matchesCategory = filteredCategory === 'all' || product.category === filteredCategory;
            const matchesSearch = product.title.toLowerCase().includes(filterText);
            return matchesCategory && matchesSearch;
        });
    };

    const cartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const cartTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const addToCart = (productId) => {
        const productToAdd = products.find((item) => item.id === productId);
        if (!productToAdd) return;

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productId);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...productToAdd, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const changeQuantity = (productId, delta) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + delta } : item
            );
            return updatedCart.filter((item) => item.quantity > 0);
        });
    };

    const toggleCart = () => setCartOpen((prev) => !prev);

    const openProductDetails = (productId) => {
        setSelectedProduct(products.find((product) => product.id === productId) || null);
    };

    const closeProductDetails = () => setSelectedProduct(null);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleCategory = (category) => setFilteredCategory(category);

    return {
        state: {
            products: getVisibleProducts(), // Pass filtered products to components
            categories,
            filteredCategory,
            searchTerm,
            cart,
            loading,
            error,
            selectedProduct,
            cartOpen,
            theme,
        },
        toggleTheme,
        toggleCart,
        handleSearch,
        handleCategory,
        addToCart,
        removeFromCart,
        changeQuantity,
        openProductDetails,
        closeProductDetails,
        formatPrice,
    };
}