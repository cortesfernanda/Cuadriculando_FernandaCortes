document.addEventListener("DOMContentLoaded", () => {
    const btnComenzar = document.getElementById('btnComenzar');
    const btnText = document.getElementById('btnText');
    const glowLayer = document.getElementById('glowLayer');
    const gridLayer = document.getElementById('gridLayer');
    const boardSection = document.getElementById('boardSection');
    const mainSelector = document.getElementById('mainSelector');
    const instructionText = document.getElementById('instructionText');
    const piecesSection = document.getElementById('piecesSection');
    const boardContainer = document.getElementById('boardContainer');
    const personalSet = document.getElementById('personalSet');
    const btnCircle = document.getElementById('btnCircle');
    const btnStar = document.getElementById('btnStar');
    const controlPanel = document.getElementById('controlPanel');
    const sliderContainer = document.getElementById('sliderContainer');
    const sizeSlider = document.getElementById('sizeSlider');
    const stripes = document.querySelectorAll('.color-stripe');

    let bandoSeleccionado = false;
    let colorElegidoGlobal = "";
    let currentScale = 1;

    // Generar fondo de grilla decorativa general
    for (let i = 0; i < 300; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gridLayer.appendChild(cell);
    }

    // Cambiar fondos líquidos por scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / window.innerHeight;
        glowLayer.style.opacity = scrollPercent >= 0.6 ? '0' : '1';
        gridLayer.style.opacity = scrollPercent >= 0.6 ? '1' : '0';
    });

    // Botón Comenzar / Reiniciar
    btnComenzar.addEventListener('click', () => {
        if (!bandoSeleccionado) {
            boardSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            bandoSeleccionado = false; colorElegidoGlobal = ""; currentScale = 1; sizeSlider.value = 1;
            btnText.innerText = "Comenzar"; btnComenzar.classList.remove('mode-reset');
            mainSelector.classList.remove('has-selection'); stripes.forEach(s => s.classList.remove('selected'));
            instructionText.innerText = "Elige un color"; piecesSection.style.display = 'none';
            sliderContainer.style.display = 'none'; personalSet.innerHTML = '';
            
            btnCircle.classList.remove('active-mode'); btnStar.classList.remove('active-mode');
            boardSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Selección de Bando cromático
    stripes.forEach(stripe => {
        stripe.addEventListener('click', () => {
            if (mainSelector.classList.contains('has-selection')) return;

            bandoSeleccionado = true;
            colorElegidoGlobal = stripe.getAttribute('data-color').toLowerCase();
            stripe.classList.add('selected'); mainSelector.classList.add('has-selection');
            btnText.innerText = "Reiniciar Selección"; btnComenzar.classList.add('mode-reset');
            instructionText.innerText = "Color elegido. Baja para jugar con la geometría";

            const colorCSS = `var(--color-${colorElegidoGlobal})`;
            controlPanel.style.setProperty('--chosen-bando', colorCSS);

            buildGrid(colorCSS);
            piecesSection.style.display = 'flex';

            setTimeout(() => { piecesSection.scrollIntoView({ behavior: 'smooth' }); }, 800);
        });
    });

    // Escuchador del Slider de Escala continua
    sizeSlider.addEventListener('input', (e) => {
        currentScale = e.target.value;
        const pieces = personalSet.querySelectorAll('.layer-square-wrapper');
        pieces.forEach(p => { p.style.transform = `scale(${currentScale})`; });
    });

    // Constructor de la matriz modular
    function buildGrid(colorCSS) {
        personalSet.innerHTML = ''; currentScale = 1; sizeSlider.value = 1;

        for (let i = 0; i < 16; i++) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('layer-square-wrapper');
            wrapper.style.setProperty('--chosen-bando', colorCSS);
            wrapper.dataset.index = i;

            const layer = document.createElement('div');
            layer.classList.add('square-layer');
            wrapper.appendChild(layer);

            // Clic base On/Off protegido contra modos activos
            wrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!btnCircle.classList.contains('active-mode') && !btnStar.classList.contains('active-mode')) {
                    wrapper.classList.toggle('is-active');
                }
            });

            // Hover elástico reactivo del Círculo (Ondas)
            wrapper.addEventListener('mouseenter', () => {
                if(btnCircle.classList.contains('active-mode')) {
                    const allPieces = personalSet.querySelectorAll('.layer-square-wrapper');
                    const index = parseInt(wrapper.dataset.index);
                    const row = Math.floor(index / 4); const col = index % 4;

                    wrapper.style.transform = `scale(${currentScale * 1.35})`; layer.style.opacity = "1";

                    allPieces.forEach(p => {
                        const pIndex = parseInt(p.dataset.index);
                        const pRow = Math.floor(pIndex / 4); const pCol = pIndex % 4;
                        const dist = Math.abs(pRow - row) + Math.abs(pCol - col);
                        if(dist === 1) {
                            p.style.transform = `scale(${currentScale * 1.15})`;
                            p.querySelector('.square-layer').style.opacity = "0.6";
                        }
                    });
                }
            });

            wrapper.addEventListener('mouseleave', () => {
                if(btnCircle.classList.contains('active-mode')) {
                    const allPieces = personalSet.querySelectorAll('.layer-square-wrapper');
                    allPieces.forEach(p => { p.style.transform = `scale(${currentScale})`; p.querySelector('.square-layer').style.opacity = "0.15"; });
                }
            });

            personalSet.appendChild(wrapper);
        }
    }

    // INTERRUPTOR MODO CÍRCULO (ONDAS)
    btnCircle.addEventListener('click', () => {
        if(!bandoSeleccionado) return;
        btnStar.classList.remove('active-mode'); btnCircle.classList.toggle('active-mode');
        sliderContainer.style.display = btnCircle.classList.contains('active-mode') ? "flex" : "none";
        buildGrid(`var(--color-${colorElegidoGlobal})`);
    });

    // INTERRUPTOR MODO ESTRELLA (CONSTELACIÓN LINEAL SECUENCIAL PROTEGIDA)
    btnStar.addEventListener('click', () => {
        if(!bandoSeleccionado) return;
        btnCircle.classList.remove('active-mode'); btnStar.classList.toggle('active-mode');

        const colorCSS = `var(--color-${colorElegidoGlobal})`;
        buildGrid(colorCSS);

        if(btnStar.classList.contains('active-mode')) {
            sliderContainer.style.display = "flex";
            const pieces = personalSet.querySelectorAll('.layer-square-wrapper');
            pieces.forEach((p, index) => {
                const layer = p.querySelector('.square-layer');
                setTimeout(() => {
                    layer.style.opacity = "0.05";
                    setTimeout(() => { layer.style.opacity = "0.4"; }, 150);
                    setTimeout(() => { layer.style.opacity = "0.8"; }, 300);
                    setTimeout(() => { layer.style.opacity = "1.0"; }, 450);
                    setTimeout(() => { const row = Math.floor(index / 4); layer.style.opacity = 0.2 + (row * 0.25); }, 600);
                }, index * 80);
            });
        } else { sliderContainer.style.display = "none"; }
    });
});