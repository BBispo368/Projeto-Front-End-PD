const API_BASE = 'https://fakestoreapi.com';

// estado global do app, tudo que ele precisa para renderizar e reagir
const state = {
  products: [], // lista de produtos vinda da api
  categories: [], // categorias disponiveis para filtro
  filteredCategory: 'all', // categoria selecionada no filtro
  searchTerm: '', // termo digitado na busca
  cart: loadCart(), // carrinho carregado do localStorage
  loading: true, // indicador de carregamento
  error: '', // mensagem de erro, se ocorrer
  selectedProduct: null, // produto aberto no modal de detalhes
  cartOpen: false, // se o carrinho lateral esta aberto
  theme: loadTheme(), // tema atual salvo no navegador
};

const dom = {
  app: document.getElementById('app'), // principal container da aplicaçao
};

let searchTimeout = null; // controle do debounce da pesquisa

// carrega o carrinho do localStorage, se existir
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('catalog-cart')) || [];
  } catch {
    return [];
  }
}

// carrega o tema salvo, padrao claro quando nao existe nada salvo
function loadTheme() {
  const storedTheme = localStorage.getItem('catalog-theme');
  return storedTheme === 'dark' ? 'dark' : 'light';
}

// salva o carrinho sempre que muda algo nele
function saveCart() {
  localStorage.setItem('catalog-cart', JSON.stringify(state.cart));
}

// salva o tema atual para manter na proxima visita
function saveTheme() {
  localStorage.setItem('catalog-theme', state.theme);
}

// aplica o tema no elemento html para o css usar as variaveis corretas
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
}

// alterna o tema claro / escuro
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveTheme();
  render();
}

// formata numero para preço em reais
function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function setLoading(value) {
  state.loading = value;
  render();
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar dados da API');
  }
  return response.json();
}

async function init() {
  try {
    setLoading(true);
    const [products, categories] = await Promise.all([
      fetchJson('/products'),
      fetchJson('/products/categories'),
    ]);
    state.products = products;
    state.categories = ['all', ...categories];
    state.error = '';
  } catch (error) {
    state.error = error.message || 'Não foi possível carregar os produtos.';
  } finally {
    setLoading(false);
  }
}

// filtra os produtos que vao aparecer na grade, usando categoria e busca
function getVisibleProducts() {
  const filterText = state.searchTerm.trim().toLowerCase();
  return state.products.filter((product) => {
    const matchesCategory = state.filteredCategory === 'all' || product.category === state.filteredCategory;
    const matchesSearch = product.title.toLowerCase().includes(filterText);
    return matchesCategory && matchesSearch;
  });
}

// calcula quantos itens existem no carrinho para mostrar no badge
function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

// calcula o total do carrinho somando preco x quantidade
function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// adiciona um produto ao carrinho ou aumenta a quantidade se ja existir
function addToCart(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const cartItem = state.cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }
  saveCart();
  render();
}

// remove o item inteiro do carrinho
function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveCart();
  render();
}

