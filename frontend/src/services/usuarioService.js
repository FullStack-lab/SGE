import axios from 'axios';

const API_URL = 'http://localhost:5168/api/usuario';

export const getAllUsuarios = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createUsuario = async (usuario) => {
    const response = await axios.post(API_URL, usuario);
    return response.data;
};

export const deleteUsuario = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const updateUsuario = async (id, usuario) => {
    const response = await axios.put(`${API_URL}/${id}`, usuario);
    return response.data;
};