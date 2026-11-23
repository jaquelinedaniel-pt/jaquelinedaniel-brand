/* =========================================
   UTILITÁRIOS GLOBAIS DE ACESSIBILIDADE (WCAG 2.2)
   ========================================= */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function createFocusTrap(container) {
    let lastFocused = null;

    function handleKeydown(e) {
        if (e.key !== 'Tab') return;
        const focusables = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
            (el) => el.offsetParent !== null
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    return {
        activate() {
            lastFocused = document.activeElement;
            container.addEventListener('keydown', handleKeydown);
            const first = container.querySelector(FOCUSABLE_SELECTOR);
            if (first) setTimeout(() => first.focus(), 40);
        },
        deactivate() {
            container.removeEventListener('keydown', handleKeydown);
            if (lastFocused && typeof lastFocused.focus === 'function') {
                lastFocused.focus();
            }
        }
    };
}

/* =========================================
   1. HERO: PARALLAX + COREOGRAFIA EM 2 ATOS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('home');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('hero-act-2');
        }, prefersReduced ? 0 : 1900);
    }

    if (!prefersReduced) {
        document.addEventListener('mousemove', (e) => {
            if (window.scrollY >= window.innerHeight) return;
            const sculpture = document.querySelector('.name-sculpture');
            const portrait = document.querySelector('.hero-image');
            if (!sculpture || !portrait) return;

            const x = (window.innerWidth / 2 - e.clientX) / 30;
            const y = (window.innerHeight / 2 - e.clientY) / 30;
            sculpture.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(0)`;
            portrait.style.transform = `translateX(${-x * 0.5}px) translateY(${-y * 0.5}px)`;
        });
    }
});

/* =========================================
   2. NAVEGAÇÃO LATERAL (SCROLL SPY)
   ========================================= */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, main');
    const navDots = document.querySelectorAll('.nav-dot');
    const top = window.scrollY;

    sections.forEach((sec) => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (id && top >= offset && top < offset + height) {
            navDots.forEach((dot) => {
                const isCurrent = dot.getAttribute('href') === `#${id}`;
                dot.classList.toggle('active', isCurrent);
            });
        }
    });
});

