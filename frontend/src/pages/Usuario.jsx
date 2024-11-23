import React, { useEffect, useState, useContext } from 'react';
import { getAllUsuarios, createUsuario, deleteUsuario, updateUsuario } from '../services/usuarioService';
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";
import { AuthContext } from "../contexts/AuthContext";
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';

const Usuario = () => {
  const { isGerente } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({ Nome: '', Email: '', SenhaHash: '', Role: 'funcionario' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState({ Nome: '', Email: '', SenhaHash: '', Role: 'funcionario' });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getAllUsuarios();
      setUsuarios(data.$values || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsuarios([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const senha = prompt("Digite a senha para confirmar a adição:");
    if (senha === "senha123") { // Substitua "senha123" pela senha correta
      try {
        await createUsuario(newUsuario);
        fetchUsuarios();
        setNewUsuario({ Nome: '', Email: '', SenhaHash: '', Role: 'funcionario' });
        alert("Usuário adicionado com sucesso!");
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
      }
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleModalSearch = (e) => {
    setModalSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    const senha = prompt("Digite a senha para confirmar a exclusão:");
    if (senha === "senha123") { // Substitua "senha123" pela senha correta
      try {
        await deleteUsuario(id);
        fetchUsuarios();
        alert("Usuário deletado com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario({
      id: usuario.id,
      Nome: usuario.nome,
      Email: usuario.email,
      SenhaHash: usuario.senhaHash,
      Role: usuario.role,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const senha = prompt("Digite a senha para confirmar a edição:");
    if (senha === "senha123") { // Substitua "senha123" pela senha correta
      try {
        await updateUsuario(selectedUsuario.id, selectedUsuario);
        fetchUsuarios();
        setEditModalOpen(false);
        alert("Usuário atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUsuario({ ...selectedUsuario, [name]: value });
  };

  const filteredModalUsuarios = usuarios.filter(usuario =>
    usuario.nome && usuario.nome.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Header>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom>
            Gerenciar Usuarios
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2 }}>
            <TextField
              label="Nome"
              variant="outlined"
              value={newUsuario.Nome}
              onChange={(e) => setNewUsuario({ ...newUsuario, Nome: e.target.value })}
              fullWidth
              InputProps={{
                style: { backgroundColor: 'white' },
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={newUsuario.Email}
              onChange={(e) => setNewUsuario({ ...newUsuario, Email: e.target.value })}
              fullWidth
              InputProps={{
                style: { backgroundColor: 'white' },
              }}
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              value={newUsuario.SenhaHash}
              onChange={(e) => setNewUsuario({ ...newUsuario, SenhaHash: e.target.value })}
              fullWidth
              InputProps={{
                style: { backgroundColor: 'white' },
              }}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUsuario.Role}
                onChange={(e) => setNewUsuario({ ...newUsuario, Role: e.target.value })}
                label="Role"
                style={{ backgroundColor: 'white' }}
              >
                <MenuItem value="funcionario">Funcionário</MenuItem>
                <MenuItem value="gerente">Gerente</MenuItem>
              </Select>
            </FormControl>
            <Button  startIcon={<AddIcon/>} type="submit" variant="contained" color="primary">
              Adicionar Usuário
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button startIcon={<SearchIcon />} onClick={() => setModalOpen(true)} variant="contained" color="primary" sx={{ mt: 2 }}>
              Buscar Usuários
            </Button>
          </Box>
        </Container>
      </Header>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxHeight: '80vh', overflowY: 'auto', bgcolor: '#f5f5f5', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Lista de Usuários
          </Typography>
          <TextField
            label="Buscar Usuário"
            variant="outlined"
            value={modalSearchTerm}
            onChange={handleModalSearch}
            fullWidth
            InputProps={{
              style: { backgroundColor: 'white' },
            }}
            sx={{ mt: 2, mb: 2 }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredModalUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.role}</TableCell>
                    <TableCell>
                      {isGerente && (
                        <Button startIcon={<DeleteIcon/>} variant="contained" color="secondary" onClick={() => handleDelete(usuario.id)} sx={{ mr: 2 }}>
                          Deletar
                        </Button>
                      )}
                      <Button startIcon={<EditIcon/>} variant="contained" color="primary" onClick={() => handleEdit(usuario)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxHeight: '80vh', overflowY: 'auto', bgcolor: '#f5f5f5', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Editar Usuário
          </Typography>
          {selectedUsuario && (
            <Box component="form" onSubmit={handleEditSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nome"
                variant="outlined"
                name="Nome"
                value={selectedUsuario.Nome}
                onChange={handleEditChange}
                fullWidth
                InputProps={{
                  style: { backgroundColor: 'white' },
                }}
              />
              <TextField
                label="Email"
                variant="outlined"
                name="Email"
                value={selectedUsuario.Email}
                onChange={handleEditChange}
                fullWidth
                InputProps={{
                  style: { backgroundColor: 'white' },
                }}
              />
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                name="SenhaHash"
                value={selectedUsuario.SenhaHash}
                onChange={handleEditChange}
                fullWidth
                InputProps={{
                  style: { backgroundColor: 'white' },
                }}
              />
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="Role"
                  value={selectedUsuario.Role}
                  onChange={handleEditChange}
                  label="Role"
                  style={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="funcionario">Funcionário</MenuItem>
                  <MenuItem value="gerente">Gerente</MenuItem>
                </Select>
              </FormControl>
              <Button startIcon={<UpdateIcon/>} type="submit" variant="contained" color="primary">
                Atualizar Usuário
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Usuario;