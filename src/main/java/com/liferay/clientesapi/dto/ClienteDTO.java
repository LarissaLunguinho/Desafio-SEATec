/**
 * DTO (Data Transfer Object) é uma classe que é usada para transferir dados entre diferentes camadas de uma aplicação.
 * Usado na comunicação com o cliente (frontend)
 * Validações mais simples focadas na entrada de dados
 * Não contém lógica de negócios
 * 
 * Quando o frontend envia dados:
Frontend -> ClienteDTO -> Conversão -> Cliente (Model) -> Banco de Dados

Quando retorna dados para o frontend:
Banco de Dados -> Cliente (Model) -> Conversão -> ClienteDTO -> Frontend
 */

package com.liferay.clientesapi.dto;

import com.liferay.clientesapi.model.Endereco;
import com.liferay.clientesapi.model.Telefone;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class ClienteDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100)
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotNull
    private Endereco endereco;

    @NotEmpty
    private List<Telefone> telefones;

    @NotEmpty
    private List<@Email String> emails;
}