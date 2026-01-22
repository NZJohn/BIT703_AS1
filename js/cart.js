document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'shopping-cart.html') {
        displayCart();
    } else if (currentPage === 'shipping-details.html') {
        displayCartSummary();
        initializeShippingForm();
    } else if (currentPage === 'payment-options.html') {
        displayCartSummary();
        initializePaymentForm();
    }
});

function displayCart() {
    const cart = getCart();
    const cartContainer = document.getElementById('cartItems');
    
    if (!cartContainer) {
        console.error('Cart container #cartItems not found!');
        return;
    }
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h4>Your cart is empty</h4>
                <p class="text-muted">Add some adventure gear to get started!</p>
                <a href="shop.html" class="btn btn-primary-custom mt-3">Start Shopping</a>
            </div>
        `;
        updateCartSummaryDisplay();
        return;
    }
    
    let html = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemImage = item.image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&h=150&fit=crop';
        const itemTotal = item.price * item.quantity;
        
        html += `
            <div class="row cart-item align-items-center mb-4 pb-4 border-bottom">
                <div class="col-md-2">
                    <img src="${itemImage}" alt="${item.name}" class="img-fluid rounded" onerror="this.src='https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&h=150&fit=crop'">
                </div>
                <div class="col-md-4">
                    <h5 class="product-name mb-1">${item.name}</h5>
                    ${item.model ? `<p class="text-muted small mb-0">Model: ${item.model}</p>` : ''}
                    <p class="text-muted small">${formatCurrency(item.price)}</p>
                </div>
                <div class="col-md-3">
                    <div class="input-group" style="max-width: 150px;">
                        <button class="btn btn-outline-secondary" type="button" onclick="decrementQuantity(${i})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="form-control text-center" value="${item.quantity}" min="1" max="99" 
                            onchange="updateCartQuantity(${i}, this.value)" id="qty-${i}">
                        <button class="btn btn-outline-secondary" type="button" onclick="incrementQuantity(${i})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2 text-end">
                    <strong>${formatCurrency(itemTotal)}</strong>
                </div>
                <div class="col-md-1 text-end">
                    <button class="btn btn-link text-danger" onclick="removeFromCart(${i}); displayCart();">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    cartContainer.innerHTML = html;
    updateCartSummaryDisplay();
}

