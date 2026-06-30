document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se tem algum usuário logado
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    // Segurança: Se não houver ninguém logado, barra o acesso e manda pro login
    if (!usuarioLogado) {
        alert('Acesso negado. Por favor, faça login para acessar seu perfil.');
        window.location.href = 'login.html';
        return;
    }

    // Se for o Admin tentando entrar aqui, manda ele pro painel dele
    if (tipoUsuario === 'admin') {
        window.location.href = 'admin.html';
        return;
    }

    //Dados do Cliente de Teste
    const nomeExibicao = "Cliente Padrão de Teste";
    const emailExibicao = "cliente@raizes.com";
    const telefoneExibicao = "(99) 91234-5678";
    const pontosExibicao = localStorage.getItem('pontosFidelidade') || "120";

    document.getElementById('perfil-nome').innerText = nomeExibicao;
    document.getElementById('perfil-email').innerText = emailExibicao;
    document.getElementById('perfil-telefone').innerText = telefoneExibicao;
    document.getElementById('perfil-pontos').innerText = pontosExibicao;

    // Logout
    document.getElementById('btn-logout').addEventListener('click', (evento) => {
        evento.preventDefault(); 
        
        // Limpa apenas o necessário para deslogar
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('tipoUsuario');
        
        alert('Você saiu da sua conta.');
        window.location.href = 'login.html'; 
    });
});