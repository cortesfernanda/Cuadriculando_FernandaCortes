document.addEventListener('DOMContentLoaded', () => {

    // 1. MANEJO DE LA BARRA DE PROGRESO DE SCROLL SUPERIOR
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressElement = document.getElementById('scroll-progress');
        if (progressElement) {
            progressElement.style.width = scrolled + '%';
        }
    });

    // 2. DINÁMICA DE LA NAVBAR (Aparece transparente en portada y gris tras hacer scroll)
    const navbar = document.querySelector('.navbar');
    
    // Detecta correctamente tu nuevo archivo para no aplicar transparencias en él
    if (navbar && !window.location.pathname.includes('newpage.html')) {
        navbar.style.backgroundColor = "transparent";
        navbar.style.borderBottom = "1px solid transparent";

        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.style.backgroundColor = "rgba(20, 20, 20, 0.85)";
                navbar.style.borderBottom = "1px solid rgba(255, 255, 255, 0.06)";
            } else {
                navbar.style.backgroundColor = "transparent";
                navbar.style.borderBottom = "1px solid transparent";
            }
        });
    }

    // 3. DETECTOR DE SECCIÓN ACTIVA (SCROLL SPY SEGURO)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-links .nav-link');

    function scrollSpy() {
        // Bloquea el Scroll Spy dinámico si estás dentro del documento separado newpage.html
        if (window.location.pathname.includes('newpage.html')) return;

        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 240; // Margen de activación de color
            const sectionId = current.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            } else if (scrollPosition < 300) {
                // Limpia el menú cuando vuelve arriba a la portada
                navLinks.forEach(link => link.classList.remove('active'));
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);

    // 4. INTERSECTION OBSERVER PARA EFECTOS FADE-IN
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearanceOptions = {
        threshold: 0.06,
        rootMargin: "0px 0px -40px 0px"
    };

    const appearanceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearanceOptions);

    fadeElements.forEach(element => {
        appearanceObserver.observe(element);
    });

    // 5. GENERACIÓN Y LÓGICA DE LA CUADRÍCULA INTERACTIVA DEL HERO (4 COLORES)
    const gridContainer = document.getElementById('grid-interaction-container');
    
    if (gridContainer) {
        const colors = ['flash-verde', 'flash-amarillo', 'flash-azul', 'flash-rojo'];
        
        // Calculamos las celdas geométricas según las proporciones de pantalla
        const cellSize = 50; 
        const columns = Math.ceil(window.innerWidth / cellSize);
        const rows = Math.ceil(window.innerHeight / cellSize);
        const totalCells = columns * rows;

        // Configuramos las columnas mediante grid nativo dinámico
        gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-pixel');
            
            // Evento interactivo: rastro aleatorio de colores al pasar el mouse
            cell.addEventListener('mouseenter', () => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                cell.classList.add(randomColor);
                
                // Efecto de desvanecimiento sutil (Estela)
                setTimeout(() => {
                    cell.classList.remove(randomColor);
                }, 250); 
            });
            
            gridContainer.appendChild(cell);
        }
    }
});