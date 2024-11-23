using backend.Database;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options => {
   options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
   }); 
});

// Registra o contexto do Entity Framework com sqlite 3
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registra os serviços (pasta services)
builder.Services.AddScoped<CategoriaService>();
builder.Services.AddScoped<ProdutoService>();
builder.Services.AddScoped<MovimentacaoService>();
builder.Services.AddScoped<UsuarioService>();

// Registra os controladores (pasta controllers), evitando referência cíclicas (um referenciando o outro)
builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(options =>
 {
     options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
     options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
 });

var app = builder.Build();

// Endpoint para inserção de dados na tabela "produtos" do banco de dados [TESTANDO CONEXÃO COM DATABASE] [Passar para 'ProdutosController']
// app.MapPost("/api/produtos", async (Produto produto, AppDbContext dbContext) =>
// {
//     dbContext.Produtos.Add(produto);
//     await dbContext.SaveChangesAsync();
//     return Results.Created($"/api/produtos/{produto.Id}", produto);
// });

app.UseCors("AllowFrontend");
app.MapControllers();
app.Run();
