document.addEventListener("DOMContentLoaded", () => {

    const textPista = document.getElementById('textPista');
    const btnComenzar = document.getElementById('btnComenzar');
    const cuadradosPortada = document.querySelectorAll('.hero-title-container .cuadrado-acrilico');
    
    // Selectores del sistema
    const pantallaPortada = document.getElementById('pantallaPortada');
    const backgroundLiquido = document.getElementById('backgroundLiquido');
    const prismaSection = document.getElementById('prismaSection');
    const canvasContainer = document.getElementById('three-prisma-canvas');
    const estrellasTriggers = document.querySelectorAll('.star-trigger');
    const textoGuia = document.getElementById('textoGuia');
    
    // Controladores de flujo
    const btnRevelarBloque = document.getElementById('btnRevelarBloque');
    const menuFinal = document.getElementById('menuFinal');
    const btnSiguienteRecorrido = document.getElementById('btnSiguienteRecorrido');
    const btnReiniciarPrisma = document.getElementById('btnReiniciarPrisma');
    const btnSiguienteSeccion = document.getElementById('btnSiguienteSeccion');
    
    // Selectores fase oscura
    const rejillaClara = document.getElementById('rejillaClara');
    const rejillaOscura = document.getElementById('rejillaOscura');
    const contenedorJuegoLaser = document.getElementById('contenedorJuegoLaser');
    const btnDispararAzar = document.getElementById('btnDispararAzar');
    const contenedorMazo16 = document.getElementById('contenedorMazo16');
    const contenedorDeck = document.getElementById('contenedorDeck');
    const contadorProgreso = document.getElementById('contadorProgreso');
    const numCeldasCompletadas = document.getElementById('numCeldasCompletadas');
    const pantallaVictoria = document.getElementById('pantallaVictoria');
    const btnVolverAJugar = document.getElementById('btnVolverAJugar');
    
    // Selectores Fase 4
    const btnFinalizarJuegoFlotante = document.getElementById('btnFinalizarJuegoFlotante');
    
    let combinacionCompletada = false;
    let elementoActivo = null;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    // ==========================================
    // 1. CONTROL ARRASTRE DE PORTADA
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
            
            // Efecto Magnético (Snap al Centro)
            cuadradosPortada.forEach((c, idx) => {
                c.classList.remove('dragging');
                c.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                c.style.left = 'calc(50% - 130px)';
                c.style.top = 'calc(50% - 130px)';
                c.style.transform = `rotate(${(idx - 1.5) * 6}deg) scale(1)`;
                c.style.cursor = 'default';
                c.style.pointerEvents = 'none'; // Desactiva arrastres futuros
            });

            setTimeout(() => {
                if (btnComenzar) {
                    btnComenzar.classList.remove('hidden-start');
                    btnComenzar.classList.add('reveal-active');
                }
            }, 450);
        }
    }

    function iniciarArrastre(e, c) {
        if (combinacionCompletada) return;
        elementoActivo = c;
        c.dataset.arrastrando = "true";
        c.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        startX = clientX;
        startY = clientY;
        initialLeft = c.offsetLeft;
        initialTop = c.offsetTop;
        c.style.transition = 'none';
        
        if (e.cancelable) e.preventDefault();
    }

    function moverArrastre(e) {
        if (!elementoActivo) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        elementoActivo.style.left = (initialLeft + dx) + "px";
        elementoActivo.style.top = (initialTop + dy) + "px";
        verificarInterseccion();
    }

    function terminarArrastre() {
        if (elementoActivo) {
            elementoActivo.dataset.arrastrando = "false";
            elementoActivo.classList.remove('dragging');
            elementoActivo.style.transition = 'transform 0.4s ease-out, box-shadow 0.3s ease, left 0.4s ease-out, top 0.4s ease-out';
            elementoActivo = null;
        }
    }

    cuadradosPortada.forEach(c => {
        c.addEventListener('mousedown', (e) => iniciarArrastre(e, c));
        c.addEventListener('touchstart', (e) => iniciarArrastre(e, c), { passive: false });
    });

    document.addEventListener('mousemove', moverArrastre);
    document.addEventListener('touchmove', moverArrastre, { passive: false });

    document.addEventListener('mouseup', terminarArrastre);
    document.addEventListener('touchend', terminarArrastre);

    if (btnComenzar) {
        btnComenzar.addEventListener('click', () => {
            if (pantallaPortada) pantallaPortada.classList.add('transitioning');
            cuadradosPortada.forEach(c => {
                c.classList.add('spin-scale-down');
            });
            
            setTimeout(() => {
                if (pantallaPortada) pantallaPortada.classList.add('hidden-screen');
                if (backgroundLiquido) backgroundLiquido.classList.add('hidden-screen');
                if (prismaSection) {
                    prismaSection.classList.remove('hidden-screen');
                    inicializarPrisma3D();
                }
            }, 800);
        });
    }

    // ==========================================
    // 2. CONFIGURACIÓN THREE.JS INTEGRAL
    // ==========================================
    let scene, camera, renderer, grupoPrisma;
    let capasPrisma = []; 
    let capasEliminadasContador = 0;
    let cuadraditosFundamento = [];
    let faseFundamentoActiva = false;
    let clickesDeCubosRealizados = 0;
    let faseEfectosActiva = false;
    
    // ==========================================
    // VARIABLES DE LA FASE 4 (LABORATORIO ÓPTICO)
    // ==========================================
    const prismasFase4 = []; // Guarda los 4 cubos de colores de la Fase 4
    let prismaActivo = null;
    let activeSwipeLayer = null;
    let luzCentral = null; // Foco de luz blanca central (bombilla) arrastrable
    const hacesDeLuzFase4 = []; // Guarda las mallas de los haces de luz proyectados
    const rejillaInteractiva = []; // Celdas de la cuadrícula interactiva de fondo
    const particulasInteractivas = []; // Partículas de brillo (chispas) que flotan en el sandbox
    
    // Partículas y feedback de Fase 2
    const cristalesExplosion = [];
    let targetBgColor = { r: 17, g: 17, b: 21 };
    let currentBgColor = { r: 17, g: 17, b: 21 };
    let targetSeparacion = 0; 
    let cameraShakeIntensity = 0; 
    let animacionId = null;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-9999, -9999);
    const capasAnimando = [];
    let capaEliminadaEnEsteSwipe = false;
    let faseTransicion3a4 = false;
    let morphers = [];
    let transicionTime = 0;
    const particulas = [];
    let flashlightLight, flashlightIndicator, mouseLight;
    const flashlightTargetPos = new THREE.Vector3();
    const flashlightTargetNormal = new THREE.Vector3(0, 0, 1);

    // Variables de Sandbox 3D y Arrastre
    let modoInspeccionPermanente = false;
    let hoveringPrisma = false;
    const objetosArrastrables = [];
    let activeDragObject = null;
    const dragPlane = new THREE.Plane();
    const dragOffset = new THREE.Vector3();
    const intersectionPoint = new THREE.Vector3();

    window.addEventListener('resize', () => {
        if (renderer && camera) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
    });

    // Mezcla aleatoria de los colores de las placas al primer clic (portada -> juego)
    function aleatorizarColoresCapas() {
        const coloresOriginales = [
            { color: 0x007bff, emissive: 0x007bff }, // Azul estándar (Parte 1)
            { color: 0xdc3545, emissive: 0xdc3545 }, // Rojo estándar (Parte 1)
            { color: 0xffc107, emissive: 0xffc107 }, // Amarillo estándar (Parte 1)
            { color: 0x28a745, emissive: 0x28a745 }  // Verde estándar (Parte 1)
        ];
        
        // Algoritmo Fisher-Yates para barajar el array
        for (let i = coloresOriginales.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coloresOriginales[i], coloresOriginales[j]] = [coloresOriginales[j], coloresOriginales[i]];
        }
        
        // Asigna los colores barajados a cada capa del prisma para cambiar el orden
        capasPrisma.forEach(capa => {
            const id = capa.userData.idCapa;
            if (id >= 0 && id <= 3) {
                capa.material.color.setHex(coloresOriginales[id].color);
                capa.material.emissive.setHex(coloresOriginales[id].emissive);
                capa.material.needsUpdate = true;
            }
        });
    }



    function dispararFeedbackExtraccion(colorHex) {
        if (camera) {
            camera.position.z = 9.2; // Zoom de rebote
        }
        
        const r = (colorHex >> 16) & 255;
        const g = (colorHex >> 8) & 255;
        const b = colorHex & 255;
        
        targetBgColor.r = r;
        targetBgColor.g = g;
        targetBgColor.b = b;
    }

    function crearDestellosCromaticos(position, colorHex) {
        const count = 35;
        for (let i = 0; i < count; i++) {
            // Tamaño aleatorio para los cubos/cuadrados
            const size = 0.08 + Math.random() * 0.12;
            const geom = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshPhysicalMaterial({
                color: colorHex,
                emissive: colorHex,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.95,
                roughness: 0.05,
                metalness: 0.1,
                transmission: 0.4,
                depthWrite: false
            });
            const shard = new THREE.Mesh(geom, mat);
            shard.position.copy(position);
            
            shard.position.x += (Math.random() - 0.5) * 2.0;
            shard.position.y += (Math.random() - 0.5) * 2.0;
            shard.position.z += (Math.random() - 0.5) * 0.2;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.08 + Math.random() * 0.22;
            shard.userData = {
                velX: Math.cos(angle) * speed,
                velY: (Math.sin(angle) * speed) + 0.06,
                velZ: (Math.random() - 0.5) * 0.12,
                rotX: (Math.random() - 0.5) * 0.3,
                rotY: (Math.random() - 0.5) * 0.3,
                opacity: 0.95,
                scale: 0.8 + Math.random() * 1.0
            };
            
            cristalesExplosion.push(shard);
            scene.add(shard);
        }
    }

    function inicializarPrisma3D() {
        if (!canvasContainer) return;
        
        if (animacionId) cancelAnimationFrame(animacionId);
        canvasContainer.innerHTML = '';
        particulas.length = 0;
        
        // Resetear visualización de contenedores para evitar superposición
        if (canvasContainer) canvasContainer.style.display = 'block';
        if (rejillaClara) rejillaClara.style.display = 'block';
        if (rejillaOscura) rejillaOscura.style.display = 'none';
        if (contenedorJuegoLaser) contenedorJuegoLaser.style.display = 'none';
        if (prismaSection) {
            prismaSection.style.background = '';
            prismaSection.classList.remove('inspeccion-activa');
        }
        
        // Limpiar objetos colaterales previos
        objetosArrastrables.forEach(obj => {
            if (scene) scene.remove(obj);
        });
        objetosArrastrables.length = 0;

        // Limpiar partículas de explosión roja
        cristalesExplosion.forEach(p => {
            if (scene) scene.remove(p);
        });
        cristalesExplosion.length = 0;

        // Limpiar los 4 prismas de la Fase 4
        prismasFase4.forEach(p => {
            if (scene) scene.remove(p);
        });
        prismasFase4.length = 0;
        prismaActivo = null;

        // Limpiar haces de luz Fase 4
        hacesDeLuzFase4.forEach(h => {
            if (scene) scene.remove(h);
        });
        hacesDeLuzFase4.length = 0;

        limpiarParticulasInteractivas();

        // Limpiar rejilla interactiva Fase 4
        rejillaInteractiva.forEach(cell => {
            if (scene) scene.remove(cell);
        });
        rejillaInteractiva.length = 0;
        
        if (luzCentral) {
            if (scene) scene.remove(luzCentral);
            luzCentral = null;
        }
        
        faseEfectosActiva = false;
        
        // Resetear color de fondo
        targetBgColor = { r: 17, g: 17, b: 21 };
        currentBgColor = { r: 17, g: 17, b: 21 };
        if (prismaSection) {
            prismaSection.style.backgroundColor = '';
        }
        if (btnFinalizarJuegoFlotante) {
            btnFinalizarJuegoFlotante.classList.remove('reveal-menu');
            btnFinalizarJuegoFlotante.classList.add('hidden-menu');
        }
        if (renderer && renderer.domElement) {
            renderer.domElement.style.filter = '';
        }

        capasPrisma = [];
        cuadraditosFundamento = [];
        capasAnimando.length = 0;
        faseFundamentoActiva = false;
        clickesDeCubosRealizados = 0;
        modoInspeccionPermanente = false;
        hoveringPrisma = false;
        activeDragObject = null;
        capasEliminadasContador = 0;
        targetSeparacion = 0;

        if (menuFinal) {
            menuFinal.classList.remove('reveal-menu');
            menuFinal.classList.add('hidden-menu');
            menuFinal.style.display = ''; 
        }
        if (btnSiguienteSeccion) btnSiguienteSeccion.style.display = 'none';

        const width = window.innerWidth;
        const height = window.innerHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 25);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasContainer.appendChild(renderer.domElement);

        grupoPrisma = new THREE.Group();
        scene.add(grupoPrisma);

        // Configuración de iluminación cálida (tonos crema/dorado) para dar sensación de acrílico iluminado
        const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.35); // Luz ambiental cálida para suavizar sombras
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xfff3db, 0.55); // Luz direccional principal cálida
        dirLight1.position.set(5, 10, 7);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffead1, 0.35); // Luz secundaria cálida de relleno
        dirLight2.position.set(-5, -5, -5);
        scene.add(dirLight2);

        // Luz direccional de seguimiento del ratón para crear reflejos y brillos interactivos cálidos
        mouseLight = new THREE.DirectionalLight(0xfff0e0, 0.4);
        mouseLight.position.set(0, 0, 10);
        scene.add(mouseLight);

        // Geometría y posiciones Z para los 4 bloques de lentes flotantes de colores
        const capasConfig = [
            { colorHex: 0x28a745, z: 1.2 }, // Verde (Parte 1)
            { colorHex: 0xffc107, z: 0.4 }, // Amarillo (Parte 1)
            { colorHex: 0xdc3545, z: -0.4 }, // Rojo (Parte 1)
            { colorHex: 0x007bff, z: -1.2 }  // Azul (Parte 1)
        ];

        capasConfig.forEach((config, idx) => {
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 0.2); // Placa de lente acrílica cuadrada
            const material = new THREE.MeshPhysicalMaterial({
                color: config.colorHex, 
                emissive: config.colorHex, // Autobrillo de color para imitar la translucidez del acrílico
                emissiveIntensity: 0.2,    // Intensidad controlada para no sobreiluminar
                transparent: true, 
                opacity: 0.55, 
                roughness: 0.15, 
                metalness: 0.05, 
                clearcoat: 1.0, 
                side: THREE.DoubleSide, 
                depthWrite: false 
            });

            const mallaCapa = new THREE.Mesh(geometry, material);
            mallaCapa.position.set(0, 0, config.z);
            mallaCapa.userData = { idCapa: idx, origZ: config.z };
            capasPrisma.push(mallaCapa);
            grupoPrisma.add(mallaCapa);
        });

        grupoPrisma.rotation.x = 0.4;
        grupoPrisma.rotation.y = 0.5;

        let isDraggingPrisma = false;
        let isSwipingPrisma = false;
        let clickStartX = 0, clickStartY = 0;
        let prevPrismaMousePosition = { x: 0, y: 0 };

        const startPrismaDrag = (clientX, clientY) => {
            if (faseFundamentoActiva) return; 

            const rect = renderer.domElement.getBoundingClientRect();
            const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

            // --- SI ESTAMOS EN FASE DE EFECTOS (PARTE 4) ---
            if (faseEfectosActiva) {
                const targets = [...prismasFase4];
                if (luzCentral) targets.push(luzCentral);

                const intersects = raycaster.intersectObjects(targets, true);
                if (intersects.length > 0) {
                    let obj = intersects[0].object;
                    while (obj.parent && !targets.includes(obj) && obj !== luzCentral) {
                        obj = obj.parent;
                    }
                    
                    if (targets.includes(obj) || obj === luzCentral) {
                        activeDragObject = obj;
                        const normal = new THREE.Vector3();
                        camera.getWorldDirection(normal);
                        normal.negate();
                        dragPlane.setFromNormalAndCoplanarPoint(normal, obj.position);
                        
                        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
                            dragOffset.copy(obj.position).sub(intersectionPoint);
                        }
                    }
                }
                return;
            }

            // Verificar click en el prisma principal
            const intersectsPrisma = raycaster.intersectObjects(grupoPrisma.children, true);

            if (intersectsPrisma.length > 0) {
                const hitObj = intersectsPrisma[0].object;
                const idCapa = hitObj.userData.idCapa;

                // Solo permitir deslizar los 4 bloques superiores de colores (0 a 3)
                if (idCapa >= 0 && idCapa <= 3) {
                    if (!modoInspeccionPermanente) {
                        // Clic inicial: Activar modo oscuro permanente y barajar colores
                        aleatorizarColoresCapas();
                        modoInspeccionPermanente = true;
                        if (prismaSection) prismaSection.classList.add('inspeccion-activa');
                    }
                    
                    // Preparar deslizamiento gestual del cajón específico
                    isSwipingPrisma = true;
                    activeSwipeLayer = hitObj;
                    clickStartX = clientX;
                    clickStartY = clientY;
                    capaEliminadaEnEsteSwipe = false;
                } else {
                    // Si se hace click en la base, rotar el prisma
                    isDraggingPrisma = true;
                    prevPrismaMousePosition = { x: clientX, y: clientY };
                }
            } else {
                // Presionó el vacío: rotar prisma
                isDraggingPrisma = true;
                prevPrismaMousePosition = { x: clientX, y: clientY };
            }
        };

        const movePrismaDrag = (clientX, clientY) => {
            if (faseFundamentoActiva) return;

            const rect = renderer.domElement.getBoundingClientRect();
            const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

            // --- SI ESTAMOS EN FASE DE EFECTOS (PARTE 4) Y ARRASTRANDO ---
            if (faseEfectosActiva) {
                if (activeDragObject) {
                    if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
                        const prevPos = activeDragObject.position.clone();
                        activeDragObject.position.copy(intersectionPoint).add(dragOffset);
                        // Limitar la posición para evitar arrastres fuera de la pantalla
                        activeDragObject.position.x = Math.max(-5.5, Math.min(5.5, activeDragObject.position.x));
                        activeDragObject.position.y = Math.max(-3.5, Math.min(3.5, activeDragObject.position.y));
                        // Forzar el plano Z correspondiente
                        if (activeDragObject.name === "luzCentral") {
                            activeDragObject.position.z = 0.1;
                        } else {
                            activeDragObject.position.z = 0.0;
                        }

                        // Estela interactiva de chispas al arrastrar el objeto
                        const travelDist = prevPos.distanceTo(activeDragObject.position);
                        if (travelDist > 0.05 && Math.random() < 0.45) {
                            // Blanco si es la bombilla central, o el color correspondiente si es un cubo
                            const col = activeDragObject.name === "luzCentral" ? 0xffffff : activeDragObject.userData.colorHex;
                            crearParticulaInteractiva(
                                activeDragObject.position,
                                col,
                                // Velocidad de las partículas contraria a la dirección del arrastre
                                (Math.random() - 0.5) * 0.06 - (activeDragObject.position.x - prevPos.x) * 0.2,
                                (Math.random() - 0.5) * 0.06 - (activeDragObject.position.y - prevPos.y) * 0.2,
                                1.1
                            );
                        }
                    }
                }
                return;
            }

            // Manejar Extracción Gestual del Prisma (Swipe Horizontal como Cajón)
            if (isSwipingPrisma && activeSwipeLayer && !capaEliminadaEnEsteSwipe) {
                const dx = clientX - clickStartX;
                const dist = Math.abs(dx);

                // Mover el cajón en tiempo real según el arrastre
                activeSwipeLayer.position.x = dx * 0.012;

                if (dist > 80) {
                    const dirX = dx > 0 ? 1.0 : -1.0;
                    const idxCapa = capasPrisma.indexOf(activeSwipeLayer);
                    if (idxCapa > -1) {
                        capasPrisma.splice(idxCapa, 1);
                        scene.add(activeSwipeLayer);

                        const worldPos = new THREE.Vector3();
                        activeSwipeLayer.getWorldPosition(worldPos);
                        activeSwipeLayer.position.copy(worldPos);
                        activeSwipeLayer.rotation.copy(grupoPrisma.rotation);

                        activeSwipeLayer.userData.dirSlideX = dirX;
                        activeSwipeLayer.userData.dirSlideY = 0.0;
                        activeSwipeLayer.userData.speed = 0.35;
                        activeSwipeLayer.userData.returnToCenter = false;
                        capasAnimando.push(activeSwipeLayer);
                        capasEliminadasContador++;
                        capaEliminadaEnEsteSwipe = true;

                        // Feedback visual de zoom y destello
                        dispararFeedbackExtraccion(activeSwipeLayer.material.color.getHex());
                        crearDestellosCromaticos(worldPos, activeSwipeLayer.material.color.getHex());
                        cameraShakeIntensity = 0.35;

                        // Liberar el bloque arrastrado
                        activeSwipeLayer = null;
                        isSwipingPrisma = false;

                        if (capasEliminadasContador >= 4) {
                            if (menuFinal) {
                                menuFinal.classList.remove('hidden-menu');
                                menuFinal.classList.add('reveal-menu');
                            }
                            modoInspeccionPermanente = false;
                            hoveringPrisma = false;
                            if (prismaSection) prismaSection.classList.remove('inspeccion-activa');
                        }
                    }
                }
            } else if (isDraggingPrisma && grupoPrisma) {
                const deltaX = clientX - prevPrismaMousePosition.x;
                const deltaY = clientY - prevPrismaMousePosition.y;

                grupoPrisma.rotation.y += deltaX * 0.007;
                grupoPrisma.rotation.x += deltaY * 0.007;

                prevPrismaMousePosition = { x: clientX, y: clientY };
            }
        };

        const stopPrismaDrag = () => {
            isDraggingPrisma = false;
            if (isSwipingPrisma && activeSwipeLayer) {
                activeSwipeLayer.userData.returnToCenter = true;
            }
            isSwipingPrisma = false;
            activeSwipeLayer = null;
            activeDragObject = null;
            capaEliminadaEnEsteSwipe = false;
        };

        canvasContainer.addEventListener('mousedown', (e) => startPrismaDrag(e.clientX, e.clientY));
        window.addEventListener('mouseup', stopPrismaDrag);
        window.addEventListener('mousemove', (e) => movePrismaDrag(e.clientX, e.clientY));

        canvasContainer.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Evitar scroll
            startPrismaDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        window.addEventListener('touchend', stopPrismaDrag);
        window.addEventListener('touchmove', (e) => {
            movePrismaDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        function animatePrisma() {
            animacionId = requestAnimationFrame(animatePrisma);
            
            if (!scene || !renderer || !camera) return; 



            // Resorte / Retorno al centro para cajones deslizantes sueltos
            if (grupoPrisma) {
                grupoPrisma.children.forEach(child => {
                    if (child.userData.returnToCenter) {
                        child.position.x += (0 - child.position.x) * 0.15;
                        if (Math.abs(child.position.x) < 0.01) {
                            child.position.x = 0;
                            child.userData.returnToCenter = false;
                        }
                    }
                });
            }

            // 1. Lerp de la cámara (Zoom pulse y Camera Shake)
            if (camera) {
                camera.position.z += (10 - camera.position.z) * 0.05;
                if (cameraShakeIntensity > 0.01) {
                    camera.position.x = (Math.random() - 0.5) * cameraShakeIntensity;
                    camera.position.y = (Math.random() - 0.5) * cameraShakeIntensity;
                    cameraShakeIntensity *= 0.88;
                } else {
                    camera.position.x = 0;
                    camera.position.y = 0;
                }
            }

            // 2. Lerp del destello de fondo en prismaSection (Solo en Parte 2)
            if (!faseFundamentoActiva && !faseTransicion3a4 && !faseEfectosActiva && (modoInspeccionPermanente || capasEliminadasContador > 0)) {
                currentBgColor.r += (targetBgColor.r - currentBgColor.r) * 0.12;
                currentBgColor.g += (targetBgColor.g - currentBgColor.g) * 0.12;
                currentBgColor.b += (targetBgColor.b - currentBgColor.b) * 0.12;
                
                if (prismaSection) {
                    prismaSection.style.backgroundColor = `rgb(${Math.round(currentBgColor.r)}, ${Math.round(currentBgColor.g)}, ${Math.round(currentBgColor.b)})`;
                }
            }

            // Animación de capas deslizándose
            for (let i = capasAnimando.length - 1; i >= 0; i--) {
                const c = capasAnimando[i];
                c.position.x += c.userData.dirSlideX * c.userData.speed;
                c.position.y += c.userData.dirSlideY * c.userData.speed;
                c.userData.speed *= 0.93;
                c.material.opacity -= 0.035;
                c.material.needsUpdate = true;
                if (c.material.opacity <= 0) {
                    scene.remove(c);
                    capasAnimando.splice(i, 1);
                }
            }

            // Animar y desvanecer cristales de explosión roja
            for (let i = cristalesExplosion.length - 1; i >= 0; i--) {
                const p = cristalesExplosion[i];
                p.position.x += p.userData.velX;
                p.position.y += p.userData.velY;
                p.position.z += p.userData.velZ;
                
                p.rotation.x += p.userData.rotX;
                p.rotation.y += p.userData.rotY;
                
                p.userData.opacity -= 0.018;
                p.userData.scale -= 0.015;
                if (p.material) {
                    p.material.opacity = p.userData.opacity;
                }
                p.scale.set(p.userData.scale, p.userData.scale, p.userData.scale);
                
                if (p.userData.opacity <= 0 || p.userData.scale <= 0) {
                    scene.remove(p);
                    cristalesExplosion.splice(i, 1);
                }
            }

            if (faseEfectosActiva) {
                // 1. ANIMACIÓN Y DESVANECIMIENTO DE LAS CHISPAS (PARTÍCULAS) DE FASE 4
                for (let i = particulasInteractivas.length - 1; i >= 0; i--) {
                    const p = particulasInteractivas[i];
                    p.position.x += p.userData.velX;
                    p.position.y += p.userData.velY;
                    p.position.z += p.userData.velZ;
                    p.rotation.x += p.userData.rotX;
                    p.rotation.y += p.userData.rotY;
                    
                    // Disminución gradual de opacidad y escala para que se desvanezcan con gracia
                    p.userData.opacity -= 0.02;
                    p.userData.scale -= 0.015;
                    if (p.material) {
                        p.material.opacity = p.userData.opacity;
                    }
                    p.scale.set(p.userData.scale, p.userData.scale, p.userData.scale);
                    
                    // Si ya son invisibles o diminutas, se eliminan de la memoria y la escena
                    if (p.userData.opacity <= 0 || p.userData.scale <= 0) {
                        scene.remove(p);
                        particulasInteractivas.splice(i, 1);
                    }
                }

                if (luzCentral) {
                    // Recuperar escala original de la bombilla blanca central tras el pulso (efecto rebote/elástico)
                    luzCentral.scale.x += (1.0 - luzCentral.scale.x) * 0.12;
                    luzCentral.scale.y += (1.0 - luzCentral.scale.y) * 0.12;
                    luzCentral.scale.z += (1.0 - luzCentral.scale.z) * 0.12;
                }

                // 2. INICIALIZAR ACUMULADORES CROMÁTICOS EN LA REJILLA DE FONDO PARA MEZCLAR COLORES
                rejillaInteractiva.forEach(cell => {
                    cell.userData.accumR = 0;
                    cell.userData.accumG = 0;
                    cell.userData.accumB = 0;
                    cell.userData.accumWeight = 0;
                });

                prismasFase4.forEach(prisma => {
                    // Rotación básica de los cubos flotantes
                    if (prisma.userData.spinVelocity === undefined) {
                        prisma.userData.spinVelocity = 0;
                    }
                    prisma.rotation.y += 0.006 + prisma.userData.spinVelocity;
                    prisma.rotation.x += 0.004;
                    prisma.userData.spinVelocity += (0.0 - prisma.userData.spinVelocity) * 0.08; // Desaceleración suave tras el clic

                    // Recuperar escala original de los cubos (efecto resorte al clicar)
                    prisma.scale.x += (1.0 - prisma.scale.x) * 0.1;
                    prisma.scale.y += (1.0 - prisma.scale.y) * 0.1;
                    prisma.scale.z += (1.0 - prisma.scale.z) * 0.1;

                    // Animación de escalado progresivo al nacer (morphing inicial)
                    if (prisma.userData.animatingSpawn) {
                        const targetScale = 1.0;
                        prisma.scale.x += (targetScale - prisma.scale.x) * 0.12;
                        prisma.scale.y += (targetScale - prisma.scale.y) * 0.12;
                        prisma.scale.z += (targetScale - prisma.scale.z) * 0.12;

                        if (Math.abs(prisma.scale.x - targetScale) < 0.01) {
                            prisma.scale.set(targetScale, targetScale, targetScale);
                            prisma.userData.animatingSpawn = false;
                        }
                    }

                    // 3. ACTUALIZACIÓN GEOMÉTRICA DE LOS HACES DE LUZ
                    const hazMesh = prisma.userData.hazMesh;
                    if (hazMesh && luzCentral) {
                        const dir = new THREE.Vector3().copy(prisma.position).sub(luzCentral.position);
                        const dist = dir.length();
                        dir.normalize();

                        // Posiciona el haz de luz exactamente detrás del prisma
                        hazMesh.position.copy(prisma.position);
                        hazMesh.position.z = -0.3; 

                        // Rota el haz para que apunte en sentido opuesto a la bombilla
                        const angle = Math.atan2(dir.y, dir.x) + Math.PI / 2;
                        hazMesh.rotation.z = angle;

                        // Escala dinámica del haz (mayor cercanía al foco de luz = haz más largo y disperso)
                        const largoHaz = Math.max(1.0, 9.0 - dist);
                        hazMesh.scale.y = largoHaz / 2.0;
                        hazMesh.scale.x = 1.0 + (largoHaz * 0.12);

                        // 4. ACUMULACIÓN DE INTENSIDAD PARA PINTADO Y MEZCLA CROMÁTICA EN LA REJILLA
                        const colorHex = prisma.userData.colorHex;
                        const r = ((colorHex >> 16) & 255) / 255;
                        const g = ((colorHex >> 8) & 255) / 255;
                        const b = (colorHex & 255) / 255;
                        const cubePos = prisma.position;

                        rejillaInteractiva.forEach(cell => {
                            const v = new THREE.Vector3().copy(cell.position).sub(cubePos);
                            v.z = 0;
                            
                            const proj = v.dot(dir);
                            const maxDistHaz = largoHaz * 3.0; // Largo absoluto del haz en 3D

                            if (proj > 0 && proj < maxDistHaz) {
                                const projVec = new THREE.Vector3().copy(dir).multiplyScalar(proj);
                                const perpDist = new THREE.Vector3().copy(v).sub(projVec).length();
                                const anchoHaz = 0.8 + proj * 0.28;

                                if (perpDist < anchoHaz) {
                                    const factorDistancia = 1.0 - (proj / maxDistHaz);
                                    const intensity = factorDistancia * 0.7; // Factor de peso/intensidad del haz
                                    
                                    // Acumula la contribución de color y peso de este haz para esta celda
                                    cell.userData.accumR += r * intensity;
                                    cell.userData.accumG += g * intensity;
                                    cell.userData.accumB += b * intensity;
                                    cell.userData.accumWeight += intensity;
                                }
                            }
                        });
                    }
                });

                // 5. MEZCLA CROMÁTICA FINAL EN LA REJILLA (INTERPOLACIÓN Y PINTADO ADITIVO)
                rejillaInteractiva.forEach(cell => {
                    if (cell.userData.accumWeight > 0) {
                        // Calcula el color promedio ponderado
                        const mixedR = cell.userData.accumR / cell.userData.accumWeight;
                        const mixedG = cell.userData.accumG / cell.userData.accumWeight;
                        const mixedB = cell.userData.accumB / cell.userData.accumWeight;
                        const targetOp = Math.min(0.65, cell.userData.accumWeight * 0.85);

                        // Interpolación del color (transición suave para evitar cortes abruptos)
                        cell.material.color.r += (mixedR - cell.material.color.r) * 0.2;
                        cell.material.color.g += (mixedG - cell.material.color.g) * 0.2;
                        cell.material.color.b += (mixedB - cell.material.color.b) * 0.2;

                        if (cell.material.opacity < targetOp) {
                            cell.material.opacity += (targetOp - cell.material.opacity) * 0.25;
                        }
                    } else {
                        // Desvanecimiento lento de la rejilla (pintura que se borra/difumina lentamente en el tiempo)
                        cell.material.opacity += (0.0 - cell.material.opacity) * 0.025;
                    }
                });
            }

            // Actualizar dirección de la luz interactiva del mouse (barrido suave)
            if (mouseLight && camera) {
                const targetX = mouseVector.x * 6.5;
                const targetY = mouseVector.y * 4.5;
                mouseLight.position.x += (targetX - mouseLight.position.x) * 0.1;
                mouseLight.position.y += (targetY - mouseLight.position.y) * 0.1;
                mouseLight.position.z = 8.0; // Distancia para crear un barrido de ángulo más difuso
            }

            if (grupoPrisma) {
                if (isDraggingPrisma || isSwipingPrisma) {
                    // Regresar posición Y al centro mientras se arrastra
                    grupoPrisma.position.y += (0 - grupoPrisma.position.y) * 0.1;
                }
            }

            if (!faseFundamentoActiva && !faseEfectosActiva && grupoPrisma) { 
                if (!isDraggingPrisma && !modoInspeccionPermanente) {
                    grupoPrisma.rotation.y += 0.005; 
                } else if (modoInspeccionPermanente && !isDraggingPrisma && !isSwipingPrisma) {
                    // Movimiento flotante sutil (oscilación de balanceo y altura)
                    const tiempo = Date.now() * 0.001;
                    grupoPrisma.position.y += (Math.sin(tiempo * 1.2) * 0.12 - grupoPrisma.position.y) * 0.05;
                    grupoPrisma.rotation.y += Math.sin(tiempo * 0.8) * 0.0008;
                    grupoPrisma.rotation.x += Math.cos(tiempo * 0.8) * 0.0006;
                }
            }

            if (faseFundamentoActiva && cuadraditosFundamento.length > 0) {
                // Raycasting para detectar hover
                raycaster.setFromCamera(mouseVector, camera);
                const intersects = raycaster.intersectObjects(cuadraditosFundamento);
                const hoveredUuid = intersects.length > 0 ? intersects[0].object.uuid : null;

                cuadraditosFundamento.forEach(cubo => {
                    if(!cubo) return;

                    // Incrementar progreso de nacimiento para la animación
                    if (cubo.userData.spawnProgress === undefined) {
                        cubo.userData.spawnProgress = 0.0;
                    }
                    if (cubo.userData.spawnProgress < 1.0) {
                        cubo.userData.spawnProgress += 0.025; // Se completa en 40 frames (~0.6s)
                        if (cubo.userData.spawnProgress > 1.0) cubo.userData.spawnProgress = 1.0;
                    }
                    const prog = cubo.userData.spawnProgress;

                    // Desacelerar velocidades de empuje de la onda
                    if (cubo.userData.pushVelX !== undefined) {
                        cubo.userData.pushVelX *= 0.92;
                        cubo.userData.pushVelY *= 0.92;
                        cubo.userData.pushVelZ *= 0.92;

                        cubo.position.x += cubo.userData.pushVelX;
                        cubo.position.y += cubo.userData.pushVelY;
                        cubo.position.z += cubo.userData.pushVelZ;
                    }

                    // Calcular la posición base interpolada desde el centro de la pantalla
                    const curOrigX = cubo.userData.origX * prog;
                    const curOrigY = cubo.userData.origY * prog;
                    const curOrigZ = cubo.userData.origZ * prog;

                    const posDestinoX = curOrigX + (cubo.userData.dirX * targetSeparacion * 4.0);
                    const posDestinoY = curOrigY + (cubo.userData.dirY * targetSeparacion * 4.0);
                    const posDestinoZ = curOrigZ + (cubo.userData.dirZ * targetSeparacion * 5.5);

                    cubo.position.x += (posDestinoX - cubo.position.x) * 0.1;
                    cubo.position.y += (posDestinoY - cubo.position.y) * 0.1;
                    cubo.position.z += (posDestinoZ - cubo.position.z) * 0.1;

                    // Dinámica reactiva al hover y pérdida de nitidez (difuminación)
                    let baseOpacity = (0.85 - (targetSeparacion * 0.55)) * prog;
                    let targetOpacity = baseOpacity;
                    let targetScale = (1.0 + (targetSeparacion * 0.6)) * prog;
                    let hoverSpin = 0;

                    if (cubo.uuid === hoveredUuid && prog >= 1.0) {
                        targetScale = 2.2; 
                        hoverSpin = 0.25; 
                        targetOpacity = 0.75; 
                    }

                    cubo.scale.x += (targetScale - cubo.scale.x) * 0.15;
                    cubo.scale.y += (targetScale - cubo.scale.y) * 0.15;
                    cubo.scale.z += (targetScale - cubo.scale.z) * 0.15;

                    // Aplicar opacidad, brillo de autoluminiscencia y aspereza física al material
                    if (cubo.material) {
                        cubo.material.opacity += (targetOpacity - cubo.material.opacity) * 0.15;
                        
                        // Brillo emissive dinámico (brilla con más intensidad al pasar el mouse por encima)
                        let targetEmissiveIntensity = 0.18;
                        if (cubo.uuid === hoveredUuid && prog >= 1.0) {
                            targetEmissiveIntensity = 0.45;
                        }
                        cubo.material.emissiveIntensity += (targetEmissiveIntensity - cubo.material.emissiveIntensity) * 0.15;
                        
                        // Perder nitidez reflejante (se vuelve más rugoso al separarse o al pasar el cursor)
                        let targetRoughness = 0.1 + (targetSeparacion * 0.8) + (cubo.uuid === hoveredUuid && prog >= 1.0 ? 0.4 : 0);
                        cubo.material.roughness += (targetRoughness - cubo.material.roughness) * 0.15;
                    }

                    const velRot = 0.005 + (targetSeparacion * 0.06) + hoverSpin; 
                    cubo.rotation.x += velRot * cubo.userData.rotXFactor;
                    cubo.rotation.y += velRot * cubo.userData.rotYFactor;
                });
            }

            if (faseTransicion3a4) {
                transicionTime++;
                for (let i = cuadraditosFundamento.length - 1; i >= 0; i--) {
                    const cubo = cuadraditosFundamento[i];
                    if (!cubo) continue;
                    
                    if (!cubo.userData.isMorpher) {
                        // Gravedad
                        cubo.userData.fallVelY += 0.005;
                        cubo.position.x += cubo.userData.fallVelX;
                        cubo.position.y -= cubo.userData.fallVelY;
                        cubo.position.z += cubo.userData.fallVelZ;
                        cubo.rotation.x += 0.02;
                        cubo.rotation.y += 0.03;
                        
                        if (cubo.material) {
                            cubo.material.opacity -= 0.02;
                            cubo.material.needsUpdate = true;
                        }
                        
                        if (cubo.position.y < -6 || (cubo.material && cubo.material.opacity <= 0)) {
                            scene.remove(cubo);
                            cuadraditosFundamento.splice(i, 1);
                        }
                    } else {
                        // Morpher lerp a su destino
                        const target = cubo.userData.targetPos;
                        cubo.position.lerp(target, 0.08);
                        cubo.rotation.x += 0.08;
                        cubo.rotation.y += 0.08;
                        
                        // Crecer y desvanecer para fusionarse
                        if (transicionTime > 40) {
                            const s = cubo.scale.x + (2.5 - cubo.scale.x) * 0.1;
                            cubo.scale.set(s, s, s);
                            if (cubo.material) {
                                cubo.material.opacity -= 0.025;
                                cubo.material.needsUpdate = true;
                            }
                        }
                    }
                }
                
                if (transicionTime >= 70) {
                    faseTransicion3a4 = false;
                    morphers.forEach(m => { scene.remove(m); });
                    morphers = [];
                    cuadraditosFundamento.forEach(c => { scene.remove(c); });
                    cuadraditosFundamento.length = 0;
                    
                    activarFase4Efectos();
                }
            }
            renderer.render(scene, camera);
        }
        animatePrisma();
    }

    if (btnSiguienteRecorrido) {
        btnSiguienteRecorrido.addEventListener('click', () => {
            if (menuFinal) menuFinal.style.display = 'none'; 
            activarTransicionFundamentoVisual();
        });
    }

    // ==========================================
    // 4. TRANSICIÓN MODULAR LIMPIA (TEXTO ORIGINAL)
    // ==========================================
    function activarTransicionFundamentoVisual() {
        if (textoGuia) {
            textoGuia.style.display = 'none';
        }

        estrellasTriggers.forEach(estrella => {
            estrella.style.display = 'none';
        });
        
        if (grupoPrisma && scene) { scene.remove(grupoPrisma); }
        
        // Limpiar objetos colaterales de la fase 2 para que no queden flotando en la fase 3
        objetosArrastrables.forEach(obj => {
            if (scene) scene.remove(obj);
        });
        objetosArrastrables.length = 0;

        // Limpiar capas que todavía se estén animando (deslizándose) para que no queden flotando en la fase 3
        capasAnimando.forEach(layer => {
            if (scene) scene.remove(layer);
        });
        capasAnimando.length = 0;

        // Asegurar que el fondo sea claro con la cuadrícula
        if (prismaSection) {
            prismaSection.style.backgroundColor = '';
            prismaSection.style.background = '';
            prismaSection.classList.remove('inspeccion-activa');
        }
        if (rejillaClara) {
            rejillaClara.style.display = 'block';
        }
        
        clickesDeCubosRealizados = 0;
        if (btnSiguienteSeccion) { 
            btnSiguienteSeccion.style.display = 'none'; // Hidden until 3 cubes are clicked
            btnSiguienteSeccion.style.right = 'auto';
            btnSiguienteSeccion.style.left = '50%';
            btnSiguienteSeccion.style.transform = 'translateX(-50%)';
            btnSiguienteSeccion.style.bottom = '75px'; 
        }

        // Paleta de colores unificada y configuraciones de creación para la lluvia de cubitos en Fase 3
        const coloresPaleta = [0x28a745, 0xffc107, 0xdc3545, 0x007bff]; 
        const totalModulos = 65; 

        for (let i = 0; i < totalModulos; i++) {
            const geomCubo = new THREE.BoxGeometry(0.45, 0.45, 0.04); // Fragmentos planos cuadrados
            const colorHex = coloresPaleta[i % coloresPaleta.length];
            const matCubo = new THREE.MeshPhysicalMaterial({
                color: colorHex,
                emissive: colorHex, // Restablece el brillo cálido del acrilico
                emissiveIntensity: 0.18,
                transparent: true, 
                opacity: 0.0, 
                roughness: 0.15, 
                transmission: 0.0, // Sin refracción interna
                side: THREE.DoubleSide, 
                depthWrite: false
            });
            const cuboMesh = new THREE.Mesh(geomCubo, matCubo);
            const origX = (Math.random() - 0.5) * 4.0;
            const origY = (Math.random() - 0.5) * 3.0;
            const origZ = (Math.random() - 0.5) * 2.0;
            cuboMesh.position.set(0, 0, 0); // Iniciar en el centro de la escena
            cuboMesh.scale.set(0, 0, 0); // Iniciar invisibles/diminutos
            cuboMesh.userData = {
                origX: origX, origY: origY, origZ: origZ,
                dirX: (Math.random() - 0.5) * 8.0, dirY: (Math.random() - 0.5) * 5.0, dirZ: (Math.random() - 0.5) * 6.0,
                rotXFactor: (Math.random() - 0.5) * 2.0, rotYFactor: (Math.random() - 0.5) * 2.0,
                pushVelX: 0, pushVelY: 0, pushVelZ: 0,
                spawnProgress: 0.0 // Progreso inicial de animación
            };
            cuadraditosFundamento.push(cuboMesh);
            if(scene) scene.add(cuboMesh);
        }
        faseFundamentoActiva = true;
    }

    // ==========================================
    // 5. LABORATORIO ÓPTICO (FASE 4) Y VICTORIA
    // ==========================================
    // Genera una textura de gradiente blanca lineal y translúcida (usando canvas 2D offline)
    function crearTexturaGradiente() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.35)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 256);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    // Instancia una nueva partícula de brillo (chispa) y la agrega a la escena y al array global
    function crearParticulaInteractiva(posicion, colorHex, velocidadX, velocidadY, tamañoFactor = 1.0) {
        const size = 0.04 + Math.random() * 0.08 * tamañoFactor;
        const geom = new THREE.BoxGeometry(size, size, size); // Partículas cuadradas (fiel al concepto)
        const mat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.9,
            depthWrite: false
        });
        const part = new THREE.Mesh(geom, mat);
        part.position.copy(posicion);
        // Pequeño desvío aleatorio inicial para naturalidad
        part.position.x += (Math.random() - 0.5) * 0.1;
        part.position.y += (Math.random() - 0.5) * 0.1;
        part.position.z += (Math.random() - 0.5) * 0.1;

        part.userData = {
            velX: velocidadX,
            velY: velocidadY,
            velZ: (Math.random() - 0.5) * 0.04,
            rotX: (Math.random() - 0.5) * 0.2,
            rotY: (Math.random() - 0.5) * 0.2,
            opacity: 0.9,
            scale: 1.0
        };
        if (scene) scene.add(part);
        particulasInteractivas.push(part);
    }

    // Helper para remover y limpiar todas las partículas interactivas al reiniciar/finalizar el juego
    function limpiarParticulasInteractivas() {
        particulasInteractivas.forEach(p => {
            if (scene) scene.remove(p);
        });
        particulasInteractivas.length = 0;
    }

    function activarFase4Efectos() {
        faseFundamentoActiva = false;
        
        // Limpiar cubos de la Fase 3
        cuadraditosFundamento.forEach(cubo => {
            if (scene) scene.remove(cubo);
        });
        cuadraditosFundamento.length = 0;

        if (btnSiguienteSeccion) btnSiguienteSeccion.style.display = 'none';
        
        if (btnFinalizarJuegoFlotante) {
            btnFinalizarJuegoFlotante.classList.remove('hidden-menu');
            btnFinalizarJuegoFlotante.classList.add('reveal-menu');
        }

        // Asegurar fondo blanco en Fase 4
        if (prismaSection) {
            prismaSection.style.backgroundColor = '#ffffff';
            prismaSection.classList.remove('inspeccion-activa');
        }
        if (rejillaClara) {
            rejillaClara.style.display = 'block';
        }

        // Limpiar residuales
        prismasFase4.forEach(p => {
            if (scene) scene.remove(p);
        });
        prismasFase4.length = 0;

        hacesDeLuzFase4.forEach(h => {
            if (scene) scene.remove(h);
        });
        hacesDeLuzFase4.length = 0;

        // Limpiar e instanciar celdas de rejilla interactiva de fondo
        rejillaInteractiva.forEach(cell => {
            if (scene) scene.remove(cell);
        });
        rejillaInteractiva.length = 0;

        const cols = 14;
        const filas = 9;
        const cellW = 1.0;
        const cellH = 1.0;
        const startX = -((cols - 1) * cellW) / 2;
        const startY = -((filas - 1) * cellH) / 2;

        for (let r = 0; r < filas; r++) {
            for (let c = 0; c < cols; c++) {
                const geomCell = new THREE.PlaneGeometry(cellW * 0.93, cellH * 0.93);
                const matCell = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.0,
                    depthWrite: false
                });
                const cellMesh = new THREE.Mesh(geomCell, matCell);
                cellMesh.position.set(startX + c * cellW, startY + r * cellH, -0.6);
                scene.add(cellMesh);
                rejillaInteractiva.push(cellMesh);
            }
        }

        if (luzCentral) {
            if (scene) scene.remove(luzCentral);
            luzCentral = null;
        }

        // 1. Crear el Foco de Luz Central (draggable)
        luzCentral = new THREE.Mesh(
            new THREE.SphereGeometry(0.38, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.95
            })
        );
        luzCentral.name = "luzCentral";
        luzCentral.position.set(0, 0, 0.1);
        scene.add(luzCentral);

        // Configuración de los 4 cubos de colores en Fase 4 (unificados con los tonos estándar de Part 1)
        const configs = [
            { color: 0x007bff, x: -2.2, y: 1.2, name: 'azul' },
            { color: 0xdc3545, x: 2.2, y: 1.2, name: 'rojo' },
            { color: 0xffc107, x: -2.2, y: -1.2, name: 'amarillo' },
            { color: 0x28a745, x: 2.2, y: -1.2, name: 'verde' }
        ];

        configs.forEach(cfg => {
            // Cubo exterior de cristal acrílico puro y limpio (sin refracción interna)
            const geomExt = new THREE.BoxGeometry(1.3, 1.3, 1.3);
            const matExt = new THREE.MeshPhysicalMaterial({
                color: cfg.color,
                roughness: 0.15,
                metalness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.65,
                depthWrite: true,
                side: THREE.FrontSide
            });
            const meshExt = new THREE.Mesh(geomExt, matExt);
            meshExt.name = cfg.name;
            meshExt.position.set(cfg.x, cfg.y, 0);

            // Iniciar en escala diminuta para la animación de nacer
            meshExt.scale.set(0.1, 0.1, 0.1);

            // Crear el Haz de Luz proyectado con Normal Blending suave
            const geomHaz = new THREE.PlaneGeometry(1.6, 6.0);
            geomHaz.translate(0, -3.0, 0);
            const matHaz = new THREE.MeshBasicMaterial({
                color: cfg.color,
                map: crearTexturaGradiente(), // white gradient map
                transparent: true,
                opacity: 0.35, // Opacidad difusa para ver bien los tonos y rejillas
                blending: THREE.NormalBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });
            const hazMesh = new THREE.Mesh(geomHaz, matHaz);
            hazMesh.position.set(cfg.x, cfg.y, -0.3);
            scene.add(hazMesh);
            hacesDeLuzFase4.push(hazMesh);

            meshExt.userData = {
                colorHex: cfg.color,
                animatingSpawn: true,
                hazMesh: hazMesh
            };

            if (scene) scene.add(meshExt);
            prismasFase4.push(meshExt);
        });

        faseEfectosActiva = true;
    }

    if (btnSiguienteSeccion) {
        btnSiguienteSeccion.addEventListener('click', () => {
            if (btnSiguienteSeccion) btnSiguienteSeccion.style.display = 'none';
            
            faseFundamentoActiva = false; // Desactivar clics de la fase 3
            faseTransicion3a4 = true;
            transicionTime = 0;
            morphers = [];
            
            // Definición de destinos y colores para los morphers (los 4 cubos de Fase 3 que se fusionan para crear Fase 4)
            const morpherConfigs = [
                { colorHex: 0x007bff, targetPos: new THREE.Vector3(-2.2, 1.2, 0), name: 'azul' },
                { colorHex: 0xdc3545, targetPos: new THREE.Vector3(2.2, 1.2, 0), name: 'rojo' },
                { colorHex: 0xffc107, targetPos: new THREE.Vector3(-2.2, -1.2, 0), name: 'amarillo' },
                { colorHex: 0x28a745, targetPos: new THREE.Vector3(2.2, -1.2, 0), name: 'verde' }
            ];
            
            const chosenIndices = new Set();
            
            morpherConfigs.forEach(cfg => {
                const foundIdx = cuadraditosFundamento.findIndex((cubo, idx) => {
                    if (chosenIndices.has(idx)) return false;
                    const hex = cubo.material.color.getHex();
                    // Emparejar cubos por color exacto
                    return hex === cfg.colorHex;
                });
                
                if (foundIdx > -1) {
                    chosenIndices.add(foundIdx);
                    const mesh = cuadraditosFundamento[foundIdx];
                    mesh.userData.isMorpher = true;
                    mesh.userData.targetPos = cfg.targetPos;
                    mesh.userData.name = cfg.name;
                    morphers.push(mesh);
                }
            });
            
            // Respaldar si falta algún color por distribución aleatoria
            morpherConfigs.forEach(cfg => {
                const alreadyMatched = morphers.some(m => m.userData.name === cfg.name);
                if (!alreadyMatched) {
                    const freeIdx = cuadraditosFundamento.findIndex((c, idx) => !chosenIndices.has(idx));
                    if (freeIdx > -1) {
                        chosenIndices.add(freeIdx);
                        const mesh = cuadraditosFundamento[freeIdx];
                        mesh.userData.isMorpher = true;
                        mesh.userData.targetPos = cfg.targetPos;
                        mesh.userData.name = cfg.name;
                        mesh.material.color.setHex(cfg.colorHex);
                        mesh.material.emissive.setHex(cfg.colorHex);
                        morphers.push(mesh);
                    }
                }
            });
            
            // Configurar gravedad para el resto de cubitos
            cuadraditosFundamento.forEach(cubo => {
                if (!cubo.userData.isMorpher) {
                    cubo.userData.fallVelY = (Math.random() * 0.04) + 0.02;
                    cubo.userData.fallVelX = (Math.random() - 0.5) * 0.03;
                    cubo.userData.fallVelZ = (Math.random() - 0.5) * 0.03;
                }
            });
        });
    }

    if (btnFinalizarJuegoFlotante) {
        btnFinalizarJuegoFlotante.addEventListener('click', () => {
            faseEfectosActiva = false;
            
            prismasFase4.forEach(p => {
                if (scene) scene.remove(p);
            });
            prismasFase4.length = 0;
            prismaActivo = null;

            hacesDeLuzFase4.forEach(h => {
                if (scene) scene.remove(h);
            });
            hacesDeLuzFase4.length = 0;

            limpiarParticulasInteractivas();

            rejillaInteractiva.forEach(cell => {
                if (scene) scene.remove(cell);
            });
            rejillaInteractiva.length = 0;

            if (luzCentral) {
                if (scene) scene.remove(luzCentral);
                luzCentral = null;
            }
            
            if (btnFinalizarJuegoFlotante) {
                btnFinalizarJuegoFlotante.classList.remove('reveal-menu');
                btnFinalizarJuegoFlotante.classList.add('hidden-menu');
            }
            
            if (canvasContainer) canvasContainer.style.display = 'none'; 
            if (rejillaClara) rejillaClara.style.display = 'none';
            
            if (renderer && renderer.domElement) {
                renderer.domElement.style.filter = '';
            }
            
            if (prismaSection) {
                prismaSection.style.setProperty('background-color', '#000000', 'important');
            }
            
            if (pantallaVictoria) {
                const victoriaTitulo = document.getElementById('victoriaTitulo');
                if (victoriaTitulo) {
                    victoriaTitulo.innerHTML = '';
                    const texto = "CUADRICULANDO";
                    texto.split('').forEach((letra, idx) => {
                        const span = document.createElement('span');
                        span.textContent = letra === ' ' ? '\u00A0' : letra;
                        span.classList.add('victoria-letra');
                        span.style.animationDelay = `${idx * 0.1}s`;
                        victoriaTitulo.appendChild(span);
                    });
                }
                pantallaVictoria.classList.remove('hidden-screen');
                pantallaVictoria.classList.add('reveal-screen');
            }
        });
    }

    const btnIrIndex = document.getElementById('btnIrIndex');
    if (btnIrIndex) {
        btnIrIndex.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (btnReiniciarPrisma) {
        btnReiniciarPrisma.addEventListener('click', () => {
            inicializarPrisma3D();
        });
    }

    // ==========================================
    // 6. EVENTOS DE MOUSE/CLICK DE CUBITOS (PARTE 3)
    // ==========================================
    document.addEventListener('mousemove', (e) => {
        if (!faseFundamentoActiva) return;
        const anchoMitad = window.innerWidth / 2;
        const altoMitad = window.innerHeight / 2;
        const diffX = e.clientX - anchoMitad;
        const diffY = e.clientY - altoMitad;
        const distancia = Math.sqrt(diffX * diffX + diffY * diffY);
        const maxDistancia = Math.sqrt(anchoMitad * anchoMitad + altoMitad * altoMitad);
        targetSeparacion = distancia / maxDistancia; 

        if (renderer) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!faseFundamentoActiva || !e.touches.length) return;
        const touch = e.touches[0];
        const anchoMitad = window.innerWidth / 2;
        const altoMitad = window.innerHeight / 2;
        const diffX = touch.clientX - anchoMitad;
        const diffY = touch.clientY - altoMitad;
        const distancia = Math.sqrt(diffX * diffX + diffY * diffY);
        const maxDistancia = Math.sqrt(anchoMitad * anchoMitad + altoMitad * altoMitad);
        targetSeparacion = distancia / maxDistancia; 

        if (renderer) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseVector.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        }
    }, { passive: true });

    // ==========================================
    // MOUSE CLICK LISTENERS / GESTIÓN DE CLICS
    // ==========================================
    if (canvasContainer) {
        canvasContainer.addEventListener('click', (e) => {
            // --- DETECTAR INTERACCIONES DE CLIC EN FASE 4 (SANDBOX DE PINTURA) ---
            if (faseEfectosActiva && scene && camera && renderer) {
                const rect = renderer.domElement.getBoundingClientRect();
                mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouseVector, camera);
                
                // 1. INTERACCIÓN AL CLICAR CUBOS (DEFORMACIÓN ELÁSTICA + VELOCIDAD DE GIRO + CHISPAS DE COLOR)
                const intersectsCubes = raycaster.intersectObjects(prismasFase4, true);
                if (intersectsCubes.length > 0) {
                    let clickedCubo = intersectsCubes[0].object;
                    // Asegurar que obtenemos el cubo padre en caso de jerarquías complejas
                    while (clickedCubo.parent && !prismasFase4.includes(clickedCubo)) {
                        clickedCubo = clickedCubo.parent;
                    }
                    // Squash-and-stretch: aplastar en Y y ensanchar en X/Z para sensación elástica
                    clickedCubo.scale.set(1.4, 0.6, 1.4);
                    clickedCubo.userData.spinVelocity = 0.22; // Impulso de giro veloz

                    // Emitir una explosión circular de chispas del color del cubo
                    const col = clickedCubo.userData.colorHex;
                    for (let i = 0; i < 15; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 0.04 + Math.random() * 0.08;
                        crearParticulaInteractiva(
                            clickedCubo.position,
                            col,
                            Math.cos(angle) * speed,
                            Math.sin(angle) * speed,
                            1.0
                        );
                    }
                    return;
                }

                // 2. INTERACCIÓN AL CLICAR LA BOMBILLA CENTRAL (PULSO DE ESCALA ELÁSTICO + CHISPAS BLANCAS)
                if (luzCentral) {
                    const intersectsBulb = raycaster.intersectObject(luzCentral);
                    if (intersectsBulb.length > 0) {
                        luzCentral.scale.set(1.7, 1.7, 1.7); // Crecer momentáneamente
                        // Emitir una explosión radial de chispas blancas
                        for (let i = 0; i < 22; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 0.05 + Math.random() * 0.1;
                            crearParticulaInteractiva(
                                luzCentral.position,
                                0xffffff,
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed,
                                1.4
                            );
                        }
                        return;
                    }
                }

                // 3. INTERACCIÓN AL CLICAR LA REJILLA DE FONDO VACÍA (ONDA EXPANSIVA DE COLOR)
                const intersectsGrid = raycaster.intersectObjects(rejillaInteractiva);
                if (intersectsGrid.length > 0) {
                    const clickedCell = intersectsGrid[0].object;
                    const clickPos = clickedCell.position;
                    
                    // Elegir un color aleatorio de la paleta estándar de Part 1
                    const coloresRipple = [0x28a745, 0xffc107, 0xdc3545, 0x007bff];
                    const chosenColor = coloresRipple[Math.floor(Math.random() * coloresRipple.length)];

                    // Disparar la propagación de color en forma de onda expansiva a las celdas vecinas
                    rejillaInteractiva.forEach(cell => {
                        const dist = cell.position.distanceTo(clickPos);
                        if (dist < 4.8) {
                            // Retrasar el encendido de la celda proporcionalmente a su distancia al clic
                            setTimeout(() => {
                                if (faseEfectosActiva && cell && cell.material) {
                                    cell.material.color.setHex(chosenColor);
                                    // La opacidad decae al alejarse del centro
                                    cell.material.opacity = Math.max(0.65, 0.85 - dist * 0.15);
                                }
                            }, dist * 80); // Velocidad de propagación de la onda
                        }
                    });

                    // Emitir algunas partículas del color de la onda en el punto de impacto
                    for (let i = 0; i < 8; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 0.03 + Math.random() * 0.06;
                        crearParticulaInteractiva(
                            clickPos,
                            chosenColor,
                            Math.cos(angle) * speed,
                            Math.sin(angle) * speed,
                            0.8
                        );
                    }
                }
                return;
            }
            if (!faseFundamentoActiva || !scene || !camera || !renderer) return;

            const rect = renderer.domElement.getBoundingClientRect();
            mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);
            const intersects = raycaster.intersectObjects(cuadraditosFundamento);

            if (intersects.length > 0) {
                const clickedCubo = intersects[0].object;
                
                // Incrementar contador si es un clic en un cubo único
                if (!clickedCubo.userData.clickeado) {
                    clickedCubo.userData.clickeado = true;
                    clickesDeCubosRealizados++;
                    if (clickesDeCubosRealizados >= 3) {
                        if (btnSiguienteSeccion) {
                            btnSiguienteSeccion.style.display = 'block';
                        }
                    }
                }

                const centerPos = clickedCubo.position.clone();

                cuadraditosFundamento.forEach(cubo => {
                    if (!cubo) return;
                    
                    const dir = cubo.position.clone().sub(centerPos);
                    const dist = dir.length();
                    
                    if (cubo === clickedCubo) {
                        cubo.userData.pushVelX = (Math.random() - 0.5) * 1.5;
                        cubo.userData.pushVelY = (Math.random() - 0.5) * 1.5;
                        cubo.userData.pushVelZ = (Math.random() - 0.5) * 1.5;
                        cubo.userData.rotXFactor = (Math.random() - 0.5) * 15.0;
                        cubo.userData.rotYFactor = (Math.random() - 0.5) * 15.0;
                        
                        if (cubo.material) {
                            const originalColor = cubo.material.color.getHex();
                            cubo.material.color.setHex(0xffffff);
                            cubo.material.emissive.setHex(0xffffff);
                            setTimeout(() => {
                                if (cubo && cubo.material) {
                                    cubo.material.color.setHex(originalColor);
                                    cubo.material.emissive.setHex(originalColor);
                                }
                            }, 250);
                        }
                    } else {
                        const force = Math.max(0, 6.0 - dist) * 0.25;
                        if (force > 0) {
                            dir.normalize().multiplyScalar(force);
                            cubo.userData.pushVelX = dir.x;
                            cubo.userData.pushVelY = dir.y;
                            cubo.userData.pushVelZ = dir.z;
                        }
                    }
                });
            }
        });
    }

    const btnIrInicio = document.getElementById('btnIrInicio');
    if (btnIrInicio) {
        btnIrInicio.addEventListener('click', () => {
            // Ocultar pantalla de victoria
            if (pantallaVictoria) {
                pantallaVictoria.classList.remove('reveal-screen');
                pantallaVictoria.classList.add('hidden-screen');
            }
            
            // Ocultar sección de prisma y volver a portada
            if (prismaSection) {
                prismaSection.classList.add('hidden-screen');
                prismaSection.style.backgroundColor = '';
            }
            if (pantallaPortada) pantallaPortada.classList.remove('hidden-screen');
            if (backgroundLiquido) backgroundLiquido.classList.remove('hidden-screen');
            
            // Resetear estado del juego
            faseEfectosActiva = false;
            prismasFase4.forEach(p => {
                if (scene) scene.remove(p);
            });
            prismasFase4.length = 0;
            prismaActivo = null;

            hacesDeLuzFase4.forEach(h => {
                if (scene) scene.remove(h);
            });
            hacesDeLuzFase4.length = 0;

            limpiarParticulasInteractivas();

            rejillaInteractiva.forEach(cell => {
                if (scene) scene.remove(cell);
            });
            rejillaInteractiva.length = 0;

            if (luzCentral) {
                if (scene) scene.remove(luzCentral);
                luzCentral = null;
            }

            if (btnFinalizarJuegoFlotante) {
                btnFinalizarJuegoFlotante.classList.remove('reveal-menu');
                btnFinalizarJuegoFlotante.classList.add('hidden-menu');
            }
            if (renderer && renderer.domElement) {
                renderer.domElement.style.filter = '';
            }
            
            // Resetear portada
            if (pantallaPortada) pantallaPortada.classList.remove('transitioning');
            combinacionCompletada = false;
            cuadradosPortada.forEach((c, idx) => {
                c.classList.remove('spin-scale-down');
                c.style.transition = '';
                c.style.left = '';
                c.style.top = '';
                c.style.transform = '';
                c.style.cursor = 'grab';
                c.style.pointerEvents = 'auto';
                c.dataset.arrastrando = "false";
            });
            if (textPista) textPista.classList.remove('fade-out');
            if (btnComenzar) {
                btnComenzar.classList.remove('reveal-active');
                btnComenzar.classList.add('hidden-start');
            }
        });
    }
});
