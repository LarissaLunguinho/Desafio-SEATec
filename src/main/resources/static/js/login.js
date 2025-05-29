document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitButton = this.querySelector('button[type="submit"]');
    
    const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const modalSpinner = document.getElementById('modalSpinner');
    const modalIcon = document.getElementById('modalIcon');
    const modalMessage = document.getElementById('modalMessage');
    
    modalSpinner.style.display = 'block';
    modalIcon.style.display = 'none';
    modalIcon.innerHTML = '';
    modalMessage.textContent = 'Verificando suas credenciais...';
    modal.show();
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';
    
    try {
        const credentials = btoa(`${username}:${password}`);
        
        const response = await fetch('/clientes', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (response.ok) {
            sessionStorage.setItem('credentials', credentials);
            sessionStorage.setItem('username', username);
            
            modalSpinner.style.display = 'none';
            modalIcon.style.display = 'block';
            modalIcon.innerHTML = '✅';
            modalMessage.textContent = 'Login realizado com sucesso! Redirecionando...';
            
            setTimeout(() => {
                modal.hide();
                if (username === 'admin') {
                    window.location.href = '/pages/admin.html';
                } else {
                    window.location.href = '/pages/user.html';
                }
            }, 1500);
        } else {
            modalSpinner.style.display = 'none';
            modalIcon.style.display = 'block';
            modalIcon.innerHTML = '❌';
            modalMessage.textContent = 'Usuário ou senha inválidos';
            
            document.querySelector('#feedbackModal .btn-close').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        
        modalSpinner.style.display = 'none';
        modalIcon.style.display = 'block';
        modalIcon.innerHTML = '❌';
        modalMessage.textContent = 'Erro ao tentar fazer login. Tente novamente.';
        
        document.querySelector('#feedbackModal .btn-close').style.display = 'block';
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Entrar';
    }
}); 