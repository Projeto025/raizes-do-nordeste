document.addEventListener('DOMContentLoaded', () => {
    
    function verificarLogin() {
        const linkAcesso = document.getElementById('link-acesso');
        const itemCarrinho = document.getElementById('item-carrinho');
        const usuarioLogado = localStorage.getItem('usuarioLogado');

        // Controle do botão de acesso/perfil
        if (linkAcesso) {
            if (usuarioLogado && usuarioLogado !== "") {
                linkAcesso.innerText = 'Perfil';
                linkAcesso.href = 'perfilusuario.html';
            } else {
                linkAcesso.innerText = 'Entrar';
                linkAcesso.href = 'login.html';
            }
        }

        // Visibilidade do carrinho
        if (itemCarrinho) {
            if (usuarioLogado && usuarioLogado !== "") {
                itemCarrinho.classList.remove('visualmente-oculto');
                itemCarrinho.classList.add('exibir-flex'); 
                
                const contador = document.getElementById('contador-carrinho');
                if (contador) {
                    const carrinhoItens = JSON.parse(localStorage.getItem('carrinho')) || [];
                    contador.innerText = carrinhoItens.length;
                    
                    if (carrinhoItens.length === 0) {
                        contador.classList.remove('contador-com-itens');
                        contador.classList.add('contador-vazio');
                    } else {
                        contador.classList.remove('contador-vazio');
                        contador.classList.add('contador-com-itens');
                    }
                }
            } else {
                itemCarrinho.classList.remove('exibir-flex');
                itemCarrinho.classList.add('visualmente-oculto');
            }
        }
    }

    // Executa o check de autenticação
    verificarLogin();    
    
    // Elementos do DOM
    const secaoCarrinho = document.getElementById('secao-carrinho');
    const secaoStatus = document.getElementById('secao-status-pedido');
    const listaItens = document.getElementById('lista-itens-carrinho');
    
    const valorSubtotal = document.getElementById('valor-subtotal');
    const valorDesconto = document.getElementById('valor-desconto');
    const valorTotal = document.getElementById('valor-total');
    const pontosAGanhar = document.getElementById('pontos-a-ganhar');
    
    const saldoPontosCatar = document.getElementById('saldo-pontos-carrinho');
    const chkUsarPontos = document.getElementById('chk-usar-pontos');
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

    // Inicialização do carrinho LocalStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    // Escuta evento do botão de esvaziar carrinho
    if (btnLimparCarrinho) {
        btnLimparCarrinho.addEventListener('click', () => {
            if (confirm('Deseja realmente esvaziar o carrinho?')) {
                carrinho = [];
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarInterfaceCarrinho();
            }
        });
    }

    // Carrega e valida os pontos de fidelidade
    let pontosAtuais = parseInt(localStorage.getItem('pontosFidelidade')) || 0;
    if (saldoPontosCatar) saldoPontosCatar.innerText = pontosAtuais;

    if (pontosAtuais < 10 && chkUsarPontos) {
        chkUsarPontos.disabled = true;
    }

    // Renderização e Cálculos de Valores do Checkout
    function atualizarInterfaceCarrinho() {
        if (!listaItens) return;
        listaItens.innerHTML = ''; 
        let subtotal = 0;

        if (carrinho.length === 0) {
            listaItens.innerHTML = '<p class="carrinho-vazio-msg">Seu carrinho está vazio. Vá até o cardápio de uma de nossas unidades para adicionar pratos deliciosos!</p>';
        } else {
            carrinho.forEach(item => {
                subtotal += item.preco;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-no-carrinho';
                itemDiv.innerHTML = `
                    <span>${item.nome}</span>
                    <strong>R$ ${item.preco.toFixed(2).replace('.', ',')}</strong>
                `;
                listaItens.appendChild(itemDiv);
            });
        }

        let desconto = 0;
        if (chkUsarPontos && chkUsarPontos.checked && pontosAtuais >= 10) {
            desconto = 10.00;
        }

        let totalGeral = subtotal - desconto;
        if (totalGeral < 0) totalGeral = 0;

        let novosPontos = Math.floor(totalGeral / 5);

        if (valorSubtotal) valorSubtotal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (valorDesconto) valorDesconto.innerText = `- R$ ${desconto.toFixed(2).replace('.', ',')}`;
        if (valorTotal) valorTotal.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        if (pontosAGanhar) pontosAGanhar.innerText = `${novosPontos} pontos`;

        if (btnFinalizar) btnFinalizar.dataset.novosPontos = novosPontos;
    }

    if (chkUsarPontos) {
        chkUsarPontos.addEventListener('change', atualizarInterfaceCarrinho);
    }
    
    atualizarInterfaceCarrinho();

    // Finalizar pedido e mudança de status com timers
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            
            secaoStatus.classList.remove('visually-hidden');
            secaoStatus.classList.add('exibir-block');

            btnFinalizar.disabled = true;
            btnFinalizar.innerText = 'Pedido em andamento...';

            if (carrinho.length > 0) {
                const unidadeSelescionada = document.getElementById('unidade-selecionada');
                if (unidadeSelescionada) unidadeSelescionada.innerText = carrinho[0].unidade;
            }

            let pontosfinais = pontosAtuais;
            if (chkUsarPontos && chkUsarPontos.checked) pontosfinais -= 10;
            pontosfinais += parseInt(btnFinalizar.dataset.novosPontos) || 0;
            localStorage.setItem('pontosFidelidade', pontosfinais);

            // Zera o carrinho no banco de dados
            localStorage.setItem('carrinho', JSON.stringify([]));

            // Elementos da linha do tempo
            const statusPreparacao = document.getElementById('status-preparacao');
            const statusPronto = document.getElementById('status-pronto');

            if (statusPreparacao) {
                statusPreparacao.classList.add('status-em-preparacao');
                setTimeout(() => {
                    statusPreparacao.classList.add('ativo');
                }, 4000);
            }

            if (statusPronto) {
                statusPronto.classList.add('status-pronto');
                setTimeout(() => {
                    statusPronto.classList.add('ativo');
                    alert('Seu pedido está pronto! Dirija-se ao balcão de pick-up.');
                    
                    carrinho = [];
                    atualizarInterfaceCarrinho();
                    
                    btnFinalizar.disabled = false;
                    btnFinalizar.innerText = 'Confirmar e Concluir Pedido';
                }, 8000);
            }
        });
    }
});