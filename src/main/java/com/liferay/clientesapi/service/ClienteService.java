// Esta classe atua como uma camada intermediária (camada de serviço) entre 
// o controlador (que lida com as requisições HTTP) e o repositório (que interage diretamente com o banco de dados). 
// Ela contém a lógica de negócios relacionada às operações com clientes. CRUD

package com.liferay.clientesapi.service;

import com.liferay.clientesapi.model.Cliente;
import com.liferay.clientesapi.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente salvar(Cliente cliente) {
        // Formata o nome antes de salvar
        cliente.setNome(formatarNome(cliente.getNome()));
        return clienteRepository.save(cliente);
    }

    public void excluir(Long id) {
        clienteRepository.deleteById(id);
    }

    private String formatarNome(String nome) {
        if (nome == null || nome.isEmpty()) {
            return nome;
        }

        // Divide o nome em palavras
        String[] palavras = nome.toLowerCase().split("\\s+");
        StringBuilder nomeFormatado = new StringBuilder();

        // Capitaliza a primeira letra de cada palavra
        for (String palavra : palavras) {
            if (!palavra.isEmpty()) {
                nomeFormatado.append(Character.toUpperCase(palavra.charAt(0)))
                            .append(palavra.substring(1))
                            .append(" ");
            }
        }

        // Remove o espaço extra no final e retorna
        return nomeFormatado.toString().trim();
    }
}