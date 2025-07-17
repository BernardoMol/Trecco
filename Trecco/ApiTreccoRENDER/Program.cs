
using Microsoft.EntityFrameworkCore;
using BibliotecaSUPABASE.Banco.Conexao;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;
using ApiTreccoRENDER.Services;

var key = "minhaCHAVEsecretaTEMqueSERgrandeSEnaoDApauNAautenticacaoNOlogin2025!@!";

var builder = WebApplication.CreateBuilder(args);
// CONEXÃO COM O BANCO
/* postgresql://postgres:[YOUR-PASSWORD]@db.dswzcnohgqeudhicxhen.supabase.co:5432/postgres */
// var connectionString = "Host=db.dswzcnohgqeudhicxhen.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=DBportfolio1333!@;SslMode=Require";
// var connectionString = "Host=db.dswzcnohgqeudhicxhen.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=DBportfolio1333!@;SslMode=Require;Keepalive=30;";
var connectionString = "Host=aws-0-sa-east-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.dswzcnohgqeudhicxhen;Password=DBportfolio1333!@;SslMode=Require";
builder.Services.AddDbContext<ConexaoContexto>(options =>
    options.UseNpgsql(connectionString)
);

// CONTROLADORES
builder.Services.AddControllers().AddNewtonsoftJson(); // Necessário para suportar JsonPatchDocument
// SWAGGER
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(); // swagger sem autenticação JWT
// swagger com autenticação JWT
builder.Services.AddSwaggerGen(options =>
{
    // Adiciona descrições e títulos para a UI do Swagger (opcional, mas bom)
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Minha API de Tarefas e Autenticação",
        Version = "v1"
    });

    // 1 - Define o esquema de segurança JWT Bearer
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Autenticação JWT usando o esquema Bearer. \r\n\r\n Insira 'Bearer' [espaço] e o seu token no campo abaixo.\r\n\r\nExemplo: \"Bearer 12345abcdef\""
    });

    // 2 - Faz com que o Swagger UI use a definição de segurança acima
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Em produção, coloque como true
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
    };
});

// CLOIDNARY (armazenar imagens)
builder.Services.AddSingleton(new Cloudinary(new Account(
    "dnc4yg4wz",
    "173547858791163", 
    "yckT9w5op_8hpCXNU9GZXr5pMa8"
)));

// O CORS CHATO PRA CARAMBAAAAAAAAAA
builder.Services.AddCors(options =>
{

    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("https://trecco.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });


    options.AddPolicy("Desenvolvimento", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddControllers();
// EMAIL
builder.Services.AddScoped<EmailService>();

// ==============================BUILDANDO O APP================================================
var app = builder.Build();

app.UseCors();            
app.UseHttpsRedirection();

app.UseAuthentication();   
app.UseAuthorization();    

app.MapControllers();      

app.UseSwagger();  
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API v1");
    c.RoutePrefix = string.Empty;
});

app.Run();

// // Função auxiliar para testar conexão
// static void TestarConexaoBanco(IServiceProvider services)
// {
//     using var scope = services.CreateScope();
//     var db = scope.ServiceProvider.GetRequiredService<ConexaoContexto>();

//     try
//     {
//         var conectado = db.Database.CanConnectAsync().GetAwaiter().GetResult();
//         Console.WriteLine(conectado
//             ? "✅ Conexão com o banco de dados bem-sucedida."
//             : "❌ Falha na conexão com o banco de dados.");
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"❌ Erro ao conectar no banco: {ex.Message}");
//     }
// }