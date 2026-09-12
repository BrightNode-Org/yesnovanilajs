document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const question = document.getElementById('question');
    const gif = document.getElementById('main-gif');
    const container = document.getElementById('main-container');

    let noHoverCount = 0;
    let yesScale = 1;

    // Progressive teasing phrases and working GIFs
    const teasingStates = [
        { text: "Do you love me?", gif: "https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif" }, 
        { text: "Are you absolutely sure?", gif: "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif" },
        { text: "Think again!", gif: "https://media.giphy.com/media/l1AsyjZ8XLd1V7pUk/giphy.gif" },
        { text: "Don't do this to me!", gif: "https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif" },
        { text: "You're breaking my heart...", gif: "https://media.giphy.com/media/3o6wrvdHFbwBrUFenu/giphy.gif" }, 
        { text: "Okay, I'm making it harder!", gif: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif" },
        { text: "Just click Yes already!", gif: "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif" }
    ];

    // Background floating hearts
    const heartsContainer = document.getElementById('floating-hearts-container');
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 10000);
    }
    setInterval(createHeart, 800);

    // 3D Tilt Effect on Container
    document.addEventListener('mousemove', (e) => {
        // Only apply if not on mobile/touch screens essentially
        if (window.innerWidth > 768) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
            container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });
    
    document.addEventListener('mouseleave', () => {
        container.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });

    // Simple Web Audio API for synthetic sounds
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playBoop() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + (noHoverCount * 40), audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(800 + (noHoverCount * 40), audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playTada() {
        initAudio();
        const frequencies = [440, 554.37, 659.25, 880, 1108.73]; // Major arpeggio ending high
        frequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const startTime = audioCtx.currentTime + (i * 0.08);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
            
            osc.start(startTime);
            osc.stop(startTime + 0.7);
        });
    }

    const moveNoButton = () => {
        playBoop();
        noHoverCount++;

        const stateIndex = Math.min(noHoverCount, teasingStates.length - 1);
        
        // Image and text fade animation
        question.classList.add('fade-text');
        gif.classList.add('fade-img');
        
        setTimeout(() => {
            question.innerHTML = teasingStates[stateIndex].text;
            if(gif && teasingStates[stateIndex].gif) {
                gif.src = teasingStates[stateIndex].gif;
            }
            question.classList.remove('fade-text');
            gif.classList.remove('fade-img');
        }, 300);

        // Grow Yes Button smoothly
        yesScale += 0.15;
        // Don't apply scale directly if animation is running, instead use a wrapper or apply to btn
        // We'll update the transform scale. The CSS heartbeat animation might override this on idle, 
        // but it looks fun when it abruptly gets bigger!
        yesBtn.style.transform = `scale(${yesScale})`;

        if (noHoverCount >= 10) {
            noBtn.style.display = 'none';
            question.innerHTML = "Okay, you win. There is only YES.";
            return;
        }

        if (noBtn.style.position !== 'fixed') {
            noBtn.style.position = 'fixed';
            noBtn.style.zIndex = '100';
            document.body.appendChild(noBtn);
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        const padding = 20;
        
        const maxX = Math.max(padding, viewportWidth - btnWidth - padding);
        const maxY = Math.max(padding, viewportHeight - btnHeight - padding);

        const randomX = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
        const randomY = Math.floor(Math.random() * (maxY - padding + 1)) + padding;

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    let successMode = false;

    yesBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent window click from firing immediately
        playTada();
        successMode = true;
        
        // Success animations
        gif.classList.add('fade-img');
        question.classList.add('fade-text');
        
        setTimeout(() => {
            if (gif) {
                gif.src = "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif"; 
            }
            question.innerHTML = "I knew it! You're the best! 💖";
            question.style.color = "#ff2a5f";
            question.style.textShadow = "0 0 30px rgba(255, 42, 95, 0.8)";
            
            gif.classList.remove('fade-img');
            question.classList.remove('fade-text');
        }, 300);

        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';

        // Fire huge confetti blast
        fireConfetti(0.5, 0.5, true); 
        
        // Add subtle hint text
        const hint = document.createElement('p');
        hint.innerHTML = "(Click anywhere for more magic!)";
        hint.style.marginTop = "2rem";
        hint.style.color = "rgba(255, 255, 255, 0.7)";
        hint.style.fontSize = "1.1rem";
        hint.style.fontFamily = "'Outfit', sans-serif";
        hint.style.transition = "opacity 1s ease";
        hint.style.opacity = "0";
        setTimeout(() => hint.style.opacity = "1", 1000);
        container.appendChild(hint);
    });

    // Interactive Confetti anywhere on the screen
    window.addEventListener('click', (e) => {
        if (successMode) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            fireConfetti(x, y, false);
        }
    });

    function fireConfetti(x, y, isHuge = false) {
        const duration = isHuge ? 3000 : 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
        
        // Romantic colors
        const colors = ['#ff2a5f', '#ff758c', '#ffffff', '#ff9a9e'];

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = isHuge ? 50 * (timeLeft / duration) : 25 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, { 
                particleCount,
                origin: { x: x, y: y },
                colors: colors,
                shapes: ['circle', 'square'],
                scalar: randomInRange(0.8, 1.2)
            }));
            
            if(isHuge) {
                confetti(Object.assign({}, defaults, { 
                    particleCount: particleCount/2,
                    origin: { x: x + randomInRange(-0.2, 0.2), y: y + randomInRange(-0.2, 0.2) },
                    colors: colors
                }));
            }
        }, 250);
    }
});
