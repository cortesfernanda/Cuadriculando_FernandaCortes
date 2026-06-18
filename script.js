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

        if (scrollY > windowHeight * 0.2) {
            document.body.classList.add('in-bento-zone');
        } else {
            document.body.classList.remove('in-bento-zone');
        }

        if (fundamentoSec) {
            const rect = fundamentoSec.getBoundingClientRect();
            const totalDistance = windowHeight;
            const currentDistance = windowHeight - rect.top;
            const fadePercent = Math.min(1, Math.max(0, currentDistance / totalDistance));

            fundamentoSec.style.backgroundColor = `rgba(244, 244, 247, ${fadePercent})`;

            if (fadePercent >= 0.6) {
                document.body.classList.add('in-light');
                if (fundamentoGrid) fundamentoGrid.style.opacity = '1';
            } else {
                document.body.classList.remove('in-light');
                if (fundamentoGrid) fundamentoGrid.style.opacity = '0';
            }
        }
    });

    // 3. SEGUIMIENTO DEL MOUSE EN LOS MARCOS DE IMAGEN (AURAS NEÓN)
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('mousemove', (e) => {
            const rect = placeholder.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
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

    // ==========================================
    // 5. MOTOR INTEGRADO DE THREE.JS (CAPAS COMPACTAS Y SOLIDAS)
    // ==========================================
    const canvas3DContainer = document.getElementById('three-acrylics-container');
    
    if (canvas3DContainer) {
        let width = canvas3DContainer.clientWidth;
        let height = canvas3DContainer.clientHeight;

        const scene3D = new THREE.Scene();

        const camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera3D.position.set(0, 0, 13.5); 

        const renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer3D.setSize(width, height);
        renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer3D.setClearColor(0xffffff, 1); 
        canvas3DContainer.appendChild(renderer3D.domElement);

        const grupoAcrilicos = new THREE.Group();
        scene3D.add(grupoAcrilicos);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene3D.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight1.position.set(5, 12, 10);
        scene3D.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight2.position.set(-8, 5, -5);
        scene3D.add(dirLight2);

        const tamano = 3.2;
        const thickness = 0.12; 
        const geometry = new THREE.BoxGeometry(tamano, tamano, thickness);

        const coloresConfig = [
            { hex: 0x44d444, index: -1.5 }, 
            { hex: 0xf4e424, index: -0.5 }, 
            { hex: 0xe43444, index: 0.5 },  
            { hex: 0x1444f4, index: 1.5 }   
        ];

        const separacionZ = 1.3; 

        coloresConfig.forEach((config) => {
            const material3D = new THREE.MeshPhysicalMaterial({
                color: config.hex,
                transparent: true,
                opacity: 0.88,        
                roughness: 0.01,     
                metalness: 0.02,
                transmission: 0.35,  
                ior: 1.52,           
                clearcoat: 1.0,      
                clearcoatRoughness: 0.02,
                side: THREE.DoubleSide
            });

            const placaMesh = new THREE.Mesh(geometry, material3D);
            placaMesh.position.set(0, 0, config.index * separacionZ);
            
            // Agregamos usando el método .add() correcto de Three.js
            grupoAcrilicos.add(placaMesh);
        });

        grupoAcrilicos.rotation.x = 0.55;
        grupoAcrilicos.rotation.y = -0.65;

        let isDragging = false;
        let prevMousePosition = { x: 0, y: 0 };

        const startDragging = (clientX, clientY) => {
            isDragging = true;
            prevMousePosition = { x: clientX, y: clientY };
        };

        const moveDragging = (clientX, clientY) => {
            if (!isDragging) return;

            const deltaX = clientX - prevMousePosition.x;
            const deltaY = clientY - prevMousePosition.y;

            grupoAcrilicos.rotation.y += deltaX * 0.01;
            grupoAcrilicos.rotation.x += deltaY * 0.01;

            prevMousePosition = { x: clientX, y: clientY };
        };

        canvas3DContainer.addEventListener('mousedown', (e) => startDragging(e.clientX, e.clientY));
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => moveDragging(e.clientX, e.clientY));

        canvas3DContainer.addEventListener('touchstart', (e) => startDragging(e.touches[0].clientX, e.touches[0].clientY));
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => moveDragging(e.touches[0].clientX, e.touches[0].clientY));

        function animate3D() {
            requestAnimationFrame(animate3D);
            if (!isDragging) {
                grupoAcrilicos.rotation.y += 0.003;
            }
            renderer3D.render(scene3D, camera3D);
        }
        animate3D();

        window.addEventListener('resize', () => {
            width = canvas3DContainer.clientWidth;
            height = canvas3DContainer.clientHeight;
            camera3D.aspect = width / height;
            camera3D.updateProjectionMatrix();
            renderer3D.setSize(width, height);
        });
    }

    // ==========================================
    // 6. MUESTRA ACRÍLICOS 2D (MICRO-MOVIMIENTO REACTIVO)
    // ==========================================
    const contenedor2D = document.getElementById('contenedor-acrilicos-2d');
    
    if (contenedor2D) {
        const acrilicos2D = contenedor2D.querySelectorAll('.acrilico-2d');
        const rangoMaximo = 6; 

        acrilicos2D.forEach(acrilico => {
            acrilico.addEventListener('mousemove', (e) => {
                const rect = acrilico.getBoundingClientRect();
                const centroX = rect.left + rect.width / 2;
                const centroY = rect.top + rect.height / 2;
                
                const diffX = e.clientX - centroX;
                const diffY = e.clientY - centroY;
                
                const moverX = (diffX / (rect.width / 2)) * rangoMaximo;
                const moverY = (diffY / (rect.height / 2)) * rangoMaximo;
                
                acrilico.style.transform = `translate(${moverX}px, ${moverY}px)`;
            });

            acrilico.addEventListener('mouseleave', () => {
                acrilico.style.transform = 'translate(0px, 0px)';
            });
        });
    }
});