document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
});

function initializeCarousel() {
    const carouselElement = document.getElementById('featuredCarousel');
    if (!carouselElement) return;
    
    const carousel = new bootstrap.Carousel(carouselElement, {
        interval: 4000,
        wrap: true,
        touch: true,
        pause: 'hover'
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            carousel.prev();
        } else if (e.key === 'ArrowRight') {
            carousel.next();
        }
    });
    
    carouselElement.addEventListener('slid.bs.carousel', function(e) {
        console.log(`Carousel moved to slide ${e.to + 1}`);
    });
}

function populateFeaturedCarousel() {
    const carouselInner = document.querySelector('#featuredCarousel .carousel-inner');
    if (!carouselInner) return;
    
    const featuredProducts = getFeaturedProducts();
    const productsPerSlide = window.innerWidth >= 768 ? 2 : 1;
    const totalSlides = Math.ceil(featuredProducts.length / productsPerSlide);
    
    carouselInner.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const slideProducts = featuredProducts.slice(
            i * productsPerSlide,
            (i + 1) * productsPerSlide
        );
        
        const isActive = i === 0 ? 'active' : '';
        const slide = document.createElement('div');
        slide.className = `carousel-item ${isActive}`;
        
        const row = document.createElement('div');
        row.className = 'row g-4';
        
        slideProducts.forEach(product => {
            const col = document.createElement('div');
            col.className = productsPerSlide === 1 ? 'col-12' : 'col-md-6';
            col.innerHTML = `
                <div class="product-card hover-lift" onclick="viewProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-body">
                        <h5 class="product-name">${product.name}</h5>
                        <div class="product-price">${formatCurrency(product.price)}</div>
                        ${generateStarRating(product.rating, product.reviews)}
                    </div>
                </div>
            `;
            row.appendChild(col);
        });
        
        slide.appendChild(row);
        carouselInner.appendChild(slide);
    }
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        populateFeaturedCarousel();
    }, 250);
});