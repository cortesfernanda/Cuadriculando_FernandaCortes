document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('gridContainer');
    const colors = ['cell-azul', 'cell-amarillo', 'cell-verde', 'cell-rojo'];
    const cellSize = 40;

    function generarGrilla() {
        container.innerHTML = '';
        const numCols = Math.ceil(window.innerWidth / cellSize);
        const numRows = Math.ceil(window.innerHeight / cellSize);
        const totalCells = numCols * numRows;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            cell.classList.add(randomColor);
            
            container.appendChild(cell);
        }
    }

    generarGrilla();
    window.addEventListener('resize', generarGrilla);

    // CONTROL DE TRANSICIÓN CON EL SCROLL
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / window.innerHeight;
        // Va disminuyendo la opacidad de la grilla a medida que bajas
        container.style.opacity = Math.max(0, 1 - scrollPercent * 1.5);
    });
});