document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('gridContainer');
    const colors = ['cell-amarillo', 'cell-azul', 'cell-rojo', 'cell-verde'];
    const cellSize = 40;

    // 1. GENERAR LA GRILLA INTERACTIVA DE PORTADA
    function generarGrilla() {
        if (!container) return;
        container.innerHTML = '';
        const numCols = Math.ceil(window.innerWidth / cellSize);
        const numRows = Math.ceil(window.innerHeight / cellSize);
        const totalCells = numCols * numRows;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            const assignedColor = colors[Math.floor(Math.random() * colors.length)];
            
            cell.addEventListener('mouseenter', () => {
                cell.classList.add('active', assignedColor);
                setTimeout(() => {
                    cell.classList.remove('active', assignedColor);
                }, 300);
            });
            container.appendChild(cell);
        }
    }

    generarGrilla();
    window.addEventListener('resize', generarGrilla);

    // 2. CONTROL DE SCROLL: COMPORTAMIENTO LÍQUIDO Y APAGADO DE GRILLA
    const fundamentoSec = document.getElementById('fundamento-sec');
    const fundamentoGrid = document.querySelector('.fundamento-grid');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        const scrollPercent = scrollY / windowHeight;
        if (container) {
            container.style.opacity = Math.max(0, 1 - scrollPercent * 1.5);
        }

        // Apagar cuadrados de fondo al entrar a la zona de información
        if (scrollY > windowHeight * 0.2) {
            document.body.classList.add('in-bento-zone');
        } else {
            document.body.classList.remove('in-bento-zone');
        }

        // Transición de color hacia el Fundamento Blanco
        if (fundamentoSec) {
            const rect = fundamentoSec.getBoundingClientRect();
            const totalDistance = windowHeight;
            const currentDistance = windowHeight - rect.top;
            const fadePercent = Math.min(1, Math.max(0, currentDistance / totalDistance));

            fundamentoSec.style.backgroundColor = `rgba(244, 244, 247, ${fadePercent})`;

            if (fadePercent >= 0.6) {
                document.body.classList.add('in-light');
                if (fundamentoGrid) fundamentoGrid.style.opacity = '0.07';
            } else {
                document.body.classList.remove('in-light');
                if (fundamentoGrid) fundamentoGrid.style.opacity = '0';
            }
        }
    });

    // 3. ACTUALIZADO: SEGUIMIENTO DEL MOUSE EN LOS MARCOS DE IMAGEN (EFECTO PRO)
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('mousemove', (e) => {
            const rect = placeholder.getBoundingClientRect();
            // Calcula la posición del cursor relativa al marco de la imagen
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Setea las variables en el CSS para desplazar el brillo de fondo
            placeholder.style.setProperty('--x', `${x}px`);
            placeholder.style.setProperty('--y', `${y}px`);
        });
    });

    // 4. SMOOTH SCROLL PARA LOS BOTONES DE LA NAVBAR
    const links = document.querySelectorAll('.btn-navegacion');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});