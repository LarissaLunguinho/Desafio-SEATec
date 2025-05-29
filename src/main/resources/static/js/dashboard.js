document.addEventListener('DOMContentLoaded', function() {
    const credentials = sessionStorage.getItem('credentials');
    const username = sessionStorage.getItem('username');
    
    if (!credentials || !username) {
        window.location.href = '/index.html';
        return;
    }

    document.getElementById('userName').textContent = username;
    
    if (username === 'admin') {
        document.body.classList.add('admin');
    }

    const cepInput = document.querySelector('input[name="cep"]');
    if (cepInput) {
        cepInput.addEventListener('blur', function() {
            const cep = this.value;
            if (cep) {
                buscarCep(cep);
            }
        });

        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 8) {
                value = value.slice(0, 8);
            }
            if (value.length > 5) {
                this.value = value.slice(0, 5) + '-' + value.slice(5);
            } else {
                this.value = value;
            }
        });
    }

    const cpfInput = document.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            if (value.length > 9) {
                this.value = value.slice(0, 3) + '.' + 
                            value.slice(3, 6) + '.' + 
                            value.slice(6, 9) + '-' + 
                            value.slice(9);
            } else if (value.length > 6) {
                this.value = value.slice(0, 3) + '.' + 
                            value.slice(3, 6) + '.' + 
                            value.slice(6);
            } else if (value.length > 3) {
                this.value = value.slice(0, 3) + '.' + 
                            value.slice(3);
            } else {
                this.value = value;
            }
        });
    }

    const telefonesContainer = document.getElementById('telefonesContainer');
    if (telefonesContainer) {
        telefonesContainer.addEventListener('input', function(e) {
            if (e.target.matches('input[name="telefones[].numero"]')) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                if (value.length > 7) {
                    if (value.length === 11) {
                        e.target.value = '(' + value.slice(0, 2) + ') ' + 
                                       value.slice(2, 7) + '-' + 
                                       value.slice(7);
                    } else {
                        e.target.value = '(' + value.slice(0, 2) + ') ' + 
                                       value.slice(2, 6) + '-' + 
                                       value.slice(6);
                    }
                } else if (value.length > 2) {
                    e.target.value = '(' + value.slice(0, 2) + ') ' + 
                                   value.slice(2);
                } else if (value.length > 0) {
                    e.target.value = '(' + value;
                } else {
                    e.target.value = value;
                }
            }
        });
    }
});

function logout() {
    sessionStorage.removeItem('credentials');
    sessionStorage.removeItem('username');
    window.location.href = '/index.html';
}