function displayCartSummary() {
    const cart = getCart();
    const summaryContainer = document.getElementById('cartSummaryItems');
    
    if (!summaryContainer) return;
    
    let html = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemImage = item.image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=60&h=60&fit=crop';
        
        html += `
            <div class="d-flex align-items-center mb-3">
                <img src="${itemImage}" alt="${item.name}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1551632811-561732d1e306?w=60&h=60&fit=crop'">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
                <strong>${formatCurrency(item.price)}</strong>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = html;
    updateCartSummaryDisplay();
    
    const shippingForm = document.getElementById('shippingForm');
    if (shippingForm) {
        checkFreeExpressShipping();
    }
}

function updateCartSummaryDisplay() {
    const totals = calculateCartTotals();
    
    const subtotalEl = document.getElementById('summarySubtotal');
    const shippingEl = document.getElementById('summaryShipping');
    const taxEl = document.getElementById('summaryTax');
    const totalEl = document.getElementById('summaryTotal');
    
    if (subtotalEl) {
        subtotalEl.textContent = formatCurrency(totals.subtotal);
    }
    
    if (shippingEl) {
        shippingEl.textContent = 'FREE';
        shippingEl.classList.add('text-success', 'fw-bold');
    }
    
    if (taxEl) {
        taxEl.textContent = formatCurrency(totals.tax);
    }
    
    if (totalEl) {
        totalEl.textContent = formatCurrency(totals.total);
    }
}

function incrementQuantity(index) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const newQty = parseInt(qtyInput.value) + 1;
    
    if (newQty <= 99) {
        qtyInput.value = newQty;
        updateCartQuantity(index, newQty);
        displayCart();
    }
}

function decrementQuantity(index) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const newQty = parseInt(qtyInput.value) - 1;
    
    if (newQty >= 1) {
        qtyInput.value = newQty;
        updateCartQuantity(index, newQty);
        displayCart();
    }
}

function initializeShippingForm() {
    const shippingForm = document.getElementById('shippingForm');
    if (!shippingForm) return;
    
    const savedShipping = localStorage.getItem('aag_shipping');
    if (savedShipping) {
        try {
            const shippingData = JSON.parse(savedShipping);
            const keys = Object.keys(shippingData);
            
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const input = document.getElementById(key);
                if (input) {
                    input.value = shippingData[key];
                }
            }
        } catch (e) {
            console.error('Error loading saved shipping data:', e);
        }
    }
    
    checkFreeExpressShipping();
    
    const shippingOptions = document.querySelectorAll('input[name="shippingOption"]');
    for (let i = 0; i < shippingOptions.length; i++) {
        shippingOptions[i].addEventListener('change', updateShippingDisplay);
    }
}

function checkFreeExpressShipping() {
    const totals = calculateCartTotals();
    const subtotal = parseFloat(totals.subtotal);
    const freeShippingOption = document.getElementById('freeShipping');
    const expressShippingOption = document.getElementById('nextDay');
    
    if (!freeShippingOption || !expressShippingOption) return;
    
    const qualifiesForFreeExpress = subtotal >= 600;
    
    if (qualifiesForFreeExpress) {
        expressShippingOption.checked = true;
        
        const expressLabel = expressShippingOption.closest('label');
        if (expressLabel) {
            const priceText = expressLabel.querySelector('strong:last-child');
            if (priceText) {
                priceText.textContent = 'FREE';
                priceText.classList.add('text-success');
            }
        }
        
        let messageEl = document.getElementById('freeExpressMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'freeExpressMessage';
            messageEl.className = 'alert alert-success mt-3';
            messageEl.innerHTML = '<i class="fas fa-shipping-fast me-2"></i><strong>Congratulations!</strong> You qualify for free express overnight shipping!';
            
            const shippingSection = expressShippingOption.closest('.row');
            if (shippingSection && shippingSection.parentElement) {
                shippingSection.parentElement.appendChild(messageEl);
            }
        }
    } else {
        freeShippingOption.checked = true;
        
        const expressLabel = expressShippingOption.closest('label');
        if (expressLabel) {
            const priceText = expressLabel.querySelector('strong:last-child');
            if (priceText) {
                priceText.textContent = '$20.00';
                priceText.classList.remove('text-success');
            }
        }
        
        const messageEl = document.getElementById('freeExpressMessage');
        if (messageEl) {
            messageEl.remove();
        }
    }
    
    updateShippingDisplay();
}

function updateShippingDisplay() {
    const selectedShipping = document.querySelector('input[name="shippingOption"]:checked');
    const shippingEl = document.getElementById('summaryShipping');
    const totals = calculateCartTotals();
    const subtotal = parseFloat(totals.subtotal);
    
    let shippingCost = 0;
    
    if (selectedShipping && selectedShipping.value === 'express') {
        if (subtotal < 600) {
            shippingCost = 20.00;
        }
    }
    
    if (shippingEl) {
        if (shippingCost === 0) {
            shippingEl.textContent = 'FREE';
            shippingEl.classList.add('text-success', 'fw-bold');
        } else {
            shippingEl.textContent = formatCurrency(shippingCost);
            shippingEl.classList.remove('text-success', 'fw-bold');
        }
    }
    
    const tax = parseFloat(totals.tax);
    const newTotal = subtotal + shippingCost + tax;
    
    const totalEl = document.getElementById('summaryTotal');
    if (totalEl) {
        totalEl.textContent = formatCurrency(newTotal.toFixed(2));
    }
}

function saveShippingDetails() {
    const form = document.getElementById('shippingForm');
    if (!form) return false;
    
    const formData = new FormData(form);
    const shippingData = {};
    
    const entries = Array.from(formData.entries());
    for (let i = 0; i < entries.length; i++) {
        const key = entries[i][0];
        const value = entries[i][1];
        shippingData[key] = value;
    }
    
    localStorage.setItem('aag_shipping', JSON.stringify(shippingData));
    return true;
}

function initializePaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    if (!paymentForm) return;
    
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formatted = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            e.target.value = formatted;
        });
    }
    
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = value;
            
            if (value.length >= 2) {
                const month = value.slice(0, 2);
                const year = value.slice(2, 4);
                formatted = month + ' / ' + year;
            }
            
            e.target.value = formatted;
        });
    }
}

function processPayment() {
    showNotification('Payment processed successfully!', 'success');
    
    setTimeout(function() {
        clearCart();
        localStorage.removeItem('aag_shipping');
        window.location.href = 'index.html?order=success';
    }, 2000);
    
    return false;
}