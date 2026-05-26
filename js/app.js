
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 VELORE загружен!');
    
    // Инициализация
    initPreloader();
    initHeader();
    initHero();
    initMarquee();
    initCatalog();
    initAbout();
    initFeatures();
    initPromo();
    initNewsletter();
    initFooter();
    initModals();
    initEventListeners();
    
    // Рендер контента
    renderProducts();
    startCountdown();
});

// ===== ПРЕЛОАДЕР =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 1500);
    }
}

// ===== HEADER =====
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== HERO =====
function initHero() {
    // Hero уже создан в HTML через JS, анимации через CSS
}

// ===== MARQUEE =====
function initMarquee() {
    // Бегущая строка работает через CSS-анимацию
}

// ===== КАТАЛОГ =====
function initCatalog() {
    // Фильтры обрабатываются в initEventListeners
}

function renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    let filtered = filter === 'sale' 
        ? products.filter(p => p.oldPrice) 
        : filter === 'all' 
            ? products 
            : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map((p, i) => `
        <div class="product-card" data-id="${p.id}" data-selected-color="0" style="transition-delay: ${i * 0.05}s">
            <div class="product-image" onclick="openProductModal(${p.id})">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badgeText}</span>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn ${favorites.some(f => f.id === p.id) ? 'liked' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${p.id}, this)" title="В избранное">♡</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc.substring(0, 50)}...</div>
                <div class="product-bottom">
                    <div class="product-price">
                        ${p.price.toLocaleString('ru')} ₽ 
                        ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString('ru')} ₽</span>` : ''}
                    </div>
                    <div class="product-colors">
                        ${p.colors.map((c, ci) => 
                            `<div class="color-dot ${ci === 0 ? 'active' : ''}" 
                                 style="background:${c}" 
                                 data-color="${c}" 
                                 data-index="${ci}"
                                 onclick="event.stopPropagation(); selectColor(this, ${p.id})"
                                 title="${getColorName(c)}"></div>`
                        ).join('')}
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id}, this)">
                    🛒 В корзину
                </button>
            </div>
        </div>
    `).join('');
    
    // Анимация появления карточек
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), index * 50);
        });
    }, 100);
}

function selectColor(dotEl, productId) {
    const card = dotEl.closest('.product-card');
    if (!card) return;
    
    // Убираем active у всех цветов
    card.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    // Добавляем active к выбранному
    dotEl.classList.add('active');
    
    // Меняем изображение
    const colorIndex = parseInt(dotEl.dataset.index);
    const product = products.find(p => p.id === productId);
    if (product && product.images?.[colorIndex]) {
        const img = card.querySelector('img');
        if (img) {
            img.style.opacity = '0.7';
            setTimeout(() => {
                img.src = product.images[colorIndex];
                img.style.opacity = '1';
            }, 150);
        }
    }
    
    // Сохраняем выбранный цвет в data-атрибут
    card.dataset.selectedColor = colorIndex;
}

// ===== О СЕКЦИИ =====
function initAbout() {
    // Статичный контент
}

// ===== ПРЕИМУЩЕСТВА =====
function initFeatures() {
    // Статичный контент
}

// ===== ПРОМО БАННЕР =====
function initPromo() {
    // Таймер запускается отдельно
}

function startCountdown() {
    // Устанавливаем дату окончания: +2 дня, +14 часов от сейчас
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);
    endDate.setHours(endDate.getHours() + 14);
    
    function update() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '00';
            });
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.textContent = [days, hours, minutes, seconds][i].toString().padStart(2, '0');
        });
    }
    
    update();
    setInterval(update, 1000);
}

// ===== NEWSLETTER =====
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                showToast('✅ Вы подписаны! Скидка 15% активирована.');
                form.reset();
            }
        });
    }
}

// ===== FOOTER =====
function initFooter() {
    // Кнопки копирования
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.replace(/[📞📧📍]/g, '').trim();
            navigator.clipboard.writeText(text).then(() => {
                const original = this.innerHTML;
                this.classList.add('copied');
                this.innerHTML = '✓ Скопировано!';
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.innerHTML = original;
                }, 2000);
            });
        });
    });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initModals() {
    // Создаём базовую структуру модальных окон, если их нет в DOM
    createModalStructure();
}

function createModalStructure() {
    // Корзина
    if (!document.getElementById('cartPanel')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="cart-overlay" id="cartOverlay"></div>
            <div class="side-panel" id="cartPanel">
                <div class="panel-header">
                    <h3>Корзина (<span id="cartItemsCount">0</span>)</h3>
                    <button class="panel-close" onclick="closeAllModals()">✕</button>
                </div>
                <div class="panel-items" id="cartItems"></div>
                <div class="panel-footer" id="cartFooter" style="display:none;">
                    <div class="cart-total"><span>Итого:</span><strong id="cartTotal">0 ₽</strong></div>
                    <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
                </div>
            </div>
            <div class="side-panel" id="favPanel">
                <div class="panel-header">
                    <h3>Избранное (<span id="favItemsCount">0</span>)</h3>
                    <button class="panel-close" onclick="closeAllModals()">✕</button>
                </div>
                <div class="panel-items" id="favItems"></div>
            </div>
            <div class="modal-overlay" id="productModal" onclick="if(event.target===this)closeAllModals()">
                <button class="modal-close" onclick="closeAllModals()">✕</button>
                <div class="product-modal" id="productModalContent"></div>
            </div>
            <div class="modal-overlay" id="infoModal" onclick="if(event.target===this)closeAllModals()">
                <div class="info-modal" id="infoModalContent"></div>
            </div>
            <div class="modal-overlay" id="mapModal" onclick="if(event.target===this)closeAllModals()">
                <div class="map-modal-content">
                    <button class="map-close" onclick="closeAllModals()">✕</button>
                    <img class="map-image" src="https://i.oneme.ru/i?r=BTE2sh_eZW7g8kugOdIm2NotuDpJwT07ectMLpxOTWGXT2UQGk9StaSO2uPk4tWwj40" alt="Карта">
                    <div class="map-info">
                        <h3>Наш магазин</h3>
                        <p>📍 г. Новороссийск, ул. Революции 1905г, д.25</p>
                        <p>🕒 Пн-Вс: 10:00–22:00</p>
                    </div>
                </div>
            </div>
            <div class="modal-overlay" id="accountModal" onclick="if(event.target===this)closeAllModals()">
                <div class="auth-modal">
                    <div class="auth-header">
                        <button class="modal-close" onclick="closeAllModals()">✕</button>
                        <div class="auth-logo">VELORE</div>
                        <p>Войдите или создайте аккаунт</p>
                    </div>
                    <div class="auth-body">
                        <div class="auth-tabs">
                            <button class="auth-tab active" onclick="switchAuth('login')">Вход</button>
                            <button class="auth-tab" onclick="switchAuth('register')">Регистрация</button>
                        </div>
                        <form id="loginForm" class="auth-form" onsubmit="handleAuth(event,'login')">
                            <div class="input-group"><input type="email" placeholder="Email" required></div>
                            <div class="input-group">
                                <input type="password" placeholder="Пароль" id="loginPw" required>
                                <button type="button" class="toggle-pw" onclick="togglePassword('loginPw',this)">👁</button>
                            </div>
                            <button type="submit" class="btn-submit">Войти</button>
                        </form>
                        <form id="registerForm" class="auth-form" style="display:none;" onsubmit="handleAuth(event,'register')">
                            <div class="input-group"><input type="text" placeholder="Имя" required></div>
                            <div class="input-group"><input type="email" placeholder="Email" required></div>
                            <div class="input-group">
                                <input type="password" placeholder="Пароль" id="regPw1" required>
                                <button type="button" class="toggle-pw" onclick="togglePassword('regPw1',this)">👁</button>
                            </div>
                            <div class="input-group">
                                <input type="password" placeholder="Повторите пароль" id="regPw2" required>
                                <button type="button" class="toggle-pw" onclick="togglePassword('regPw2',this)">👁</button>
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" id="agreeTerms" required>
                                <label for="agreeTerms">Я принимаю <a href="#" onclick="event.preventDefault();openInfoModal('terms')">соглашение</a></label>
                            </div>
                            <button type="submit" class="btn-submit">Зарегистрироваться</button>
                        </form>
                        <div class="divider"><span>или</span></div>
                        <div class="social-auth-title">Зайти с помощью</div>
                        <div class="social-buttons">
                            <button class="social-btn" onclick="socialAuth('Google')">Google</button>
                            <button class="social-btn" onclick="socialAuth('Яндекс')">Яндекс</button>
                        </div>
                        <a class="guest-link" onclick="handleGuestAuth()">Продолжить как гость →</a>
                    </div>
                </div>
            </div>
        `);
    }
}

