// Remover la clase de fade-in de inmediato para evitar retrasos o bloqueos por carga
if (document.body) {
    document.body.classList.remove('page-fade-in');
}

document.addEventListener("DOMContentLoaded", () => {

    // Interceptar el botón "Inicio" para salir con animación sutil (fade-out)
    const btnNavbar = document.querySelector('.btn-navbar');
    if (btnNavbar) {
        btnNavbar.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-fade-out');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 400); // Duración de la transición de salida
        });
    }

    // ==========================================
    // SINTETIZADOR DE EFECTOS DE SONIDO (WEB AUDIO API)
    // ==========================================
    function playSuccessChime() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
            gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + index * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + index * 0.08);
            osc.stop(ctx.currentTime + index * 0.08 + 0.3);
        });
    }

    function playShatterSound() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1400, now);
        gain1.gain.setValueAtTime(0.025, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.04);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(900, now + 0.012);
        gain2.gain.setValueAtTime(0.02, now + 0.012);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.012 + 0.03);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.012);
        osc2.stop(now + 0.012 + 0.035);
        
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1800, now + 0.025);
        gain3.gain.setValueAtTime(0.015, now + 0.025);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.025 + 0.02);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.025);
        osc3.stop(now + 0.025 + 0.025);
    }

    function playBubblePop() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (error) {
            console.warn("AudioContext initialization blocked or failed:", error);
        }
    }

    function playTransitionSwoop() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);
    }

    function playColorNote(colorName) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        let freq = 440;
        if (colorName === 'rojo') freq = 196.00;
        else if (colorName === 'amarillo') freq = 246.94;
        else if (colorName === 'verde') freq = 293.66;
        else if (colorName === 'azul') freq = 392.00;
        else if (colorName === 'blanco') freq = 523.25;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    }

    function playRippleTone() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    function playCustomRippleTone(freq) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.35);
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    }

    const textPista = document.getElementById('textPista');
    const btnComenzar = document.getElementById('btnComenzar');
    const cuadradosPortada = document.querySelectorAll('.hero-title-container .cuadrado-acrilico');
    
    const pantallaPortada = document.getElementById('pantallaPortada');
    const backgroundLiquido = document.getElementById('backgroundLiquido');
    const prismaSection = document.getElementById('prismaSection');
    const canvasContainer = document.getElementById('three-prisma-canvas');
    
    const menuFinal = document.getElementById('menuFinal');
    const btnSiguienteRecorrido = document.getElementById('btnSiguienteRecorrido');
    const btnReiniciarPrisma = document.getElementById('btnReiniciarPrisma');
    
    const rejillaClara = document.getElementById('rejillaClara');
    const pantallaVictoria = document.getElementById('pantallaVictoria');
    
    const btnFinalizarJuegoFlotante = document.getElementById('btnFinalizarJuegoFlotante');
    const cuadriculaFondo = document.querySelector('.cuadricula-fondo');
    
    let combinacionCompletada = false;
    let elementoActivo = null;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    let prevX = 0, prevY = 0;

    // ==========================================
    // INICIALIZACIÓN DE PORTADA CON CORTINA DE CUADRADOS
    // ==========================================
    let portadaRevelada = false;

    function inicializarPortadaConCuadrados() {
        portadaRevelada = false;
        combinacionCompletada = false;
        
        if (pantallaPortada) {
            pantallaPortada.classList.remove('transitioning');
            
            // Limpiar residuos anteriores si los hay
            const decorativos = document.querySelectorAll('.cuadrado-decorativo');
            decorativos.forEach(d => d.remove());
            const msgRevealExistente = document.getElementById('introRevealMsg');
            if (msgRevealExistente) msgRevealExistente.remove();

            // Ocultar la cuadrícula del fondo al reiniciar
            if (cuadriculaFondo) {
                cuadriculaFondo.classList.remove('visible');
            }

            // Ocultar el título de fondo inicialmente y animar su entrada
            const titleFondo = document.querySelector('.hero-title-container .texto-fondo');
            if (titleFondo) {
                titleFondo.style.opacity = '0';
                titleFondo.style.transform = 'translate(-50%, -50%) scale(0.85)';
                titleFondo.style.transition = 'opacity 1.4s ease-out, transform 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                setTimeout(() => {
                    titleFondo.style.opacity = '1';
                    titleFondo.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 150);
            }

            // Ocultar cuadrados principales y la pista
            cuadradosPortada.forEach(c => {
                c.classList.remove('spin-scale-down');
                c.style.opacity = '0';
                c.style.pointerEvents = 'none';
                c.style.transform = 'scale(0.5)';
                c.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                c.style.left = '';
                c.style.top = '';
                c.style.cursor = 'grab';
                c.dataset.arrastrando = "false";
            });
            if (textPista) {
                textPista.style.opacity = '0';
                textPista.style.transform = 'translateX(-50%) translateY(15px)';
                textPista.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                textPista.classList.remove('fade-out');
            }
            if (btnComenzar) {
                btnComenzar.classList.remove('reveal-active');
                btnComenzar.classList.add('hidden-start');
            }

            // Crear botón de revelado minimalista y elegante (con entrada retrasada)
            const msgReveal = document.createElement('div');
            msgReveal.id = "introRevealMsg";
            msgReveal.className = "intro-reveal-msg";
            msgReveal.textContent = "Haz scroll";
            msgReveal.style.opacity = '0';
            msgReveal.style.transition = 'opacity 1.0s ease, transform 1.0s ease';
            pantallaPortada.appendChild(msgReveal);

            setTimeout(() => {
                if (!portadaRevelada && msgReveal) {
                    msgReveal.style.opacity = '1';
                }
            }, 1200);

            const colClases = ['verde', 'azul', 'rojo', 'amarillo'];
            const colBgColors = [
                'rgba(40, 167, 69, 0.45)', // Mismo color y opacidad que los originales
                'rgba(0, 123, 255, 0.45)',
                'rgba(220, 53, 69, 0.45)',
                'rgba(255, 193, 7, 0.5)'
            ];

            // Crear 20 cuadrados decorativos dispersos tapando el título (estáticos para evitar lag)
            for (let i = 0; i < 20; i++) {
                const decSquare = document.createElement('div');
                decSquare.className = `cuadrado-decorativo ${colClases[i % 4]}`;
                
                const size = 130 + Math.random() * 110;
                decSquare.style.width = `${size}px`;
                decSquare.style.height = `${size}px`;
                
                const leftVal = 3 + Math.random() * 88;
                const topVal = 3 + Math.random() * 80;
                decSquare.style.left = `${leftVal}%`;
                decSquare.style.top = `${topVal}%`;
                
                const rotVal = (Math.random() - 0.5) * 140;
                decSquare.style.transform = `rotate(${rotVal}deg)`;
                decSquare.style.backgroundColor = colBgColors[i % 4];
                
                // Configurar rotación final de caída y transiciones con retraso y duración aleatoria (gravedad)
                const targetFallRot = rotVal + (Math.random() - 0.5) * 120;
                decSquare.style.setProperty('--fall-rot', `${targetFallRot}deg`);
                
                const fallDuration = 0.8 + Math.random() * 0.6; // Entre 0.8s y 1.4s
                const fallDelay = Math.random() * 0.35; // Stagger de retraso hasta 350ms
                decSquare.style.transition = `transform ${fallDuration}s cubic-bezier(0.55, 0.085, 0.68, 0.53) ${fallDelay}s, opacity ${fallDuration}s ease-in ${fallDelay}s`;
                
                pantallaPortada.appendChild(decSquare);
            }

            const revelarPortada = () => {
                if (portadaRevelada) return;
                portadaRevelada = true;
                
                playBubblePop();

                if (msgReveal) {
                    msgReveal.classList.add('desvanecer');
                    setTimeout(() => msgReveal.remove(), 500);
                }

                // Mostrar la cuadrícula del fondo con transición al revelar
                if (cuadriculaFondo) {
                    cuadriculaFondo.classList.add('visible');
                }

                const decorativos = document.querySelectorAll('.cuadrado-decorativo');
                decorativos.forEach(dec => {
                    dec.classList.add('desvanecer');
                    // Incrementar el tiempo para removerlos del DOM ya que la caída dura hasta 1.75 segundos con el delay
                    setTimeout(() => dec.remove(), 1800);
                });

                // Revelar el título de fondo con animación
                if (titleFondo) {
                    titleFondo.style.opacity = '1';
                    titleFondo.style.transform = 'translate(-50%, -50%) scale(1)';
                }

                cuadradosPortada.forEach((c, idx) => {
                    // Generar posiciones aleatorias en rangos seguros para que se dispersen de forma única en cada partida
                    const randomLeft = 10 + Math.random() * 65; // Rango 10% a 75%
                    const randomTop = 15 + Math.random() * 55;  // Rango 15% a 70%
                    c.style.left = `${randomLeft}%`;
                    c.style.top = `${randomTop}%`;

                    setTimeout(() => {
                        c.style.opacity = '1';
                        c.style.pointerEvents = 'auto';
                        c.style.transform = 'scale(1)';
                    }, idx * 120);
                });

                if (textPista) {
                    setTimeout(() => {
                        textPista.style.opacity = '1';
                        textPista.style.transform = 'translateX(-50%) translateY(0)';
                    }, 300);
                }
            };

            let scrollTouchStartY = 0;
            
            const registrarTouchStart = (e) => {
                scrollTouchStartY = e.touches[0].clientY;
            };
            
            const detectarScrollReveal = (e) => {
                if (portadaRevelada) return;
                
                if (e.type === 'wheel') {
                    if (e.deltaY > 0) { // Scroll hacia abajo
                        revelarPortadaConLimpieza();
                    }
                } else if (e.type === 'touchmove') {
                    const currentY = e.touches[0].clientY;
                    if (scrollTouchStartY - currentY > 20) { // Swipe hacia arriba (scroll down)
                        revelarPortadaConLimpieza();
                    }
                }
            };

            const revelarPortadaConLimpieza = () => {
                revelarPortada();
                window.removeEventListener('wheel', detectarScrollReveal);
                window.removeEventListener('touchstart', registrarTouchStart);
                window.removeEventListener('touchmove', detectarScrollReveal);
                pantallaPortada.removeEventListener('click', clickHandler);
            };

            const clickHandler = (e) => {
                if (e.target.closest('.btn-navbar') || e.target.closest('#btnComenzar')) return;
                revelarPortadaConLimpieza();
            };

            window.addEventListener('wheel', detectarScrollReveal, { passive: true });
            window.addEventListener('touchstart', registrarTouchStart, { passive: true });
            window.addEventListener('touchmove', detectarScrollReveal, { passive: true });

            pantallaPortada.addEventListener('click', clickHandler);
            msgReveal.addEventListener('click', revelarPortadaConLimpieza);
        }
    }

    // Inicializar portada al cargar
    inicializarPortadaConCuadrados();

    // ==========================================
    // 1. CONTROL ARRASTRE DE PORTADA
    // ==========================================================================
    // VERIFICACIÓN DE INTERSECCIÓN Y AUTO-ALINEACIÓN (GRID SNAP 2x2)
    // ==========================================================================
    function verificarInterseccion() {
        // Si el puzzle ya fue completado, no volvemos a calcular colisiones
        if (combinacionCompletada) return;

        // Obtener los rectángulos de colisión físicos (bounding boxes) en pantalla de cada cuadrado
        const rects = [...cuadradosPortada].map(c => c.getBoundingClientRect());
        let todosSeTocan = true;

        // Comparación cruzada (doble iteración) para detectar colisiones tipo AABB
        // Se valida que cada cuadrado i tenga intersección con cada cuadrado j
        for (let i = 0; i < rects.length; i++) {
            for (let j = i + 1; j < rects.length; j++) {
                // Si NO se superponen en X o Y, entonces NO se están tocando todos
                if (!(rects[i].left < rects[j].right && 
                      rects[i].right > rects[j].left && 
                      rects[i].top < rects[j].bottom && 
                      rects[i].bottom > rects[j].top)) {
                    todosSeTocan = false;
                }
            }
        }

        // Si se cumple la condición de colisión mutua (todas las piezas se tocan)
        if (todosSeTocan) {
            combinacionCompletada = true;
            playSuccessChime(); // Reproducir sonido de éxito
            
            // Ocultar la pista interactiva ("Junta los cuadros...") con transición suave
            if (textPista) {
                textPista.style.opacity = '0';
                textPista.style.transform = 'translateX(-50%) translateY(15px)';
            }
            
            // Alinear magnéticamente los 4 cuadrados en un mosaico 2x2 perfectamente centrado
            cuadradosPortada.forEach((c) => {
                c.classList.remove('dragging');
                c.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)'; // Transición elástica de snap
                
                const idx = parseInt(c.dataset.index);
                // Ubicaciones relativas al centro (50%, 50%) usando un tamaño de celda de 260px
                if (idx === 0) { // Verde -> Cuadrante Superior Izquierdo
                    c.style.left = 'calc(50% - 260px)';
                    c.style.top = 'calc(50% - 260px)';
                } else if (idx === 1) { // Azul -> Cuadrante Superior Derecho
                    c.style.left = 'calc(50% - 0px)';
                    c.style.top = 'calc(50% - 260px)';
                } else if (idx === 2) { // Rojo -> Cuadrante Inferior Izquierdo
                    c.style.left = 'calc(50% - 260px)';
                    c.style.top = 'calc(50% - 0px)';
                } else if (idx === 3) { // Amarillo -> Cuadrante Inferior Derecho
                    c.style.left = 'calc(50% - 0px)';
                    c.style.top = 'calc(50% - 0px)';
                }
                
                // Forzar alineación recta sin rotación y desactivar interacciones
                c.style.transform = 'scale(1) rotate(0deg)';
                c.style.cursor = 'default';
                c.style.pointerEvents = 'none';
            });

            setTimeout(() => {
                if (btnComenzar) {
                    btnComenzar.classList.remove('hidden-start');
                    btnComenzar.classList.add('reveal-active');
                }
            }, 650);
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
        prevX = clientX;
        prevY = clientY;
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
        
        // Calcular inercia
        const speedX = clientX - prevX;
        const speedY = clientY - prevY;
        prevX = clientX;
        prevY = clientY;
        
        // Calcular inclinación y rotación elástica en base a la velocidad
        const tiltX = Math.max(-12, Math.min(12, speedY * 0.35));
        const tiltY = Math.max(-12, Math.min(12, -speedX * 0.35));
        const rotate = Math.max(-15, Math.min(15, speedX * 0.22));
        
        elementoActivo.style.left = (initialLeft + dx) + "px";
        elementoActivo.style.top = (initialTop + dy) + "px";
        elementoActivo.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(${rotate}deg) scale(1.08)`;
        
        verificarInterseccion();
    }

    function terminarArrastre() {
        if (elementoActivo) {
            elementoActivo.dataset.arrastrando = "false";
            elementoActivo.classList.remove('dragging');
            // Rebotar con efecto muelle (spring) al soltar
            elementoActivo.style.transition = 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.4s ease-out, top 0.4s ease-out';
            elementoActivo.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)';
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

    document.addEventListener('mousemove', (e) => {
        if (!pantallaPortada || pantallaPortada.classList.contains('hidden-screen')) return;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        pantallaPortada.style.setProperty('--mouse-x', `${x}%`);
        pantallaPortada.style.setProperty('--mouse-y', `${y}%`);
    });

    if (btnComenzar) {
        btnComenzar.addEventListener('click', () => {
            if (pantallaPortada) pantallaPortada.classList.add('transitioning');
            // Limpiar estilos en línea del título para permitir que la clase CSS actúe libremente
            const titleFondo = document.querySelector('.hero-title-container .texto-fondo');
            if (titleFondo) {
                titleFondo.style.opacity = '';
                titleFondo.style.transform = '';
            }
            cuadradosPortada.forEach(c => {
                c.classList.add('spin-scale-down');
            });
            
            // Mostrar la sección 3D e inicializarla de inmediato para que la transición cinemática
            // sea visible mientras la portada se desvanece
            if (prismaSection) {
                prismaSection.classList.remove('hidden-screen');
                inicializarPrisma3D();
            }
            
            setTimeout(() => {
                if (pantallaPortada) pantallaPortada.classList.add('hidden-screen');
                if (backgroundLiquido) backgroundLiquido.classList.add('hidden-screen');
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
    let clickPhase2Count = 0;
    let faseEfectosActiva = false;
    
    const prismasFase4 = [];
    let prismaActivo = null;
    let activeSwipeLayer = null;
    let luzCentral = null;
    const hacesDeLuzFase4 = [];
    const rejillaInteractiva = [];
    const particulasInteractivas = [];
    let timerBotonFinalizar = null;
    const cristalesExplosion = [];
    let targetBgColor = { r: 244, g: 244, b: 247 };
    let currentBgColor = { r: 244, g: 244, b: 247 };
    let targetSeparacion = 0; 
    let cameraShakeIntensity = 0; 
    let animacionId = null;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-9999, -9999);
    const capasAnimando = [];
    let faseTransicion3a4 = false;
    let morphers = [];
    let transicionTime = 0;
    const particulas = [];
    let mouseLight;

    let modoInspeccionPermanente = false;
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

    function crearShatterAcrilico(capa) {
        if (!capa.userData.fragmentos) return;
        
        capa.userData.fragmentos.forEach(frag => {
            const worldPos = new THREE.Vector3();
            frag.getWorldPosition(worldPos);
            
            const geom = frag.geometry.clone();
            const mat = frag.material.clone();
            mat.transparent = true;
            mat.opacity = 1.0;
            mat.transmission = 0.0;
            mat.emissiveIntensity = 0.0;
            mat.clearcoat = 1.0;
            mat.roughness = 0.15;
            mat.depthWrite = false;
            
            const shard = new THREE.Mesh(geom, mat);
            shard.position.copy(worldPos);
            shard.rotation.copy(frag.rotation);
            
            const relX = frag.position.x;
            const relY = frag.position.y;
            const angle = Math.atan2(relY, relX) + (Math.random() - 0.5) * 0.45;
            const dist = Math.sqrt(relX * relX + relY * relY) || 0.1;
            const speed = 0.06 + dist * 0.06 + Math.random() * 0.08;
            
            shard.userData = {
                velX: Math.cos(angle) * speed + (capa.userData.vx || 0) * 0.5,
                velY: Math.sin(angle) * speed + (capa.userData.vy || 0) * 0.5,
                velZ: (Math.random() - 0.5) * 0.1,
                rotX: (Math.random() - 0.5) * 0.25,
                rotY: (Math.random() - 0.5) * 0.25,
                opacity: 1.0,
                scale: 1.0
            };
            
            cristalesExplosion.push(shard);
            scene.add(shard);
        });
    }

    function inicializarPrisma3D() {
        if (!canvasContainer) return;
        
        if (animacionId) cancelAnimationFrame(animacionId);
        canvasContainer.innerHTML = '';
        particulas.length = 0;
        
        if (canvasContainer) canvasContainer.style.display = 'block';
        if (rejillaClara) rejillaClara.style.display = 'block';
        if (prismaSection) {
            prismaSection.style.background = '';
            prismaSection.classList.remove('inspeccion-activa');
        }
        
        objetosArrastrables.forEach(obj => {
            if (scene) scene.remove(obj);
        });
        objetosArrastrables.length = 0;

        cristalesExplosion.forEach(p => {
            if (scene) scene.remove(p);
        });
        cristalesExplosion.length = 0;

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
        
        faseEfectosActiva = false;
        targetBgColor = { r: 244, g: 244, b: 247 };
        currentBgColor = { r: 244, g: 244, b: 247 };
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
        clickPhase2Count = 0;
        modoInspeccionPermanente = true;
        hoveringPrisma = false;
        activeDragObject = null;
        capasEliminadasContador = 0;
        targetSeparacion = 0;

        const pistaFase2 = document.getElementById('pistaFase2');
        if (pistaFase2) {
            pistaFase2.textContent = "Haz click para ver los cambios";
            pistaFase2.style.opacity = '1';
            pistaFase2.style.color = 'rgba(10, 10, 15, 0.6)';
        }

        if (menuFinal) {
            menuFinal.classList.remove('reveal-menu');
            menuFinal.classList.add('hidden-menu');
            menuFinal.style.display = 'none';
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        // Órbita cinemática: la cámara inicia desplazada en esquina e inclinada
        camera.position.set(-14, 8, 26);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasContainer.appendChild(renderer.domElement);

        grupoPrisma = new THREE.Group();
        // Inclinación inicial para que realice un giro de entrada espectacular
        grupoPrisma.rotation.set(-1.2, 2.2, 0);
        scene.add(grupoPrisma);

        const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.35);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xfff3db, 0.55);
        dirLight1.position.set(5, 10, 7);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffead1, 0.35);
        dirLight2.position.set(-5, -5, -5);
        scene.add(dirLight2);

        mouseLight = new THREE.DirectionalLight(0xfff0e0, 0.4);
        mouseLight.position.set(0, 0, 10);
        scene.add(mouseLight);

        const capasConfig = [
            { colorHex: 0x28a745, z: 1.2 },
            { colorHex: 0xffc107, z: 0.4 },
            { colorHex: 0xdc3545, z: -0.4 },
            { colorHex: 0x007bff, z: -1.2 }
        ];

        capasConfig.forEach((config, idx) => {
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 0.2);
            const material = new THREE.MeshPhysicalMaterial({
                color: config.colorHex, 
                emissive: config.colorHex,
                emissiveIntensity: 0.2,
                transparent: true, 
                opacity: 0.55, 
                roughness: 0.15, 
                metalness: 0.05, 
                clearcoat: 1.0, 
                side: THREE.DoubleSide, 
                depthWrite: false 
            });

            const mallaCapa = new THREE.Mesh(geometry, material);
            // Efecto de acordeón al entrar: inician agrupadas en Z=0 y con escala casi 0
            mallaCapa.position.set(0, 0, 0);
            mallaCapa.scale.set(0.001, 0.001, 0.001);
            mallaCapa.userData = { 
                idCapa: idx, 
                origZ: config.z,
                introDelay: idx * 160 // 160ms de desfase por placa
            };
            capasPrisma.push(mallaCapa);
            grupoPrisma.add(mallaCapa);
        });

        let isDraggingPrisma = false;
        let isSwipingPrisma = false;
        let prevPrismaMousePosition = { x: 0, y: 0 };

        const startPrismaDrag = (clientX, clientY) => {
            if (faseFundamentoActiva) return; 

            const rect = renderer.domElement.getBoundingClientRect();
            const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

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

            const intersectsPrisma = raycaster.intersectObjects(grupoPrisma.children, true);

            if (intersectsPrisma.length > 0) {
                let hitObj = intersectsPrisma[0].object;
                while (hitObj.parent && hitObj.parent !== grupoPrisma && hitObj.userData.idCapa === undefined) {
                    hitObj = hitObj.parent;
                }
                const idCapa = hitObj.userData.idCapa;
                if (idCapa >= 0 && idCapa <= 3) {
                    clickPhase2Count++;

                    const coloresOriginales = [
                        0x28a745,
                        0xffc107,
                        0xdc3545,
                        0x007bff
                    ];
                    const pistaFase2 = document.getElementById('pistaFase2');

                    if (clickPhase2Count === 1) {
                        capasPrisma.forEach(c => {
                            const nuevoIdx = (c.userData.idCapa + 1) % 4;
                            const nuevoColor = coloresOriginales[nuevoIdx];
                            c.material.color.setHex(nuevoColor);
                            c.material.emissive.setHex(nuevoColor);
                            c.material.needsUpdate = true;

                            if (c.userData.idCapa === 0) { c.userData.vx = -0.045; c.userData.vy = 0.035; }
                            else if (c.userData.idCapa === 1) { c.userData.vx = 0.045; c.userData.vy = 0.035; }
                            else if (c.userData.idCapa === 2) { c.userData.vx = -0.045; c.userData.vy = -0.035; }
                            else if (c.userData.idCapa === 3) { c.userData.vx = 0.045; c.userData.vy = -0.035; }
                        });
                        if (pistaFase2) {
                            pistaFase2.textContent = "";
                            pistaFase2.style.opacity = '0';
                        }
                        playBubblePop();
                    } else if (clickPhase2Count === 2) {
                        const targetZs = [-1.2, -0.4, 0.4, 1.2]; // Invertir orden de profundidad Z
                        capasPrisma.forEach(c => {
                            c.userData.origZ = targetZs[c.userData.idCapa];
                            c.material.emissiveIntensity = 2.0;
                            c.material.needsUpdate = true;
                            
                            // Movimiento en Cruz (+): dos horizontales y dos verticales
                            if (c.userData.idCapa === 0) { c.userData.vx = -0.065; c.userData.vy = 0; }
                            else if (c.userData.idCapa === 1) { c.userData.vx = 0.065; c.userData.vy = 0; }
                            else if (c.userData.idCapa === 2) { c.userData.vx = 0; c.userData.vy = 0.05; }
                            else if (c.userData.idCapa === 3) { c.userData.vx = 0; c.userData.vy = -0.05; }
                        });
                        playSuccessChime();
                    } else if (clickPhase2Count === 3) {
                        capasPrisma.forEach(c => {
                            c.material.opacity = 0.95;
                            c.material.emissiveIntensity = 0.4;
                            c.material.needsUpdate = true;
                            
                            // Movimiento en diagonales invertidas/rápidas (X invertido)
                            if (c.userData.idCapa === 0) { c.userData.vx = 0.055; c.userData.vy = 0.065; }
                            else if (c.userData.idCapa === 1) { c.userData.vx = -0.055; c.userData.vy = 0.065; }
                            else if (c.userData.idCapa === 2) { c.userData.vx = 0.055; c.userData.vy = -0.065; }
                            else if (c.userData.idCapa === 3) { c.userData.vx = -0.055; c.userData.vy = -0.065; }
                        });
                        playRippleTone();
                    } else if (clickPhase2Count === 4) {
                        capasPrisma.forEach(c => {
                            c.material.transmission = 0.95;
                            c.material.opacity = 0.25;
                            c.material.roughness = 0.01;
                            c.material.ior = 1.5;
                            c.material.clearcoat = 1.0;
                            c.material.clearcoatRoughness = 0.01;
                            c.material.needsUpdate = true;
                            
                            // Dispersión caótica asimétrica veloz
                            if (c.userData.idCapa === 0) { c.userData.vx = -0.085; c.userData.vy = -0.045; }
                            else if (c.userData.idCapa === 1) { c.userData.vx = 0.045; c.userData.vy = -0.085; }
                            else if (c.userData.idCapa === 2) { c.userData.vx = 0.085; c.userData.vy = 0.045; }
                            else if (c.userData.idCapa === 3) { c.userData.vx = -0.045; c.userData.vy = 0.085; }
                        });
                        playSuccessChime();
                    } else if (clickPhase2Count === 5) {
                        // Clic 5: Desintegración en 36 cubitos independientes con volumen que se mezclan por toda la pantalla
                        const nuevosFragmentos = [];
                        const cols = 3;
                        const filas = 3;
                        const spacing = 0.52;
                        
                        capasPrisma.forEach(c => {
                            const colorHex = c.material.color.getHex();
                            
                            for (let r = 0; r < filas; r++) {
                                for (let col = 0; col < cols; col++) {
                                    // Aumentamos el espesor a 0.15 para darles volumen físico real
                                    const geom = new THREE.BoxGeometry(0.45, 0.45, 0.15);
                                    const mat = new THREE.MeshPhysicalMaterial({
                                        color: colorHex,
                                        transparent: true,
                                        opacity: 0.85,
                                        roughness: 0.1,
                                        metalness: 0.1,
                                        clearcoat: 1.0,
                                        transmission: 0.15,
                                        emissive: colorHex,
                                        emissiveIntensity: 0.4,
                                        side: THREE.DoubleSide,
                                        depthWrite: false
                                    });
                                    const mesh = new THREE.Mesh(geom, mat);
                                    
                                    // Posicionamiento inicial relativo rotado según la placa madre
                                    const relX = (col - 1) * spacing;
                                    const relY = (r - 1) * spacing;
                                    const localOffset = new THREE.Vector3(relX, relY, 0);
                                    localOffset.applyEuler(c.rotation);
                                    
                                    mesh.position.copy(c.position).add(localOffset);
                                    mesh.rotation.copy(c.rotation);
                                    
                                    // Ocultar y escalar a 0 inicialmente para el efecto escalonado
                                    mesh.scale.set(0.001, 0.001, 0.001);
                                    mesh.visible = false;
                                    
                                    // Velocidades independientes con dispersión aleatoria variada (lentas y rápidas)
                                    const angle = Math.random() * Math.PI * 2;
                                    const dispersionSpeed = 0.015 + Math.random() * 0.11;
                                    
                                    // Retraso escalonado según la placa e índice
                                    const indexInPlate = r * cols + col;
                                    const delay = (c.userData.idCapa * 160) + (indexInPlate * 35);
                                    
                                    mesh.userData = {
                                        idCapa: c.userData.idCapa,
                                        origZ: c.userData.origZ,
                                        vx: (c.userData.vx || 0) * 0.75 + Math.cos(angle) * dispersionSpeed,
                                        vy: (c.userData.vy || 0) * 0.75 + Math.sin(angle) * dispersionSpeed,
                                        originalColor: new THREE.Color(colorHex),
                                        spawnDelay: delay
                                    };
                                    
                                    grupoPrisma.add(mesh);
                                    nuevosFragmentos.push(mesh);
                                }
                            }
                            
                            // Remover la placa madre original
                            grupoPrisma.remove(c);
                        });
                        
                        // Reemplazar la lista de capas por la lista plana de fragmentos independientes
                        capasPrisma = nuevosFragmentos;
                        playBubblePop();
                    } else if (clickPhase2Count === 6) {
                        if (renderer && renderer.domElement) {
                            renderer.domElement.style.filter = 'blur(3px) brightness(1.05)';
                            renderer.domElement.style.transition = 'filter 0.5s ease';
                        }
                        
                        // Clic 6: Barajar los colores de los 36 fragmentos por unidad directamente
                        const brandColors = [0x28a745, 0xffc107, 0xdc3545, 0x007bff];
                        capasPrisma.forEach(frag => {
                            if (frag.material) {
                                const randomColor = brandColors[Math.floor(Math.random() * brandColors.length)];
                                frag.userData.originalColor = new THREE.Color(randomColor);
                                
                                const softColor = frag.userData.originalColor.clone().lerp(new THREE.Color(0xffffff), 0.3);
                                frag.material.color.copy(softColor);
                                frag.material.emissive.copy(softColor);
                                frag.material.emissiveIntensity = 0.8;
                                frag.material.opacity = 0.8;
                                frag.material.needsUpdate = true;
                            }
                            // Acelerar y desviar ligeramente
                            const speed = Math.sqrt(frag.userData.vx * frag.userData.vx + frag.userData.vy * frag.userData.vy) || 0.03;
                            const angle = Math.atan2(frag.userData.vy, frag.userData.vx) + (Math.random() - 0.5) * 0.3;
                            frag.userData.vx = Math.cos(angle) * speed * 1.25;
                            frag.userData.vy = Math.sin(angle) * speed * 1.25;
                        });
                        playSuccessChime();
                    } else if (clickPhase2Count === 7) {
                        if (renderer && renderer.domElement) {
                            renderer.domElement.style.filter = 'blur(1.5px)';
                        }
                        
                        // Clic 7: Acrílico translúcido pastel por unidad (se achicarán a 0.6 en animatePrisma)
                        capasPrisma.forEach(frag => {
                            if (frag.material) {
                                const origColor = frag.userData.originalColor || frag.material.color.clone();
                                if (!frag.userData.originalColor) {
                                    frag.userData.originalColor = origColor.clone();
                                }
                                
                                const pastelColor = origColor.clone().lerp(new THREE.Color(0xffffff), 0.55);
                                frag.material.color.copy(pastelColor);
                                frag.material.emissive.copy(pastelColor);
 
                                frag.material.roughness = 0.05;
                                frag.material.clearcoat = 1.0;
                                frag.material.transmission = 0.88;
                                frag.material.opacity = 0.38;
                                frag.material.emissiveIntensity = 0.0;
                                frag.material.ior = 1.45;
                                frag.material.needsUpdate = true;
                            }
                            
                            // Cambiar la dirección de movimiento para cada uno de los 36 cubitos por sí solo
                            const currentVx = frag.userData.vx || 0.02;
                            const currentVy = frag.userData.vy || 0.02;
                            const speed = Math.sqrt(currentVx * currentVx + currentVy * currentVy) || 0.05;
                            const currentAngle = Math.atan2(currentVy, currentVx);
                            
                            const angleShift = Math.PI * (0.5 + Math.random() * 1.0);
                            const newAngle = currentAngle + angleShift;
                            
                            frag.userData.vx = Math.cos(newAngle) * speed * 1.25;
                            frag.userData.vy = Math.sin(newAngle) * speed * 1.25;
                        });
                        playRippleTone();
                    } else if (clickPhase2Count === 8) {
                        // Clic 8: Se rompen y estallan los 36 fragmentos independientes (se habrán agrandado a 3.8 en animatePrisma)
                        playShatterSound();
                        cameraShakeIntensity = 0.95;
                        if (pistaFase2) {
                            pistaFase2.style.opacity = '0';
                        }
                        
                        if (renderer && renderer.domElement) {
                            renderer.domElement.style.filter = '';
                        }
 
                        capasPrisma.forEach(frag => {
                            const worldPos = new THREE.Vector3();
                            frag.getWorldPosition(worldPos);
                            
                            // Crear fragmento físico de explosión
                            const geom = frag.geometry.clone();
                            const mat = frag.material.clone();
                            
                            if (frag.userData.originalColor) {
                                mat.color.copy(frag.userData.originalColor);
                                mat.emissive.copy(frag.userData.originalColor);
                            }
                            mat.transmission = 0.0;
                            mat.emissiveIntensity = 0.0;
                            mat.opacity = 1.0;
                            mat.clearcoat = 1.0;
                            mat.roughness = 0.15;
                            mat.depthWrite = false;
                            
                            const shard = new THREE.Mesh(geom, mat);
                            shard.position.copy(worldPos);
                            shard.rotation.copy(frag.rotation);
                            
                            // Explosión radial desde el centro de la pantalla (más veloz)
                            const angle = Math.atan2(worldPos.y, worldPos.x) + (Math.random() - 0.5) * 0.4;
                            const dist = worldPos.length() || 0.1;
                            const speed = 0.32 + dist * 0.16 + Math.random() * 0.25;
                            
                            shard.userData = {
                                velX: Math.cos(angle) * speed + (frag.userData.vx || 0) * 0.55,
                                velY: Math.sin(angle) * speed + (frag.userData.vy || 0) * 0.55,
                                velZ: (Math.random() - 0.5) * 0.25,
                                rotX: (Math.random() - 0.5) * 0.8,
                                rotY: (Math.random() - 0.5) * 0.8,
                                opacity: 1.0,
                                scale: frag.scale.x // Hereda la escala grande
                            };
                            
                            cristalesExplosion.push(shard);
                            scene.add(shard);
                            
                            grupoPrisma.remove(frag);
                        });
                        capasPrisma = [];
 
                        setTimeout(() => {
                            activarTransicionFundamentoVisual();
                        }, 900);
                    }
                } else {
                    isDraggingPrisma = true;
                    prevPrismaMousePosition = { x: clientX, y: clientY };
                }
            } else {
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
 
            if (faseEfectosActiva) {
                if (activeDragObject) {
                    if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
                        const prevPos = activeDragObject.position.clone();
                        activeDragObject.position.copy(intersectionPoint).add(dragOffset);
                        activeDragObject.position.x = Math.max(-5.5, Math.min(5.5, activeDragObject.position.x));
                        activeDragObject.position.y = Math.max(-3.5, Math.min(3.5, activeDragObject.position.y));
                        if (activeDragObject.name === "luzCentral") {
                            activeDragObject.position.z = 0.1;
                        } else {
                            activeDragObject.position.z = 0.0;
                        }
 
                        const travelDist = prevPos.distanceTo(activeDragObject.position);
                        if (travelDist > 0.05 && Math.random() < 0.45) {
                            const col = activeDragObject.name === "luzCentral" ? 0xffffff : activeDragObject.userData.colorHex;
                            crearParticulaInteractiva(
                                activeDragObject.position,
                                col,
                                (Math.random() - 0.5) * 0.06 - (activeDragObject.position.x - prevPos.x) * 0.2,
                                (Math.random() - 0.5) * 0.06 - (activeDragObject.position.y - prevPos.y) * 0.2,
                                1.1
                            );
                        }
                    }
                }
                return;
            }
 
            if (isDraggingPrisma && grupoPrisma) {
                const deltaX = clientX - prevPrismaMousePosition.x;
                const deltaY = clientY - prevPrismaMousePosition.y;
 
                grupoPrisma.rotation.y += deltaX * 0.007;
                grupoPrisma.rotation.x += deltaY * 0.007;
 
                prevPrismaMousePosition = { x: clientX, y: clientY };
            }
        };
 
        const stopPrismaDrag = () => {
            isDraggingPrisma = false;
            isSwipingPrisma = false;
            activeSwipeLayer = null;
            activeDragObject = null;
        };
 
        canvasContainer.addEventListener('mousedown', (e) => startPrismaDrag(e.clientX, e.clientY));
        window.addEventListener('mouseup', stopPrismaDrag);
        window.addEventListener('mousemove', (e) => movePrismaDrag(e.clientX, e.clientY));
 
        canvasContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startPrismaDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        window.addEventListener('touchend', stopPrismaDrag);
        window.addEventListener('touchmove', (e) => {
            movePrismaDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
 
        function animatePrisma() {
            animacionId = requestAnimationFrame(animatePrisma);
            
            if (!scene || !renderer || !camera) return; 
 
            if (!faseFundamentoActiva && !faseEfectosActiva && !faseTransicion3a4 && grupoPrisma) {
                raycaster.setFromCamera(mouseVector, camera);
                const intersects = raycaster.intersectObjects(grupoPrisma.children, true);
                let hoveredUuid = null;
                if (intersects.length > 0) {
                    let hitObj = intersects[0].object;
                    while (hitObj.parent && hitObj.parent !== grupoPrisma) {
                        hitObj = hitObj.parent;
                    }
                    hoveredUuid = hitObj.uuid;
                }
 
                grupoPrisma.children.forEach(child => {
                    if (child.userData.idCapa !== undefined) {
                        // Retraso de aparición escalonada al inicio (Etapa 0)
                        if (clickPhase2Count === 0 && child.userData.introDelay !== undefined && child.userData.introDelay > 0) {
                            child.userData.introDelay -= 16.6;
                            child.visible = false;
                            child.scale.set(0.001, 0.001, 0.001);
                            return;
                        } else if (clickPhase2Count === 0 && child.userData.introDelay !== undefined && child.userData.introDelay <= 0) {
                            child.visible = true;
                        }
 
                        // Retraso de aparición escalonada en el clic 5
                        if (child.userData.spawnDelay !== undefined && child.userData.spawnDelay > 0) {
                            child.userData.spawnDelay -= 16.6; // restar un frame
                            child.visible = false;
                            child.scale.set(0.001, 0.001, 0.001);
                            if (child.material) {
                                child.material.opacity = 0.0;
                            }
                            return; // no procesar movimiento ni escalar hasta que aparezca
                        } else if (child.userData.spawnDelay !== undefined && child.userData.spawnDelay <= 0) {
                            child.visible = true;
                        }
 
                        if (clickPhase2Count >= 1) {
                            if (child.userData.vx === undefined) child.userData.vx = 0;
                            if (child.userData.vy === undefined) child.userData.vy = 0;
 
                            // Flotación libre y rebote en límites de pantalla para todas las etapas
                            child.position.x += child.userData.vx;
                            child.position.y += child.userData.vy;
 
                            const limiteX = 5.5;
                            const limiteY = 3.5;
 
                            if (child.position.x > limiteX) { child.position.x = limiteX; child.userData.vx *= -1; } 
                            else if (child.position.x < -limiteX) { child.position.x = -limiteX; child.userData.vx *= -1; }
 
                            if (child.position.y > limiteY) { child.position.y = limiteY; child.userData.vy *= -1; } 
                            else if (child.position.y < -limiteY) { child.position.y = -limiteY; child.userData.vy *= -1; }
                        }
 
                        if (clickPhase2Count >= 5) {
                            // Rotación tridimensional de los cubitos individuales
                            child.rotation.z += 0.008;
                            child.rotation.x += 0.005;
                            child.rotation.y += 0.003;
                        }
 
                        let targetZ = child.userData.origZ;
                        let targetRoughness = 0.15;
                        let targetOpacity = 0.55;
                        let baseScale = 1.0;
 
                        if (clickPhase2Count === 1) { baseScale = 1.35; } 
                        else if (clickPhase2Count === 2) { baseScale = 1.7; } 
                        else if (clickPhase2Count === 3) { targetOpacity = 0.95; baseScale = 2.05; } 
                        else if (clickPhase2Count === 4) { targetOpacity = 0.25; targetRoughness = 0.01; baseScale = 2.4; } 
                        else if (clickPhase2Count === 5) { targetOpacity = 0.8; targetRoughness = 0.1; baseScale = 2.0; }
                        else if (clickPhase2Count === 6) { targetOpacity = 0.8; targetRoughness = 0.1; baseScale = 2.2; }
                        // En el penúltimo click se achican (baseScale = 1.25 para que sigan siendo cliqueables cómodamente)
                        else if (clickPhase2Count === 7) { targetOpacity = 0.8; targetRoughness = 0.1; baseScale = 1.25; }
                        // En el último click se agrandan (baseScale = 3.8)
                        else if (clickPhase2Count >= 8) {
                            targetOpacity = 0.8;
                            targetRoughness = 0.1;
                            baseScale = 3.8;
                        }
 
                        if (clickPhase2Count === 5 && child.userData.originalColor) {
                            // Pulso de emisión sutil integrado en el color original del cubito
                            const tiempo = Date.now() * 0.008;
                            child.material.emissiveIntensity = 0.4 + Math.sin(tiempo) * 0.15;
                        }
 
                        let targetScale = baseScale;
                        
                        // Pulsación de tamaño orgánica e individual para los cubos flotantes (etapas 5, 6, 7)
                        if (clickPhase2Count >= 5 && clickPhase2Count <= 7) {
                            const seed = child.userData.spawnDelay || 0;
                            // Rango de pulsación suavizado (oscila entre 0.6 y 1.0 de la escala base) para mejorar jugabilidad
                            const pulse = 0.8 + Math.sin(Date.now() * 0.0035 + seed) * 0.2;
                            targetScale = baseScale * pulse;
                        }
 
                        let targetScaleX = targetScale;
                        let targetScaleY = targetScale;
                        let targetScaleZ = targetScale;
 
                        if (child.uuid === hoveredUuid) {
                            targetZ = child.userData.origZ + 0.9;
                            targetRoughness = clickPhase2Count >= 5 ? 0.1 : 0.95;
                            targetOpacity = clickPhase2Count === 3 ? 0.8 : (clickPhase2Count === 4 ? 0.15 : (clickPhase2Count >= 5 ? 0.9 : 0.35));
                            targetScale = baseScale * 1.15;
                            if (clickPhase2Count >= 5 && clickPhase2Count <= 7) {
                                const seed = child.userData.spawnDelay || 0;
                                const pulse = 0.8 + Math.sin(Date.now() * 0.0035 + seed) * 0.2;
                                targetScale = baseScale * pulse * 1.15;
                            }
                            targetScaleX = targetScale;
                            targetScaleY = targetScale;
                            targetScaleZ = targetScale;
                        }
 
                        child.position.z += (targetZ - child.position.z) * 0.15;
                        child.scale.x += (targetScaleX - child.scale.x) * 0.15;
                        child.scale.y += (targetScaleY - child.scale.y) * 0.15;
                        child.scale.z += (targetScaleZ - child.scale.z) * 0.15;
                        
                        if (child.material) {
                            child.material.opacity += (targetOpacity - child.material.opacity) * 0.15;
                            child.material.roughness += (targetRoughness - child.material.roughness) * 0.15;
                        }
                    }
                });
            }

            if (camera) {
                // Órbita cinemática de entrada de la cámara (lerp en X, Y, Z)
                camera.position.x += (0 - camera.position.x) * 0.05;
                camera.position.y += (0 - camera.position.y) * 0.05;
                camera.position.z += (10 - camera.position.z) * 0.05;
                
                // Enfocar al centro mientras la cámara esté realizando la órbita de entrada
                if (Math.abs(camera.position.x) > 0.15) {
                    camera.lookAt(0, 0, 0);
                    if (grupoPrisma) {
                        grupoPrisma.rotation.x += (0.4 - grupoPrisma.rotation.x) * 0.05;
                        grupoPrisma.rotation.y += (0.5 - grupoPrisma.rotation.y) * 0.05;
                    }
                }

                if (cameraShakeIntensity > 0.01) {
                    camera.position.x += (Math.random() - 0.5) * cameraShakeIntensity;
                    camera.position.y += (Math.random() - 0.5) * cameraShakeIntensity;
                    cameraShakeIntensity *= 0.88;
                } else if (Math.abs(camera.position.x) <= 0.15) {
                    camera.position.x = 0;
                    camera.position.y = 0;
                    camera.lookAt(0, 0, 0); // Alinear la cámara perfectamente recta al finalizar la entrada
                }
            }
 
            if (!faseFundamentoActiva && !faseTransicion3a4 && !faseEfectosActiva && (modoInspeccionPermanente || capasEliminadasContador > 0)) {
                currentBgColor.r += (targetBgColor.r - currentBgColor.r) * 0.12;
                currentBgColor.g += (targetBgColor.g - currentBgColor.g) * 0.12;
                currentBgColor.b += (targetBgColor.b - currentBgColor.b) * 0.12;
                
                if (prismaSection) {
                    prismaSection.style.backgroundColor = `rgb(${Math.round(currentBgColor.r)}, ${Math.round(currentBgColor.g)}, ${Math.round(currentBgColor.b)})`;
                }
            }
 
            for (let i = capasAnimando.length - 1; i >= 0; i--) {
                const c = capasAnimando[i];
                c.position.x += c.userData.dirSlideX * c.userData.speed;
                c.position.y += c.userData.dirSlideY * c.userData.speed;
                c.userData.speed *= 0.93;
                c.material.opacity -= 0.035;
                if (c.material.opacity <= 0) {
                    scene.remove(c);
                    capasAnimando.splice(i, 1);
                }
            }
 
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
                for (let i = particulasInteractivas.length - 1; i >= 0; i--) {
                    const p = particulasInteractivas[i];
                    p.position.x += p.userData.velX;
                    p.position.y += p.userData.velY;
                    p.position.z += p.userData.velZ;
                    p.rotation.x += p.userData.rotX;
                    p.rotation.y += p.userData.rotY;
                    
                    p.userData.opacity -= 0.02;
                    p.userData.scale -= 0.015;
                    if (p.material) {
                        p.material.opacity = p.userData.opacity;
                    }
                    p.scale.set(p.userData.scale, p.userData.scale, p.userData.scale);
                    
                    if (p.userData.opacity <= 0 || p.userData.scale <= 0) {
                        scene.remove(p);
                        particulasInteractivas.splice(i, 1);
                    }
                }
 
                if (luzCentral) {
                    luzCentral.scale.x += (1.0 - luzCentral.scale.x) * 0.12;
                    luzCentral.scale.y += (1.0 - luzCentral.scale.y) * 0.12;
                    luzCentral.scale.z += (1.0 - luzCentral.scale.z) * 0.12;
                }
 
                rejillaInteractiva.forEach(cell => {
                    cell.userData.accumR = 0;
                    cell.userData.accumG = 0;
                    cell.userData.accumB = 0;
                    cell.userData.accumWeight = 0;
                });
 
                prismasFase4.forEach(prisma => {
                    if (prisma.userData.spinVelocity === undefined) {
                        prisma.userData.spinVelocity = 0;
                    }
                    prisma.rotation.y += 0.006 + prisma.userData.spinVelocity;
                    prisma.rotation.x += 0.004;
                    prisma.userData.spinVelocity += (0.0 - prisma.userData.spinVelocity) * 0.08;
 
                    prisma.scale.x += (1.0 - prisma.scale.x) * 0.1;
                    prisma.scale.y += (1.0 - prisma.scale.y) * 0.1;
                    prisma.scale.z += (1.0 - prisma.scale.z) * 0.1;
 
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
 
                    const hazMesh = prisma.userData.hazMesh;
                    if (hazMesh && luzCentral) {
                        const dir = new THREE.Vector3().copy(prisma.position).sub(luzCentral.position);
                        const dist = dir.length();
                        dir.normalize();
 
                        hazMesh.position.copy(prisma.position);
                        hazMesh.position.z = -0.3; 
 
                        const angle = Math.atan2(dir.y, dir.x) + Math.PI / 2;
                        hazMesh.rotation.z = angle;
 
                        const largoHaz = Math.max(1.0, 9.0 - dist);
                        hazMesh.scale.y = largoHaz / 2.0;
                        hazMesh.scale.x = 1.0 + (largoHaz * 0.12);
 
                        const colorHex = prisma.userData.colorHex;
                        const r = ((colorHex >> 16) & 255) / 255;
                        const g = ((colorHex >> 8) & 255) / 255;
                        const b = (colorHex & 255) / 255;
                        const cubePos = prisma.position;
 
                        rejillaInteractiva.forEach(cell => {
                            const v = new THREE.Vector3().copy(cell.position).sub(cubePos);
                            v.z = 0;
                            
                            const proj = v.dot(dir);
                            const maxDistHaz = largoHaz * 3.0;
 
                            if (proj > 0 && proj < maxDistHaz) {
                                const projVec = new THREE.Vector3().copy(dir).multiplyScalar(proj);
                                const perpDist = new THREE.Vector3().copy(v).sub(projVec).length();
                                const anchoHaz = 0.8 + proj * 0.28;
 
                                if (perpDist < anchoHaz) {
                                    const factorDistancia = 1.0 - (proj / maxDistHaz);
                                    const intensity = factorDistancia * 0.7;
                                    
                                    cell.userData.accumR += r * intensity;
                                    cell.userData.accumG += g * intensity;
                                    cell.userData.accumB += b * intensity;
                                    cell.userData.accumWeight += intensity;
                                }
                            }
                        });
                    }
                });
 
                rejillaInteractiva.forEach(cell => {
                    if (cell.userData.accumWeight > 0) {
                        const mixedR = cell.userData.accumR / cell.userData.accumWeight;
                        const mixedG = cell.userData.accumG / cell.userData.accumWeight;
                        const mixedB = cell.userData.accumB / cell.userData.accumWeight;
                        const targetOp = Math.min(0.65, cell.userData.accumWeight * 0.85);
 
                        cell.material.color.r += (mixedR - cell.material.color.r) * 0.2;
                        cell.material.color.g += (mixedG - cell.material.color.g) * 0.2;
                        cell.material.color.b += (mixedB - cell.material.color.b) * 0.2;
 
                        if (cell.material.opacity < targetOp) {
                            cell.material.opacity += (targetOp - cell.material.opacity) * 0.25;
                        }
                    } else {
                        cell.material.opacity += (0.0 - cell.material.opacity) * 0.025;
                    }
                });
            }
 
            if (mouseLight && camera) {
                const targetX = mouseVector.x * 6.5;
                const targetY = mouseVector.y * 4.5;
                mouseLight.position.x += (targetX - mouseLight.position.x) * 0.1;
                mouseLight.position.y += (targetY - mouseLight.position.y) * 0.1;
                mouseLight.position.z = 8.0;
            }
 
            // Absorción de color interactiva de luzCentral (estrella 3D) y giro
            if (faseEfectosActiva && luzCentral) {
                luzCentral.rotation.z += 0.015; // Rotación sutil de la estrella
                luzCentral.rotation.y += 0.008;
 
                let targetColor = new THREE.Color(0xffffff);
                let targetEmissive = new THREE.Color(0xffffff);
                let targetIntensity = 0.15;
                let nearPrism = false;
 
                prismasFase4.forEach(prisma => {
                    const dist = luzCentral.position.distanceTo(prisma.position);
                    if (dist < 1.8) {
                        nearPrism = true;
                        const colHex = prisma.userData.colorHex;
                        targetColor.setHex(colHex);
                        targetEmissive.setHex(colHex);
                        targetIntensity = 0.8;
 
                        // Efecto de partículas chispeantes del color absorbido
                        if (Math.random() < 0.12) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 0.01 + Math.random() * 0.03;
                            crearParticulaInteractiva(
                                luzCentral.position,
                                colHex,
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed,
                                0.6
                            );
                        }
                    }
                });
 
                // Suavizar la transición cromática de la estrella
                if (luzCentral.material) {
                    luzCentral.material.color.lerp(targetColor, 0.08);
                    luzCentral.material.emissive.lerp(targetEmissive, 0.08);
                    luzCentral.material.emissiveIntensity += (targetIntensity - luzCentral.material.emissiveIntensity) * 0.08;
                }
 
                // Afectar la luz interactiva del mouse
                if (mouseLight) {
                    const defaultMouseLightColor = new THREE.Color(0xfff0e0);
                    mouseLight.color.lerp(nearPrism ? targetColor : defaultMouseLightColor, 0.08);
                }
            }
 
            if (grupoPrisma) {
                if (isDraggingPrisma || isSwipingPrisma) {
                    grupoPrisma.position.y += (0 - grupoPrisma.position.y) * 0.1;
                }
            }
 
            if (!faseFundamentoActiva && !faseEfectosActiva && grupoPrisma) { 
                if (!isDraggingPrisma && !modoInspeccionPermanente) {
                    grupoPrisma.rotation.y += 0.005; 
                } else if (modoInspeccionPermanente && !isDraggingPrisma && !isSwipingPrisma) {
                    const tiempo = Date.now() * 0.001;
                    grupoPrisma.position.y += (Math.sin(tiempo * 1.2) * 0.12 - grupoPrisma.position.y) * 0.05;
                    grupoPrisma.rotation.y += Math.sin(tiempo * 0.8) * 0.0008;
                    grupoPrisma.rotation.x += Math.cos(tiempo * 0.8) * 0.0006;
                }
            }
 
            if (faseFundamentoActiva && cuadraditosFundamento.length > 0) {
                raycaster.setFromCamera(mouseVector, camera);
                const intersects = raycaster.intersectObjects(cuadraditosFundamento);
                const hoveredUuid = intersects.length > 0 ? intersects[0].object.uuid : null;
 
                cuadraditosFundamento.forEach(cubo => {
                    if(!cubo) return;
 
                    if (cubo.userData.spawnProgress === undefined) {
                        cubo.userData.spawnProgress = 0.0;
                    }
                    if (cubo.userData.spawnProgress < 1.0) {
                        cubo.userData.spawnProgress += 0.025;
                        if (cubo.userData.spawnProgress > 1.0) cubo.userData.spawnProgress = 1.0;
                    }
                    const prog = cubo.userData.spawnProgress;
 
                    if (cubo.userData.pushVelX !== undefined) {
                        cubo.userData.pushVelX *= 0.92;
                        cubo.userData.pushVelY *= 0.92;
                        cubo.userData.pushVelZ *= 0.92;
 
                        cubo.position.x += cubo.userData.pushVelX;
                        cubo.position.y += cubo.userData.pushVelY;
                        cubo.position.z += cubo.userData.pushVelZ;
                    }
 
                    const curOrigX = cubo.userData.origX * prog;
                    const curOrigY = cubo.userData.origY * prog;
                    const curOrigZ = cubo.userData.origZ * prog;
 
                    const posDestinoX = curOrigX + (cubo.userData.dirX * targetSeparacion * 4.0);
                    const posDestinoY = curOrigY + (cubo.userData.dirY * targetSeparacion * 4.0);
                    const posDestinoZ = curOrigZ + (cubo.userData.dirZ * targetSeparacion * 5.5);
 
                    cubo.position.x += (posDestinoX - cubo.position.x) * 0.1;
                    cubo.position.y += (posDestinoY - cubo.position.y) * 0.1;
                    cubo.position.z += (posDestinoZ - cubo.position.z) * 0.1;
 
                    let baseOpacity = (0.42 - (targetSeparacion * 0.15)) * prog;
                    let targetOpacity = baseOpacity;
                    const scaleMod = cubo.userData.scaleModifier || 1.0;
                    let targetScale = (1.0 + (targetSeparacion * 0.6)) * prog * scaleMod;
                    let hoverSpin = 0;
 
                    if (cubo.uuid === hoveredUuid && prog >= 1.0) {
                        targetScale = 2.2 * scaleMod; 
                        hoverSpin = 0.25; 
                        targetOpacity = 0.55; 
                    }
 
                    cubo.scale.x += (targetScale - cubo.scale.x) * 0.15;
                    cubo.scale.y += (targetScale - cubo.scale.y) * 0.15;
                    cubo.scale.z += (targetScale - cubo.scale.z) * 0.15;
 
                    if (cubo.material) {
                        cubo.material.opacity += (targetOpacity - cubo.material.opacity) * 0.15;
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
                        cubo.userData.fallVelY += 0.005;
                        cubo.position.x += cubo.userData.fallVelX;
                        cubo.position.y -= cubo.userData.fallVelY;
                        cubo.position.z += cubo.userData.fallVelZ;
                        cubo.rotation.x += 0.02;
                        cubo.rotation.y += 0.03;
                        
                        if (cubo.material) {
                            cubo.material.opacity -= 0.02;
                        }
                        
                        if (cubo.position.y < -6 || (cubo.material && cubo.material.opacity <= 0)) {
                            scene.remove(cubo);
                            cuadraditosFundamento.splice(i, 1);
                        }
                    } else {
                        const target = cubo.userData.targetPos;
                        cubo.position.lerp(target, 0.08);
                        cubo.rotation.x += 0.08;
                        cubo.rotation.y += 0.08;
                        
                        if (transicionTime > 40) {
                            const s = cubo.scale.x + (2.5 - cubo.scale.x) * 0.1;
                            cubo.scale.set(s, s, s);
                            if (cubo.material) {
                                cubo.material.opacity -= 0.025;
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
 
    function activarTransicionFundamentoVisual() {
        if (grupoPrisma && scene) { scene.remove(grupoPrisma); }
        
        objetosArrastrables.forEach(obj => {
            if (scene) scene.remove(obj);
        });
        objetosArrastrables.length = 0;
 
        capasAnimando.forEach(layer => {
            if (scene) scene.remove(layer);
        });
        capasAnimando.length = 0;
 
        if (prismaSection) {
            prismaSection.style.backgroundColor = '';
            prismaSection.style.background = '';
            prismaSection.classList.remove('inspeccion-activa');
        }
        if (rejillaClara) {
            rejillaClara.style.display = 'block';
        }
        
        clickesDeCubosRealizados = 0;
 
        const pistaFase2 = document.getElementById('pistaFase2');
        if (pistaFase2) {
            pistaFase2.style.opacity = '0';
        }
 
        const indicador = document.getElementById('indicadorClic');
        if (indicador) {
            indicador.style.opacity = '1';
            indicador.style.transform = 'translate(-50%, -50%) scale(1)';
        }
 
        const coloresPaleta = [0x28a745, 0xffc107, 0xdc3545, 0x007bff]; 
        const totalModulos = 65; 
 
        for (let i = 0; i < totalModulos; i++) {
            const geomCubo = new THREE.BoxGeometry(0.45, 0.45, 0.04);
            const colorHex = coloresPaleta[i % coloresPaleta.length];
            const matCubo = new THREE.MeshPhysicalMaterial({
                color: colorHex,
                transparent: true, 
                opacity: 0.0, 
                roughness: 0.1, 
                metalness: 0.1,
                clearcoat: 1.0,
                side: THREE.DoubleSide, 
                depthWrite: false
            });
            const cuboMesh = new THREE.Mesh(geomCubo, matCubo);
            const origX = (Math.random() - 0.5) * 4.0;
            const origY = (Math.random() - 0.5) * 3.0;
            const origZ = (Math.random() - 0.5) * 2.0;
            cuboMesh.position.set(0, 0, 0);
            cuboMesh.scale.set(0, 0, 0);
            cuboMesh.userData = {
                origX: origX, origY: origY, origZ: origZ,
                dirX: (Math.random() - 0.5) * 8.0, dirY: (Math.random() - 0.5) * 5.0, dirZ: (Math.random() - 0.5) * 6.0,
                rotXFactor: (Math.random() - 0.5) * 2.0, rotYFactor: (Math.random() - 0.5) * 2.0,
                pushVelX: 0, pushVelY: 0, pushVelZ: 0,
                spawnProgress: 0.0
            };
            cuadraditosFundamento.push(cuboMesh);
            if(scene) scene.add(cuboMesh);
        }
        faseFundamentoActiva = true;
    }
 
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
 
    function crearParticulaInteractiva(posicion, colorHex, velocidadX, velocidadY, tamañoFactor = 1.0) {
        const size = 0.04 + Math.random() * 0.08 * tamañoFactor;
        const geom = new THREE.BoxGeometry(size, size, size);
        const mat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.9,
            depthWrite: false
        });
        const part = new THREE.Mesh(geom, mat);
        part.position.copy(posicion);
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
 
    function limpiarParticulasInteractivas() {
        particulasInteractivas.forEach(p => {
            if (scene) scene.remove(p);
        });
        particulasInteractivas.length = 0;
    }
 
    function activarFase4Efectos() {
        faseFundamentoActiva = false;
        
        cuadraditosFundamento.forEach(cubo => {
            if (scene) scene.remove(cubo);
        });
        cuadraditosFundamento.length = 0;
 
        if (btnFinalizarJuegoFlotante) {
            btnFinalizarJuegoFlotante.classList.remove('reveal-menu');
            btnFinalizarJuegoFlotante.classList.add('hidden-menu');
        }
 
        clearTimeout(timerBotonFinalizar);
        timerBotonFinalizar = setTimeout(() => {
            if (faseEfectosActiva && btnFinalizarJuegoFlotante) {
                btnFinalizarJuegoFlotante.classList.remove('hidden-menu');
                btnFinalizarJuegoFlotante.classList.add('reveal-menu');
            }
        }, 1500);
 
        if (prismaSection) {
            prismaSection.style.backgroundColor = '#ffffff';
            prismaSection.classList.remove('inspeccion-activa');
        }
        if (rejillaClara) {
            rejillaClara.style.display = 'block';
        }
 
        prismasFase4.forEach(p => {
            if (scene) scene.remove(p);
        });
        prismasFase4.length = 0;
 
        hacesDeLuzFase4.forEach(h => {
            if (scene) scene.remove(h);
        });
        hacesDeLuzFase4.length = 0;
 
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
 
        // Crear geometría de estrella 3D de 4 puntas biselada
        const starShape = new THREE.Shape();
        const R = 0.52; // Radio exterior
        const r = 0.16; // Radio interior
        starShape.moveTo(R, 0);
        starShape.lineTo(r, r);
        starShape.lineTo(0, R);
        starShape.lineTo(-r, r);
        starShape.lineTo(-R, 0);
        starShape.lineTo(-r, -r);
        starShape.lineTo(0, -R);
        starShape.lineTo(r, -r);
        starShape.closePath();
 
        const extrudeSettings = {
            steps: 1,
            depth: 0.16,
            bevelEnabled: true,
            bevelThickness: 0.08,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
        };
        const geomStar = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
        geomStar.center(); // Centrar pivote geométrico
 
        luzCentral = new THREE.Mesh(
            geomStar,
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                roughness: 0.05,
                metalness: 0.1,
                transmission: 0.9,
                thickness: 1.2,
                ior: 1.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                transparent: true,
                opacity: 1.0,
                emissive: 0xffffff,
                emissiveIntensity: 0.15
            })
        );
        luzCentral.name = "luzCentral";
        luzCentral.position.set(0, 0, 0.1);
        scene.add(luzCentral);
 
        const configs = [
            { color: 0x007bff, x: -2.2, y: 1.2, name: 'azul' },
            { color: 0xdc3545, x: 2.2, y: 1.2, name: 'rojo' },
            { color: 0xffc107, x: -2.2, y: -1.2, name: 'amarillo' },
            { color: 0x28a745, x: 2.2, y: -1.2, name: 'verde' }
        ];
 
        configs.forEach(cfg => {
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
            meshExt.scale.set(0.1, 0.1, 0.1);
 
            const geomHaz = new THREE.PlaneGeometry(1.6, 6.0);
            geomHaz.translate(0, -3.0, 0);
            const matHaz = new THREE.MeshBasicMaterial({
                color: cfg.color,
                map: crearTexturaGradiente(),
                transparent: true,
                opacity: 0.35,
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
 
    function iniciarTransicionFase4() {
        faseFundamentoActiva = false;
        faseTransicion3a4 = true;
        transicionTime = 0;
        playTransitionSwoop();
        morphers = [];
        
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
                    mesh.material.needsUpdate = true;
                    morphers.push(mesh);
                }
            }
        });
        
        cuadraditosFundamento.forEach(cubo => {
            if (!cubo.userData.isMorpher) {
                cubo.userData.fallVelY = (Math.random() * 0.04) + 0.02;
                cubo.userData.fallVelX = (Math.random() - 0.5) * 0.03;
                cubo.userData.fallVelZ = (Math.random() - 0.5) * 0.03;
            }
        });
    }
 
    if (btnFinalizarJuegoFlotante) {
        btnFinalizarJuegoFlotante.addEventListener('click', () => {
            faseEfectosActiva = false;
            clearTimeout(timerBotonFinalizar);
            
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
            ejecutarTransicionFinal(() => {
                window.location.href = 'index.html';
            });
        });
    }
 
    if (btnReiniciarPrisma) {
        btnReiniciarPrisma.addEventListener('click', () => {
            inicializarPrisma3D();
        });
    }
 
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
 
    if (canvasContainer) {
        canvasContainer.addEventListener('click', (e) => {
            if (faseEfectosActiva && scene && camera && renderer) {
                const rect = renderer.domElement.getBoundingClientRect();
                mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
 
                raycaster.setFromCamera(mouseVector, camera);
                
                const intersectsCubes = raycaster.intersectObjects(prismasFase4, true);
                if (intersectsCubes.length > 0) {
                    let clickedCubo = intersectsCubes[0].object;
                    while (clickedCubo.parent && !prismasFase4.includes(clickedCubo)) {
                        clickedCubo = clickedCubo.parent;
                    }
                    clickedCubo.scale.set(1.4, 0.6, 1.4);
                    clickedCubo.userData.spinVelocity = 0.22;
                    playColorNote(clickedCubo.name);
 
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
 
                if (luzCentral) {
                    const intersectsBulb = raycaster.intersectObject(luzCentral);
                    if (intersectsBulb.length > 0) {
                        luzCentral.scale.set(1.7, 1.7, 1.7);
                        playColorNote('blanco');
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
 
                const intersectsGrid = raycaster.intersectObjects(rejillaInteractiva);
                if (intersectsGrid.length > 0) {
                    const clickedCell = intersectsGrid[0].object;
                    const clickPos = clickedCell.position;
                    
                    // Sintetizar tono pentatónico según posición X e Y (X: -6.5 a 6.5, Y: -4.0 a 4.0)
                    const pctX = (clickPos.x + 6.5) / 13.0; // Normalizado 0 a 1
                    const pctY = (clickPos.y + 4.0) / 8.0;  // Normalizado 0 a 1
                    
                    // Escala pentatónica mayor armonizada (C4 a A5)
                    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
                    const noteIdx = Math.floor(pctX * 6) + Math.floor(pctY * 4);
                    const freq = pentatonic[Math.min(9, Math.max(0, noteIdx))];
                    
                    playCustomRippleTone(freq);
                    
                    const coloresRipple = [0x28a745, 0xffc107, 0xdc3545, 0x007bff];
                    const chosenColor = coloresRipple[Math.floor(Math.random() * coloresRipple.length)];
 
                    rejillaInteractiva.forEach(cell => {
                        const dist = cell.position.distanceTo(clickPos);
                        if (dist < 4.8) {
                            setTimeout(() => {
                                if (faseEfectosActiva && cell && cell.material) {
                                    cell.material.color.setHex(chosenColor);
                                    cell.material.opacity = Math.max(0.65, 0.85 - dist * 0.15);
                                }
                            }, dist * 80);
                        }
                    });
 
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
                
                clickesDeCubosRealizados++;
                playBubblePop();
 
                const indicador = document.getElementById('indicadorClic');
                if (indicador) {
                    indicador.style.opacity = '0';
                    setTimeout(() => indicador.remove(), 500);
                }
 
                if (clickesDeCubosRealizados >= 5) {
                    iniciarTransicionFase4();
                    return;
                }
 
                clickedCubo.userData.scaleModifier = 0.5 + Math.random() * 1.5;
 
                for (let i = 0; i < 4; i++) {
                    const randCubo = cuadraditosFundamento[Math.floor(Math.random() * cuadraditosFundamento.length)];
                    if (randCubo && randCubo !== clickedCubo) {
                        randCubo.userData.scaleModifier = 0.4 + Math.random() * 1.4;
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
                            setTimeout(() => {
                                if (cubo && cubo.material) {
                                    cubo.material.color.setHex(originalColor);
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
            ejecutarTransicionFinal(() => {
                if (pantallaVictoria) {
                    pantallaVictoria.classList.remove('reveal-screen');
                    pantallaVictoria.classList.add('hidden-screen');
                }
                
                if (prismaSection) {
                    prismaSection.classList.add('hidden-screen');
                    prismaSection.style.backgroundColor = '';
                }
                if (pantallaPortada) pantallaPortada.classList.remove('hidden-screen');
                if (backgroundLiquido) backgroundLiquido.classList.remove('hidden-screen');
                
                faseEfectosActiva = false;
                clearTimeout(timerBotonFinalizar);
 
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
                
                inicializarPortadaConCuadrados();
            });
        });
    }

    function ejecutarTransicionFinal(callback) {
        const overlay = document.getElementById('transitionOverlay');
        if (overlay) {
            overlay.classList.add('active');
            setTimeout(() => {
                callback();
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 400);
            }, 1400);
        } else {
            callback();
        }
    }
});