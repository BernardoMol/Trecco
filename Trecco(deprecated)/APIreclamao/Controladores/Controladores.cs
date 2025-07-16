using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using bibliotecaReclamao.Banco.Conexao;
using MySql.Data.MySqlClient;
using bibliotecaReclamao.Banco.Modelos;

namespace APIreclamao.Controladores
{

    [ApiController]
    [Route("[controller]")]
    public class Controladores : Controller
    {
        [HttpGet("todas")]
        public IActionResult ObterTodas()
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("SELECT * FROM Reclamacao", conn);
                using var reader = comando.ExecuteReader();

                var reclamacoes = new List<object>();

                // Se eu nao comentar, ele pula a linha do reader, ai perco o primeiro dado
                //Console.Write("\n READER -->" + reader);
                //Console.Write("\n READER LIDO! -->" + reader.Read());

                // O exemplo abaixo trasnforma o conteudo em um dicionario e o exibe para sabermos o formato dos dados

                // var reclamacoes = new List<Dictionary<string, object>>();

                // while (reader.Read())
                // {
                //     var linha = new Dictionary<string, object>();

                //     for (int i = 0; i < reader.FieldCount; i++)
                //     {
                //         string nomeColuna = reader.GetName(i);
                //         object valor = reader.GetValue(i);

                //         linha[nomeColuna] = valor;
                //     }

                //     reclamacoes.Add(linha);
                // }

                // // Exibir resultado
                // foreach (var linha in reclamacoes)
                // {
                //     Console.WriteLine("LINHA:");
                //     foreach (var kvp in linha)
                //     {
                //         Console.WriteLine($"{kvp.Key}: {kvp.Value}");
                //     }
                // }

                while (reader.Read())
                {
                    reclamacoes.Add(new
                    {
                        id = reader["IdReclamacao"],
                        conteudo = reader["ConteudoReclamacao"],
                        dataCriacao = reader["DataCriacaoReclamacao"],
                        UsuarioId = reader["UsuarioId"] 
                    });
                }

