const botaoAlternar = document.getElementById('toggle-admin');
const textoPerfil = document.getElementById('tipo-usuario');
const formulario = document.getElementById('form-login');

// Alternador do perfil de acesso
botaoAlternar.addEventListener('click', () => {
    if (textoPerfil.innerText === 'Cliente') {
        textoPerfil.innerText = 'Administrador';
        botaoAlternar.innerText = 'Alternar para Portal Cliente';
    } else {
        textoPerfil.innerText = 'Cliente';
        botaoAlternar.innerText = 'Alternar para Portal Admin';
    }
});

// Validação de login (mockada)
// Tem lógica aqui, mas optei por deixar o cadastro apenas visual
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    const email = document.getElementById('campo-email').value;
    const senha = document.getElementById('campo-senha').value;
    const perfilAtual = textoPerfil.innerText;

    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('tipoUsuario');

    const dadosCadastrados = localStorage.getItem('usuarioCadastrado');
    let usuarioDinâmico = null;
    if (dadosCadastrados) {
        usuarioDinâmico = JSON.parse(dadosCadastrados); // Transforma o texto de volta em objeto
    }

    // Validação do administrador
    if (perfilAtual === 'Administrador' && email === 'admin@raizes.com' && senha === 'admin123') {
        localStorage.setItem('usuarioLogado', email);
        localStorage.setItem('tipoUsuario', 'admin');
        alert('Acesso Autorizado: Painel Administrativo.');
        window.location.href = 'admin.html';
    } 
    //Validação do cliente
    else if (perfilAtual === 'Cliente' && 
            ((email === 'cliente@raizes.com' && senha === 'raizes123') || 
             (usuarioDinâmico && email === usuarioDinâmico.email && senha === usuarioDinâmico.senha))) {
        
        const nomeUsuario = usuarioDinâmico && email === usuarioDinâmico.email ? usuarioDinâmico.nome : "Cliente";
        
        localStorage.setItem('usuarioLogado', nomeUsuario);
        localStorage.setItem('tipoUsuario', 'cliente');
        
        if (!localStorage.getItem('carrinho')) {
            localStorage.setItem('carrinho', JSON.stringify([]));
        }

        alert(`Bem-vindo à Raízes do Nordeste, ${nomeUsuario}!`);
        window.location.href = 'perfilusuario.html';
    } 
    else {
        alert('Credenciais incorretas para o perfil selecionado.');
    }
});