document.addEventListener('mousemove', (e) => {
    // Cálculo do movimento
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;

    const sculpture = document.querySelector('.name-sculpture');
    const portrait = document.querySelector('.hero-image');

    // O Nome e a Foto movem-se em intensidades diferentes (Parallax)
    // Isso reforça a ideia de que o nome está "em profundidade" atrás de você
    sculpture.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(0)`;
    sculpture.style.textShadow = `${x}px ${y}px 40px rgba(255,255,255,0.15)`;
    
    portrait.style.transform = `translateX(${-x * 0.5}px) translateY(${-y * 0.5}px)`;
});

// Remove o loader (se houver) após carregar
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

