import React, { useEffect, useState } from 'react';
import { getAllUsuarios } from '../services/usuarioService';
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";

const Usuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        const data = await getAllUsuarios();
        setUsuarios(data);
    };

    return (
        <>
        <Navbar />
        <Header>
            <h1>Usuários</h1>
            <ul>
                {Array.isArray(usuarios) && usuarios.map(usuario => (
                    <li key={usuario.Id}>{usuario.Nome} - {usuario.Email}</li>
                ))}
            </ul>
        </Header>
        </>
    );
};

export default Usuario;