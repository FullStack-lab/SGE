import React, { useEffect, useState } from 'react';
import { getAllCategorias, createCategoria } from '../services/categoriaService';
import { getAllProdutos } from '../services/produtoService';
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";
import { Container, TextField, Button, Box, Typography, List, ListItem, ListItemText, Popover, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import CategoryIcon from '@mui/icons-material/Category';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [newCategoria, setNewCategoria] = useState({ Nome: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [countModalOpen, setCountModalOpen] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [produtoModalOpen, setProdutoModalOpen] = useState(false);

  useEffect(() => {
    fetchCategorias();
    fetchProdutos();
  }, []);

  const fetchCategorias = async () => {
    const data = await getAllCategorias();
    setCategorias(data.$values || []);
  };

  const fetchProdutos = async () => {
    const data = await getAllProdutos();
    setProdutos(data.$values || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategoria(newCategoria);
      fetchCategorias();
      setNewCategoria({ Nome: '' });
      alert("Categoria adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar categoria", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategoria({ ...newCategoria, [name]: value });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCountClick = () => {
    const uniqueProducts = produtos.reduce((acc, produto) => {
      const key = `${produto.codigo}-${produto.categoriaId}`;
      if (!acc[key]) {
        acc[key] = produto;
      }
      return acc;
    }, {});

    const counts = categorias.map(categoria => {
      const count = Object.values(uniqueProducts).filter(produto => produto.categoriaId === categoria.id).length;
      return { ...categoria, count };
    });

    setCategoryCounts(counts);
    setCountModalOpen(true);
  };

  const handleCountClose = () => {
    setCountModalOpen(false);
  };

  const handleProdutoClick = (categoria) => {
    setSelectedCategoria(categoria);
    setProdutoModalOpen(true);
  };

  const handleProdutoClose = () => {
    setProdutoModalOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Navbar />
      <Header>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom>
            Categorias
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2 }}>
            <TextField
              label="Nome da Categoria"
              variant="outlined"
              name="Nome"
              value={newCategoria.Nome}
              onChange={handleChange}
              fullWidth
              InputProps={{
                style: { backgroundColor: 'white' },
              }}
            />
            <Button startIcon={<AddIcon />} type="submit" variant="contained" color="primary">
              Adicionar Categoria
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button startIcon={<ListIcon />} onClick={handleClick} variant="contained" color="primary">
              Ver Categorias
            </Button>
            <Button startIcon={<CategoryIcon />} onClick={handleCountClick} variant="contained" color="primary" sx={{ ml: 2 }}>
              Contagem de Produtos por Categoria
            </Button>
          </Box>
        </Container>
      </Header>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: '300px', maxHeight: '200px', overflowY: 'auto', bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'black' }}>
            Lista de Categorias
          </Typography>
          <List>
            {Array.isArray(categorias) && categorias.map((categoria) => (
              <ListItem key={categoria.id}>
                <ListItemText primary={`${categoria.id} - ${categoria.nome}`} sx={{ color: 'black' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      <Modal
        open={countModalOpen}
        onClose={handleCountClose}
        aria-labelledby="count-modal-title"
        aria-describedby="count-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%', maxHeight: '50vh', overflowY: 'auto', bgcolor: '#f5f5f5', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography id="count-modal-title" variant="h6" component="h2">
            Contagem de Produtos por Categoria
          </Typography>
          <List>
            {categoryCounts.map((categoria) => (
              <ListItem key={categoria.id}>
                <ListItemText primary={`${categoria.nome}: ${categoria.count} produtos`} sx={{ color: 'black' }} />
                <Button startIcon={<VisibilityIcon />} variant="contained" color="primary" onClick={() => handleProdutoClick(categoria)}>
                  Ver Produtos
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>

      <Modal
        open={produtoModalOpen}
        onClose={handleProdutoClose}
        aria-labelledby="produto-modal-title"
        aria-describedby="produto-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%', maxHeight: '50vh', overflowY: 'auto', bgcolor: '#f5f5f5', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography id="produto-modal-title" variant="h6" component="h2">
            Produtos da Categoria: {selectedCategoria && selectedCategoria.nome}
          </Typography>
          <List>
            {selectedCategoria && produtos.filter(produto => produto.categoriaId === selectedCategoria.id).map((produto) => (
              <ListItem key={produto.id}>
                <ListItemText primary={`${produto.nome} - Estoque Atual: ${produto.estoqueAtual}`} sx={{ color: 'black' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default Categoria;