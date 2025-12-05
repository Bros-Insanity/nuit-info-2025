// Animations et interactions pour la documentation

// Animation du pixel grid pour CNN
function animatePixelGrid() {
    const grid = document.getElementById('inputGrid');
    if (!grid) return;

    // Créer une grille 4x4 animée
    grid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const pixel = document.createElement('div');
        pixel.style.width = '20px';
        pixel.style.height = '20px';
        pixel.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        pixel.style.borderRadius = '2px';
        pixel.style.transition = 'opacity 0.3s';
        grid.appendChild(pixel);
    }

    // Animation de pulsation
    setInterval(() => {
        const pixels = grid.querySelectorAll('div');
        pixels.forEach(pixel => {
            pixel.style.opacity = Math.random() > 0.5 ? '0.5' : '1';
        });
    }, 1000);
}

// Animation smooth scroll pour la navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Animation des statistiques au scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = start + (end - start) * progress;
            
            // Formater selon le type
            if (element.textContent.includes('B')) {
                element.textContent = current.toFixed(1) + 'B';
            } else if (element.textContent.includes('k')) {
                element.textContent = Math.floor(current) + 'k';
            } else {
                element.textContent = Math.floor(current);
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const finalValue = parseFloat(entry.target.textContent.replace(/[^\d.]/g, ''));
                animateValue(entry.target, 0, finalValue, 2000);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Effet parallaxe léger
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    });
}

// Animation des formules mathématiques
function highlightFormulas() {
    const formulas = document.querySelectorAll('.formula');
    
    formulas.forEach(formula => {
        formula.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(99, 102, 241, 0.3)';
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        formula.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 0, 0, 0.3)';
            this.style.transform = 'scale(1)';
        });
    });
}

// Animation des cartes de solutions
function animateSolutionCards() {
    const solutionItems = document.querySelectorAll('.solution-item, .llm-solution');
    
    solutionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Effet de particules pour le hero (optionnel, léger)
function createParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    // Créer quelques particules flottantes
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(99, 102, 241, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
        hero.style.position = 'relative';
        hero.appendChild(particle);
    }
}

// Keyframes pour l'animation de flottement
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

// Initialisation de toutes les animations
document.addEventListener('DOMContentLoaded', function() {
    animatePixelGrid();
    animateStats();
    highlightFormulas();
    
    // Délai pour les animations de cartes
    setTimeout(() => {
        animateSolutionCards();
    }, 500);
    
    // Parallaxe seulement sur desktop
    if (window.innerWidth > 768) {
        initParallax();
    }
    
    // Particules optionnelles (peuvent être désactivées pour performance)
    // createParticles();
});

// Gestion du thème (si besoin d'ajouter un toggle dark/light)
function initThemeToggle() {
    // Pour l'instant, on garde le thème sombre par défaut
    // Mais on peut ajouter un toggle si nécessaire
}

// Optimisation des performances : lazy loading des graphiques
function lazyLoadCharts() {
    const chartContainers = document.querySelectorAll('canvas');
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Les graphiques sont déjà créés dans visualizations.js
                // On pourrait ajouter une logique de chargement différé ici
                chartObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '50px' });
    
    chartContainers.forEach(container => {
        chartObserver.observe(container);
    });
}

// Initialisation du lazy loading
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadCharts();
});

// Animation de la navbar au scroll
function animateNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    animateNavbar();
});

