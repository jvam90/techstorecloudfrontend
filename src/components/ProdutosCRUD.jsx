import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import axios from "axios";

export default function ProdutosCRUD() {
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    categoria: "",
    estoque: "",
  });
  const [produtoEditando, setProdutoEditando] = useState({});

  const API_BASE_URL =
    "https://techstorecloud20250922104235-bkhph0e7asfpcze5.brazilsouth-01.azurewebsites.net/api/";

  async function getProdutos() {
    const produtosIniciais = await axios.get(`${API_BASE_URL}/produtos`);
    console.log(produtosIniciais.data);
    setProdutos(produtosIniciais.data);
  }
  // Carregar produtos iniciais
  useEffect(() => {
    getProdutos();
  }, []);

  // Adicionar novo produto
  const adicionarProduto = async () => {
    if (!novoProduto.nome.trim()) return;

    const produto = {
      id: Date.now(),
      nome: novoProduto.nome,
      preco: novoProduto.preco || "0",
      categoria: novoProduto.categoria || "Geral",
      estoque: novoProduto.estoque || "0",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/produtos`, produto);
      setNovoProduto({ nome: "", preco: "", categoria: "", estoque: "" });
      getProdutos();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  // Iniciar edição
  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setProdutoEditando({ ...produto });
  };

  // Salvar edição
  const salvarEdicao = () => {
    setProdutos(
      produtos.map((p) => (p.id === editandoId ? { ...produtoEditando } : p))
    );
    setEditandoId(null);
    setProdutoEditando({});
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
    setProdutoEditando({});
  };

  // Excluir produto
  const excluirProduto = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/produtos/${id}`);
      getProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      throw error;
    }
  };

  // Atualizar campo do produto em edição
  const atualizarCampoEdicao = (campo, valor) => {
    setProdutoEditando({ ...produtoEditando, [campo]: valor });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <p className="text-blue-100 mt-2">CRUD para produtos</p>
          </div>

          {/* Formulário de Adição */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Plus className="mr-2" size={20} />
              Adicionar Novo Produto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nome do produto"
                value={novoProduto.nome}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, nome: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Preço (R$)"
                step="0.01"
                value={novoProduto.preco}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, preco: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Categoria"
                value={novoProduto.categoria}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, categoria: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Estoque"
                value={novoProduto.estoque}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, estoque: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={adicionarProduto}
              className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center font-medium"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Produto
            </button>
          </div>

          {/* Lista de Produtos */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Produtos Cadastrados ({produtos.length})
            </h2>

            {produtos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  Nenhum produto cadastrado
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  Adicione seu primeiro produto usando o formulário acima
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produtos?.map((produto) => (
                      <tr
                        key={produto.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{produto.id}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editandoId === produto.id ? (
                            <input
                              type="text"
                              value={produtoEditando.nome}
                              onChange={(e) =>
                                atualizarCampoEdicao("nome", e.target.value)
                              }
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {produto.nome}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editandoId === produto.id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={produtoEditando.preco}
                              onChange={(e) =>
                                atualizarCampoEdicao(
                                  "preco",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              R$ {produto.preco}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editandoId === produto.id ? (
                            <input
                              type="text"
                              value={produtoEditando.categoria}
                              onChange={(e) =>
                                atualizarCampoEdicao(
                                  "categoria",
                                  e.target.value
                                )
                              }
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                            />
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {produto.categoria}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editandoId === produto.id ? (
                            <input
                              type="number"
                              value={produtoEditando.estoque}
                              onChange={(e) =>
                                atualizarCampoEdicao(
                                  "estoque",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  produto.estoque > 10
                                    ? "bg-green-100 text-green-800"
                                    : produto.estoque > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {produto.estoque} unidades
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editandoId === produto.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={salvarEdicao}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                title="Salvar"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={cancelarEdicao}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                                title="Cancelar"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => excluirProduto(produto.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