// ===== СОБЫТИЯ =====
function initEventListeners() {
    // Фильтры каталога
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProducts(tab.dataset.filter);
        });
    });
    
    // Кнопки хедера
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('favBtn')?.addEventListener('click', openFavorites);
    document.getElementById('accountBtn')?.addEventListener('click', openAuthModal);
    
    // Закрытие по клику на оверлей
    document.getElementById('cartOverlay')?.addEventListener('click', closeAllModals);
    
    // ESC для закрытия
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
    
    // Скролл-индикатор
    document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
}

// ===== КОРЗИНА =====
function addToCart(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const card = btn.closest('.product-card');
    const colorIndex = card ? parseInt(card.dataset.selectedColor) || 0 : 0;
    const colorHex = product.colors[colorIndex];
    const colorName = getColorName(colorHex);
    const size = product.sizes[0] || 'One Size';
    
    // Проверяем, есть ли уже такой товар с таким цветом и размером
    const existing = cart.find(item => 
        item.id === id && item.colorIndex === colorIndex && item.size === size
    );
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            ...product,
            qty: 1,
            colorIndex,
            colorHex,
            colorName,
            size
        });
    }
    
    // Визуальный фидбек
    const originalText = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '✓ Добавлено';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalText;
    }, 1500);
    
    updateCartUI();
    showToast(`${product.name} (${colorName}) в корзине`);
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    // Обновляем счётчики
    updateCartCount();
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="panel-empty"><div class="empty-icon">🛒</div><p>Ваша корзина пуста</p></div>';
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    
    if (cartFooter) cartFooter.style.display = 'block';
    
    // Считаем сумму
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (cartTotal) cartTotal.textContent = total.toLocaleString('ru') + ' ₽';
    
    // Рендерим товары
    cartItems.innerHTML = cart.map(item => {
        const colorDot = `<span class="color-dot-small" style="background:${item.colorHex}"></span>`;
        return `
        <div class="panel-item">
            <div class="panel-item-image"><img src="${item.image}"></div>
            <div class="panel-item-info">
                <div class="item-brand">${item.brand}</div>
                <h4>${item.name}</h4>
                <div class="item-meta">
                    <span class="color-badge">${colorDot} ${item.colorName}</span>
                    <span class="size-badge">Размер: ${item.size}</span>
                </div>
                <div class="item-price">${(item.price * item.qty).toLocaleString('ru')} ₽</div>
                <div class="quantity-control">
                    <button onclick="changeQty(${item.id},${item.colorIndex},'${item.size}',-1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id},${item.colorIndex},'${item.size}',1)">+</button>
                </div>
            </div>
            <button class="item-remove" onclick="removeFromCart(${item.id},${item.colorIndex},'${item.size}')">✕</button>
        </div>`;
    }).join('');
}

