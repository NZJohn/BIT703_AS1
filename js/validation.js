document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
});

function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if (!validateForm(form)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    initializeEmailValidation();
    initializePhoneValidation();
    initializePostalCodeValidation();
    initializeCreditCardValidation();
    initializeDateValidation();
    initializeCurrencyValidation();
}

function validateForm(form) {
    const formId = form.id;
    
    switch(formId) {
        case 'newsletterForm':
            return validateNewsletterForm(form);
        case 'shippingForm':
            return validateShippingForm(form);
        case 'paymentForm':
            return validatePaymentForm(form);
        case 'searchForm':
            return validateSearchForm(form);
        default:
            return true;
    }
}

function validateNewsletterForm(form) {
    const emailInput = form.querySelector('input[type="email"]');
    
    if (!emailInput) return true;
    
    if (!isValidEmail(emailInput.value)) {
        showValidationError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    clearValidationError(emailInput);
    return true;
}

function validateShippingForm(form) {
    let isValid = true;
    
    const firstName = form.querySelector('#firstName');
    if (firstName && firstName.value.trim().length < 2) {
        showValidationError(firstName, 'First name must be at least 2 characters');
        isValid = false;
    }
    
    const lastName = form.querySelector('#lastName');
    if (lastName && lastName.value.trim().length < 2) {
        showValidationError(lastName, 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    const address = form.querySelector('#address');
    if (address && address.value.trim().length < 5) {
        showValidationError(address, 'Please enter a valid address');
        isValid = false;
    }
    
    const city = form.querySelector('#city');
    if (city && city.value.trim().length < 2) {
        showValidationError(city, 'Please enter a valid city');
        isValid = false;
    }
    
    const postalCode = form.querySelector('#postalCode');
    if (postalCode && !isValidNZPostalCode(postalCode.value)) {
        showValidationError(postalCode, 'Please enter a valid 4-digit postal code');
        isValid = false;
    }
    
    const phone = form.querySelector('#phone');
    if (phone && !isValidNZPhone(phone.value)) {
        showValidationError(phone, 'Please enter a valid NZ phone number');
        isValid = false;
    }
    
    const country = form.querySelector('#country');
    if (country && !country.value) {
        showValidationError(country, 'Please select a country');
        isValid = false;
    }
    
    const shippingOptions = form.querySelectorAll('input[name="shippingOption"]');
    const shippingSelected = Array.from(shippingOptions).some(radio => radio.checked);
    if (!shippingSelected) {
        showNotification('Please select a shipping option', 'warning');
        isValid = false;
    }
    
    return isValid;
}

function validatePaymentForm(form) {
    let isValid = true;
    
    const paymentMethod = form.querySelector('input[name="paymentMethod"]:checked');
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'warning');
        return false;
    }
    
    if (paymentMethod.value === 'card') {
        const cardNumber = form.querySelector('#cardNumber');
        if (cardNumber && !validateCreditCard(cardNumber.value)) {
            showValidationError(cardNumber, 'Please enter a valid credit card number');
            isValid = false;
        }
        
        const expiryDate = form.querySelector('#expiryDate');
        if (expiryDate && !validateExpiryDate(expiryDate.value)) {
            showValidationError(expiryDate, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }
        
        const cvv = form.querySelector('#cvv');
        if (cvv && !/^\d{3,4}$/.test(cvv.value)) {
            showValidationError(cvv, 'Please enter a valid CVV (3-4 digits)');
            isValid = false;
        }
        
        const cardholderName = form.querySelector('#cardholderName');
        if (cardholderName && cardholderName.value.trim().length < 3) {
            showValidationError(cardholderName, 'Please enter the cardholder name');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateSearchForm(form) {
    const searchInput = form.querySelector('input[type="search"]');
    
    if (!searchInput) return true;
    
    if (searchInput.value.trim().length === 0) {
        showValidationError(searchInput, 'Please enter a search term');
        return false;
    }
    
    if (searchInput.value.trim().length < 2) {
        showValidationError(searchInput, 'Search term must be at least 2 characters');
        return false;
    }
    
    clearValidationError(searchInput);
    return true;
}

function initializeEmailValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showValidationError(this, 'Please enter a valid email address');
            } else {
                clearValidationError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value && isValidEmail(this.value)) {
                clearValidationError(this);
            }
        });
    });
}

function initializePhoneValidation() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidNZPhone(this.value)) {
                showValidationError(this, 'Please enter a valid NZ phone number (e.g., 021 123 4567)');
            } else {
                clearValidationError(this);
            }
        });
    });
}

function initializePostalCodeValidation() {
    const postalInputs = document.querySelectorAll('#postalCode, input[name="postalCode"]');
    
    postalInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
        
        input.addEventListener('blur', function() {
            if (this.value && !isValidNZPostalCode(this.value)) {
                showValidationError(this, 'Postal code must be 4 digits');
            } else {
                clearValidationError(this);
            }
        });
    });
}

function initializeCreditCardValidation() {
    const cardInputs = document.querySelectorAll('#cardNumber, input[name="cardNumber"]');
    
    cardInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue.slice(0, 19);
        });
        
        input.addEventListener('blur', function() {
            if (this.value && !validateCreditCard(this.value)) {
                showValidationError(this, 'Please enter a valid credit card number');
            } else {
                clearValidationError(this);
            }
        });
    });
}

function initializeDateValidation() {
    const expiryInputs = document.querySelectorAll('#expiryDate, input[name="expiryDate"]');
    
    expiryInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
            }
            this.value = value;
        });
        
        input.addEventListener('blur', function() {
            if (this.value && !validateExpiryDate(this.value)) {
                showValidationError(this, 'Please enter a valid expiry date (MM/YY)');
            } else {
                clearValidationError(this);
            }
        });
    });
}

function initializeCurrencyValidation() {
    const currencyInputs = document.querySelectorAll('input[type="number"][step="0.01"]');
    
    currencyInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            
            if (value < 0) {
                showValidationError(this, 'Amount cannot be negative');
                this.value = '';
            } else if (value > 0) {
                this.value = value.toFixed(2);
                clearValidationError(this);
            }
        });
    });
}

function validateCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

function validateExpiryDate(expiry) {
    const cleaned = expiry.replace(/\s/g, '');
    const parts = cleaned.split('/');
    
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0]);
    const year = parseInt(parts[1]);
    
    if (month < 1 || month > 12) return false;
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
}

function showValidationError(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    let feedback = input.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.insertBefore(feedback, input.nextSibling);
    }
    
    feedback.textContent = message;
}

function clearValidationError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = e.target.closest('form');
        if (form && !form.classList.contains('allow-enter-submit')) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                e.preventDefault();
                submitButton.click();
            }
        }
    }
});