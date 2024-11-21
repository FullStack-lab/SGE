import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";
import axios from "axios";

const SignIn = () => {
    const [newUsuario, setNewUsuario] = useState({ Nome: "", Email: "", SenhaHash: "", Role: "user" });
    const [isLogin, setIsLogin] = useState(true);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem("loggedInUser");
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setUserName(user.Nome);
        }
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5168/api/Usuario", newUsuario);
            setNewUsuario({ Nome: "", Email: "", SenhaHash: "", Role: "user" });
            alert("Usuário cadastrado com sucesso!");
            setIsLogin(true);
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao cadastrar usuário.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Dados enviados:", {
            Email: newUsuario.Email,
            SenhaHash: newUsuario.SenhaHash,
        });
    
        try {
            const response = await axios.post("http://localhost:5168/api/usuario/login", {
                Email: newUsuario.Email,
                SenhaHash: newUsuario.SenhaHash,
            });
    
            console.log("Resposta do servidor:", response.data);
            const user = response.data;
    
            sessionStorage.setItem("loggedIn", true);
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            setUserName(user.Nome);
            navigate("/home");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Credenciais inválidas!");
        }
    };
    
    

    const handleLogout = () => {
        sessionStorage.clear();
        setUserName("");
        navigate("/login");
    };

    const isAuthenticated = !!sessionStorage.getItem("loggedIn");

    if (isAuthenticated) {
        return (
            <>
                <Navbar />
                <Header>
                    <h1>Bem-vindo, {userName}!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </Header>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Header>
                {isLogin ? (
                    <>
                        <h1>Login</h1>
                        <form onSubmit={handleLogin}>
                            <input
                                placeholder="Email"
                                value={newUsuario.Email}
                                onChange={(e) => setNewUsuario({ ...newUsuario, Email: e.target.value })}
                            />
                            <input
                                placeholder="Senha"
                                type="password"
                                value={newUsuario.SenhaHash}
                                onChange={(e) => setNewUsuario({ ...newUsuario, SenhaHash: e.target.value })}
                            />
                            <button type="submit">Entrar</button>
                        </form>
                        <p>
                            Não tem uma conta? <span onClick={() => setIsLogin(false)}>Cadastre-se</span>
                        </p>
                    </>
                ) : (
                    <>
                        <h1>Cadastro</h1>
                        <form onSubmit={handleSignUp}>
                            <input
                                placeholder="Nome"
                                value={newUsuario.Nome}
                                onChange={(e) => setNewUsuario({ ...newUsuario, Nome: e.target.value })}
                            />
                            <input
                                placeholder="Email"
                                value={newUsuario.Email}
                                onChange={(e) => setNewUsuario({ ...newUsuario, Email: e.target.value })}
                            />
                            <input
                                placeholder="Senha"
                                type="password"
                                value={newUsuario.SenhaHash}
                                onChange={(e) => setNewUsuario({ ...newUsuario, SenhaHash: e.target.value })}
                            />
                            <button type="submit">Cadastrar Usuário</button>
                        </form>
                        <p>
                            Já tem uma conta? <span onClick={() => setIsLogin(true)}>Faça login</span>
                        </p>
                    </>
                )}
            </Header>
        </>
    );
};

export default SignIn;
