document.addEventListener('DOMContentLoaded', () => {
    const linkAcesso = document.getElementById('link-acesso');
    const itemCarrinho = document.getElementById('item-carrinho');
    const linkSair = document.getElementById('id-link-sair') || document.getElementById('link-sair');
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (usuarioLogado && usuarioLogado !== "") {
        // Se tiver logado
        if (linkAcesso) {
            linkAcesso.innerText = 'Perfil';
            linkAcesso.href = 'perfilusuario.html';
        }
        if (linkSair) {
            linkSair.style.display = 'inline-block'; // Mostra o botão Sair
        }

        if (tipoUsuario) {
            if (tipoUsuario === 'admin') {
                itemCarrinho.style.display = 'none';
            } else {
                itemCarrinho.style.display = 'inline-block'
            }
        }


    } else {
        // Se não tiver
        if (linkAcesso) {
            linkAcesso.innerText = 'Entrar';
            linkAcesso.href = 'login.html';
        }
        if (linkSair) {
            linkSair.style.display = 'none'; // Esconde o botão Sair completamente
        }
        if (itemCarrinho) {
            itemCarrinho.style.display ='none';
        }
    }
});