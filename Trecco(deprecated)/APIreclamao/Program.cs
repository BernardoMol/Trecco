using bibliotecaReclamao.Banco.Conexao;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using bibliotecaReclamao.Banco.Modelos; // Garanta que este using esteja correto
using Microsoft.AspNetCore.Identity.UI.Services; // Necessário para IEmailSender
using System.Threading.Tasks; // Necessário para Task
using System; // Necessário para Console
//configurando
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ConexaoContexto>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// **2. Configuração da Autenticação JWT**
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Valida o emissor do token
            ValidateAudience = true, // Valida o público-alvo do token
            ValidateLifetime = true, // Valida o tempo de expiração do token
            ValidateIssuerSigningKey = true, // Valida a chave de assinatura do token
            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Pega o emissor do appsettings.json
            ValidAudience = builder.Configuration["Jwt:Audience"], // Pega o público-alvo do appsettings.json
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Pega a chave secreta do appsettings.json
        };
    });

// ** Configuração do CORS **
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowSpecificOrigin",
//         builder => builder.WithOrigins("http://localhost:3000", 
//                                       "https://trecco.vercel.app", 
//                                       "https://trecco-fdfdp35a3-bernardo-mols-projects.vercel.app") // <<<<<< Substitua pela URL do seu frontend React
//                           .AllowAnyHeader()
//                           .AllowAnyMethod());
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});


// **3. Habilita o Serviço de Autorização**
builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagens_perfis")),
    RequestPath = "/imagens_perfis"
});

app.UseRouting();
app.UseCors("AllowAll"); // tem que estar antes do UseAuthentication!

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();