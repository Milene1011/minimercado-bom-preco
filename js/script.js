// JavaScript personalizado para o Minimercado Bom Preço - Fase 2

// Função para exibir horário atual (função temporal)
function atualizarHorario() {
    const agora = new Date();
    const opcoes = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
    };
    
    const horarioFormatado = agora.toLocaleDateString('pt-BR', opcoes);
    const elementoHorario = document.getElementById('horario-atual');
    
    if (elementoHorario) {
        elementoHorario.textContent = horarioFormatado;
    }
}

// Função para verificar se a loja está aberta
function verificarStatusLoja() {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, etc.
    const hora = agora.getHours();
    
    // Loja funciona de segunda (1) a sábado (6), das 7h às 22h
    const lojaAberta = (diaSemana >= 1 && diaSemana <= 6) && (hora >= 7 && hora < 22);
    
    const elementoStatus = document.getElementById('status-loja');
    if (elementoStatus) {
        if (lojaAberta) {
            elementoStatus.innerHTML = '<span class="text-success">🟢 Loja Aberta</span>';
            elementoStatus.className = 'alert alert-success';
        } else {
            elementoStatus.innerHTML = '<span class="text-danger">🔴 Loja Fechada</span>';
            elementoStatus.className = 'alert alert-warning';
        }
    }
}

// Função para animação de entrada dos elementos
function animarElementos() {
    const elementos = document.querySelectorAll('.fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elementos.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(30px)';
        elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(elemento);
    });
}

// Função para validação de formulário de cadastro
function validarFormularioCadastro() {
    const formulario = document.getElementById('form-cadastro');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação de CPF simples
            const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
            if (cpf.length !== 11) {
                alert('CPF deve ter 11 dígitos');
                return false;
            }
            
            // Validação de email
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Email inválido');
                return false;
            }
            
            // Validação de telefone
            const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
            if (telefone.length < 10) {
                alert('Telefone deve ter pelo menos 10 dígitos');
                return false;
            }
            
            // Se chegou até aqui, o formulário é válido
            alert('Cadastro realizado com sucesso!');
            formulario.reset();
        });
    }
}

// Função para máscara de CPF
function aplicarMascaraCPF() {
    const campoCPF = document.getElementById('cpf');
    if (campoCPF) {
        campoCPF.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = valor;
        });
    }
}

// Função para máscara de telefone
function aplicarMascaraTelefone() {
    const campoTelefone = document.getElementById('telefone');
    if (campoTelefone) {
        campoTelefone.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length <= 10) {
                valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
                valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
                valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = valor;
        });
    }
}

// Função para inicializar o calendário de agendamento
function inicializarCalendario() {
    const inputData = document.getElementById('data-agendamento');
    if (inputData) {
        // Definir data mínima como hoje
        const hoje = new Date();
        const dataMinima = hoje.toISOString().split('T')[0];
        inputData.min = dataMinima;
        
        // Definir data máxima como 30 dias a partir de hoje
        const dataMaxima = new Date();
        dataMaxima.setDate(hoje.getDate() + 30);
        inputData.max = dataMaxima.toISOString().split('T')[0];
    }
}

// Função para atualizar horários disponíveis baseado na data selecionada
function atualizarHorariosDisponiveis() {
    const inputData = document.getElementById('data-agendamento');
    const selectHorario = document.getElementById('horario-agendamento');
    
    if (inputData && selectHorario) {
        inputData.addEventListener('change', function() {
            const dataSelecionada = new Date(this.value + 'T00:00:00');
            const diaSemana = dataSelecionada.getDay();
            
            // Limpar opções existentes
            selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
            
            // Verificar se é dia útil (segunda a sábado)
            if (diaSemana >= 1 && diaSemana <= 6) {
                // Horários de funcionamento: 7h às 22h
                for (let hora = 7; hora < 22; hora++) {
                    const horario = `${hora.toString().padStart(2, '0')}:00`;
                    const option = document.createElement('option');
                    option.value = horario;
                    option.textContent = horario;
                    selectHorario.appendChild(option);
                }
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Não funcionamos aos domingos';
                option.disabled = true;
                selectHorario.appendChild(option);
            }
        });
    }
}

