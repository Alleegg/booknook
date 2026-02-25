class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateButtonText(savedTheme);
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateButtonText(newTheme);
    }

    updateButtonText(theme) {
        if (this.themeToggle) {
            this.themeToggle.textContent = theme === 'light' ? 'Темная тема' : 'Светлая тема';
        }
    }
}







class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        const clearCartBtn = document.getElementById('clearCartBtn');
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.openCheckoutModal());
        }
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }
    }

    addToCart(book) {
        const existingItem = this.cart.find(item => item.id === book.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...book, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Книга добавлена в корзину');
    }

    removeFromCart(bookId) {
        this.cart = this.cart.filter(item => item.id !== bookId);
        this.saveCart();
        this.updateCartDisplay();
    }

    clearCart() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            if (cartTotal) cartTotal.textContent = '0 ₽';
            if (emptyCartMessage) emptyCartMessage.classList.add('visible');
            return;
        }

        if (emptyCartMessage) emptyCartMessage.classList.remove('visible');

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p class="cart-item-author">${item.author}</p>
                </div>
                <div class="cart-item-quantity">x${item.quantity}</div>
                <div class="cart-item-price">${item.price * item.quantity} ₽</div>
                <button class="cart-item-remove" onclick="cartManager.removeFromCart(${item.id})">×</button>
            </div>
        `).join('');

        if (cartTotal) {
            cartTotal.textContent = `${this.getTotal()} ₽`;
        }
    }

    showNotification(message) {
        alert(message);
    }

    openCheckoutModal() {
        if (this.cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
}









class CatalogManager {
    constructor() {
        this.books = [
            { id: 1, title: 'Властелин колец', author: 'Дж. Р. Р. Толкин', price: 1500, genre: 'fantasy' },
            { id: 2, title: 'Краткая история времени', author: 'Стивен Хокинг', price: 1200, genre: 'science' },
            { id: 3, title: '1984', author: 'Джордж Оруэлл', price: 800, genre: 'fiction' },
            { id: 4, title: 'Гарри Поттер', author: 'Дж. К. Роулинг', price: 1300, genre: 'fantasy' },
            { id: 5, title: 'Sapiens', author: 'Юваль Харари', price: 1400, genre: 'science' },
            { id: 6, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 900, genre: 'fiction' }
        ];
        
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderBooks();
        this.setupFilters();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.filter;
                this.renderBooks();
            });
        });
    }

    renderBooks() {
        const booksGrid = document.getElementById('booksGrid');
        if (!booksGrid) return;

        const filteredBooks = this.currentFilter === 'all' 
            ? this.books 
            : this.books.filter(book => book.genre === this.currentFilter);

        booksGrid.innerHTML = filteredBooks.map(book => `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <p class="price">${book.price} ₽</p>
                <button class="add-to-cart" onclick="catalogManager.addToCart(${book.id})">
                    Добавить в корзину
                </button>
            </div>
        `).join('');
    }

    addToCart(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            cartManager.addToCart(book);
        }
    }
}










class FormValidator {
    constructor() {
        this.initNewsletterForm();
        this.initCheckoutForm();
    }

    initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email');
            const errorElement = document.getElementById('emailError');
            const successElement = document.getElementById('formSuccess');

            if (this.validateEmail(email.value)) {
                errorElement.textContent = '';
                email.classList.remove('error');
                
                successElement.style.display = 'block';
                form.reset();
                
                setTimeout(() => {
                    successElement.style.display = 'none';
                }, 3000);
            } else {
                errorElement.textContent = 'Пожалуйста, введите корректный email';
                email.classList.add('error');
                successElement.style.display = 'none';
            }
        });
    }

    initCheckoutForm() {
        const form = document.getElementById('checkoutForm');
        const modal = document.getElementById('checkoutModal');
        const closeBtn = document.querySelector('.close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name');
                const phone = document.getElementById('phone');
                const address = document.getElementById('address');

                if (this.validateCheckoutForm(name.value, phone.value, address.value)) {
                    alert('Заказ успешно оформлен');
                    cartManager.clearCart();
                    modal.style.display = 'none';
                    form.reset();
                }
            });
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validateCheckoutForm(name, phone, address) {
        if (!name || !phone || !address) {
            alert('Пожалуйста, заполните все поля');
            return false;
        }
        
        if (phone.length < 10) {
            alert('Введите корректный номер телефона');
            return false;
        }
        
        return true;
    }
}











document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.cartManager = new CartManager();
    window.catalogManager = new CatalogManager();
    window.formValidator = new FormValidator();
});