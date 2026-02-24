/* =========================================
   PARALLAX DA HOME 
   ========================================= */
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;
    const sculpture = document.querySelector('.name-sculpture');
    const portrait = document.querySelector('.hero-image');

    if (window.scrollY < window.innerHeight) {
        sculpture.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(0)`;
        portrait.style.transform = `translateX(${-x * 0.5}px) translateY(${-y * 0.5}px)`;
    }
});

/* =========================================
   SIDE NAVIGATION
   ========================================= */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, main');
    const navDots = document.querySelectorAll('.nav-dot');

    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (document.querySelector('.side-nav a[href*=' + id + ']') === dot) {
                    dot.classList.add('active');
                }
            });
        }
    });
});

/* =========================================
   LÓGICA DOS PILARES (METODOLOGIA)
   ========================================= */
function openPillar(element) {
    const overlay = document.getElementById('expansion-overlay');
    const content = document.getElementById('card-content');
    const hiddenText = element.querySelector('.pillar-full-text').innerHTML;
    
    content.innerHTML = hiddenText;
    overlay.classList.add('active');
}

function closePillar() {
    document.getElementById('expansion-overlay').classList.remove('active');
}

/* =========================================
   LÓGICA DO ECOSSISTEMA
   ========================================= */
function updateEco(element) {
    document.querySelectorAll('.eco-node').forEach(node => node.classList.remove('active'));
    element.classList.add('active');

    const container = document.getElementById('eco-dynamic-content');
    container.style.opacity = 0;
    
    const hiddenText = element.querySelector('.eco-full-text').innerHTML;
    
    setTimeout(() => {
        container.innerHTML = hiddenText;
        container.style.opacity = 1;
    }, 400);
}

/* =========================================
   ANIMAÇÃO DOS NÚMEROS
   ========================================= */
const proofObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateRefinedProof();
        proofObserver.unobserve(entries[0].target);
    }
}, { threshold: 0.6 });

function animateRefinedProof() {
    const columns = document.querySelectorAll('.metric-column');
    columns.forEach((col, index) => {
        const number = col.querySelector('.m-number');
        const fill = col.querySelector('.m-progress-fill');
        const target = +number.getAttribute('data-target');

        setTimeout(() => {
            let curr = 0;
            const step = target / 60;
            const timer = setInterval(() => {
                curr += step;
                if (curr >= target) {
                    number.innerText = target;
                    clearInterval(timer);
                } else {
                    number.innerText = Math.ceil(curr);
                }
            }, 20);
            fill.style.transition = 'width 2s cubic-bezier(0.16, 1, 0.3, 1)';
            fill.style.width = '100%';
        }, index * 300); 
    });
}

const sectionProof = document.getElementById('proof');
if (sectionProof) proofObserver.observe(sectionProof);

/* =========================================
   LÓGICA DOS ARTIGOS (ARQUIVOS DE INTELIGÊNCIA)
   ========================================= */
const filterButtons = document.querySelectorAll('.menu-btn');
const intelItems = document.querySelectorAll('.intel-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        intelItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

function openReading(element) {
    const fullContent = element.nextElementSibling.innerHTML;
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('reading-modal');

    modalBody.innerHTML = fullContent;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeReading() {
    document.getElementById('reading-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; 
}