/* =========================================
   3. SEÇÃO II: CARROSSEL & MODAL DE DIAGNÓSTICO
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const thesisDatabase = {
        '01': {
            kicker: 'DIAGNÓSTICO ESTRATÉGICO // TESE 01',
            title: 'A ILUSÃO DA VELOCIDADE',
            symptom: 'O projeto vai para o ar dentro do prazo, mas a operação trava na primeira semana. Começam os ajustes de emergência, os remendos manuais e a discussão sobre o que realmente tinha sido combinado.',
            cause: 'A pressão por entrega atropela a validação de requisitos. Regras que todo mundo na operação dá como óbvias e exceções da rotina ficam de fora do papel e só aparecem quando o sistema já está pronto.',
            remedy: 'Fechar regras de negócio, exceções e critérios de aceite antes de abrir a primeira tarefa de desenvolvimento. Custa dias no começo e evita meses de correção depois.'
        },
        '02': {
            kicker: 'DIAGNÓSTICO ESTRATÉGICO // TESE 02',
            title: 'CAPACIDADE SEM FLUXO',
            symptom: 'Equipes exaustas e softwares caros rodando pela metade, enquanto o trabalho real continua sendo resolvido em planilhas paralelas e cobranças no corredor.',
            cause: 'Cada área tenta otimizar o próprio pedaço sem olhar o caminho inteiro. O problema mora na passagem de bastão: quando ninguém responde pela transição entre setores, a equipe compensa na força bruta.',
            remedy: 'Desenhar o fluxo real de ponta a ponta, deixar claro o que entra, o que sai e quem responde por cada passagem. Só depois disso decidir o que merece automação ou reforço de equipe.'
        },
        '03': {
            kicker: 'DIAGNÓSTICO ESTRATÉGICO // TESE 03',
            title: 'CLAREZA ANTES DA AÇÃO',
            symptom: 'A funcionalidade entra no ar exatamente como foi pedida, mas os números da operação não se mexem e a reclamação de quem usa continua a mesma.',
            cause: 'Confundir o desejo por uma solução com a necessidade do negócio. Quem pede costuma descrever a tela ou o recurso que imaginou, e não o bloqueio real que precisa derrubar.',
            remedy: 'Dar um passo atrás antes de aceitar o pedido. Entender quem sente o impacto, onde o processo trava e se a resposta certa está em tecnologia ou em ajuste de rotina.'
        },
        '04': {
            kicker: 'DIAGNÓSTICO ESTRATÉGICO // TESE 04',
            title: 'DECISÃO SOB INCERTEZA',
            symptom: 'Projetos que mudam de direção no meio do caminho, decisões travadas por falta de acordo ou investimentos mantidos mesmo quando a prática já mostrou que a conta não fecha.',
            cause: 'Fato observado, opinião de diretoria e aposta de mercado entram no mesmo pacote. Sem separar o que é dado real do que é hipótese, o time não sabe o que testar nem quando parar.',
            remedy: 'Colocar no papel o que é fato, o que é premissa e o que é limite antes de aprovar a iniciativa. Definir desde o início qual sinal confirma a tese e qual gatilho obriga a revisar ou encerrar a rota.'
        }
    };

    // Controle acessível de pausa/retomada do fluxo
    const track = document.getElementById('spatialTrack');
    const toggleBtn = document.getElementById('spatialToggleBtn');
    if (track && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isPaused = track.classList.toggle('is-paused');
            toggleBtn.setAttribute('aria-pressed', String(isPaused));
            toggleBtn.textContent = isPaused ? 'RETOMAR FLUXO' : 'PAUSAR FLUXO';
        });
    }

    const modal = document.getElementById('diagnosisModal');
    if (!modal) return;

    const modalKicker = document.getElementById('modalKicker');
    const modalTitle = document.getElementById('modalTitle');
    const modalSymptom = document.getElementById('modalSymptom');
    const modalCause = document.getElementById('modalCause');
    const modalRemedy = document.getElementById('modalRemedy');
    const closeModalBtn = document.getElementById('closeModal');
    const trap = createFocusTrap(modal);

    function openThesisModal(thesisId) {
        const data = thesisDatabase[thesisId];
        if (!data) return;

        if (modalKicker) modalKicker.textContent = data.kicker;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalSymptom) modalSymptom.textContent = data.symptom;
        if (modalCause) modalCause.textContent = data.cause;
        if (modalRemedy) modalRemedy.textContent = data.remedy;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        trap.activate();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        trap.deactivate();
    }

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.spatial-card');
        if (card) openThesisModal(card.getAttribute('data-thesis'));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
            return;
        }
        const activeCard = document.activeElement?.closest?.('.spatial-card');
        if (activeCard && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            openThesisModal(activeCard.getAttribute('data-thesis'));
        }
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});

/* =========================================
   4. SEÇÃO III: MOTOR DE CRITÉRIOS (ABAS + TECLADO)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const protocolSteps = {
        '01': {
            num: '01',
            tag: 'CAMADA 01 // INVESTIGAÇÃO DE EVIDÊNCIAS',
            headline: 'INVESTIGAÇÃO DE EVIDÊNCIAS',
            thesis: 'Toda análise começa olhando para o que acontece de verdade na operação, não para o que parece estar acontecendo.',
            input: 'Alguém chega com um problema urgente e uma solução já pronta na cabeça.',
            filter: 'Antes de abrir qualquer ferramenta, ouço quem executa o trabalho na ponta e olho os registros reais: planilhas, chamados, telas e reclamações. Separo o que está acontecendo de fato do que é apenas impressão de quem conta a história.',
            output: 'Um diagnóstico claro, sustentado por evidências reais. Sem depender de achismo nem de uma única versão dos fatos.'
        },
        '02': {
            num: '02',
            tag: 'CAMADA 02 // INTEGRIDADE DO FLUXO',
            headline: 'INTEGRIDADE DO FLUXO',
            thesis: 'Antes de acelerar qualquer etapa, é preciso garantir que a passagem de trabalho entre uma área e outra não está quebrada.',
            input: 'O trabalho passa por várias áreas, mas ninguém sabe direito onde ele trava ou quem resolve quando aparece uma exceção.',
            filter: 'Mapeio o caminho real do início ao fim. Não o fluxograma bonito da parede, mas o que acontece na rotina de uma terça-feira comum. Levanto entradas, saídas, desvios e pontos de passagem entre times.',
            output: 'Visibilidade clara de onde o processo quebra, quem responde por cada etapa e o que precisa ser arrumado antes de colocar tecnologia em cima.'
        },
        '03': {
            num: '03',
            tag: 'CAMADA 03 // TRADUÇÃO OPERACIONAL',
            headline: 'TRADUÇÃO OPERACIONAL',
            thesis: 'Entre o que o negócio precisa e o que o código executa, a precisão da regra evita a maior parte do retrabalho.',
            input: 'O negócio pede uma coisa, o time técnico entende outra e quem usa o sistema fica no meio tentando se virar.',
            filter: 'Transformo a rotina e as regras do negócio em especificação direta: requisitos funcionais, regras de negócio, fluxos e critérios de aceite. Valido esses artefatos com quem decide, quem opera e quem vai desenvolver.',
            output: 'Uma referência única que o negócio reconhece e a engenharia consegue construir sem precisar adivinhar regras no meio do código.'
        },
        '04': {
            num: '04',
            tag: 'CAMADA 04 // ESCOPO & TRANSPARÊNCIA',
            headline: 'ESCOPO & TRANSPARÊNCIA',
            thesis: 'Clareza sobre limites não trava o projeto. Ela evita que o time entregue algo diferente do que foi acordado.',
            input: 'O projeto cresce no meio do caminho, entram pedidos paralelos e ninguém sabe mais o que faz parte da entrega ou qual é o custo de mudar.',
            filter: 'Deixo registrado o que entra, o que fica de fora e quais limites existem. Quando surge uma mudança, coloco na mesa o impacto em prazo, esforço e rotina para que quem decide aprove com clareza.',
            output: 'Decisões conscientes, menos surpresa na hora da entrega e menos desgaste entre quem pede e quem executa.'
        }
    };

    const tabs = Array.from(document.querySelectorAll('.method-tab'));
    const stageContent = document.getElementById('stageContent');
    if (!tabs.length || !stageContent) return;

    const stageWatermark = document.getElementById('stageWatermark');
    const stageTag = document.getElementById('stageTag');
    const stageHeadline = document.getElementById('stageHeadline');
    const stageThesis = document.getElementById('stageThesis');
    const stageInput = document.getElementById('stageInput');
    const stageFilter = document.getElementById('stageFilter');
    const stageOutput = document.getElementById('stageOutput');
    const ambientGlow = document.querySelector('.method-ambient-glow');
    let switchTimer = null;

    function selectStep(stepId) {
        const data = protocolSteps[stepId];
        if (!data) return;

        tabs.forEach((tab) => {
            const isActive = tab.getAttribute('data-step') === stepId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });

        if (ambientGlow) {
            const offset = (parseInt(stepId, 10) - 1) * 18;
            ambientGlow.style.transform = `translateY(calc(-50% + ${offset - 25}px))`;
        }

        clearTimeout(switchTimer);
        stageContent.classList.add('is-switching');

        switchTimer = setTimeout(() => {
            stageWatermark.textContent = data.num;
            stageTag.textContent = data.tag;
            stageHeadline.textContent = data.headline;
            stageThesis.textContent = data.thesis;
            stageInput.textContent = data.input;
            stageFilter.textContent = data.filter;
            stageOutput.textContent = data.output;
            stageContent.classList.remove('is-switching');
        }, 180);
    }

    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => selectStep(tab.getAttribute('data-step')));
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const next = tabs[(idx + 1) % tabs.length];
                next.focus();
                selectStep(next.getAttribute('data-step'));
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                prev.focus();
                selectStep(prev.getAttribute('data-step'));
            }
        });
    });
});

/* =========================================
   5. SEÇÃO IV: PILHA ISOMÉTRICA 3D (PRINCÍPIOS)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const layersData = [
        {
            kicker: 'PRINCÍPIO 01 // INTEGRIDADE INTELECTUAL',
            counter: '01 / 05',
            title: 'INTEGRIDADE INTELECTUAL',
            desc: 'Mudar de posição diante de um argumento melhor não é fraqueza. É obrigação técnica. Não defendo uma ideia só porque foi minha ou porque já está em andamento. Se os fatos mostrarem outro caminho, a análise muda junto.',
            fault: 'A equipe passa a proteger decisões antigas em vez de resolver o problema real. Erros óbvios são empurrados para frente para ninguém precisar admitir que a premissa inicial estava errada.',
            tags: ['EVIDÊNCIA', 'REVISÃO', 'CRITÉRIO']
        },
        {
            kicker: 'PRINCÍPIO 02 // RIGOR NA DEFINIÇÃO',
            counter: '02 / 05',
            title: 'RIGOR NA DEFINIÇÃO',
            desc: 'Não trato termos vagos, regras subentendidas ou requisitos ambíguos como definição fechada. Se algo ainda gera interpretações diferentes na conversa, precisa ser explicitado antes de virar defeito na entrega.',
            fault: 'Cada área sai da reunião acreditando em um acordo diferente. O retrabalho só aparece semanas depois, quando já custa caro corrigir.',
            tags: ['PRECISÃO', 'REQUISITOS', 'CLAREZA']
        },
        {
            kicker: 'PRINCÍPIO 03 // CONFIANÇA E TRANSPARÊNCIA',
            counter: '03 / 05',
            title: 'CONFIANÇA E TRANSPARÊNCIA',
            desc: 'Erros operacionais acontecem e podem ser corrigidos; o que dificilmente se recupera é a quebra de confiança. Prefiro expor um risco, um limite ou uma lacuna cedo do que entregar uma certeza falsa para agradar na reunião.',
            fault: 'Os problemas deixam de ser reportados enquanto ainda são pequenos. Quem decide perde visibilidade real do cenário e só descobre o estrago quando o prazo já estourou.',
            tags: ['CONFIANÇA', 'RISCO', 'TRANSPARÊNCIA']
        },
        {
            kicker: 'PRINCÍPIO 04 // CALIBRAGEM HUMANA',
            counter: '04 / 05',
            title: 'CALIBRAGEM HUMANA',
            desc: 'Nenhum processo sobrevive se ignorar quem executa o trabalho todo dia. Ouvir a operação, entender os atritos reais e negociar prioridades com clareza vale tanto quanto qualquer especificação técnica.',
            fault: 'O sistema entra no ar conforme especificado, mas a equipe rejeita o uso, cria atalhos informais fora da ferramenta e volta ao jeito antigo de trabalhar.',
            tags: ['OPERAÇÃO', 'ESCUTA', 'NEGOCIAÇÃO']
        },
        {
            kicker: 'PRINCÍPIO 05 // TECNOLOGIA A SERVIÇO DO NEGÓCIO',
            counter: '05 / 05',
            title: 'TECNOLOGIA A SERVIÇO DO NEGÓCIO',
            desc: 'Ferramenta não é ponto de partida nem troféu. Uma solução tecnológica só se justifica quando resolve um gargalo concreto, respeita as regras da operação e facilita a vida de quem usa.',
            fault: 'A empresa acumula licenças, integrações e complexidade técnica para sustentar funcionalidades que ninguém usa, sem destravar o gargalo que originou o investimento.',
            tags: ['GARGALO', 'OPERAÇÃO', 'TECNOLOGIA']
        }
    ];

    const slabs = Array.from(document.querySelectorAll('.arch3d-slab'));
    const pills = Array.from(document.querySelectorAll('.quick-pill'));
    const readout = document.getElementById('arch3dReadout');
    if (!slabs.length || !readout) return;

    const kickerEl = document.getElementById('readoutKicker');
    const counterEl = document.getElementById('readoutCounter');
    const titleEl = document.getElementById('readoutTitle');
    const descEl = document.getElementById('readoutDesc');
    const faultEl = document.getElementById('readoutFault');
    const tagsEl = document.getElementById('readoutTags');
    let switchTimer = null;

    function activateLayer(activeIdx) {
        const idx = Number(activeIdx);
        const data = layersData[idx];
        if (!data) return;

        slabs.forEach((slab, i) => {
            slab.classList.remove('active', 'is-above', 'is-below');
            if (i === idx) slab.classList.add('active');
            else if (i < idx) slab.classList.add('is-above');
            else slab.classList.add('is-below');
        });

        pills.forEach((pill, i) => {
            const isActive = i === idx;
            pill.classList.toggle('active', isActive);
            pill.setAttribute('aria-selected', String(isActive));
        });

        clearTimeout(switchTimer);
        readout.classList.add('is-switching');

        switchTimer = setTimeout(() => {
            kickerEl.textContent = data.kicker;
            counterEl.textContent = data.counter;
            titleEl.textContent = data.title;
            descEl.textContent = data.desc;
            faultEl.textContent = data.fault;
            tagsEl.innerHTML = data.tags.map((t) => `<span>${t}</span>`).join('');
            readout.classList.remove('is-switching');
        }, 170);
    }

    slabs.forEach((slab) => slab.addEventListener('click', () => activateLayer(slab.dataset.layer)));
    pills.forEach((pill, idx) => {
        pill.addEventListener('click', () => activateLayer(pill.dataset.layer));
        pill.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = pills[(idx + 1) % pills.length];
                next.focus();
                activateLayer(next.dataset.layer);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = pills[(idx - 1 + pills.length) % pills.length];
                prev.focus();
                activateLayer(prev.dataset.layer);
            }
        });
    });

    activateLayer(0);
});

/* =========================================
   6. SEÇÃO V: GAVETA DE DOSSIÊS (#proof)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const casesDatabase = {
        '01': {
            kicker: '01 // OPERAÇÃO COMERCIAL PRÓPRIA (2010–2022)',
            title: 'STILUS — VAREJO E ATACADO',
            lead: '12 anos à frente de uma operação multicanal, da compra ao pós-venda, com processos desenhados para reduzir erro e atrito logístico.',
            context: 'Operar varejo e atacado à distância, com expedição interestadual e alta rotatividade de peças, expunha o negócio a dois riscos diários: falhas na separação de pedidos e conflitos logísticos com transportadoras e clientes.',
            architecture: 'Estruturei a operação de ponta a ponta sem depender de improviso. Criei um fluxo de preparação em três etapas independentes (separação, conferência e embalagem feitas por pessoas diferentes), com registro em vídeo para dar transparência ao cliente. Adotei estoque sob demanda para evitar capital parado, controle de ocorrências logísticas em sistema e regra clara de seguro opcional no envio.',
            impact: 'A operação funcionou por 12 anos (2010–2022, formalizada em 2012), sustentando atendimento recorrente e resposta direta a crises operacionais. A rotina de negociar com fornecedores, treinar equipes e mediar conflitos virou a base prática da forma como hoje leio processos e regras de negócio.',
            tags: ['FLUXO EM 3 ETAPAS', 'ESTOQUE SOB DEMANDA', 'GESTÃO DE OCORRÊNCIAS', 'TREINAMENTO DE EQUIPE'],
            linkUrl: '',
            linkLabel: ''
        },
        '02': {
            kicker: '02 // CASO TÉCNICO DE ANÁLISE FUNCIONAL & PROTÓTIPO',
            title: 'DOUROVINHOS MOBILE SALES',
            lead: 'Especificação funcional completa e protótipo MVP construídos a partir de um cenário real de distribuição de vinhos em campo.',
            context: 'Nascido de um diagnóstico real com uma cave de vinhos (projeto comercial que não avançou por resistência interna à tecnologia), o caso traduz uma dor comum em vendas externas: representantes sem sinal de internet em rota, erros manuais em regras de bonificação e risco de sobrecarga em um ERP legado (PHC).',
            architecture: 'Conduzi o ciclo completo de documentação e prototipação como estudo técnico autoral. Estruturei o glossário de negócio (como a regra de bonificação 12+1), desenhei fluxos em BPMN 2.0, ERD e diagramas de sequência, e especifiquei requisitos funcionais com histórias de usuário em Gherkin. Para lidar com a falta de conexão e proteger o ERP, defini arquitetura Offline-First (SQLite local), validação na ponta (Edge Validation) e sincronização assíncrona em lote. Todo o fluxo foi especificado e prototipado em ambiente demonstrativo (não produtivo), sem integração ativa com o ERP.',
            impact: 'O resultado é um repositório técnico auditável, da carta do projeto ao protótipo funcional (React Native/Expo) e plano de testes (UAT e testes unitários). Mostra na prática como transformar restrições operacionais reais em especificação que a engenharia consegue construir sem adivinhação.',
            tags: ['BPMN 2.0', 'SRS & GHERKIN', 'OFFLINE-FIRST', 'PROTÓTIPO MVP', 'PLANO UAT'],
            linkUrl: 'https://github.com/jaquelinedaniel-pt/dourovinhos-mobile-sales',
            linkLabel: 'AUDITAR DOCUMENTAÇÃO NO GITHUB'
        },
        '03': {
            kicker: '03 // PRODUTO PRÓPRIO — MVP VALIDADO E ENCERRADO',
            title: 'PROJETO WINWIN',
            lead: 'Aplicativo criado para resolver um problema real de rotina familiar, testado com famílias reais e encerrado por decisão consciente de foco.',
            context: 'O projeto nasceu de um problema doméstico concreto: aumentar a adesão de adolescentes às tarefas de casa sem transformar a rotina em cobrança constante. Como eu já comercializava e-books sobre dinâmica familiar, havia um público real para validar a proposta fora da minha própria casa.',
            architecture: 'Defini as regras de negócio, a experiência de uso e o MVP funcional (React Native, Expo e Firebase). Para evitar que o app virasse apenas um checklist ignorado ou gerasse custo fixo alto de servidor, estruturei uma economia de dois tokens (XP imutável para progresso e moedas para recompensas), fluxo de aprovação de missões extras e um algoritmo de auditoria retroativa no próprio dispositivo (Lazy Audit).',
            impact: 'O aplicativo cumpriu sua função na prática, validado primeiro na minha casa e depois por famílias leitoras dos e-books, com feedback real de uso. Quando decidi encerrar a venda dos e-books, escolhi também descontinuar o WinWin. Não por falha do produto, mas por critério de foco: manter um produto ativo sem o canal que o sustentava não fazia sentido.',
            tags: ['DISCOVERY & MVP', 'REGRAS DE NEGÓCIO', 'DUAL-TOKEN', 'LAZY AUDIT', 'CRITÉRIO DE CORTE'],
            linkUrl: 'https://github.com/jaquelinedaniel-pt/winwin-product-portfolio',
            linkLabel: 'VER DOCUMENTAÇÃO DO PROJETO'
        },
        'academic': {
            kicker: '04 // FORMAÇÃO & BASE TÉCNICA',
            title: 'TRAJETÓRIA ACADÊMICA',
            lead: 'Formação estruturada em desenvolvimento de sistemas, engenharia de software e gestão ágil para sustentar análise funcional e decisões de negócio com rigor.',
            context: 'A transição de mais de 15 anos de operação comercial para tecnologia exigiu consolidar base formal em arquitetura de sistemas, modelagem de processos e engenharia de requisitos.',
            architecture: '• Graduação em Análise e Desenvolvimento de Sistemas (ADS) — concluída em julho de 2025.\n• Pós-graduação em Engenharia de Software — concluída em janeiro de 2026.\n• MBA em Gestão de Projetos e Metodologias Ágeis — em curso (PMBOK 7ª ed., Scrum, OKRs, Lean, UML e BPMN 2.0).',
            impact: 'A combinação entre vivência comercial real e formação técnica permite traduzir regras de negócio em especificações claras, rastreáveis e prontas para execução pela engenharia.',
            tags: ['ADS', 'ENGENHARIA DE SOFTWARE', 'MBA GESTÃO ÁGIL', 'REQUISITOS', 'BPMN 2.0'],
            linkUrl: 'https://linkedin.com/in/jaquelinedaniel-pt',
            linkLabel: 'VER FORMAÇÃO COMPLETA NO LINKEDIN'
        }
    };

    const drawer = document.getElementById('dossierDrawer');
    if (!drawer) return;

    const closeBtn = document.getElementById('closeDossier');
    const kickerEl = document.getElementById('dossierKicker');
    const titleEl = document.getElementById('dossierTitle');
    const leadEl = document.getElementById('dossierLead');
    const contextEl = document.getElementById('dossierContext');
    const archEl = document.getElementById('dossierArchitecture');
    const impactEl = document.getElementById('dossierImpact');
    const tagsEl = document.getElementById('dossierTags');
    const footerEl = document.getElementById('dossierFooter');
    const linkEl = document.getElementById('dossierLink');
    const linkTextEl = document.getElementById('dossierLinkText');
    const trap = createFocusTrap(drawer);

    function openDossier(caseId) {
        const data = casesDatabase[caseId];
        if (!data) return;

        kickerEl.textContent = data.kicker;
        titleEl.textContent = data.title;
        leadEl.textContent = data.lead;
        contextEl.textContent = data.context;
        archEl.textContent = data.architecture;
        impactEl.textContent = data.impact;
        tagsEl.innerHTML = data.tags.map((t) => `<span>${t}</span>`).join('');

        if (data.linkUrl) {
            linkEl.href = data.linkUrl;
            linkTextEl.textContent = data.linkLabel;
            footerEl.classList.remove('is-hidden');
        } else {
            footerEl.classList.add('is-hidden');
        }

        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        trap.activate();
    }

    function closeDossier() {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        trap.deactivate();
    }

    document.addEventListener('click', (e) => {
        const item = e.target.closest('.proof-item, .metric-link[data-case]');
        if (item) openDossier(item.dataset.case);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeDossier();
            return;
        }
        const activeItem = document.activeElement?.closest?.('.proof-item');
        if (activeItem && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            openDossier(activeItem.dataset.case);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDossier);
    drawer.addEventListener('click', (e) => {
        if (e.target === drawer) closeDossier();
    });
});

/* =========================================
   7. SEÇÃO VI: ARCO 3D + LEITOR DE DOSSIÊS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('arcStage');
    if (stage) {
        const monoliths = Array.from(stage.querySelectorAll('.arc-monolith'));
        const dots = Array.from(document.querySelectorAll('.arc-dot'));
        const prevBtn = document.getElementById('arcPrev');
        const nextBtn = document.getElementById('arcNext');
        const total = monoliths.length;
        let activeIndex = 0;

        function updateArc(newIndex) {
            activeIndex = (newIndex + total) % total;
            monoliths.forEach((card, idx) => {
                const diff = (idx - activeIndex + total) % total;
                let pos = 'back';
                if (diff === 0) pos = 'center';
                else if (diff === 1) pos = 'right';
                else if (diff === total - 1) pos = 'left';
                card.setAttribute('data-pos', pos);
            });

            dots.forEach((dot, idx) => {
                const isActive = idx === activeIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', String(isActive));
            });
        }

        monoliths.forEach((card) => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-open-doc]')) return;
                const pos = card.getAttribute('data-pos');
                if (pos === 'left' || pos === 'right') updateArc(Number(card.dataset.index));
            });
        });

        if (prevBtn) prevBtn.addEventListener('click', () => updateArc(activeIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => updateArc(activeIndex + 1));
        dots.forEach((dot) => dot.addEventListener('click', () => updateArc(Number(dot.dataset.target))));

        let touchStartX = 0;
        stage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        stage.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(deltaX) > 45) updateArc(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
        }, { passive: true });

        updateArc(0);
    }

    const articlesDatabase = {
        '01': {
            id: 'DOC.01',
            cat: 'REQUISITOS & REALIDADE',
            time: '1 MIN DE LEITURA',
            title: 'O DILEMA DO POLIÉSTER',
            subtitle: '',
            cta: 'Esse tipo de distância entre regra e uso real aparece na sua equipe?',
            body: `
                <p>No papel, trocar um tecido natural por poliéster faz sentido imediato: o custo cai, a margem sobe e a planilha aprova. O problema só aparece fora da sala de reunião, quando a peça chega ao cliente no verão, gera desconforto térmico e volta em forma de devolução e perda de confiança.</p>
                <p>Na engenharia de software acontece o mesmo. Requisitos são aprovados em reuniões longe da ponta porque parecem eficientes no orçamento ou no cronograma, mas ignoram o contexto real de quem vai operar o sistema todo dia.</p>
                <p>Elicitar requisitos não é anotar o que cabe na planilha. É ir até o uso real antes de fechar a especificação, para não economizar na decisão e pagar a conta na rejeição.</p>
            `
        },
        '02': {
            id: 'DOC.02',
            cat: 'FLUXO & ESCOPO',
            time: '1 MIN DE LEITURA',
            title: 'A LÓGICA DA ZARA',
            subtitle: '',
            cta: 'Quer trocar uma ideia sobre priorização, escopo ou análise funcional?',
            body: `
                <p>A força logística da Zara nunca foi adivinhar todas as tendências com um ano de antecedência. Foi produzir lotes menores, observar o que realmente sai da arara e ajustar a reposição rápido, evitando galpões cheios de peças encalhadas.</p>
                <p>Projetos de tecnologia costumam fazer o oposto: passam meses especificando e construindo um pacote gigante de funcionalidades baseadas em palpites. Quando o sistema finalmente vai ao ar, metade dos recursos vira peso morto que ninguém usa, mas que a equipe precisa manter.</p>
                <p>Priorizar escopo é aplicar disciplina de giro ao software: colocar no ar o que resolve o gargalo real, observar o comportamento de uso e só investir no próximo passo quando a operação provar que precisa dele.</p>
            `
        },
        '03': {
            id: 'DOC.03',
            cat: 'PROCESSO & FLUXO',
            time: '1 MIN DE LEITURA',
            title: 'O ALGORITMO DO CAPITAL ZERO',
            subtitle: '',
            cta: 'Tem um desafio de processo ou operação em aberto? Podemos conversar sobre o cenário.',
            body: `
                <p>Um dos maiores gargalos do comércio tradicional é imobilizar dinheiro em estoque esperando uma venda que talvez não aconteça. Na operação da Stilus, trabalhei com a lógica inversa: o pedido do cliente entrava antes da reposição, reduzindo o estoque parado ao mínimo necessário.</p>
                <p>Esse modelo só se sustenta quando o processo é disciplinado. Sem prazos realistas, conferência rigorosa e transparência com fornecedores e clientes, o estoque sob demanda vira atraso e reclamação em cadeia.</p>
                <p>A lição vale direto para tecnologia: antes de pedir mais orçamento ou uma ferramenta mais robusta, vale perguntar se o gargalo é falta de recurso ou falta de fluxo. Processo bem desenhado elimina desperdício que dinheiro sozinho só esconde.</p>
            `
        },
        '04': {
            id: 'DOC.04',
            cat: 'COMUNICAÇÃO & STAKEHOLDERS',
            time: '1 MIN DE LEITURA',
            title: 'O INTERVALO DA DECISÃO',
            subtitle: '',
            cta: 'Faz sentido conversar sobre um projeto, uma vaga ou um desafio de análise?',
            body: `
                <p>Toda empresa tem dois mapas do mesmo trabalho: o mapa de quem decide na diretoria e o mapa de quem executa no balcão, no atendimento ou no código. Quanto maior a distância entre esses dois pontos, maior a chance de uma decisão bem-intencionada travar a operação.</p>
                <p>Esse intervalo raramente é resolvido com mais reuniões ou relatórios mais longos. Ele se fecha quando alguém traduz as restrições dos dois lados sem distorcer nenhum deles, levando a realidade da ponta para a decisão e a lógica do negócio para a execução.</p>
                <p>É exatamente nesse meio-campo que a análise de negócios e a análise funcional geram valor: não escolhendo um lado, mas garantindo que os dois estejam falando do mesmo problema.</p>
            `
        }
    };

    let reader = document.getElementById('codexReader');
    if (!reader) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="reader-overlay" id="codexReader" aria-hidden="true">
                <article class="reader-sheet" role="dialog" aria-modal="true" aria-labelledby="readerTitle">
                    <div class="reader-progress-track" aria-hidden="true">
                        <div class="reader-progress-bar" id="readerProgressBar"></div>
                    </div>
                    <header class="reader-header">
                        <div class="reader-meta">
                            <span class="reader-doc-id" id="readerDocId">DOC.01</span>
                            <span class="reader-sep">//</span>
                            <span class="reader-cat" id="readerCat">REQUISITOS & REALIDADE</span>
                            <span class="reader-sep">•</span>
                            <span class="reader-time" id="readerTime">1 MIN DE LEITURA</span>
                        </div>
                        <button class="reader-close" id="closeReader" type="button" aria-label="Fechar leitura">
                            FECHAR ×
                        </button>
                    </header>
                    <div class="reader-body" id="readerBody">
                        <h3 class="reader-title" id="readerTitle"></h3>
                        <p class="reader-subtitle" id="readerSubtitle"></p>
                        <div class="reader-content" id="readerContent"></div>
                        <div class="reader-bridge">
                            <div class="bridge-copy">
                                <span class="bridge-kicker">PRÓXIMO PASSO</span>
                                <p class="bridge-text" id="readerCtaText"></p>
                            </div>
                            <a href="#contact" class="bridge-cta" id="readerContactBtn">
                                INICIAR CONVERSA <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        `);
        reader = document.getElementById('codexReader');
    }

    const readerDocId = document.getElementById('readerDocId');
    const readerCat = document.getElementById('readerCat');
    const readerTime = document.getElementById('readerTime');
    const readerTitle = document.getElementById('readerTitle');
    const readerSubtitle = document.getElementById('readerSubtitle');
    const readerContent = document.getElementById('readerContent');
    const readerCtaText = document.getElementById('readerCtaText');
    const readerBody = document.getElementById('readerBody');
    const readerProgressBar = document.getElementById('readerProgressBar');
    const closeReaderBtn = document.getElementById('closeReader');
    const readerContactBtn = document.getElementById('readerContactBtn');
    const trap = createFocusTrap(reader);

    function openReader(docKey) {
        const doc = articlesDatabase[docKey];
        if (!doc || !reader) return;

        if (readerDocId) readerDocId.textContent = doc.id;
        if (readerCat) readerCat.textContent = doc.cat;
        if (readerTime) readerTime.textContent = doc.time;
        if (readerTitle) readerTitle.textContent = doc.title;
        if (readerSubtitle) {
            readerSubtitle.textContent = doc.subtitle || '';
            readerSubtitle.style.display = doc.subtitle ? '' : 'none';
        }
        if (readerContent) readerContent.innerHTML = doc.body;
        if (readerCtaText) readerCtaText.textContent = doc.cta || '';
        if (readerBody) readerBody.scrollTop = 0;
        if (readerProgressBar) readerProgressBar.style.width = '0%';

        reader.classList.add('active');
        reader.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        trap.activate();
    }

    function closeReader() {
        if (!reader) return;
        reader.classList.remove('active');
        reader.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        trap.deactivate();
    }

    document.querySelectorAll('[data-open-doc]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openReader(btn.getAttribute('data-open-doc'));
        });
    });

    if (readerBody && readerProgressBar) {
        readerBody.addEventListener('scroll', () => {
            const maxScroll = readerBody.scrollHeight - readerBody.clientHeight;
            const progress = maxScroll > 0 ? (readerBody.scrollTop / maxScroll) * 100 : 0;
            readerProgressBar.style.width = `${progress}%`;
        });
    }

    if (closeReaderBtn) closeReaderBtn.addEventListener('click', closeReader);
    if (readerContactBtn) readerContactBtn.addEventListener('click', closeReader);
    reader.addEventListener('click', (e) => {
        if (e.target === reader) closeReader();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reader.classList.contains('active')) closeReader();
    });
});

/* =========================================
   8. SEÇÃO VII: MODAL DE CONTATO, CÓPIA & VALIDAÇÃO
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openContactModal');
    const closeBtn = document.getElementById('closeContactModal');
    const copyBtn = document.getElementById('copyEmailBtn');
    const form = document.getElementById('contactBriefForm');
    const statusEl = document.getElementById('cmodalStatus');
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (!modal || !openBtn) return;

    const trap = createFocusTrap(modal);

    function openContactModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (statusEl) statusEl.textContent = '';
        trap.activate();
    }

    function closeContactModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        trap.deactivate();
    }

    openBtn.addEventListener('click', openContactModal);
    if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeContactModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeContactModal();
    });

    // Copiar e-mail com fallback + feedback acessível
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = copyBtn.getAttribute('data-email') || 'jaquelinedaniel.pt@gmail.com';
            let copied = false;

            try {
                await navigator.clipboard.writeText(email);
                copied = true;
            } catch {
                const temp = document.createElement('textarea');
                temp.value = email;
                temp.setAttribute('readonly', '');
                temp.style.position = 'absolute';
                temp.style.left = '-9999px';
                document.body.appendChild(temp);
                temp.select();
                copied = document.execCommand('copy');
                document.body.removeChild(temp);
            }

            if (copied) {
                copyBtn.textContent = 'COPIADO ✓';
                copyBtn.classList.add('is-copied');
                if (statusEl) statusEl.textContent = 'E-MAIL COPIADO PARA A ÁREA DE TRANSFERÊNCIA.';
                setTimeout(() => {
                    copyBtn.textContent = 'COPIAR E-MAIL';
                    copyBtn.classList.remove('is-copied');
                }, 2200);
            }
        });
    }

    // Validação completa + abertura de e-mail
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('cName')?.value.trim();
            const email = document.getElementById('cEmail')?.value.trim();
            const message = document.getElementById('cMessage')?.value.trim();
            const targetEmail = copyBtn?.getAttribute('data-email') || 'jaquelinedaniel.pt@gmail.com';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !message) {
                if (statusEl) statusEl.textContent = 'PREENCHA NOME, E-MAIL E CONTEXTO PARA CONTINUAR.';
                return;
            }

            if (!emailRegex.test(email)) {
                if (statusEl) statusEl.textContent = 'INFORME UM ENDEREÇO DE E-MAIL VÁLIDO.';
                return;
            }

            const subject = encodeURIComponent(`[Portfólio] Contato — ${name}`);
            const body = encodeURIComponent(
                `Nome: ${name}\nE-mail: ${email}\n\nContexto / Desafio:\n${message}`
            );

            if (statusEl) {
                statusEl.textContent = 'ABRINDO SEU CLIENTE DE E-MAIL COM A MENSAGEM PRONTA...';
            }

            window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            setTimeout(() => {
                form.reset();
            }, 600);
        });
    }
});