function changeQty(id, colorIndex, size, delta) {
    const item = cart.find(i => i.id === id && i.colorIndex === colorIndex && i.size === size);
    if (!item) return;
    
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id, colorIndex, size);
    } else {
        updateCartUI();
    }
}

function removeFromCart(id, colorIndex, size) {
    cart = cart.filter(item => !(item.id === id && item.colorIndex === colorIndex && item.size === size));
    updateCartUI();
    showToast('Удалено из корзины');
}

function checkout() {
    showToast('🎉 Заказ оформлен! Менеджер свяжется с вами.');
    cart = [];
    updateCartUI();
    closeAllModals();
}

function openCart() {
    updateCartUI();
    document.getElementById('cartPanel')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// ===== ИЗБРАННОЕ =====
function toggleFavorite(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const card = btn.closest('.product-card');
    const colorIndex = card ? parseInt(card.dataset.selectedColor) || 0 : 0;
    const colorHex = product.colors[colorIndex];
    const colorName = getColorName(colorHex);
    const size = product.sizes[0] || 'One Size';
    
    const existingIndex = favorites.findIndex(f => 
        f.id === id && f.colorIndex === colorIndex && f.size === size
    );
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        btn.classList.remove('liked');
        btn.textContent = '♡';
        showToast('Удалено из избранного');
    } else {
        favorites.push({ ...product, colorIndex, colorHex, colorName, size });
        btn.classList.add('liked');
        btn.textContent = '❤';
        showToast('Добавлено в избранное');
    }
    
    updateFavoritesUI();
}

