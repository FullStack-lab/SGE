namespace backend.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public decimal Preco { get; set; }
        public int EstoqueAtual { get; set; }
        public int EstoqueMinimo { get; set; }

        // Relacionamento com tabela categoria
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }

    }
}