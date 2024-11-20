import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login === "admin" && senha === "admin") {
            sessionStorage.setItem("loggedIn", true); // Salva o estado de login no sessionStorage
            navigate("/home"); // Redireciona para a página inicial
        } else {
            alert("Credenciais inválidas");
        }
    };

    return (
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
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Login"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: 'white' }
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
                            style: { backgroundColor: 'white' }
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
    );
};

export default SignIn;