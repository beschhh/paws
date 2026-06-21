document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.header_nav');
    if (burger && nav) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        function toggleMenu() {
            burger.classList.toggle('burger-open');
            nav.classList.toggle('header_nav-open');
            overlay.classList.toggle('nav-overlay-visible');
            document.body.style.overflow = nav.classList.contains('header_nav-open') ? 'hidden' : '';
        }

        burger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        nav.querySelectorAll('.nav_link').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('header_nav-open')) toggleMenu();
            });
        });
    }

    document.querySelectorAll('.counter_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            const input = document.getElementById(target + '-count');
            let val = parseInt(input.value, 10) || 0;
            if (btn.dataset.action === 'plus') val++;
            else if (val > 0) val--;
            input.value = val || '';
        });
    });

    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('menu-tab-active'));
            tab.classList.add('menu-tab-active');
            document.querySelectorAll('.menu-content').forEach(c => c.classList.remove('menu-content-active'));
            const target = tab.dataset.tab === 'people' ? 'menu-people' : 'menu-dogs';
            document.getElementById(target).classList.add('menu-content-active');

            const waves = document.getElementById('menu-waves');
            const page = document.querySelector('.menu-page');
            if (waves) {
                waves.style.backgroundImage = tab.dataset.tab === 'people'
                    ? "url('assets/images/люди.png')"
                    : "url('assets/images/псы_меню_фон.png')";
                waves.style.backgroundSize = tab.dataset.tab === 'people'
                    ? "80% auto"
                    : "81% auto";
            }
            if (page) {
                page.style.backgroundColor = tab.dataset.tab === 'people'
                    ? '#F8ABD9'
                    : '#FEF4EB';
            }
            const header = document.querySelector('.header');
            if (header) {
                header.style.backgroundImage = tab.dataset.tab === 'people'
                    ? "url('assets/images/хэдер беж-роз.jpg')"
                    : "url('assets/images/хэдер роз-беж.jpg')";
            }
        });
    });

    const gameField = document.getElementById('game-field');
    if (gameField) {
        const pawImages = [
            'assets/images/Frame 50.png',
            'assets/images/Frame 51.png',
            'assets/images/Frame 52.png',
            'assets/images/Frame 53.png'
        ];
        let score = 0;
        let gameRunning = true;
        const scoreEl = document.getElementById('game-score');
        const winEl = document.getElementById('game-win');
        const basket = document.getElementById('game-basket');
        const fieldRect = () => gameField.getBoundingClientRect();

        gameField.addEventListener('mousemove', (e) => {
            const rect = fieldRect();
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            x = Math.max(10, Math.min(90, x));
            basket.style.left = x + '%';
        });

        gameField.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = fieldRect();
            let x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
            x = Math.max(10, Math.min(90, x));
            basket.style.left = x + '%';
        }, { passive: false });

        function spawnPaw() {
            if (!gameRunning || score >= 10) return;
            const paw = document.createElement('img');
            paw.src = pawImages[Math.floor(Math.random() * pawImages.length)];
            paw.className = 'game_paw';
            const size = 60 + Math.random() * 50;
            paw.style.width = size + 'px';
            const x = 5 + Math.random() * 80;
            paw.style.left = x + '%';
            paw.style.top = '-80px';
            paw.style.transform = 'rotate(' + (Math.random() * 40 - 20) + 'deg)';
            gameField.appendChild(paw);

            const speed = 1.5 + Math.random() * 2;
            let posY = -80;

            
            function fall() {
                if (!gameRunning) { paw.remove(); return; }
                posY += speed;
                paw.style.top = posY + 'px';
                const rect = fieldRect();
                const basketRect = basket.getBoundingClientRect();
                const pawRect = paw.getBoundingClientRect();

                if (pawRect.bottom >= basketRect.top &&
                    pawRect.left + pawRect.width / 2 > basketRect.left &&
                    pawRect.left + pawRect.width / 2 < basketRect.right &&
                    posY < rect.height - 40) {
                    paw.remove();
                    score++;
                    scoreEl.textContent = score + '/10';
                    if (score >= 10) {
                        gameRunning = false;
                        setTimeout(() => { winEl.style.display = 'flex'; }, 300);
                    }
                    return;
                }

                if (posY > rect.height + 20) {
                    paw.remove();
                    return;
                }
                requestAnimationFrame(fall);
            }
            requestAnimationFrame(fall);

            setTimeout(spawnPaw, 800 + Math.random() * 1200);
        }

        spawnPaw();
        setTimeout(spawnPaw, 400);
        setTimeout(spawnPaw, 900);

        document.getElementById('game-close').addEventListener('click', () => {
            winEl.style.display = 'none';
            score = 0;
            scoreEl.textContent = '0/10';
            gameRunning = true;
            gameField.querySelectorAll('.game_paw').forEach(p => p.remove());
            spawnPaw();
            setTimeout(spawnPaw, 400);
            setTimeout(spawnPaw, 900);
        });
    }



    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
