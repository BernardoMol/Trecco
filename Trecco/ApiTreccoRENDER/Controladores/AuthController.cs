using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using BibliotecaSUPABASE.Banco.Conexao;
using BibliotecaSUPABASE.Banco.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ApiTreccoRENDER.Controladores
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        // Propriedades
        private readonly ConexaoContexto _context;
        // Construtor
        public AuthController(ConexaoContexto context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            // 1 - Pego o usuario
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.EmailUsuario == request.Email);
            // Vejo se colocou o usuario e se a senha bate
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaUsuario)) 
            {
                return Unauthorized("Email ou senha inválidos.");
            }

            // 2 - GERO O TOKEN com a chave do program.cs
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("minhaCHAVEsecretaTEMqueSERgrandeSEnaoDApauNAautenticacaoNOlogin2025!@!");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Subject contém as informações (claims) que você quer armazenar no token
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, usuario.NomeUsuario),
                new Claim(ClaimTypes.Email, usuario.EmailUsuario),
                // Você pode adicionar qualquer outra informação, como o ID do usuário
                new Claim("UsuarioId", usuario.UsuarioId.ToString())
            }),
                // Define o tempo de expiração do token
                Expires = DateTime.UtcNow.AddHours(2),
                // Define as credenciais de assinatura, usando o algoritmo HMAC-SHA256
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // 3. Retorne o token para o cliente
            return Ok(new { Token = tokenString });
        }
    }
}