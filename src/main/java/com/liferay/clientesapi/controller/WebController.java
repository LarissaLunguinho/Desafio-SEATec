package com.liferay.clientesapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        return "redirect:/pages/login.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/pages/login.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "redirect:/pages/admin.html";
    }

    @GetMapping("/list-clientes")
    public String listClientes() {
        return "redirect:/pages/list-clientes.html";
    }

    @GetMapping("/user")
    public String user() {
        return "redirect:/pages/user.html";
    }
    
    
} 