import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Header } from "../../components/Header/Header";
import { getAllMovimentacoes } from "../../services/movimentacaoService";
import { getAllProdutos } from "../../services/produtoService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

const Home = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());

  useEffect(() => {
    fetchMovimentacoes();
    fetchProdutos();
  }, []);

  useEffect(() => {
    processChartData(movimentacoes);
  }, [movimentacoes]);

  const fetchMovimentacoes = async () => {
    const data = await getAllMovimentacoes();
    setMovimentacoes(data.$values || []);
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

  const getBorderColor = (estoqueAtual, estoqueMinimo) => {
    if (estoqueAtual === 0) {
      return "red";
    } else if (estoqueAtual <= estoqueMinimo) {
      return "yellow";
    } else {
      return "green";
    }
  };

  const getBackgroundColor = (estoqueAtual, estoqueMinimo) => {
    if (estoqueAtual === 0) {
      return "rgba(255, 0, 0, 0.3)";
    } else if (estoqueAtual <= estoqueMinimo) {
      return "rgba(255, 255, 0, 0.3)";
    } else {
      return "rgba(0, 255, 0, 0.3)";
    }
  };

  return (
    <Box sx={{ backgroundColor: "#121214", minHeight: "100vh", color: "#fff", padding: "20px" }}>
      <Navbar />
      <Header>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Gráfico de Vendas do Mês
        </Typography>
        <ResponsiveContainer
          width="80%"
          height={400}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "25px auto", 
            padding: "20px",
            backgroundColor: "#f8f9fa", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
          }}
        >
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
            }}
          >
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis
              dataKey="mes"
              stroke="#5f6368"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            />
            <YAxis stroke="#5f6368" style={{ fontSize: "14px", fontWeight: "bold" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Line
              type="monotone"
              dataKey="saida"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
              strokeWidth={3}
              dot={{ r: 5 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Estoques em Alerta */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Estoques em Alerta
          </Typography>
          <Grid container spacing={3}>
            {produtos
              .filter((produto) => produto.estoqueAtual <= produto.estoqueMinimo + 5)
              .map((produto) => {
                const falta = Math.max(
                  (produto.estoqueMinimo - produto.estoqueAtual) * -1
                );
                return (
                  <Grid item xs={12} sm={6} md={4} key={produto.id}>
                    <Paper
                      sx={{
                        p: 2,
                        border: `2px solid ${getBorderColor(
                          produto.estoqueAtual,
                          produto.estoqueMinimo
                        )}`,
                        backgroundColor: getBackgroundColor(
                          produto.estoqueAtual,
                          produto.estoqueMinimo
                        ),
                        borderRadius: "10px",
                      }}
                    >
                      <Typography variant="h6">{produto.nome}</Typography>
                      <Typography>
                        Quantidade Atual: {produto.estoqueAtual}
                      </Typography>
                      <Typography>
                        Estoque Mínimo: {produto.estoqueMinimo}
                      </Typography>
                      <Typography>
                        Faltam {falta} para atingir o estoque mínimo.
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
    </Header>

      
    </Box >
  );
};

export default Home;