// Função para calcular taxa de entrega baseada no CEP
function calcularTaxaEntrega() {
    const inputCEP = document.getElementById('cep-entrega');
    const spanTaxa = document.getElementById('taxa-entrega');
    
    if (inputCEP && spanTaxa) {
        inputCEP.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                // Simular cálculo de taxa baseado no CEP
                const primeirosDigitos = parseInt(cep.substring(0, 2));
                let taxa = 0;
                
                if (primeirosDigitos >= 90000 && primeirosDigitos <= 99999) {
                    // CEPs de Porto Alegre e região metropolitana
                    taxa = 5.00;
                } else {
                    // Outras regiões
                    taxa = 10.00;
                }
                
                spanTaxa.textContent = `R$ ${taxa.toFixed(2)}`;
                spanTaxa.className = 'text-success fw-bold';
            } else {
                spanTaxa.textContent = 'CEP inválido';
                spanTaxa.className = 'text-danger';
            }
        });
    }
}

// Função para aplicar máscara de CEP
function aplicarMascaraCEP() {
    const campoCEP = document.getElementById('cep-entrega');
    if (campoCEP) {
        campoCEP.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = valor;
        });
    }
}

// Função para mostrar/ocultar campos baseado no tipo de serviço
function configurarTipoServico() {
    const radioRetirada = document.getElementById('retirada');
    const radioEntrega = document.getElementById('entrega');
    const camposEntrega = document.getElementById('campos-entrega');
    
    if (radioRetirada && radioEntrega && camposEntrega) {
        function toggleCamposEntrega() {
            if (radioEntrega.checked) {
                camposEntrega.style.display = 'block';
                camposEntrega.querySelectorAll('input, select').forEach(campo => {
                    campo.required = true;
                });
            } else {
                camposEntrega.style.display = 'none';
                camposEntrega.querySelectorAll('input, select').forEach(campo => {
                    campo.required = false;
                });
            }
        }
        
        radioRetirada.addEventListener('change', toggleCamposEntrega);
        radioEntrega.addEventListener('change', toggleCamposEntrega);
        
        // Inicializar estado
        toggleCamposEntrega();
    }
}

// Função para smooth scroll nos links âncora
function configurarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para destacar link ativo na navegação
function destacarLinkAtivo() {
    const paginaAtual = window.location.pathname.split('/').pop();
    const linksNav = document.querySelectorAll('.nav-link');
    
    linksNav.forEach(link => {
        const href = link.getAttribute('href');
        if (href === paginaAtual || (paginaAtual === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Função principal que executa quando o DOM está carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    atualizarHorario();
    verificarStatusLoja();
    animarElementos();
    validarFormularioCadastro();
    aplicarMascaraCPF();
    aplicarMascaraTelefone();
    aplicarMascaraCEP();
    inicializarCalendario();
    atualizarHorariosDisponiveis();
    calcularTaxaEntrega();
    configurarTipoServico();
    configurarSmoothScroll();
    destacarLinkAtivo();
    
    // Atualizar horário a cada segundo
    setInterval(atualizarHorario, 1000);
    
    // Verificar status da loja a cada minuto
    setInterval(verificarStatusLoja, 60000);
    
    // Adicionar efeito de hover nos cards
    document.querySelectorAll('.category-card, .product-card, .service-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Configurar tooltips do Bootstrap se existirem
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (typeof bootstrap !== 'undefined') {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    console.log('Minimercado Bom Preço - Sistema carregado com sucesso!');
});

// Função para acessibilidade - navegação por teclado
document.addEventListener('keydown', function(e) {
    // Esc para fechar modais ou voltar ao topo
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Alt + H para ir ao início
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = 'index.html';
    }
    
    // Alt + P para ir aos produtos
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        window.location.href = 'produtos.html';
    }
    
    // Alt + S para ir aos serviços
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        window.location.href = 'servicos.html';
    }
    
    // Alt + C para ir ao contato
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        window.location.href = 'contato.html';
    }
});

// Função para melhorar acessibilidade - anunciar mudanças para leitores de tela
function anunciarMudanca(mensagem) {
    const anunciador = document.createElement('div');
    anunciador.setAttribute('aria-live', 'polite');
    anunciador.setAttribute('aria-atomic', 'true');
    anunciador.className = 'sr-only';
    anunciador.textContent = mensagem;
    
    document.body.appendChild(anunciador);
    
    setTimeout(() => {
        document.body.removeChild(anunciador);
    }, 1000);
}