function updateFavoritesUI() {
    const favItems = document.getElementById('favItems');
    updateFavCount();
    
    if (!favItems) return;
    
    if (favorites.length === 0) {
        favItems.innerHTML = '<div class="panel-empty"><div class="empty-icon">♡</div><p>Список избранного пуст</p></div>';
        return;
    }
    
    favItems.innerHTML = favorites.map(f => {
        const colorDot = `<span class="color-dot-small" style="background:${f.colorHex}"></span>`;
        return `
        <div class="panel-item" onclick="openProductModal(${f.id}); closeAllModals();" style="cursor:pointer;">
            <div class="panel-item-image"><img src="${f.image}"></div>
            <div class="panel-item-info">
                <div class="item-brand">${f.brand}</div>
                <h4>${f.name}</h4>
                <div class="item-meta">
                    <span class="color-badge">${colorDot} ${f.colorName}</span>
                    <span class="size-badge">Размер: ${f.size}</span>
                </div>
                <div class="item-price">${f.price.toLocaleString('ru')} ₽</div>
            </div>
            <button class="item-remove" onclick="event.stopPropagation(); removeFav(${f.id},${f.colorIndex},'${f.size}')">✕</button>
        </div>`;
    }).join('');
}

function removeFav(id, colorIndex, size) {
    favorites = favorites.filter(f => !(f.id === id && f.colorIndex === colorIndex && f.size === size));
    updateFavoritesUI();
    showToast('Удалено из избранного');
}

function openFavorites() {
    updateFavoritesUI();
    document.getElementById('favPanel')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// ===== МОДАЛКА ТОВАРА =====
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const modalContent = document.getElementById('productModalContent');
    if (!modalContent) return;
    
    const firstSize = product.sizes[0] || 'One Size';
    
    modalContent.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" id="modalImg" alt="${product.name}">
        </div>
        <div class="modal-content" data-selected-color="0" data-selected-size="${firstSize}">
            <div class="product-brand">${product.brand}</div>
            <h2>${product.name}</h2>
            <div class="modal-price">
                ${product.price.toLocaleString('ru')} ₽ 
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString('ru')} ₽</span>` : ''}
            </div>
            <p class="modal-desc">${product.desc}</p>
            
            <div class="modal-section">
                <h4>Размеры</h4>
                <div class="modal-sizes">
                    ${product.sizes.map((s, i) => 
                        `<button class="size-btn ${i === 0 ? 'active' : ''}" onclick="selectModalSize(this)">${s}</button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="modal-section">
                <h4>Цвета</h4>
                <div class="modal-colors">
                    ${product.colors.map((c, i) => 
                        `<div class="modal-color-dot ${i === 0 ? 'active' : ''}" 
                             style="background:${c}" 
                             data-color="${c}" 
                             data-index="${i}"
                             onclick="selectModalColor(this, ${product.id})"
                             title="${getColorName(c)}"></div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="modal-section">
                <h4>Отзывы (${product.reviews.length})</h4>
                <div class="modal-reviews">
                    ${product.reviews.map(r => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="review-name">${r.name}</span>
                                <span class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span>
                            </div>
                            <div class="review-text">${r.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button class="modal-add-btn" onclick="addToCartFromModal(${product.id}, this)">
                🛒 Добавить в корзину — ${product.price.toLocaleString('ru')} ₽
            </button>
        </div>
    `;
    
    document.getElementById('productModal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function selectModalSize(btn) {
    btn.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const modal = document.getElementById('productModalContent');
    if (modal) modal.dataset.selectedSize = btn.textContent;
}

function selectModalColor(dotEl, productId) {
    const modal = document.getElementById('productModalContent');
    if (!modal) return;
    
    // Переключаем active
    modal.querySelectorAll('.modal-color-dot').forEach(d => d.classList.remove('active'));
    dotEl.classList.add('active');
    
    // Меняем изображение
    const colorIndex = parseInt(dotEl.dataset.index);
    const product = products.find(p => p.id === productId);
    if (product?.images?.[colorIndex]) {
        const img = document.getElementById('modalImg');
        if (img) {
            img.style.opacity = '0.7';
            setTimeout(() => {
                img.src = product.images[colorIndex];
                img.style.opacity = '1';
            }, 150);
        }
    }
    
    modal.dataset.selectedColor = colorIndex;
}

function addToCartFromModal(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const modal = document.getElementById('productModalContent');
    const colorIndex = parseInt(modal?.dataset.selectedColor) || 0;
    const colorHex = product.colors[colorIndex];
    const colorName = getColorName(colorHex);
    const size = modal?.dataset.selectedSize || product.sizes[0] || 'One Size';
    
    const existing = cart.find(item => 
        item.id === id && item.colorIndex === colorIndex && item.size === size
    );
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1, colorIndex, colorHex, colorName, size });
    }
    
    const originalText = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '✓ Добавлено';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalText;
    }, 1500);
    
    updateCartUI();
    showToast(`${product.name} (${colorName}, ${size}) в корзине`);
}

