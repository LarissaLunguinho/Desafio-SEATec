package com.liferay.clientesapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Telefone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Telefone.TipoTelefone tipo;

    @NotBlank(message = "Número é obrigatório")
    private String numero;

    public enum TipoTelefone {
        RESIDENCIAL,
        COMERCIAL,
        CELULAR
    }
}