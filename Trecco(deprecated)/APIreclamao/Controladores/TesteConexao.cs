using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MySql.Data.MySqlClient; // permite a conexão com o mysql
using bibliotecaReclamao.Banco.Conexao;

namespace APIreclamao.Controladores
{
    [ApiController]
    [Route("[controller]")]
    public class TesteConexao : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult TestandoConexao()
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();
                return Ok("✅ Conexão com o banco de dados bem-sucedida!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Erro ao conectar: {ex.Message}");
            }
        }
    }
}