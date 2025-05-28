package com.liferay.clientesapi.repository;

import com.liferay.clientesapi.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}