async function carregarClientes() {
    const listaClientes = document.getElementById('listaClientes');
    const tableBody = document.getElementById('clientesTableBody');
    const credentials = sessionStorage.getItem('credentials');
    
    try {
        const response = await fetch('/clientes', {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (response.ok) {
            const clientes = await response.json();
            
            // Limpa tabela
            tableBody.innerHTML = '';
            
            clientes.forEach(cliente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.emails[0] || ''}</td>
                    <td>${cliente.telefones[0]?.numero || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="verDetalhes(${cliente.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${sessionStorage.getItem('username') === 'admin' ? `
                            <button class="btn btn-sm btn-warning ms-1" onclick="editarCliente(${cliente.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger ms-1" onclick="excluirCliente(${cliente.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            
            listaClientes.style.display = 'block';
        } else {
            alert('Erro ao carregar clientes');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar clientes');
    }
}

function adicionarEmail() {
    const container = document.getElementById('emailsContainer');
    const novoEmail = document.createElement('div');
    novoEmail.className = 'input-group mb-2';
    novoEmail.innerHTML = `
        <input type="email" class="form-control" name="emails[]" required>
        <button type="button" class="btn btn-outline-danger" onclick="removerCampo(this)">
            <i class="bi bi-trash"></i>
        </button>
    `;
    container.appendChild(novoEmail);
}

function adicionarTelefone() {
    const container = document.getElementById('telefonesContainer');
    const novoTelefone = document.createElement('div');
    novoTelefone.className = 'row g-2 mb-2';
    novoTelefone.innerHTML = `
        <div class="col-md-6">
            <input type="tel" class="form-control" name="telefones[].numero" placeholder="Número" required>
        </div>
        <div class="col-md-5">
            <select class="form-select" name="telefones[].tipo" required>
                <option value="CELULAR">Celular</option>
                <option value="RESIDENCIAL">Residencial</option>
                <option value="COMERCIAL">Comercial</option>
            </select>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-outline-danger w-100" onclick="removerCampo(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(novoTelefone);
}

function removerCampo(botao) {
    const campo = botao.closest('.input-group, .row');
    campo.remove();
}

// Busca CEP
async function buscarCep(cep) {
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return false;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado');
            return false;
        }
        
        const form = document.getElementById('novoClienteForm');
        form.querySelector('[name="logradouro"]').value = data.logradouro || '';
        form.querySelector('[name="bairro"]').value = data.bairro || '';
        form.querySelector('[name="cidade"]').value = data.localidade || '';
        form.querySelector('[name="uf"]').value = data.uf || '';
        
        return true;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP');
        return false;
    }
}

async function salvarCliente() {
    const form = document.getElementById('novoClienteForm');
    const formData = new FormData(form);
    const credentials = sessionStorage.getItem('credentials');
    
    const cpf = formData.get('cpf').replace(/\D/g, '');
    
    const emails = Array.from(form.querySelectorAll('input[name="emails[]"]'))
        .map(input => input.value);
    
    const telefones = [];
    const telefonesContainer = document.getElementById('telefonesContainer');
    const telefonesRows = telefonesContainer.querySelectorAll('.row');
    telefonesRows.forEach(row => {
        telefones.push({
            numero: row.querySelector('input[name="telefones[].numero"]').value.replace(/\D/g, ''),
            tipo: row.querySelector('select[name="telefones[].tipo"]').value
        });
    });
    
    const cliente = {
        nome: formData.get('nome'),
        cpf: cpf,
        endereco: {
            cep: formData.get('cep').replace(/\D/g, ''),
            logradouro: formData.get('logradouro'),
            bairro: formData.get('bairro'),
            cidade: formData.get('cidade'),
            uf: formData.get('uf')
        },
        telefones: telefones,
        emails: emails
    };
    
    try {
        const response = await fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
            body: JSON.stringify(cliente)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoClienteModal'));
            modal.hide();
            
            carregarClientes();
            
            form.reset();
            
            document.getElementById('emailsContainer').innerHTML = `
                <div class="input-group mb-2">
                    <input type="email" class="form-control" name="emails[]" required>
                    <button type="button" class="btn btn-outline-danger" onclick="removerCampo(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            document.getElementById('telefonesContainer').innerHTML = `
                <div class="row g-2 mb-2">
                    <div class="col-md-6">
                        <input type="tel" class="form-control" name="telefones[].numero" placeholder="Número" required>
                    </div>
                    <div class="col-md-5">
                        <select class="form-select" name="telefones[].tipo" required>
                            <option value="CELULAR">Celular</option>
                            <option value="RESIDENCIAL">Residencial</option>
                            <option value="COMERCIAL">Comercial</option>
                        </select>
                    </div>
                    <div class="col-md-1">
                        <button type="button" class="btn btn-outline-danger w-100" onclick="removerCampo(this)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        } else {
            alert('Erro ao salvar cliente');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar cliente');
    }
}

async function verDetalhes(id) {
    const credentials = sessionStorage.getItem('credentials');
    
    try {
        const response = await fetch(`/clientes/${id}`, {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (response.ok) {
            const cliente = await response.json();
            
            const cpf = cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            
            const cep = cliente.endereco.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
            
            document.getElementById('detalheNome').textContent = cliente.nome;
            document.getElementById('detalheCpf').textContent = cpf;
            
            document.getElementById('detalheCep').textContent = cep;
            document.getElementById('detalheLogradouro').textContent = cliente.endereco.logradouro;
            document.getElementById('detalheBairro').textContent = cliente.endereco.bairro;
            document.getElementById('detalheCidade').textContent = cliente.endereco.cidade;
            document.getElementById('detalheUf').textContent = cliente.endereco.uf;
            
            const emailsContainer = document.getElementById('detalheEmails');
            emailsContainer.innerHTML = cliente.emails.map(email => 
                `<p class="mb-1"><i class="bi bi-envelope me-2"></i>${email}</p>`
            ).join('');
            
            const telefonesContainer = document.getElementById('detalheTelefones');
            telefonesContainer.innerHTML = cliente.telefones.map(telefone => {
                const numero = telefone.numero.length === 11 
                    ? telefone.numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                    : telefone.numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                
                return `
                    <tr>
                        <td>${numero}</td>
                        <td><span class="badge bg-secondary">${telefone.tipo}</span></td>
                    </tr>
                `;
            }).join('');
            
            const modal = new bootstrap.Modal(document.getElementById('detalhesClienteModal'));
            modal.show();
        } else {
            alert('Erro ao carregar detalhes do cliente');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar detalhes do cliente');
    }
}

async function editarCliente(id) {
    const credentials = sessionStorage.getItem('credentials');
    
    try {
        const response = await fetch(`/clientes/${id}`, {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (response.ok) {
            const cliente = await response.json();
            
            document.getElementById('editarId').value = cliente.id;
            
            document.getElementById('editarNome').value = cliente.nome;
            document.getElementById('editarCpf').value = cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            
            document.getElementById('editarCep').value = cliente.endereco.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
            document.getElementById('editarLogradouro').value = cliente.endereco.logradouro;
            document.getElementById('editarBairro').value = cliente.endereco.bairro;
            document.getElementById('editarCidade').value = cliente.endereco.cidade;
            document.getElementById('editarUf').value = cliente.endereco.uf;
            
            const emailsContainer = document.getElementById('editarEmailsContainer');
            emailsContainer.innerHTML = cliente.emails.map(email => `
                <div class="input-group mb-2">
                    <input type="email" class="form-control" name="emails[]" value="${email}" required>
                    <button type="button" class="btn btn-outline-danger" onclick="removerCampo(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('');
            
            const telefonesContainer = document.getElementById('editarTelefonesContainer');
            telefonesContainer.innerHTML = cliente.telefones.map(telefone => {
                const numero = telefone.numero.length === 11 
                    ? telefone.numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                    : telefone.numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                
                return `
                    <div class="row g-2 mb-2">
                        <div class="col-md-6">
                            <input type="tel" class="form-control" name="telefones[].numero" value="${numero}" placeholder="Número" required>
                        </div>
                        <div class="col-md-5">
                            <select class="form-select" name="telefones[].tipo" required>
                                <option value="CELULAR" ${telefone.tipo === 'CELULAR' ? 'selected' : ''}>Celular</option>
                                <option value="RESIDENCIAL" ${telefone.tipo === 'RESIDENCIAL' ? 'selected' : ''}>Residencial</option>
                                <option value="COMERCIAL" ${telefone.tipo === 'COMERCIAL' ? 'selected' : ''}>Comercial</option>
                            </select>
                        </div>
                        <div class="col-md-1">
                            <button type="button" class="btn btn-outline-danger w-100" onclick="removerCampo(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            const cepInput = document.getElementById('editarCep');
            if (cepInput) {
                cepInput.addEventListener('blur', function() {
                    const cep = this.value;
                    if (cep) {
                        buscarCep(cep);
                    }
                });
            }
            
            const modal = new bootstrap.Modal(document.getElementById('editarClienteModal'));
            modal.show();
        } else {
            alert('Erro ao carregar dados do cliente');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do cliente');
    }
}

function adicionarEmailEdicao() {
    const container = document.getElementById('editarEmailsContainer');
    const novoEmail = document.createElement('div');
    novoEmail.className = 'input-group mb-2';
    novoEmail.innerHTML = `
        <input type="email" class="form-control" name="emails[]" required>
        <button type="button" class="btn btn-outline-danger" onclick="removerCampo(this)">
            <i class="bi bi-trash"></i>
        </button>
    `;
    container.appendChild(novoEmail);
}

function adicionarTelefoneEdicao() {
    const container = document.getElementById('editarTelefonesContainer');
    const novoTelefone = document.createElement('div');
    novoTelefone.className = 'row g-2 mb-2';
    novoTelefone.innerHTML = `
        <div class="col-md-6">
            <input type="tel" class="form-control" name="telefones[].numero" placeholder="Número" required>
        </div>
        <div class="col-md-5">
            <select class="form-select" name="telefones[].tipo" required>
                <option value="CELULAR">Celular</option>
                <option value="RESIDENCIAL">Residencial</option>
                <option value="COMERCIAL">Comercial</option>
            </select>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-outline-danger w-100" onclick="removerCampo(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(novoTelefone);
}

async function salvarEdicao() {
    const form = document.getElementById('editarClienteForm');
    const formData = new FormData(form);
    const credentials = sessionStorage.getItem('credentials');
    const id = document.getElementById('editarId').value;
    
    const cpf = formData.get('cpf').replace(/\D/g, '');
    
    const emails = Array.from(form.querySelectorAll('input[name="emails[]"]'))
        .map(input => input.value);
    
    const telefones = [];
    const telefonesContainer = document.getElementById('editarTelefonesContainer');
    const telefonesRows = telefonesContainer.querySelectorAll('.row');
    telefonesRows.forEach(row => {
        telefones.push({
            numero: row.querySelector('input[name="telefones[].numero"]').value.replace(/\D/g, ''),
            tipo: row.querySelector('select[name="telefones[].tipo"]').value
        });
    });
    
    const cliente = {
        id: id,
        nome: formData.get('nome'),
        cpf: cpf,
        endereco: {
            cep: formData.get('cep').replace(/\D/g, ''),
            logradouro: formData.get('logradouro'),
            bairro: formData.get('bairro'),
            cidade: formData.get('cidade'),
            uf: formData.get('uf')
        },
        telefones: telefones,
        emails: emails
    };
    
    try {
        const response = await fetch(`/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
            body: JSON.stringify(cliente)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarClienteModal'));
            modal.hide();
            
            carregarClientes();
        } else {
            alert('Erro ao salvar alterações');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar alterações');
    }
}

async function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }
    
    const credentials = sessionStorage.getItem('credentials');
    
    try {
        const response = await fetch(`/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (response.ok) {
            carregarClientes();
        } else {
            alert('Erro ao excluir cliente');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir cliente');
    }
}

document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#clientesTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}); 