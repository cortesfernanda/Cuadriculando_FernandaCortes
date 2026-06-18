document.addEventListener("DOMContentLoaded", () => {

    const textPista = document.getElementById('textPista');
    const btnComenzar = document.getElementById('btnComenzar');
    const cuadradosPortada = document.querySelectorAll('.hero-title-container .cuadrado-acrilico');
    
    // Selectores del sistema del prisma
    const pantallaPortada = document.getElementById('pantallaPortada');
    const backgroundLiquido = document.getElementById('backgroundLiquido');
    const prismaSection = document.getElementById('prismaSection');
    const canvasContainer = document.getElementById('three-prisma-canvas');
    const estrellasTriggers = document.querySelectorAll('.star-trigger');
    const textoGuia = document.getElementById('textoGuia');
    
    // Controladores de flujo y recorrido
    const btnRevelarBloque = document.getElementById('btnRevelarBloque');
    const menuFinal = document.getElementById('menuFinal');
    const btnSiguienteRecorrido = document.getElementById('btnSiguienteRecorrido');
    const btnReiniciarPrisma = document.getElementById('btnReiniciarPrisma');
    const btnSiguienteSeccion = document.getElementById('btnSiguienteSeccion');
    
    let combinacionCompletada = false;
    let elementoActivo = null;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    // ==========================================
    // 1. CONDICIÓN DE INTERSECCIÓN EN PORTADA
    // ==========================================
    function verificarInterseccion() {
        if (combinacionCompletada) return;
        const rects = [...cuadradosPortada].map(c => c.getBoundingClientRect());
        let todosSeTocan = true;

        for (let i = 0; i < rects.length; i++) {
            for (let j = i + 1; j < rects.length; j++) {
                if (!(rects[i].left < rects[j].right && 
                      rects[i].right > rects[j].left && 
                      rects[i].top < rects[j].bottom && 
                      rects[i].bottom > rects[j].top)) {
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

    document.addEventListener('mousemove', (e) => {
        if (!elementoActivo) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        elementoActivo.style.left = (initialLeft + dx) + "px";
        elementoActivo.style.top = (initialTop + dy) + "px";
        verificarInterseccion();
    });

    document.addEventListener('mouseup', () => {
        if (elementoActivo) {
            elementoActivo.dataset.arrastrando = "false";
            elementoActivo.style.transition = 'transform 0.4s ease-out, box-shadow 0.3s ease';
            elementoActivo = null;
        }
    });

    // CAMBIO DE PANTALLA INICIAL
    if (btnComenzar) {
        btnComenzar.addEventListener('click', () => {
            pantallaPortada.classList.add('hidden-screen');
            if (backgroundLiquido) backgroundLiquido.classList.add('hidden-screen');
            
            if (prismaSection) {
                prismaSection.classList.remove('hidden-screen');
                inicializarPrisma3D();
            }
        });
    }

    // ==========================================
    // 2. MOTOR THREE.JS: ENTORNO
    // ==========================================
    let scene, camera, renderer, grupoPrisma;
    let capasPrisma = []; 
    let capasEliminadasContador = 0;
    
    let cuadraditosFundamento = [];
    let faseFundamentoActiva = false;
    let targetSeparacion = 0; 

    function inicializarPrisma3D() {
        if (!canvasContainer) return;
        
        canvasContainer.innerHTML = '';
        capasPrisma = [];
        cuadraditosFundamento = [];
        faseFundamentoActiva = false;
        capasEliminadasContador = 0;
        targetSeparacion = 0;

        if (menuFinal) {
            menuFinal.classList.remove('reveal-menu');
            menuFinal.classList.add('hidden-menu');
            menuFinal.style.display = ''; 
        }

        if (btnSiguienteSeccion) {
            btnSiguienteSeccion.style.display = 'none';
        }

        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 10);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasContainer.appendChild(renderer.domElement);

        grupoPrisma = new THREE.Group();
        scene.add(grupoPrisma);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight1.position.set(5, 10, 7);
        scene.add(dirLight1);

        const radioTop = 1.6;
        const radioBottom = 1.6;
        const altura = 3.4;
        const segmentosCaras = 4;

        const capasConfig = [
            { colorHex: 0x1444f4, emissiveHex: 0x1444f4, opacity: 0.85, transmission: 0.6, emissiveIntensity: 0.6, escala: 0.45 }, 
            { colorHex: 0xe4646c, emissiveHex: 0xe4646c, opacity: 0.85, transmission: 0.6, emissiveIntensity: 0.6, escala: 0.65 }, 
            { colorHex: 0xfcf464, emissiveHex: 0xfcf464, opacity: 0.85, transmission: 0.6, emissiveIntensity: 0.6, escala: 0.85 }, 
            { colorHex: 0x94ec94, emissiveHex: 0x94ec94, opacity: 0.85, transmission: 0.6, emissiveIntensity: 0.6, escala: 1.05 }, 
            { colorHex: 0x000000, emissiveHex: 0x000000, opacity: 1.0,  transmission: 0.0, emissiveIntensity: 0.0, escala: 1.25 }  
        ];

        capasConfig.forEach((config, idx) => {
            const geometry = new THREE.CylinderGeometry(radioTop, radioBottom, altura, segmentosCaras);
            
            const material = new THREE.MeshPhysicalMaterial({
                color: config.colorHex,       
                emissive: config.emissiveHex, 
                emissiveIntensity: config.emissiveIntensity,       
                transparent: true,
                opacity: config.opacity,                
                roughness: 0.02,              
                metalness: 0.02,
                transmission: config.transmission, 
                ior: 1.50,           
                clearcoat: 1.0,      
                clearcoatRoughness: 0.01,
                side: THREE.DoubleSide,
                depthWrite: false 
            });

            const mallaCapa = new THREE.Mesh(geometry, material);
            mallaCapa.scale.set(config.escala, 1, config.escala);
            mallaCapa.userData = { idCapa: idx };

            capasPrisma.push(mallaCapa);
            grupoPrisma.add(mallaCapa);
        });

        grupoPrisma.rotation.x = 0.55;
        grupoPrisma.rotation.y = 0.65;

        function animatePrisma() {
            requestAnimationFrame(animatePrisma);
            
            if (!faseFundamentoActiva && grupoPrisma) {
                grupoPrisma.rotation.y += 0.005; 
            }

            if (faseFundamentoActiva) {
                cuadraditosFundamento.forEach(cubo => {
                    const posDestinoX = cubo.userData.origX + (cubo.userData.dirX * targetSeparacion * 4.0);
                    const posDestinoY = cubo.userData.origY + (cubo.userData.dirY * targetSeparacion * 4.0);
                    const posDestinoZ = cubo.userData.origZ + (cubo.userData.dirZ * targetSeparacion * 5.5);

                    cubo.position.x += (posDestinoX - cubo.position.x) * 0.1;
                    cubo.position.y += (posDestinoY - cubo.position.y) * 0.1;
                    cubo.position.z += (posDestinoZ - cubo.position.z) * 0.1;

                    const velocidadRotacion = 0.005 + (targetSeparacion * 0.07); 
                    cubo.rotation.x += velocidadRotacion * cubo.userData.rotXFactor;
                    cubo.rotation.y += velocidadRotacion * cubo.userData.rotYFactor;
                    cubo.rotation.z += (velocidadRotacion * 0.5) * cubo.userData.rotZFactor;

                    cubo.material.roughness = 0.02 + (targetSeparacion * 0.85); 
                    cubo.material.opacity = 0.85 - (targetSeparacion * 0.45);   
                    cubo.material.transmission = 0.6 + (targetSeparacion * 0.4); 
                });
            }

            renderer.render(scene, camera);
        }
        animatePrisma();
    }

    // ==========================================
    // 3. SECUENCIA DE FASES (CLICS Y BOTONES)
    // ==========================================
    if (btnRevelarBloque) {
        btnRevelarBloque.addEventListener('click', () => {
            const capaNegra = capasPrisma.find(m => m.userData.idCapa === 4);
            if (capaNegra) {
                grupoPrisma.remove(capaNegra); 
                btnRevelarBloque.classList.add('fade-out-btn');
                
                if (textoGuia) textoGuia.innerHTML = "La luz atraviesa la materia: Descompón las 4 capas cromáticas";

                estrellasTriggers.forEach(estrella => {
                    estrella.classList.remove('hidden-star-trigger');
                    estrella.classList.add('reveal-star-trigger');
                    estrella.style.opacity = ''; 
                    estrella.style.transform = '';
                    estrella.style.pointerEvents = 'auto';
                });
            }
        });
    }

    estrellasTriggers.forEach(estrella => {
        estrella.addEventListener('click', () => {
            const idCapaARemover = parseInt(estrella.dataset.targetLayer);
            const capaMalla = capasPrisma.find(m => m.userData.idCapa === idCapaARemover);

            if (capaMalla) {
                grupoPrisma.remove(capaMalla); 
                capasEliminadasContador++;

                estrella.style.transform = 'scale(0) rotate(135deg)';
                estrella.style.opacity = '0';
                estrella.style.pointerEvents = 'none';

                if (capasEliminadasContador >= 4) {
                    if (menuFinal) {
                        menuFinal.classList.remove('hidden-menu');
                        menuFinal.classList.add('reveal-menu');
                    }
                    if (textoGuia) textoGuia.innerHTML = "Estructuras liberadas. Continúa para ver el fundamento visual.";
                }
            }
        });
    });

    if (btnSiguienteRecorrido) {
        btnSiguienteRecorrido.addEventListener('click', () => {
            if (menuFinal) {
                menuFinal.style.display = 'none'; 
            }
            activarTransicionFundamentoVisual();
        });
    }

    // ==========================================
    // 4. TRANSICIÓN AL FUNDAMENTO VISUAL RESUMIDO
    // ==========================================
    function activarTransicionFundamentoVisual() {
        if (textoGuia) {
            // RESUMEN TEXTUAL SINTETIZADO EDITORIAL
            textoGuia.innerHTML = "La proximidad entre capas define y concentra el color. Al distanciarse, las formas se difuminan en manchas abstractas, expandiendo la luz en el espacio. Mueve el cursor horizontalmente para experimentar el descalce.";
            textoGuia.style.maxWidth = "700px";
            textoGuia.style.margin = "0 auto";
            textoGuia.style.lineHeight = "1.6";
            textoGuia.style.fontSize = "0.78rem";
        }

        if (grupoPrisma) { scene.remove(grupoPrisma); }

        // MUESTRA EL BOTÓN LATERAL RECORRIDO DE FORMA CORRECTA
        if (btnSiguienteSeccion) {
            btnSiguienteSeccion.style.display = 'block';
        }

        const coloresPaleta = [0x94ec94, 0xfcf464, 0xe4646c, 0x4c6cf4]; 
        const totalModulos = 70; 

        for (let i = 0; i < totalModulos; i++) {
            const geomCubo = new THREE.BoxGeometry(0.45, 0.45, 0.04);
            const matCubo = new THREE.MeshPhysicalMaterial({
                color: coloresPaleta[i % coloresPaleta.length],
                transparent: true, opacity: 0.85, roughness: 0.02, metalness: 0.05, transmission: 0.5, clearcoat: 1.0, side: THREE.DoubleSide, depthWrite: false
            });

            const cuboMesh = new THREE.Mesh(geomCubo, matCubo);
            const origX = (Math.random() - 0.5) * 0.2;
            const origY = (Math.random() - 0.5) * 0.2;
            const origZ = (Math.random() - 0.5) * 0.2;
            cuboMesh.position.set(origX, origY, origZ);

            cuboMesh.userData = {
                origX: origX, origY: origY, origZ: origZ,
                dirX: (Math.random() - 0.5) * 1.5, dirY: (Math.random() - 0.5) * 1.5, dirZ: (Math.random() - 0.5) * 1.5,
                rotXFactor: (Math.random() - 0.5) * 2.5, rotYFactor: (Math.random() - 0.5) * 2.5, rotZFactor: (Math.random() - 0.5) * 2.5  
            };
            cuboMesh.rotation.set(Math.random() * 0.2, Math.random() * 0.2, 0);
            cuadraditosFundamento.push(cuboMesh);
            scene.add(cuboMesh);
        }

        faseFundamentoActiva = true;
    }

    // CLIC EN EL BOTÓN LATERAL DERECHO -> APAGÓN A PANTALLA NEGRA
    if (btnSiguienteSeccion) {
        btnSiguienteSeccion.addEventListener('click', () => {
            faseFundamentoActiva = false; 
            
            btnSiguienteSeccion.style.display = 'none';
            if (textoGuia) textoGuia.style.display = 'none';
            
            cuadraditosFundamento.forEach(c => scene.remove(c));
            
            if (prismaSection) {
                prismaSection.style.setProperty('background-color', '#000000', 'important');
                const rejilla = prismaSection.querySelector('.cuadricula-fondo-clara');
                if (rejilla) rejilla.style.display = 'none';
            }
        });
    }

    if (btnReiniciarPrisma) {
        btnReiniciarPrisma.addEventListener('click', () => {
            btnRevelarBloque.classList.remove('fade-out-btn');
            if (textoGuia) {
                textoGuia.innerHTML = "Un prisma denso absorbe la luz sobre la cuadrícula";
                textoGuia.style.maxWidth = ""; textoGuia.style.margin = ""; textoGuia.style.fontSize = "0.72rem";
            }
            inicializarPrisma3D();
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (!faseFundamentoActiva) return;
        const anchoMitad = window.innerWidth / 2;
        const diffX = Math.abs(e.clientX - anchoMitad);
        targetSeparacion = diffX / anchoMitad; 
    });
});