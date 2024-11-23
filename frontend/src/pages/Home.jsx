import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";
import { getAllMovimentacoes } from "../services/movimentacaoService";
import { getAllProdutos } from "../services/produtoService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper, Button, Popover, Grid, IconButton, Select, MenuItem } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import TrophyIcon from "@mui/icons-material/EmojiEvents";

const Home = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [vendasAnchorEl, setVendasAnchorEl] = useState(null);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
  const [valorTotalVendas, setValorTotalVendas] = useState(0);

  useEffect(() => {
    fetchMovimentacoes();
    fetchProdutos();
  }, []);

  useEffect(() => {
    processarProdutosMaisVendidos(mesSelecionado);
  }, [movimentacoes, mesSelecionado]);

  const fetchMovimentacoes = async () => {
    const data = await getAllMovimentacoes();
    setMovimentacoes(data.$values || []);
    processChartData(data.$values || []);
  };

  const fetchProdutos = async () => {
    const data = await getAllProdutos();
    setProdutos(data.$values || []);
  };

  const processChartData = (movimentacoes) => {
    const movimentacoesPorMes = Array(12)
      .fill(0)
      .map((_, index) => ({
        mes: new Date(0, index).toLocaleString("default", { month: "short" }),
        saida: 0,
      }));

    movimentacoes.forEach((movimentacao) => {
      const mes = new Date(movimentacao.data).getMonth();
      if (movimentacao.tipo === "saida") {
        movimentacoesPorMes[mes].saida += movimentacao.quantidade;
      }
    });

    setChartData(movimentacoesPorMes);
  };

  const processarProdutosMaisVendidos = (mes) => {
    const vendasPorProduto = {};
    let totalVendas = 0;

    movimentacoes.forEach((movimentacao) => {
      const mesMovimentacao = new Date(movimentacao.data).getMonth();
      if (movimentacao.tipo === "saida" && mesMovimentacao === mes) {
        if (!vendasPorProduto[movimentacao.produtoId]) {
          vendasPorProduto[movimentacao.produtoId] = 0;
        }
        vendasPorProduto[movimentacao.produtoId] += movimentacao.quantidade;
      }
    });

    const produtosVendidos = produtos.map((produto) => {
      const vendas = vendasPorProduto[produto.id] || 0;
      const valorVendas = vendas * produto.preco;
      totalVendas += valorVendas;
      return {
        ...produto,
        vendas,
        valorVendas,
      };
    });

    produtosVendidos.sort((a, b) => b.vendas - a.vendas);
    setProdutosMaisVendidos(produtosVendidos);
    setValorTotalVendas(totalVendas);
  };

  const getBorderColor = (estoqueAtual, estoqueMinimo) => {
    if (estoqueAtual === 0) {
      return "red"; // Vermelho para itens sem estoque
    } else if (estoqueAtual <= estoqueMinimo) {
      return "yellow"; // Amarelo para estoques abaixo do mínimo
    } else {
      return "green"; // Verde para estoques acima do mínimo
    }
  };

  const getBackgroundColor = (estoqueAtual, estoqueMinimo) => {
    if (estoqueAtual === 0) {
      return "rgba(255, 0, 0, 0.3)"; // Fundo vermelho claro para sem estoque
    } else if (estoqueAtual <= estoqueMinimo) {
      return "rgba(255, 255, 0, 0.3)"; // Fundo amarelo claro para estoques abaixo do mínimo
    } else {
      return "rgba(0, 255, 0, 0.3)"; // Fundo verde claro para estoques acima do mínimo
    }
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleVendasClick = (event) => {
    setVendasAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setVendasAnchorEl(null);
  };

  const handleMesChange = (event) => {
    setMesSelecionado(event.target.value);
  };

  const open = Boolean(anchorEl);
  const vendasOpen = Boolean(vendasAnchorEl);
  const id = open ? "simple-popover" : undefined;
  const vendasId = vendasOpen ? "vendas-popover" : undefined;

  return (
    <>
      <Navbar />
      <Header>
        <h1>Gráfico de vendas do mês</h1>
        <ResponsiveContainer
          width="80%"
          height={400}
          style={{ marginTop: "25px" }}
        >
          <LineChart
            data={chartData}
            margin={{
              top: 25,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
          >
            <CartesianGrid stroke="#000000" strokeDasharray="1 1" />
            <XAxis dataKey="mes" stroke="#000000" />
            <YAxis stroke="#000000" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="saida"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ListIcon />}
            onClick={handleClick}
            variant="contained"
            color="primary"
          >
            Ver Estoque
          </Button>
          <Button
            startIcon={<ListIcon />}
            onClick={handleVendasClick}
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
          >
            Vendas
          </Button>
        </Box>
      </Header>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            width: "800px", // Aumenta largura
            maxHeight: "300px", // Diminui altura
            overflowY: "auto",
            bgcolor: "#f5f5f5",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "black", mb: 2 }}
          >
            Estoques Em Alerta
          </Typography>
          <Grid container spacing={2}>
            {produtos
              .filter(
                (produto) =>
                  produto.estoqueAtual <= produto.estoqueMinimo + 5
              )
              .map((produto) => {
                const falta = Math.max(
                  (produto.estoqueMinimo - produto.estoqueAtual) * (-1)
                );
                return (
                  <Grid item xs={4} key={produto.id}>
                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        border: `2px solid ${getBorderColor(
                          produto.estoqueAtual,
                          produto.estoqueMinimo
                        )}`,
                        backgroundColor: getBackgroundColor(
                          produto.estoqueAtual,
                          produto.estoqueMinimo
                        ),
                        animation: "none", // Remove a animação de piscar
                      }}
                    >
                      <Typography variant="h6" component="h3">
                        {produto.nome}
                      </Typography>
                      <Typography>
                        Quantidade Atual: {produto.estoqueAtual}
                      </Typography>
                      <Typography>
                        Quantidade Mínima: {produto.estoqueMinimo}
                      </Typography>
                      <Typography style={{ fontSize: '20px' }}>
                        Falta para atingir a quantidade mínima: {falta}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Popover>

      <Popover
        id={vendasId}
        open={vendasOpen}
        anchorEl={vendasAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            width: "900px",
            maxHeight: "600px",
            overflowY: "auto",
            bgcolor: "#f5f5f5",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "black", mb: 2 }}
          >
            Produtos Mais Vendidos - Valor Total: R$ {valorTotalVendas.toFixed(2)}
          </Typography>
          <Select
            value={mesSelecionado}
            onChange={handleMesChange}
            sx={{ mb: 2 }}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <MenuItem key={index} value={index}>
                {new Date(0, index).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
          <Grid container spacing={2}>
            {produtosMaisVendidos.map((produto, index) => (
              <Grid item xs={4} key={produto.id}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    {produto.nome}
                    {index < 3 && (
                      <TrophyIcon sx={{ color: "gold", ml: 1 }} />
                    )}
                  </Typography>
                  <Typography>Vendas: {produto.vendas}</Typography>
                  <Typography>Valor Arrecadado: R$ {produto.valorVendas.toFixed(2)}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  );
};

export default Home;