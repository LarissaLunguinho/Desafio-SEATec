package com.liferay.clientesapi.repository;

import com.liferay.clientesapi.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}


/* 
    Separação de Responsabilidades:
    ClienteRepository: Responsável pela comunicação direta com o banco de dados
    ClienteService: Responsável pela lógica de negócios e por coordenar as operações

Controller (Requisições HTTP)
    ↓
Service (Lógica de Negócios)
    ↓
Repository (Acesso ao Banco)
    ↓
Banco de Dados 

*/