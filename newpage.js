document.addEventListener("DOMContentLoaded", () => {

    const textPista = document.getElementById('textPista');
    const boardSection = document.getElementById('boardSection');
    const btnComenzar = document.getElementById('btnComenzar');
    const cuadradosPortada = document.querySelectorAll('.hero-title-container .cuadrado-acrilico');
    
    // Segunda pantalla
    const remoteOptions = document.querySelectorAll('.remote-option');
    const shuttle = document.querySelector('.glass-remote-shuttle');
    const instructionText = document.getElementById('instructionText');
    const nitidezControl = document.getElementById('nitidezControl');
    const blurSlider = document.getElementById('blurSlider'); 
    const puzzleContainer = document.getElementById('puzzleContainer');
    const btnNegroCentro = document.getElementById('btnNegroCentro');
    const btnResetPuzzle = document.getElementById('btnResetPuzzle');
    const coloresMover = document.querySelectorAll('.color-back');

    let combinacionCompletada = false;
    let elementoActivo = null;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    // VERIFICAR SUPERPOSICIÓN EN PORTADA
    function verificarInterseccion() {
        if (combinacionCompletada) return;
        const rects = [...cuadradosPortada].map(c => c.getBoundingClientRect());
        let todosSeTocan = true;

        for (let i = 0; i < rects.length; i++) {
            for (let j = i + 1; j < rects.length; j++) {
                if (!(rects[i].left < rects[j].right && rects[i].right > rects[j].left && rects[i].top < rects[j].bottom && rects[i].bottom > rects[j].top)) {
                    todosSeTocan = false;
                }
            }
        }

        if (todosSeTocan) {
            combinacionCompletada = true;
            if (textPista) textPista.classList.add('fade-out');
            if (btnComenzar) {
                btnComenzar.classList.remove('hidden-start');
                btnComenzar.classList.add('reveal-active');
            }
        }
    }

    // ARRASTRE PORTADA EXCLUSIVO
    cuadradosPortada.forEach(c => {
        c.addEventListener('mousedown', (e) => {
            elementoActivo = c;
            c.dataset.arrastrando = "true";
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = c.offsetLeft;
            initialTop = c.offsetTop;
            c.style.transition = 'none';
        });
    });

    // MOUSEMOVE (Solo manipula la portada)
    document.addEventListener('mousemove', (e) => {
        if (!elementoActivo) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        elementoActivo.style.left = (initialLeft + dx) + "px";
        elementoActivo.style.top = (initialTop + dy) + "px";
        
        if (elementoActivo.classList.contains('cuadrado-acrilico')) {
            verificarInterseccion();
        }
    });

    // MOUSEUP
    document.addEventListener('mouseup', () => {
        if (elementoActivo) {
            elementoActivo.dataset.arrastrando = "false";
            elementoActivo.style.transition = 'transform 0.4s ease-out, box-shadow 0.3s ease';
            elementoActivo = null;
        }
    });

    // CONTROL REMOTO
    remoteOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const color = opt.dataset.color;

            if (color === "Amarillo") {
                if (instructionText) instructionText.style.opacity = 0;
                if (shuttle) shuttle.classList.add('has-choice');

                setTimeout(() => {
                    remoteOptions.forEach(o => o.classList.remove('active-choice'));
                    opt.classList.add('active-choice');

                    if (boardSection) boardSection.classList.add('modo-blanco-puro');
                    if (puzzleContainer) puzzleContainer.classList.remove('hidden-puzzle');
                    if (nitidezControl) nitidezControl.classList.add('reveal-visible');
                }, 250);

            } else {
                resetearMesaPuzzle();
                if (boardSection) boardSection.classList.remove('modo-blanco-puro');
                if (puzzleContainer) puzzleContainer.classList.add('hidden-puzzle');
                if (nitidezControl) nitidezControl.classList.remove('reveal-visible');

                if (shuttle) shuttle.classList.add('has-choice');

                setTimeout(() => {
                    remoteOptions.forEach(o => o.classList.remove('active-choice'));
                    opt.classList.add('active-choice');

                    if (instructionText) {
                        instructionText.innerHTML = `${color.toUpperCase()}`;
                        instructionText.style.color = `var(--color-${color.toLowerCase()})`;
                        instructionText.style.opacity = 1;
                    }
                }, 250);
            }
        });
    });

    // EXPLOSIÓN CUADRADO NEGRO
    if (btnNegroCentro) {
        btnNegroCentro.addEventListener('click', () => {
            puzzleContainer.classList.add('dispersado');
            btnNegroCentro.classList.add('fade-out-centro'); 
        });
    }

    // RANGE SLIDER DE ETAPAS
    if (blurSlider) {
        blurSlider.addEventListener('input', (e) => {
            const valorBlur = parseFloat(e.target.value);
            
            document.documentElement.style.setProperty('--blur-dinamico', `${valorBlur}px`);
            
            const nuevoRadio = 12 + (valorBlur * 3.5); 
            document.documentElement.style.setProperty('--radio-dinamico', `${nuevoRadio}px`);
            
            const nuevoFactor = 1 + (valorBlur / 15); 
            document.documentElement.style.setProperty('--factor-movimiento', nuevoFactor);
        });
    }

    // RESETEAR LA MESA
    function resetearMesaPuzzle() {
        if (puzzleContainer) puzzleContainer.classList.remove('dispersado');
        if (btnNegroCentro) btnNegroCentro.classList.remove('fade-out-centro');
        if (blurSlider) blurSlider.value = 0;
        
        document.documentElement.style.setProperty('--blur-dinamico', `0px`);
        document.documentElement.style.setProperty('--radio-dinamico', `12px`);
        document.documentElement.style.setProperty('--factor-movimiento', `1`);
        
        if (instructionText) {
            instructionText.innerHTML = "Elige un color";
            instructionText.style.color = "#111115";
            instructionText.style.opacity = boardSection.classList.contains('modo-blanco-puro') ? 0 : 1;
        }
        
        coloresMover.forEach(c => {
            c.removeAttribute('style');
        });
    }

    if (btnResetPuzzle) {
        btnResetPuzzle.addEventListener('click', resetearMesaPuzzle);
    }

    // SCROLL
    if (btnComenzar) {
        btnComenzar.addEventListener('click', () => {
            if (boardSection) boardSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});