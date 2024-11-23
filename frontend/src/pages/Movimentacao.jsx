import React, { useEffect, useState } from "react";
import { getAllMovimentacoes, createMovimentacao } from "../services/movimentacaoService";
import { getAllProdutos, updateProduto } from "../services/produtoService";
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';

const Movimentacao = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [newMovimentacao, setNewMovimentacao] = useState({
    ProdutoId: "",
    Quantidade: 0,
    Tipo: "entrada",
    Data: new Date().toISOString()
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  useEffect(() => {
    fetchMovimentacoes();
    fetchProdutos();
  }, []);

  const fetchMovimentacoes = async () => {
    const data = await getAllMovimentacoes();
    setMovimentacoes(data.$values || []);
  };

  const fetchProdutos = async () => {
    const data = await getAllProdutos();
    setProdutos(data.$values || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const senha = prompt("Digite a senha para confirmar a movimentação:");
    if (senha === "senha123") { // Substitua "senha123" pela senha correta
      try {
        await createMovimentacao(newMovimentacao);
        await updateProdutoEstoque(newMovimentacao);
        fetchMovimentacoes();
        fetchProdutos();
        setNewMovimentacao({ ProdutoId: "", Quantidade: 0, Tipo: "entrada", Data: new Date().toISOString() });
        alert("Movimentação adicionada com sucesso!");
      } catch (error) {
        console.error("Erro ao adicionar movimentação", error);
      }
    } else {
      alert("Senha incorreta!");
    }
  };

  const updateProdutoEstoque = async (movimentacao) => {
    const produto = produtos.find(p => p.id === parseInt(movimentacao.ProdutoId));
    if (produto) {
      const novaQuantidade = movimentacao.Tipo === "entrada"
        ? produto.estoqueAtual + parseInt(movimentacao.Quantidade)
        : produto.estoqueAtual - parseInt(movimentacao.Quantidade);

      await updateProduto(produto.id, { ...produto, EstoqueAtual: novaQuantidade });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovimentacao({ ...newMovimentacao, [name]: value });
  };

  const handleModalSearch = (e) => {
    setModalSearchTerm(e.target.value);
  };

  const filteredMovimentacoes = movimentacoes.filter(movimentacao =>
    movimentacao.data && movimentacao.data.includes(modalSearchTerm)
  );

  return (
    <>
      <Navbar />
      <Header>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom>
            Movimentações
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2 }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>ID do Produto</InputLabel>
              <Select
                name="ProdutoId"
                value={newMovimentacao.ProdutoId}
                onChange={handleChange}
                label="ID do Produto"
                style={{ backgroundColor: 'white' }}
              >
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantidade"
              variant="outlined"
              name="Quantidade"
              type="number"
              value={newMovimentacao.Quantidade}
              onChange={handleChange}
              fullWidth
              InputProps={{
                style: { backgroundColor: 'white' },
              }}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="Tipo"
                value={newMovimentacao.Tipo}
                onChange={handleChange}
                label="Tipo"
                style={{ backgroundColor: 'white' }}
              >
                <MenuItem value="entrada">Entrada</MenuItem>
                <MenuItem value="saida">Saída</MenuItem>
              </Select>
            </FormControl>
            <Button startIcon={<AddIcon/>} type="submit" variant="contained" color="primary">
              Adicionar Movimentação
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button startIcon={<HistoryIcon/>} onClick={() => setModalOpen(true)} variant="contained" color="primary" sx={{ mt: 2 }}>
              Ver Movimentações
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
            Lista de Movimentações
          </Typography>
          <TextField
            label="Buscar Movimentação por Mês"
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
                  <TableCell>ID do Produto</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovimentacoes.map((movimentacao) => (
                  <TableRow key={movimentacao.id}>
                    <TableCell>{movimentacao.produtoId}</TableCell>
                    <TableCell>{movimentacao.quantidade}</TableCell>
                    <TableCell>{movimentacao.tipo}</TableCell>
                    <TableCell>{movimentacao.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </>
  );
};

export default Movimentacao;