// ===== АВТОРИЗАЦИЯ =====
function openAuthModal() {
    document.getElementById('accountModal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function switchAuth(type) {
    document.querySelectorAll('.auth-tab').forEach((tab, i) => {
        tab.classList.toggle('active', (type === 'login' && i === 0) || (type === 'register' && i === 1));
    });
    document.getElementById('loginForm').style.display = type === 'login' ? 'flex' : 'none';
    document.getElementById('registerForm').style.display = type === 'register' ? 'flex' : 'none';
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
        btn.style.color = 'var(--accent)';
    } else {
        input.type = 'password';
        btn.textContent = '👁';
        btn.style.color = '#a8a8a8';
    }
}

function handleAuth(e, type) {
    e.preventDefault();
    
    if (type === 'register') {
        const pw1 = document.getElementById('regPw1')?.value;
        const pw2 = document.getElementById('regPw2')?.value;
        const agree = document.getElementById('agreeTerms')?.checked;
        
        if (pw1 !== pw2) {
            showToast('❌ Пароли не совпадают!');
            return;
        }
        if (!agree) {
            showToast('❌ Примите соглашение');
            return;
        }
        showToast('✅ Аккаунт создан! Добро пожаловать!');
    } else {
        showToast('✅ Вы успешно вошли!');
    }
    
    closeAllModals();
}

function socialAuth(provider) {
    showToast(`🔄 Вход через ${provider}...`);
    setTimeout(() => {
        showToast('✅ Авторизация успешна!');
        closeAllModals();
    }, 1000);
}

function handleGuestAuth() {
    showToast('👤 Вы вошли как гость');
    closeAllModals();
}

// ===== ИНФО-МОДАЛКИ =====
function openInfoModal(type) {
    const data = infoData[type];
    if (!data) return;
    
    const content = document.getElementById('infoModalContent');
    if (!content) return;
    
    content.innerHTML = `
        <button class="modal-close" onclick="closeAllModals()">✕</button>
        <h2>${data.title}</h2>
        ${data.content}
    `;
    
    document.getElementById('infoModal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function openMapModal() {
    document.getElementById('mapModal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML-ОБРАБОТЧИКОВ =====
window.closeAllModals = closeAllModals;
window.openProductModal = openProductModal;
window.openInfoModal = openInfoModal;
window.openMapModal = openMapModal;
window.addToCart = addToCart;
window.toggleFavorite = toggleFavorite;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.removeFav = removeFav;
window.checkout = checkout;
window.switchAuth = switchAuth;
window.togglePassword = togglePassword;
window.handleAuth = handleAuth;
window.socialAuth = socialAuth;
window.handleGuestAuth = handleGuestAuth;
window.selectColor = selectColor;
window.selectModalSize = selectModalSize;
window.selectModalColor = selectModalColor;
window.addToCartFromModal = addToCartFromModal;