function changeQuantity(productId, delta) {
  const item = state.cart.find((row) => row.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  render();
}

function toggleCart() {
  state.cartOpen = !state.cartOpen;
  render();
}

function openProductDetails(productId) {
  state.selectedProduct = state.products.find((product) => product.id === productId) || null;
  render();
}

// fecha o modal de produto
function closeProductDetails() {
  state.selectedProduct = null;
  render();
}

function handleSearch(value) {
  state.searchTerm = value;
  render();
}

function handleCategory(category) {
  state.filteredCategory = category;
  render();
}

// monta a grade de produtos em html, usando os produtos filtrados
function createProductGrid() {
  const visibleProducts = getVisibleProducts();
  if (visibleProducts.length === 0) {
    return `<div class="empty-state">Nenhum produto encontrado para essa busca.</div>`;
  }

  return visibleProducts
    .map(
      (product) => `
      <article class="product-card">
        <button type="button" class="product-card__media" data-action="show-details" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.title}" loading="lazy" />
        </button>
        <div class="product-card__body">
          <button type="button" class="product-card__title" data-action="show-details" data-product-id="${product.id}">${product.title}</button>
          <div class="product-card__price">${formatPrice(product.price)}</div>
          <button type="button" class="button button--secondary button--icon" data-action="add-to-cart" data-product-id="${product.id}" aria-label="Adicionar ao carrinho">➕</button>
        </div>
      </article>
    `
    )
    .join('');
}

// monta os botoes de filtro de categoria
function createCategoryButtons() {
  return state.categories
    .map(
      (category) => `
      <button type="button" class="category-pill ${state.filteredCategory === category ? 'category-pill--active' : ''}" data-action="filter-category" data-category="${category}">
        ${category === 'all' ? 'Todas' : category}
      </button>
    `
    )
    .join('');
}

// monta o conteudo do carrinho lateral com os itens e os controles
function createCartContent() {
  if (state.cart.length === 0) {
    return `<div class="cart-empty">Seu carrinho ainda está vazio.</div>`;
  }

  return state.cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" />
        <div class="cart-item__info">
          <strong>${item.title}</strong>
          <span>${formatPrice(item.price)}</span>
          <div class="cart-item__quantity">
            <button type="button" data-action="change-quantity" data-product-id="${item.id}" data-delta="-1">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="change-quantity" data-product-id="${item.id}" data-delta="1">+</button>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-action="remove-from-cart" data-product-id="${item.id}">×</button>
      </div>
    `
    )
    .join('');
}

// monta o modal de detalhe do produto quando o usuario clica na imagem ou no titulo
function createProductDetailModal() {
  if (!state.selectedProduct) return '';

  return `
    <div class="modal-overlay" data-action="close-details">
      <div class="modal-card" data-action="stop-close">
        <button type="button" class="modal-close" data-action="close-details">×</button>
        <img src="${state.selectedProduct.image}" alt="${state.selectedProduct.title}" />
        <div class="modal-content">
          <span class="tag">${state.selectedProduct.category}</span>
          <h2>${state.selectedProduct.title}</h2>
          <p>${state.selectedProduct.description}</p>
          <div class="modal-footer">
            <div class="modal-price">${formatPrice(state.selectedProduct.price)}</div>
            <button type="button" class="button button--primary button--icon" data-action="add-to-cart" data-product-id="${state.selectedProduct.id}" aria-label="Adicionar ao carrinho">➕</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// renderiza toda a pagina dinamicamente a cada mudanca de estado
function render() {
  const productsHtml = createProductGrid();
  const categoriesHtml = createCategoryButtons();
  const cartHtml = createCartContent();
  const detailHtml = createProductDetailModal();

  applyTheme();
  dom.app.innerHTML = `
    <div class="page-shell ${state.cartOpen ? 'page-shell--cart-open' : ''}">
      <header class="topbar">
        <div>
          <span class="brand-badge">Catálogo</span>
          <h1>Portal de Compras Simples</h1>
          <p>Descubra produtos reais e gerencie seu carrinho em uma única página.</p>
        </div>
          <div class="topbar__actions">
          <button type="button" class="button button--ghost topbar__theme" data-action="toggle-theme" aria-label="Mudar tema">
            ${state.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button type="button" class="button button--ghost topbar__cart" data-action="toggle-cart" aria-label="Abrir carrinho">
            🛒 <span class="badge">${cartCount()}</span>
          </button>
        </div>
      </header>

      <section class="panel panel--hero">
        <div>
          <h2>Bem-vindo ao catálogo</h2>
          <p>Filtre por categoria, pesquise produtos e finalize suas compras com persistência no navegador.</p>
        </div>
      </section>

      <section class="toolbar">
        <input id="search-input" class="search-input" type="search" placeholder="Buscar produtos..." value="${state.searchTerm}" />
        <div class="category-list">${categoriesHtml}</div>
      </section>

      ${state.error ? `<div class="alert">${state.error}</div>` : ''}

      <section class="product-grid">${productsHtml}</section>

      <aside class="cart-drawer ${state.cartOpen ? 'cart-drawer--open' : ''}">
        <div class="cart-header">
          <h2>Seu carrinho</h2>
          <button type="button" class="button button--ghost button--icon" data-action="toggle-cart" aria-label="Fechar carrinho">×</button>
        </div>
        <div class="cart-body">${cartHtml}</div>
        <div class="cart-footer">
          <div>
            <span>Total</span>
            <strong>${formatPrice(cartTotal())}</strong>
          </div>
          <button type="button" class="button button--primary" ${state.cart.length === 0 ? 'disabled' : ''}>Comprar</button>
        </div>
      </aside>

      ${detailHtml}

      ${state.loading ? '<div class="loading-overlay"><span>Carregando produtos...</span></div>' : ''}
    </div>
  `;

  bindEvents();
}

// vincula os eventos de clique e de busca depois que o html eh renderizado
function bindEvents() {
  dom.app.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const action = event.currentTarget.dataset.action;
      const productId = Number(event.currentTarget.dataset.productId);
      const category = event.currentTarget.dataset.category;
      const delta = Number(event.currentTarget.dataset.delta);

      if (action === 'toggle-cart') {
        toggleCart();
      }

      if (action === 'toggle-theme') {
        toggleTheme();
      }

      if (action === 'show-details') {
        openProductDetails(productId);
      }

      if (action === 'add-to-cart') {
        addToCart(productId);
      }

      if (action === 'remove-from-cart') {
        removeFromCart(productId);
      }

      if (action === 'change-quantity') {
        changeQuantity(productId, delta);
      }

      if (action === 'close-details') {
        closeProductDetails();
      }

      if (action === 'stop-close') {
        event.stopPropagation();
      }

      if (action === 'filter-category') {
        handleCategory(category);
      }
    });
  });

  const searchInput = dom.app.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      clearTimeout(searchTimeout);
      const value = event.target.value;
      searchTimeout = setTimeout(() => handleSearch(value), 250);
    });
  }
}

init();
render();
