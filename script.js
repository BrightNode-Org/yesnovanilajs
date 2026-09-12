document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const question = document.getElementById('question');
    const container = document.getElementById('main-container');

    const moveNoButton = () => {
        // Change position to fixed so it escapes the flow and can go anywhere on screen
        if (noBtn.style.position !== 'fixed') {
            noBtn.style.position = 'fixed';
            noBtn.style.zIndex = '100';
            // Move it to the body so it isn't trapped by the container's transform/filter
            document.body.appendChild(noBtn);
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        // Ensure the button stays completely within the viewport bounds
        const padding = 20;
        
        const maxX = Math.max(padding, viewportWidth - btnWidth - padding);
        const maxY = Math.max(padding, viewportHeight - btnHeight - padding);

        const randomX = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
        const randomY = Math.floor(Math.random() * (maxY - padding + 1)) + padding;

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    };

    // Move away on hover for desktop
    noBtn.addEventListener('mouseover', moveNoButton);
    
    // Move away on touch for mobile devices
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent standard touch actions like clicking
        moveNoButton();
    });

    yesBtn.addEventListener('click', () => {
        question.innerHTML = "I knew it! You're awesome! 🚀";
        
        // Hide buttons with a smooth fade out
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';

        // Display a pulsing heart
        const heartContainer = document.createElement('div');
        heartContainer.classList.add('heart-container');
        heartContainer.innerHTML = '<div class="heart">❤️</div>';
        
        // Append to the specific container element
        document.querySelector('.button-group').appendChild(heartContainer);

        // Fire confetti celebration
        fireConfetti();
    });

    function fireConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, { 
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            
            confetti(Object.assign({}, defaults, { 
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }
});
