document.addEventListener('DOMContentLoaded', () => {
    
    const botoesAdicionar = document.querySelectorAll('.btn-add-carrinho');

    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // Trava de segurança: impede compra sem login
            if (!localStorage.getItem('usuarioLogado')) {
                alert('Por favor, faça login para adicionar itens ao seu carrinho.');
                window.location.href = 'login.html';
                return;
            }

            const nome = e.target.dataset.nome;
            const preco = parseFloat(e.target.dataset.preco);
            const unidade = e.target.dataset.unidade;

            // Puxa o carrinho da gaveta ou inicia um array vazio
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

            // Insere o novo prato
            carrinho.push({
                id: Date.now(),
                nome: nome,
                preco: preco,
                unidade: unidade
            });

            // Devolve para a gaveta atualizado
            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            // Notifica o cliente
            alert(`${nome} foi adicionado ao seu carrinho!`);
        });
    });
});