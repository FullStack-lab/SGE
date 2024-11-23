import React, { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getAllUsuarios } from "../services/usuarioService";
import { Navbar } from "../components/Navbar/Navbar"; 

const SignIn = () => {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login: loginUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const usuarios = await getAllUsuarios();
            const listaUsuarios = usuarios.$values;

            if (!listaUsuarios || listaUsuarios.length === 0) {
                setError("Nenhum usuário encontrado.");
                return;
            }

            const usuarioValido = listaUsuarios.find(
                (user) => user.email === login && user.senhaHash === senha
            );

            if (usuarioValido) {
                loginUser(usuarioValido);
                navigate("/home");
            } else {
                setError("Credenciais inválidas.");
            }
        } catch (err) {
            console.error("Erro ao verificar login:", err);
            setError("Ocorreu um erro ao conectar com o servidor. Tente novamente.");
        }
    };

    return (
        <>
            <Navbar/>
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Conectar
                </Typography>
                {error && (
                    <Typography variant="body2" color="error" gutterBottom>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Login"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: 'white' },
                        }}
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: 'white' },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Entrar
                    </Button>
                </form>
            </Box>
        </Container>
        </>
    );
};

export default SignIn;
