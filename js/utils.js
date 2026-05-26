// 🛠 Вспомогательные функции

// Глобальные состояния
let cart = [];
let favorites = [];

// Создание HTML-элемента
function createElement(tag, className = '', attributes = {}, children = []) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'dataset' && typeof value === 'object') {
            Object.entries(value).forEach(([dk, dv]) => el.dataset[dk] = dv);
        } else {
            el.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            el.appendChild(child);
        }
    });
    return el;
}

// Показать уведомление (toast)
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = createElement('div', 'toast', { id: 'toast' });
        document.body.appendChild(toast);
    }
    toast.textContent = '✓ ' + message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Обновление счётчика корзины
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartCount');
    const itemsCount = document.getElementById('cartItemsCount');
    if (badge) {
        badge.textContent = count;
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
    }
    if (itemsCount) itemsCount.textContent = count;
}

// Обновление счётчика избранного
function updateFavCount() {
    const count = favorites.length;
    const badge = document.getElementById('favCount');
    const itemsCount = document.getElementById('favItemsCount');
    if (badge) badge.textContent = count;
    if (itemsCount) itemsCount.textContent = count;
}

// Закрытие всех модальных окон
function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open, .side-panel.open, .cart-overlay.open').forEach(el => {
        el.classList.remove('open');
    });
    document.body.style.overflow = '';
}

// Экспорт функций для глобального доступа
window.addToCart = addToCart;
window.toggleFavorite = toggleFavorite;
window.openProductModal = openProductModal;
window.showToast = showToast;
window.closeAllModals = closeAllModals;