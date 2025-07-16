using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bibliotecaReclamao.Banco.Conexao;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIreclamao.Controladores
{
    [ApiController]
    [Route("TESTEconexaoCONTEXTO")]
    public class TesteConexaoContexto : ControllerBase
    {
        private readonly ConexaoContexto _contexto;
        public TesteConexaoContexto(ConexaoContexto contexto)
        {
            _contexto = contexto;
        }

        [HttpGet("ping")]
        public async Task<IActionResult> TestandoConexao()
        {
            try
            {
                // Tenta acessar o banco de dados com um comando simples
                await _contexto.Database.ExecuteSqlRawAsync("SELECT 1");

                return Ok("✅ Conexão com o banco de dados bem-sucedida!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Erro ao conectar: {ex.Message}");
            }
        }

    }
}