                return Ok(reclamacoes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

        [HttpGet("uma/{idBusca}")]
        public IActionResult ObterUma(int idBusca)
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("SELECT IdReclamacao, ConteudoReclamacao, DataCriacaoReclamacao FROM Reclamacao WHERE IdReclamacao = @idBusca;", conn);
                comando.Parameters.AddWithValue("@idBusca", idBusca);
                using var reader = comando.ExecuteReader();

                if (reader.Read()) // Tenta ler a primeira (e única) linha de resultado
                {
                    var reclamacao = new
                    {
                        id = reader["IdReclamacao"],
                        conteudo = reader["ConteudoReclamacao"],
                        dataCriacao = reader["DataCriacaoReclamacao"],
                        // UsuarioId = reader["UsuarioId"] // podia ter pelgo pela query, mas nao quis!!!
                    };

                    return Ok(reclamacao);
                }
                else
                {
                    // Se reader.Read() retornar false, significa que não encontrou a reclamação
                    return NotFound($"Reclamação com ID {idBusca} não encontrada.");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

        [HttpPost("adiciona/conteudo={conteudo}/data={data}/UsuarioId={UsuarioId}")]
        public IActionResult AdicionarUm(int idBusca, string conteudo, string data,int UsuarioId)
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("INSERT INTO Reclamacao (ConteudoReclamacao, DataCriacaoReclamacao, UsuarioId) VALUES (@conteudo, @DATA, @UsuarioId);", conn);
                // comando.Parameters.AddWithValue("@idBusca", idBusca); // id adiconado automaticamente
                comando.Parameters.AddWithValue("@conteudo", conteudo);
                comando.Parameters.AddWithValue("@DATA", data);
                comando.Parameters.AddWithValue("@UsuarioId", UsuarioId);

                comando.ExecuteNonQuery(); // (ExecuteNonQuery() para INSERT, UPDATE, DELETE)

                return Ok("ADICIONADO");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

        [HttpPut("atualiza/{idBusca}/conteudo={conteudo}/UsuarioId={UsuarioId}")]
        public IActionResult AtualizaUma(int idBusca, string conteudo, int UsuarioId)
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("UPDATE Reclamacao SET ConteudoReclamacao = @novoConteudo, UsuarioId = @novoUsuarioId WHERE IdReclamacao = @idBusca;", conn);
                comando.Parameters.AddWithValue("@idBusca", idBusca);
                comando.Parameters.AddWithValue("@novoConteudo", conteudo);
                comando.Parameters.AddWithValue("@novoUsuarioId", UsuarioId);

                comando.ExecuteNonQuery(); // (ExecuteNonQuery() para INSERT, UPDATE, DELETE)

                // using var reader = comando.ExecuteReader(); // NÃO FNCIONA PARA UPDATE PORQUE ELE NAO RETORNA DADOS PARA A LEITURA
                // var reclamacaoAlterada = new
                // {
                //     id = reader["id"],
                //     conteudo = reader["conteudo"],
                //     Reclamacao = reader["UsuarioId"] // nao, nao tem data na tabbela, é so pra vizualizar os dados mesmo
                // };

                return Ok("ALTERADO");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

        [HttpDelete("deletarUma/{idBusca}")]
        public IActionResult DeletarUma(int idBusca)
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("DELETE FROM Reclamacao WHERE IdReclamacao = @idBusca", conn);
                comando.Parameters.AddWithValue("@idBusca", idBusca);

                comando.ExecuteNonQuery(); // (ExecuteNonQuery() para INSERT, UPDATE, DELETE)

                return Ok("DELETADO");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

        // // ====PEGANDO DADOS PELO CORPO (ui! selvagem!)================
        // // PEGANDO DADOS PELO CORPO (ui! selvagem!) 
        // // ============================================================

        // using bibliotecaReclamao.Banco.Modelos; // comentado porque ja eta la em cima
        // apenas para referenca do objeto sem ter que ir em outro arquivo
        // namespace bibliotecaReclamao.Banco.Modelos
        // {
        //     public class Reclamacao
        //     {
        //         public int IdReclamacao { get; set; }
        //         public string ConteudoReclamacao { get; set; }
        //         public DateTime dataCriacao { get; set; }

        //         // Chave estrangeira para ligar ao Usuario
        //         public int UsuarioId { get; set; }

        //         // Propriedade de navegação para representar o Usuario associado
        //         public Usuario UsuarioAssociado { get; set; } 
        //     }
        // }

        [HttpPost("adicionaUmPeloBody")]
        public IActionResult AdicionarUmPeloBody([FromBody] ReclamacaoSimples novaReclamacao)
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("INSERT INTO Reclamacao (ConteudoReclamacao, DataCriacaoReclamacao, UsuarioId) VALUES (@conteudo, @data, @UsuarioId);", conn);
                // comando.Parameters.AddWithValue("@idBusca", idBusca); // id adiconado automaticamente
                comando.Parameters.AddWithValue("@conteudo", novaReclamacao.ConteudoReclamacao);
                comando.Parameters.AddWithValue("@data", novaReclamacao.DataCriacaoReclamacao);
                comando.Parameters.AddWithValue("@UsuarioId", novaReclamacao.UsuarioId);

                comando.ExecuteNonQuery(); // (ExecuteNonQuery() para INSERT, UPDATE, DELETE)

                return Ok("ADICIONADO PELO BODY");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

        [HttpPut("atualizaPeloBody")]
        public IActionResult AtualizaPeloBody([FromBody] ReclamacaoSimples ReclamacaoATT)
        {
            try
            {
                var conexao = new Conexao();
                using var conn = conexao.Conectar();
                conn.Open();

                var comando = new MySqlCommand("UPDATE Reclamacao SET ConteudoReclamacao = @novoConteudo, DataCriacaoReclamacao = @novaData WHERE IdReclamacao = @idBusca;", conn);
                comando.Parameters.AddWithValue("@idBusca", ReclamacaoATT.id);
                comando.Parameters.AddWithValue("@novoConteudo", ReclamacaoATT.ConteudoReclamacao);
                comando.Parameters.AddWithValue("@novaData", ReclamacaoATT.DataCriacaoReclamacao);

                comando.ExecuteNonQuery();

                return Ok("ATUALIZADO PELO BODY");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter dados: {ex.Message}");
            }
        }

    }
}