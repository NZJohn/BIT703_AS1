document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    updateCartBadge();
    initializeScrollEffects();
});

function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function updateCartBadge() {
    const cart = getCart();
    const cartBadge = document.querySelector('.cart-badge');
    const cartButton = document.querySelector('.btn-cart');
    
    if (cart.length > 0) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'inline-block';
        } else if (cartButton) {
            const badge = document.createElement('span');
            badge.className = 'badge bg-danger cart-badge ms-2';
            badge.textContent = totalItems;
            badge.style.borderRadius = '10px';
            cartButton.appendChild(badge);
        }
    } else if (cartBadge) {
        cartBadge.style.display = 'none';
    }
}

function getCart() {
    const cartData = localStorage.getItem('aag_cart');
    
    if (cartData) {
        try {
            return JSON.parse(cartData);
        } catch (e) {
            console.error('Error parsing cart:', e);
            return [];
        }
    }
    return [];
}

function saveCart(cart) {
    localStorage.setItem('aag_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId, quantity = 1, model = null) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }
    
    const cart = getCart();
    const existingItem = cart.findIndex(item => 
        item.id === productId && item.model === model
    );
    
    if (existingItem > -1) {
        cart[existingItem].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            model: model,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification('Item added to cart!', 'success');
    return true;
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartQuantity(index, quantity) {
    const cart = getCart();
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = parseInt(quantity);
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem('aag_cart');
    updateCartBadge();
}

function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15;
    const shipping = 0;
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.style.minWidth = '250px';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function generateStarRating(rating, reviews = null) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '<span class="product-rating">';
    
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    if (reviews !== null) {
        html += `<span class="reviews">(${reviews})</span>`;
    }
    
    html += '</span>';
    return html;
}

function initializeScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidNZPostalCode(postalCode) {
    const re = /^\d{4}$/;
    return re.test(postalCode);
}

function isValidNZPhone(phone) {
    const cleaned = phone.replace(/[\s-]/g, '');
    const re = /^(\+64|64|0)?[2-9]\d{7,9}$/;
    return re.test(cleaned);
}