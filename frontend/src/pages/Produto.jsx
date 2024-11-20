import React, { useEffect, useState } from "react";
import {
  getAllProdutos,
  createProduto,
  deleteProduto,
} from "../services/produtoService";
import { Navbar } from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header";

const Produto = () => {
  const [produtos, setProdutos] = useState([]);
  const [newProduto, setNewProduto] = useState({
    Codigo: "",
    Nome: "",
    Descricao: "",
    Preco: 0,
    EstoqueAtual: 0,
    EstoqueMinimo: 0,
    CategoriaId: 1,
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const data = await getAllProdutos();
      setProdutos(data);
    } catch (erro) {
      console.error("Erro ao buscar produtos", erro);
      setProdutos([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduto(newProduto);
    fetchProdutos();
    setNewProduto({
      Codigo: "",
      Nome: "",
      Descricao: "",
      Preco: 0,
      EstoqueAtual: 0,
      EstoqueMinimo: 0,
      CategoriaId: 1,
    });
  };

  const handleDelete = async (id) => {
    await deleteProduto(id);
    fetchProdutos();
  };

  return (
    <>
      <Navbar />
      <Header>
        <h1>Produtos</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Código"
            value={newProduto.Codigo}
            onChange={(e) =>
              setNewProduto({ ...newProduto, Codigo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Nome"
            value={newProduto.Nome}
            onChange={(e) =>
              setNewProduto({ ...newProduto, Nome: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newProduto.Descricao}
            onChange={(e) =>
              setNewProduto({ ...newProduto, Descricao: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Preço"
            value={newProduto.Preco}
            onChange={(e) =>
              setNewProduto({ ...newProduto, Preco: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Estoque Atual"
            value={newProduto.EstoqueAtual}
            onChange={(e) =>
              setNewProduto({ ...newProduto, EstoqueAtual: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Estoque Mínimo"
            value={newProduto.EstoqueMinimo}
            onChange={(e) =>
              setNewProduto({ ...newProduto, EstoqueMinimo: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="ID Categoria"
            value={newProduto.CategoriaId}
            onChange={(e) =>
              setNewProduto({ ...newProduto, CategoriaId: e.target.value })
            }
          />
          <button type="submit">Adicionar Produto</button>
        </form>
        <ul>
          {Array.isArray(produtos) &&
            produtos.map((produto) => (
              <li key={produto.Id}>
                {produto.Nome}
                <button onClick={() => handleDelete(produto.Id)}>
                  Excluir
                </button>
              </li>
            ))}
        </ul>
      </Header>
    </>
  );
};

export default Produto;
