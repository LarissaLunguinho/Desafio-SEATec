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