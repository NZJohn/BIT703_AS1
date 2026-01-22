document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingAnchor();
});

function initializeFloatingAnchor() {
    const anchor = document.createElement('div');
    anchor.className = 'floating-anchor';
    anchor.innerHTML = '<i class="fas fa-chevron-up"></i>';
    anchor.setAttribute('aria-label', 'Scroll to top');
    anchor.setAttribute('role', 'button');
    anchor.setAttribute('tabindex', '0');
    
    document.body.appendChild(anchor);
    
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            anchor.classList.add('visible');
        } else {
            anchor.classList.remove('visible');
        }
    }, 100));
    
    anchor.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    anchor.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    anchor.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    anchor.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}