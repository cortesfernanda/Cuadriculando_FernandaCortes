// Remover la clase de fade-in de inmediato para evitar retrasos o bloqueos por carga
if (document.body) {
    document.body.classList.remove('page-fade-in');
}

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

    // 2. DINÁMICA DE LA NAVBAR
    const navbar = document.querySelector('.navbar');
    
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

    // 3. DETECTOR DE SECCIÓN ACTIVA (SCROLL SPY)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-links .nav-link');

    function scrollSpy() {
        if (window.location.pathname.includes('newpage.html')) return;

        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        let activeSectionId = null;
        let maxVisibleHeight = 0;

        sections.forEach(current => {
            const rect = current.getBoundingClientRect();
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                activeSectionId = current.getAttribute('id');
            }
        });

        if (scrollPosition < 300) {
            activeSectionId = null;
        }

        let highlightSectionId = activeSectionId;
        if (activeSectionId === 'como-ganar') {
            highlightSectionId = 'como-se-juega';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (highlightSectionId && link.getAttribute('href') === `#${highlightSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('load', scrollSpy);
    scrollSpy();

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

    // 5. GRILLA INTERACTIVA DEL HERO
    const gridContainer = document.getElementById('grid-interaction-container');
    
    if (gridContainer) {
        const colors = ['flash-verde', 'flash-amarillo', 'flash-azul', 'flash-rojo'];
        const cellSize = 50; 
        const columns = Math.ceil(window.innerWidth / cellSize);
        const rows = Math.ceil(window.innerHeight / cellSize);
        const totalCells = columns * rows;

        gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-pixel');
            
            cell.addEventListener('mouseenter', () => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                cell.classList.add(randomColor);
                
                setTimeout(() => {
                    cell.classList.remove(randomColor);
                }, 250); 
            });
            
            gridContainer.appendChild(cell);
        }
    }

    // 6. RENDERIZADOR 3D DE LA CAJA DEL JUEGO
    const boxContainer = document.getElementById('canvas-caja-3d');
    if (boxContainer && typeof THREE !== 'undefined') {
        const width = boxContainer.clientWidth || 400;
        const height = boxContainer.clientHeight || 480;

        const scene3d = new THREE.Scene();
        
        const camera3d = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera3d.position.set(0, 3.2, 5.8);
        camera3d.lookAt(0, 0.1, 0);

        const renderer3d = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer3d.setSize(width, height);
        renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        boxContainer.appendChild(renderer3d.domElement);

        const mainGroup = new THREE.Group();
        scene3d.add(mainGroup);

        const GLYPHS_LOCAL = {
            'C': ["#####", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
            'U': ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", "#####"],
            'A': ["#####", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
            'D': ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
            'R': ["#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"],
            'I': ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "#####"],
            'L': ["#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
            'N': ["#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"],
            'O': ["#####", "#   #", "#   #", "#   #", "#   #", "#   #", "#####"]
        };

        function drawLogoLocal(ctx, centerX, centerY, pixelSize) {
            const text = "CUADRICULANDO";
            const letterSpacing = 2;
            const glyphWidth = 5;
            const glyphHeight = 7;
            const totalWidth = (text.length * glyphWidth * pixelSize) + ((text.length - 1) * letterSpacing * pixelSize);
            let startX = centerX - (totalWidth / 2);
            let startY = centerY - ((glyphHeight * pixelSize) / 2);

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const glyph = GLYPHS_LOCAL[char];
                const charX = startX + i * ((glyphWidth + letterSpacing) * pixelSize);
                if (glyph) {
                    for (let r = 0; r < glyphHeight; r++) {
                        const row = glyph[r];
                        for (let c = 0; c < glyphWidth; c++) {
                            if (row[c] === '#') {
                                ctx.fillStyle = '#ffffff';
                                if (i === 5) {
                                    if (r === 0) ctx.fillStyle = '#2f80ed';
                                    if (r === 6) ctx.fillStyle = '#f2c94c';
                                } else if (i === 11) {
                                    if (r === 0 && c === 4) ctx.fillStyle = '#eb5757';
                                }
                                ctx.fillRect(charX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
                            }
                        }
                    }
                }
            }
        }

        function createTextureLocal(side) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0e0e10';
            ctx.fillRect(0, 0, 512, 512);

            if (side === 'top') {
                const canvasTex = new THREE.CanvasTexture(canvas);
                const img = new Image();
                img.src = 'assets/tapa_caja.jpg';
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, img.width, img.height * 0.965, 0, 0, 512, 512);
                    canvasTex.needsUpdate = true;
                };
                return canvasTex;
            } else if (side === 'side') {
                canvas.height = 64;
                ctx.fillStyle = '#0e0e10';
                ctx.fillRect(0, 0, 512, 64);
                
                ctx.strokeStyle = '#050506';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, 20);
                ctx.lineTo(512, 20);
                ctx.stroke();

                ctx.strokeStyle = '#1a1a1f';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, 21);
                ctx.lineTo(512, 21);
                ctx.stroke();

                drawLogoLocal(ctx, 256, 38, 1.7);
                return new THREE.CanvasTexture(canvas);
            }
            return new THREE.CanvasTexture(canvas);
        }

        const topTex = createTextureLocal('top');
        const sideTex = createTextureLocal('side');

        function createShadowTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
            grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 128, 128);
            return new THREE.CanvasTexture(canvas);
        }

        const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
        const shadowMat = new THREE.MeshBasicMaterial({
            map: createShadowTexture(),
            transparent: true,
            depthWrite: false
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.y = -0.55;
        scene3d.add(shadowMesh);

        const matSide = new THREE.MeshPhysicalMaterial({
            map: sideTex,
            roughness: 0.35,
            metalness: 0.1,
            clearcoat: 0.3
        });
        const matTop = new THREE.MeshPhysicalMaterial({
            map: topTex,
            roughness: 0.15,
            metalness: 0.05,
            clearcoat: 0.9,
            clearcoatRoughness: 0.08
        });
        const matBottom = new THREE.MeshStandardMaterial({
            color: 0x0e0e10,
            roughness: 0.5
        });

        const materials = [matSide, matSide, matTop, matBottom, matSide, matSide];

        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 3.2), materials);
        mainGroup.add(boxMesh);

        mainGroup.rotation.x = 0.45;
        mainGroup.rotation.y = -0.45;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
        scene3d.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.85);
        dirLight.position.set(4, 8, 5);
        scene3d.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xebf2ff, 0.45);
        fillLight.position.set(-4, 4, -4);
        scene3d.add(fillLight);

        let isDragging = false;
        let prevMousePos = { x: 0, y: 0 };
        let autoRotate = true;
        let autoRotateTimer;

        boxContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            autoRotate = false;
            clearTimeout(autoRotateTimer);
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                autoRotateTimer = setTimeout(() => { autoRotate = true; }, 3000);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevMousePos.x;
            const deltaY = e.clientY - prevMousePos.y;
            mainGroup.rotation.y += deltaX * 0.008;
            mainGroup.rotation.x += deltaY * 0.008;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        boxContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                autoRotate = false;
                clearTimeout(autoRotateTimer);
                prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                autoRotateTimer = setTimeout(() => { autoRotate = true; }, 3000);
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - prevMousePos.x;
            const deltaY = e.touches[0].clientY - prevMousePos.y;
            mainGroup.rotation.y += deltaX * 0.008;
            mainGroup.rotation.x += deltaY * 0.008;
            prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        let time = 0;
        function renderLoop() {
            requestAnimationFrame(renderLoop);
            time += 0.005;

            const bobHeight = Math.sin(time * 2.5) * 0.08;
            boxMesh.position.y = bobHeight;

            shadowMat.opacity = 0.65 - (bobHeight * 2);
            const shadowScale = 1.0 - (bobHeight * 0.4);
            shadowMesh.scale.set(shadowScale, shadowScale, 1);

            if (autoRotate) {
                mainGroup.rotation.y = time - 0.45;
                mainGroup.rotation.x = 0.45 + Math.sin(time * 0.8) * 0.08;
            }
            renderer3d.render(scene3d, camera3d);
        }
        renderLoop();

        const resizeObserver = new ResizeObserver(() => {
            const w = boxContainer.clientWidth;
            const h = boxContainer.clientHeight;
            if (w > 0 && h > 0) {
                camera3d.aspect = w / h;
                camera3d.updateProjectionMatrix();
                renderer3d.setSize(w, h);
            }
        });
        resizeObserver.observe(boxContainer);
    }

    // 7. LÓGICA DE LA RULETA INTERACTIVA
    const rouletteCard = document.getElementById('card-roulette');
    const rouletteCanvas = document.getElementById('roulette-canvas');
    if (rouletteCard && rouletteCanvas) {
        const ctx = rouletteCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = 110;
        const height = 110;
        
        rouletteCanvas.width = width * dpr;
        rouletteCanvas.height = height * dpr;
        rouletteCanvas.style.width = width + 'px';
        rouletteCanvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        const cx = width / 2;
        const cy = height / 2;
        const radius = 45;
        const textRadius = radius * 0.68;

        let theta = 0;
        let spinActive = false;
        let currentSpeed = 0;
        const friction = 0.975;
        let hasLanded = false;
        let winningNumber = null;
        let pulseScale = 1;
        let pulseDirection = 1;
        let hoverActive = false;

        function drawRoulette() {
            ctx.clearRect(0, 0, width, height);

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(theta);
            ctx.translate(-cx, -cy);

            ctx.fillStyle = '#0c0c0e';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const sectorAngle = (i * Math.PI / 4);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(sectorAngle) * radius, cy + Math.sin(sectorAngle) * radius);
                ctx.stroke();
            }

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 12px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            for (let k = 1; k <= 8; k++) {
                const sectorAngle = -Math.PI / 2 + (k - 0.5) * (Math.PI / 4);
                
                ctx.save();
                const tx = cx + Math.cos(sectorAngle) * textRadius;
                const ty = cy + Math.sin(sectorAngle) * textRadius;
                ctx.translate(tx, ty);
                ctx.rotate(sectorAngle + Math.PI / 2);
                ctx.fillText(k.toString(), 0, 0);
                ctx.restore();
            }

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, 14, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();

            ctx.fillStyle = '#0c0c0e';
            ctx.beginPath();
            ctx.arc(cx, cy, 13, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, 13, 0, Math.PI * 2);
            ctx.stroke();

            if (spinActive || !hasLanded) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.save();
                ctx.fillStyle = '#fcf464';
                ctx.font = `900 ${Math.floor(13 * pulseScale)}px Montserrat, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = '#fcf464';
                ctx.shadowBlur = 6 * pulseScale;
                ctx.fillText(winningNumber.toString(), cx, cy);
                ctx.restore();

                if (pulseScale > 1) {
                    ctx.strokeStyle = `rgba(252, 244, 100, ${(1.3 - pulseScale) * 2})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 13 + (pulseScale - 1) * 10, 0, Math.PI * 2);
                    ctx.stroke();
                }

                if (pulseScale > 1.25) pulseDirection = -1;
                if (pulseScale < 1) pulseScale = 1;
                if (pulseScale > 1 || pulseDirection === 1) {
                    pulseScale += pulseDirection * 0.015;
                }
            }
        }

        function updateAnimation() {
            if (spinActive) {
                theta += currentSpeed;
                currentSpeed *= friction;
                
                if (currentSpeed < 0.0015) {
                    spinActive = false;
                    currentSpeed = 0;
                    hasLanded = true;
                    
                    let normalized = (-theta) % (Math.PI * 2);
                    if (normalized < 0) normalized += Math.PI * 2;
                    const sector = Math.floor(normalized / (Math.PI / 4));
                    winningNumber = sector + 1;
                    
                    pulseScale = 1.3;
                    pulseDirection = -1;
                }
            }

            drawRoulette();
            
            if (spinActive || (hasLanded && pulseScale > 1)) {
                requestAnimationFrame(updateAnimation);
            }
        }

        function startSpin() {
            if (spinActive) return;
            spinActive = true;
            hasLanded = false;
            currentSpeed = 0.22 + Math.random() * 0.16;
            updateAnimation();
        }

        rouletteCard.addEventListener('mouseenter', () => {
            hoverActive = true;
            startSpin();
        });

        rouletteCard.addEventListener('mouseleave', () => {
            hoverActive = false;
        });

        drawRoulette();
    }

    // 8. LÓGICA DE LAS CARTAS DE JUEGO
    const cardsCard = document.getElementById('card-cards');
    const cardsCanvas = document.getElementById('cards-canvas');
    if (cardsCard && cardsCanvas) {
        const ctx = cardsCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = 120;
        const height = 120;
        
        cardsCanvas.width = width * dpr;
        cardsCanvas.height = height * dpr;
        cardsCanvas.style.width = width + 'px';
        cardsCanvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        const cx = width / 2;
        const cy = height / 2;
        const cardW = 40;
        const cardH = 64;

        let currentProgress = 0;
        let targetProgress = 0;
        let isAnimating = false;

        function drawRoundRect(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y);
            c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r);
            c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h);
            c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r);
            c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
        }

        function drawSingleCardIcon(c, x, y, rotation) {
            c.save();
            c.translate(x, y);
            c.rotate(rotation);

            c.fillStyle = '#0c0c0e';
            c.strokeStyle = '#ffffff';
            c.lineWidth = 1.6;
            drawRoundRect(c, -cardW / 2, -cardH / 2, cardW, cardH, 5);
            c.fill();
            c.stroke();

            c.restore();
        }

        function drawCards() {
            ctx.clearRect(0, 0, width, height);
            const p = currentProgress;

            drawSingleCardIcon(ctx, cx - 10 - 24 * p, cy + 4 * p, -0.08 - 0.22 * p);
            drawSingleCardIcon(ctx, cx + 10 + 24 * p, cy + 4 * p, 0.08 + 0.22 * p);
            drawSingleCardIcon(ctx, cx - 5 - 12 * p, cy + 1 * p, -0.04 - 0.11 * p);
            drawSingleCardIcon(ctx, cx + 5 + 12 * p, cy + 1 * p, 0.06 + 0.11 * p);
            drawSingleCardIcon(ctx, cx, cy - 4 * p, 0);
        }

        function animateCards() {
            isAnimating = true;
            const diff = targetProgress - currentProgress;
            if (Math.abs(diff) > 0.005) {
                currentProgress += diff * 0.16;
                drawCards();
                requestAnimationFrame(animateCards);
            } else {
                currentProgress = targetProgress;
                drawCards();
                isAnimating = false;
            }
        }

        cardsCard.addEventListener('mouseenter', () => {
            targetProgress = 1;
            if (!isAnimating) animateCards();
        });

        cardsCard.addEventListener('mouseleave', () => {
            targetProgress = 0;
            if (!isAnimating) animateCards();
        });

        drawCards();
    }

    // 9. LÓGICA DEL PEÓN REAL SILUETA
    const pawnCard = document.getElementById('card-pawn');
    const pawnCanvas = document.getElementById('pawn-canvas');
    if (pawnCard && pawnCanvas) {
        const ctx = pawnCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = 120;
        const height = 120;
        
        pawnCanvas.width = width * dpr;
        pawnCanvas.height = height * dpr;
        pawnCanvas.style.width = width + 'px';
        pawnCanvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        const cx = width / 2;
        const pawnBaseY = 120;
        const bodyW = 32;
        const bodyH = 72;
        const bodyY = pawnBaseY - bodyH;
        const rHead = 16;
        const headCenterY = bodyY - rHead + 2;

        let pawnX = cx;
        let targetX = cx;
        let animTime = 0;
        let hoverActive = false;
        let animationFrameId = null;

        function drawRoundRect(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y);
            c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r);
            c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h);
            c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r);
            c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
        }

        function drawSolidPawn(c, px) {
            c.save();
            c.fillStyle = '#ffffff';
            c.strokeStyle = '#ffffff';
            c.lineWidth = 1.2;

            drawRoundRect(c, px - bodyW / 2, bodyY, bodyW, bodyH, 8);
            c.fill();
            c.stroke();

            c.beginPath();
            c.ellipse(px, bodyY, 6.5, 2.5, 0, 0, Math.PI * 2);
            c.fill();
            c.stroke();

            c.beginPath();
            c.arc(px, headCenterY, rHead, 0, Math.PI * 2);
            c.fill();
            c.stroke();

            c.restore();
        }

        function drawPawnFrame() {
            ctx.clearRect(0, 0, width, height);
            drawSolidPawn(ctx, pawnX);
        }

        function renderPawnLoop() {
            if (hoverActive) {
                animTime += 0.04;
                targetX = cx + Math.sin(animTime) * 32;
            } else {
                targetX = cx;
            }

            const diff = targetX - pawnX;
            pawnX += diff * 0.15;

            drawPawnFrame();

            if (hoverActive || Math.abs(diff) > 0.05) {
                animationFrameId = requestAnimationFrame(renderPawnLoop);
            } else {
                pawnX = cx;
                drawPawnFrame();
                animationFrameId = null;
            }
        }

        pawnCard.addEventListener('mouseenter', () => {
            hoverActive = true;
            if (!animationFrameId) {
                renderPawnLoop();
            }
        });

        pawnCard.addEventListener('mouseleave', () => {
            hoverActive = false;
        });

        drawPawnFrame();
    }

    // 10. LÓGICA DEL TABLERO EXPLORA Y BLOQUEA
    const blockCard = document.getElementById('card-block');
    const blockCanvas = document.getElementById('block-canvas');
    if (blockCard && blockCanvas) {
        const ctx = blockCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = 120;
        const height = 120;
        
        blockCanvas.width = width * dpr;
        blockCanvas.height = height * dpr;
        blockCanvas.style.width = width + 'px';
        blockCanvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        let hoverActive = false;
        let animationFrameId = null;
        let animProgress = 0;

        function drawBoard() {
            ctx.clearRect(0, 0, width, height);

            for (let r = 0; r <= 10; r++) {
                for (let c = 0; c <= 10; c++) {
                    const cx = 10 + c * 10 + 5;
                    const cy = 10 + r * 10 + 5;

                    const isTrack = (r === 0 || r === 10 || c === 0 || c === 10 || r === 5 || c === 5);
                    const isCorner = (r === 0 || r === 10) && (c === 0 || c === 10);
                    const isCenter = (r === 5 && c === 5);

                    if (isTrack) {
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(10 + c * 10, 10 + r * 10, 10, 10);

                        if (isCorner) {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                            ctx.strokeRect(10 + c * 10 + 1, 10 + r * 10 + 1, 8, 8);
                            
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '800 5px Montserrat, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('x3', cx, cy);
                        } else if (isCenter) {
                            ctx.strokeStyle = '#ffffff';
                            ctx.beginPath();
                            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                            ctx.stroke();

                            ctx.fillStyle = '#ffffff';
                            ctx.font = '800 4px Montserrat, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('x2', cx, cy);
                        } else {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
                            ctx.lineWidth = 0.8;
                            if ((r + c) % 2 === 0) {
                                ctx.beginPath();
                                ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
                                ctx.stroke();
                            } else {
                                ctx.beginPath();
                                ctx.moveTo(cx, cy - 2.2);
                                ctx.lineTo(cx + 2.2, cy);
                                ctx.lineTo(cx, cy + 2.2);
                                ctx.lineTo(cx - 2.2, cy);
                                ctx.closePath();
                                ctx.stroke();
                            }
                        }
                    } else {
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                        ctx.lineWidth = 0.6;
                        ctx.strokeRect(10 + c * 10, 10 + r * 10, 10, 10);
                    }
                }
            }

            const t = animProgress;

            let px = 15;
            let py = 115;

            if (t <= 0.55) {
                const factor = t / 0.55;
                px = 15 + (65 - 15) * factor;
                py = 115;
            } else if (t <= 0.75) {
                const factor = (t - 0.55) / 0.20;
                px = 65;
                py = 115 + (85 - 115) * factor;
            } else {
                px = 65;
                py = 87;
            }

            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = hoverActive ? 4 : 0;
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            if (t >= 0.72) {
                const pulse = Math.floor((t - 0.72) * 20) % 2 === 0;
                ctx.strokeStyle = pulse ? '#fcf464' : '#e4646c';
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(60, 75);
                ctx.lineTo(70, 75);
                ctx.stroke();

                ctx.font = '900 8px Montserrat, sans-serif';
                ctx.fillStyle = pulse ? '#fcf464' : '#e4646c';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('X', 65, 69);
            }
        }

        function renderBlockLoop() {
            if (hoverActive) {
                animProgress += 0.008;
                if (animProgress > 1) {
                    animProgress = 0;
                }
            } else {
                if (animProgress > 0) {
                    animProgress -= 0.02;
                    if (animProgress < 0) animProgress = 0;
                }
            }

            drawBoard();

            if (hoverActive || animProgress > 0) {
                animationFrameId = requestAnimationFrame(renderBlockLoop);
            } else {
                animationFrameId = null;
            }
        }

        blockCard.addEventListener('mouseenter', () => {
            hoverActive = true;
            if (!animationFrameId) {
                renderBlockLoop();
            }
        });

        blockCard.addEventListener('mouseleave', () => {
            hoverActive = false;
        });

        drawBoard();
    }

    // 11. LÓGICA DE LA CUADRÍCULA GANADORA
    const gridWinCard = document.getElementById('card-grid-win');
    const gridWinCanvas = document.getElementById('grid-win-canvas');
    if (gridWinCard && gridWinCanvas) {
        const ctx = gridWinCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = 120;
        const height = 120;
        
        gridWinCanvas.width = width * dpr;
        gridWinCanvas.height = height * dpr;
        gridWinCanvas.style.width = width + 'px';
        gridWinCanvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        let hoverActive = false;
        let animationFrameId = null;
        let fillCount = 0;

        const cellSize = 20;
        const startX = 20;
        const startY = 20;

        const spiral = [
            {r: 0, c: 0}, {r: 0, c: 1}, {r: 0, c: 2}, {r: 0, c: 3},
            {r: 1, c: 3}, {r: 2, c: 3}, {r: 3, c: 3}, {r: 3, c: 2},
            {r: 3, c: 1}, {r: 3, c: 0}, {r: 2, c: 0}, {r: 1, c: 0},
            {r: 1, c: 1}, {r: 1, c: 2}, {r: 2, c: 2}, {r: 2, c: 1}
        ];

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);

            const filledLimit = Math.floor(fillCount);
            for (let i = 0; i < filledLimit; i++) {
                const cell = spiral[i];
                const cx = startX + cell.c * cellSize;
                const cy = startY + cell.r * cellSize;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
                ctx.fillRect(cx, cy, cellSize, cellSize);
            }

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            for (let r = 1; r < 4; r++) {
                ctx.moveTo(startX, startY + r * cellSize);
                ctx.lineTo(startX + 80, startY + r * cellSize);
            }
            for (let c = 1; c < 4; c++) {
                ctx.moveTo(startX + c * cellSize, startY);
                ctx.lineTo(startX + c * cellSize, startY + 80);
            }
            ctx.stroke();

            ctx.font = '800 8px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const isInner = (r === 1 || r === 2) && (c === 1 || c === 2);
                    const val = isInner ? '20' : '10';
                    
                    const idx = spiral.findIndex(item => item.r === r && item.c === c);
                    if (idx < filledLimit) {
                        ctx.fillStyle = '#ffffff';
                    } else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
                    }

                    const tx = startX + c * cellSize + cellSize / 2;
                    const ty = startY + r * cellSize + cellSize / 2;
                    ctx.fillText(val, tx, ty);
                }
            }

            if (fillCount >= 16) {
                const pulse = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
                ctx.save();
                ctx.strokeStyle = '#fcf464';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#fcf464';
                ctx.shadowBlur = 4 + pulse * 6;
                ctx.strokeRect(startX, startY, 80, 80);
                ctx.restore();
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(startX, startY, 80, 80);
            }
        }

        function renderGridLoop() {
            if (hoverActive) {
                if (fillCount < 16) {
                    fillCount += 0.22;
                    if (fillCount > 16) fillCount = 16;
                }
            } else {
                if (fillCount > 0) {
                    fillCount -= 0.4;
                    if (fillCount < 0) fillCount = 0;
                }
            }

            drawGrid();

            if (hoverActive || fillCount > 0) {
                animationFrameId = requestAnimationFrame(renderGridLoop);
            } else {
                animationFrameId = null;
            }
        }

        gridWinCard.addEventListener('mouseenter', () => {
            hoverActive = true;
            if (!animationFrameId) {
                renderGridLoop();
            }
        });

        gridWinCard.addEventListener('mouseleave', () => {
            hoverActive = false;
        });

        drawGrid();
    }

    // 12. LÓGICA DEL CARRUSEL DE FOTOS
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.btn-next');
    const prevButton = document.querySelector('.btn-prev');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (track && slides.length > 0 && nextButton && prevButton && dotsContainer) {
        let currentIdx = 0;
        let autoplayTimer = null;

        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

        function updateSlidePosition() {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentIdx);
            });
            
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIdx);
            });
        }

        function goToSlide(idx) {
            currentIdx = idx;
            if (currentIdx < 0) currentIdx = slides.length - 1;
            if (currentIdx >= slides.length) currentIdx = 0;
            updateSlidePosition();
        }

        nextButton.addEventListener('click', () => {
            goToSlide(currentIdx + 1);
            resetAutoplay();
        });

        prevButton.addEventListener('click', () => {
            goToSlide(currentIdx - 1);
            resetAutoplay();
        });

        function startAutoplay() {
            autoplayTimer = setInterval(() => {
                goToSlide(currentIdx + 1);
            }, 6000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        startAutoplay();

        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoplayTimer);
            });
            carouselContainer.addEventListener('mouseleave', () => {
                startAutoplay();
            });
        }

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    goToSlide(currentIdx + 1);
                } else {
                    goToSlide(currentIdx - 1);
                }
                resetAutoplay();
            }
        }
    }

    // 13. RENDERIZADOR 3D DE 4 ACRÍLICOS EN EL FUNDAMENTO
    const acrilicosContainer = document.getElementById('canvas-acrilicos-3d');
    if (acrilicosContainer && typeof THREE !== 'undefined') {
        const width = acrilicosContainer.clientWidth || 400;
        const height = acrilicosContainer.clientHeight || 480;

        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 6.2);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        acrilicosContainer.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const createAcrylicMaterial = (colorValue) => {
            return new THREE.MeshPhysicalMaterial({
                color: colorValue,
                roughness: 0.05,
                metalness: 0.01,
                transmission: 0.65,
                ior: 1.49,
                thickness: 0.15,
                transparent: true,
                opacity: 0.95,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                side: THREE.DoubleSide,
                depthWrite: true
            });
        };

        const plateGeo = new THREE.BoxGeometry(2.1, 2.1, 0.08);

        const plates = [
            { color: 0x22c55e, x: -0.3, y: -0.3, z: -0.45 },
            { color: 0x3b82f6, x: -0.1, y: -0.1, z: -0.15 },
            { color: 0xeab308, x: 0.1, y: 0.1, z: 0.15 },
            { color: 0xef4444, x: 0.3, y: 0.3, z: 0.45 }
        ];

        plates.forEach(data => {
            const mat = createAcrylicMaterial(data.color);
            const mesh = new THREE.Mesh(plateGeo, mat);
            mesh.position.set(data.x, data.y, data.z);
            group.add(mesh);
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
        keyLight.position.set(4, 5, 4);
        scene.add(keyLight);

        const backlight = new THREE.DirectionalLight(0xffffff, 1.6);
        backlight.position.set(-4, 4, -5);
        scene.add(backlight);

        group.rotation.x = 0.35;
        group.rotation.y = -0.6;

        let isDragging = false;
        let prevMousePos = { x: 0, y: 0 };
        let autoRotate = true;
        let autoRotateTimer;

        acrilicosContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            autoRotate = false;
            clearTimeout(autoRotateTimer);
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                autoRotateTimer = setTimeout(() => { autoRotate = true; }, 3000);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevMousePos.x;
            const deltaY = e.clientY - prevMousePos.y;
            group.rotation.y += deltaX * 0.007;
            group.rotation.x += deltaY * 0.007;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        acrilicosContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                autoRotate = false;
                clearTimeout(autoRotateTimer);
                prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                autoRotateTimer = setTimeout(() => { autoRotate = true; }, 3000);
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - prevMousePos.x;
            const deltaY = e.touches[0].clientY - prevMousePos.y;
            group.rotation.y += deltaX * 0.007;
            group.rotation.x += deltaY * 0.007;
            prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.004;

            if (autoRotate) {
                group.rotation.y = Math.sin(time * 0.5) * 0.7;
                group.rotation.x = 0.35 + Math.cos(time * 0.3) * 0.15;
            }

            renderer.render(scene, camera);
        }
        animate();

        const resizeObserver = new ResizeObserver(() => {
            const w = acrilicosContainer.clientWidth;
            const h = acrilicosContainer.clientHeight;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        });
        resizeObserver.observe(acrilicosContainer);
    }

    // 14. GRILLA INTERACTIVA PARA SECCIONES DE FONDO BLANCO (CANVAS DE ALTO RENDIMIENTO)
    const whiteSections = document.querySelectorAll('.bg-white');
    whiteSections.forEach(section => {
        const canvas = document.createElement('canvas');
        canvas.className = 'white-grid-canvas';
        section.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        let width = canvas.width = section.clientWidth;
        let height = canvas.height = section.clientHeight;
        const cellSize = 50;

        let activeCells = {};
        const colors = [
            'rgba(59, 130, 246, ',   // Azul
            'rgba(234, 179, 8, ',    // Amarillo (eab308)
            'rgba(239, 68, 68, ',    // Rojo (ef4444)
            'rgba(34, 197, 94, '     // Verde (22c55e)
        ];

        // Función matemática para módulo que siempre devuelve un valor positivo
        const mod = (n, m) => ((n % m) + m) % m;

        let offsetX = 0;
        let offsetY = 0;

        function updateGridOffsets() {
            // Alinea el canvas exactamente con el background-position: center del CSS
            offsetX = mod(section.clientWidth / 2 - cellSize / 2, cellSize);
            offsetY = mod(section.clientHeight / 2 - cellSize / 2, cellSize);
        }

        function resize() {
            width = canvas.width = section.clientWidth;
            height = canvas.height = section.clientHeight;
            updateGridOffsets();
        }

        updateGridOffsets();
        window.addEventListener('resize', resize);

        // Recalcular el tamaño del canvas si las imágenes de la sección cargan después
        const imgs = section.querySelectorAll('img');
        imgs.forEach(img => {
            if (img.complete) {
                resize();
            } else {
                img.addEventListener('load', resize);
            }
        });

        // Seguir movimiento del mouse en la sección alineando con la grilla centrada
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calcula columna y fila con respecto al offset del centro
            const col = Math.floor((x - offsetX) / cellSize);
            const row = Math.floor((y - offsetY) / cellSize);
            const key = `${row},${col}`;

            const minCol = Math.floor(-offsetX / cellSize);
            const maxCol = Math.ceil((width - offsetX) / cellSize);
            const minRow = Math.floor(-offsetY / cellSize);
            const maxRow = Math.ceil((height - offsetY) / cellSize);

            if (row >= minRow && row < maxRow && col >= minCol && col < maxCol) {
                if (!activeCells[key]) {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    activeCells[key] = {
                        row: row,
                        col: col,
                        color: randomColor,
                        opacity: 0,
                        targetOpacity: 0.12,
                        fadingIn: true,
                        lifespan: 1.0
                    };
                } else {
                    activeCells[key].lifespan = 1.0;
                    activeCells[key].fadingIn = true;
                }
            }
        });

        // Spawn automático ambiental alineado con la grilla
        let frames = 0;
        function draw() {
            ctx.clearRect(0, 0, width, height);

            frames++;
            if (frames % 40 === 0 && Math.random() < 0.75) {
                const minCol = Math.floor(-offsetX / cellSize);
                const maxCol = Math.ceil((width - offsetX) / cellSize);
                const minRow = Math.floor(-offsetY / cellSize);
                const maxRow = Math.ceil((height - offsetY) / cellSize);

                const row = minRow + Math.floor(Math.random() * (maxRow - minRow));
                const col = minCol + Math.floor(Math.random() * (maxCol - minCol));
                const key = `${row},${col}`;

                if (!activeCells[key]) {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    activeCells[key] = {
                        row: row,
                        col: col,
                        color: randomColor,
                        opacity: 0,
                        targetOpacity: 0.05 + Math.random() * 0.05,
                        fadingIn: true,
                        lifespan: 0.8
                    };
                }
            }

            // Dibujar y actualizar celdas activas posicionándolas según los offsets
            for (let key in activeCells) {
                const cell = activeCells[key];

                if (cell.fadingIn) {
                    cell.opacity += 0.012;
                    if (cell.opacity >= cell.targetOpacity) {
                        cell.opacity = cell.targetOpacity;
                        cell.fadingIn = false;
                    }
                } else {
                    cell.lifespan -= 0.01;
                    if (cell.lifespan <= 0) {
                        cell.opacity -= 0.008;
                        if (cell.opacity <= 0) {
                            delete activeCells[key];
                            continue;
                        }
                    }
                }

                const tileX = offsetX + cell.col * cellSize;
                const tileY = offsetY + cell.row * cellSize;

                ctx.fillStyle = cell.color + cell.opacity + ')';
                ctx.fillRect(tileX + 1.5, tileY + 1.5, cellSize - 3, cellSize - 3);
            }

            requestAnimationFrame(draw);
        }

        draw();
    });

    // 15. TRANSICIÓN SUTIL DE PÁGINA (FADE & BLUR)

    const linksToNewPage = document.querySelectorAll('a[href="newpage.html"]');
    linksToNewPage.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-fade-out');
            setTimeout(() => {
                window.location.href = link.getAttribute('href');
            }, 400); // Duración de la transición de salida
        });
    });
});