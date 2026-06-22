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
                }, 200);
            });
            container.appendChild(cell);
        }
    }

    generarGrilla();
    window.addEventListener('resize', generarGrilla);
});