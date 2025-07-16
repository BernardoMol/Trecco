using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using bibliotecaReclamao.Banco.Conexao;
using bibliotecaReclamao.Banco.DTOs;
using bibliotecaReclamao.Banco.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace APIreclamao.Controladores
{
    [ApiController]
    [Route("[controller]")]
    public class ControladorContexto : ControllerBase
    {
        // Propriedades
        private readonly ConexaoContexto _context;
        // Construtor
        public ControladorContexto(ConexaoContexto context)
        {
            _context = context;
        }

        // Métodos
        [HttpGet("CTX_todos")]
        public async Task<ActionResult<List<Reclamacao>>> GetReclamacoes()
        {
            var lista = await _context.Reclamacao
            .Include(r => r.UsuarioAssociado) // garante que o usuário seja carregado
            .Select(r => new ReclamacaoDTO
            {
                IdReclamacao = r.IdReclamacao,
                ConteudoReclamacao = r.ConteudoReclamacao,
                DataCriacaoReclamacao = r.DataCriacaoReclamacao,
                UsuarioDTO = new UsuarioDTO
                {
                    UsuarioId = r.UsuarioAssociado.UsuarioId,
                    NomeUsuario = r.UsuarioAssociado.NomeUsuario,
                    EmailUsuario = r.UsuarioAssociado.EmailUsuario
                    // Reclamacoes = null, nao quero saber as outras reclamacoes dele, entao vem NULO
                    // podia ter feito um dto a mais para o USUARIO, 
                    // para essa informanão nem aparecer como nula na resposta,
                    //  mas achei que n precisava
                }
            })
            .ToListAsync();
            return Ok(lista);
        }

        [HttpGet("CTX_pegarUM/{id}")]
        public async Task<ActionResult<Reclamacao>> GetReclamacoes(int id)
        {

            var objetoUnico = await _context.Reclamacao.Include(r => r.UsuarioAssociado)
                                                        .Where(r => r.IdReclamacao == id)
                                                        .Select(r => new ReclamacaoDTO
                                                        {
                                                            IdReclamacao = r.IdReclamacao,
                                                            ConteudoReclamacao = r.ConteudoReclamacao,
                                                            DataCriacaoReclamacao = r.DataCriacaoReclamacao,
                                                            UsuarioDTO = new UsuarioDTO
                                                            {
                                                                UsuarioId = r.UsuarioAssociado.UsuarioId,
                                                                NomeUsuario = r.UsuarioAssociado.NomeUsuario,
                                                                EmailUsuario = r.UsuarioAssociado.EmailUsuario
                                                                // Reclamacoes = null por padrão, ou omitido
                                                            }
                                                        })
                                                        .FirstOrDefaultAsync();
            return Ok(objetoUnico);
            // var objetoUnico = await _context.Reclamacao.FirstOrDefaultAsync(r => r.IdReclamacao == id);
            // return Ok(objetoUnico);
        }

        [HttpPost("CTX_adicionar")]
        public async Task<ActionResult<Reclamacao>> PostReclamacao([FromBody] Reclamacao novaReclamacao)
        {
            novaReclamacao.DataCriacaoReclamacao = DateTime.Now;
            _context.Reclamacao.Add(novaReclamacao);
            await _context.SaveChangesAsync();
            return StatusCode(201, "ADICIONADO");
            // OU, se quiser que retorne o objeto criado no banco:
            // return CreatedAtAction(nameof(GetReclamacoes), new { id = novaReclamacao.IdReclamacao }, novaReclamacao);
        }

        [HttpPut("CTX_alterar/id={id}")]
        public async Task<ActionResult<Reclamacao>> PutReclamacao(int id, [FromBody] Reclamacao novaReclamacao)
        {
            var reclamacaoExistente = await _context.Reclamacao.FindAsync(id);
            if (reclamacaoExistente == null)
            {
                return NotFound(); // 404 se não encontrar
            }
            reclamacaoExistente.ConteudoReclamacao = novaReclamacao.ConteudoReclamacao;
            reclamacaoExistente.DataCriacaoReclamacao = DateTime.Now;
            reclamacaoExistente.UsuarioId = novaReclamacao.UsuarioId;

            await _context.SaveChangesAsync();
            // return Ok("\n Alterado \n" + reclamacaoExistente);
            return Ok(new
            {
                mensagem = "Alterado com sucesso",
                reclamacao = reclamacaoExistente
            });

        }

        [HttpDelete("CTX_deletar/id={id}")]
        public async Task<ActionResult<Reclamacao>> DeleteReclamacao(int id)
        {
            var reclamacaoExistente = await _context.Reclamacao.FindAsync(id);
            if (reclamacaoExistente == null)
            {
                return NotFound(); // 404 se não encontrar
            }
            _context.Reclamacao.Remove(reclamacaoExistente);
            await _context.SaveChangesAsync();
            return Ok(reclamacaoExistente);
        }

        [HttpGet("obterPorUsuario/{usuarioId}")] // Endpoint para obter reclamações por ID de usuário
        // [Authorize] // Opcional: Se quiser exigir autenticação para este endpoint
        public async Task<ActionResult<IEnumerable<Reclamacao>>> GetReclamacoesByUsuario(string usuarioId)
        {
            var reclamacoes = await _context.Reclamacao
                                            .Where(r => r.UsuarioId == usuarioId)
                                            .OrderByDescending(r => r.DataCriacaoReclamacao) // Opcional: para exibir as mais recentes primeiro
                                            .ToListAsync();

            if (reclamacoes == null || !reclamacoes.Any())
            {
                // Retorne um array vazio ou um status 200 OK com array vazio,
                // em vez de NotFound, para que o frontend não trate como erro.
                return Ok(new List<Reclamacao>());
            }
            return Ok(reclamacoes);
        }


    }
}


