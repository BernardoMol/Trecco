using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using BibliotecaSUPABASE.Banco.Conexao;
using BibliotecaSUPABASE.Banco.Modelos;
using BibliotecaSUPABASE.Banco.DTOs;
using Microsoft.AspNetCore.JsonPatch;


namespace ApiTreccoRENDER.Controladores
{
    [ApiController]
    [Route("api/[controller]")]
    public class ControllerTarefas : ControllerBase
    {

        // Propriedades
        private readonly ConexaoContexto _context;
        // Construtor
        public ControllerTarefas(ConexaoContexto context)
        {
            _context = context;
        }


        [HttpGet("Tarefa_Buscar_todos")]
        public async Task<ActionResult<List<Tarefa>>> GetTarefas()
        {
            var lista = await _context.Tarefas
                .Include(t => t.UsuarioAssociado)
                .Select(t => new TarefaGetDTO
                {
                    IdTarefa = t.IdTarefa,
                    ConteudoTarefa = t.ConteudoTarefa,
                    DataCriacaoTarefa = t.DataCriacaoTarefa,
                    UsuarioAssociado = new Usuario
                    {
                        UsuarioId = t.UsuarioAssociado.UsuarioId,
                        NomeUsuario = t.UsuarioAssociado.NomeUsuario,
                        ImagemUsuario = t.UsuarioAssociado.ImagemUsuario,
                        EmailUsuario = t.UsuarioAssociado.EmailUsuario,
                        SenhaUsuario = t.UsuarioAssociado.SenhaUsuario,
                    }
                })
                .ToListAsync();
            return Ok(lista);
        }

        [HttpGet("Tarefa_Buscar_Id/{id}")]
        public async Task<ActionResult<Tarefa>> GetTarefaID(string id)
        {
            var tarefa = await _context.Tarefas
                .Where(t => t.IdTarefa == id)
                .Include(t => t.UsuarioAssociado)
                .Select(t => new TarefaGetDTO
                {
                    IdTarefa = t.IdTarefa,
                    ConteudoTarefa = t.ConteudoTarefa,
                    DataCriacaoTarefa = t.DataCriacaoTarefa,
                    UsuarioAssociado = new Usuario
                    {
                        UsuarioId = t.UsuarioAssociado.UsuarioId,
                        NomeUsuario = t.UsuarioAssociado.NomeUsuario,
                        ImagemUsuario = t.UsuarioAssociado.ImagemUsuario,
                        EmailUsuario = t.UsuarioAssociado.EmailUsuario,
                        SenhaUsuario = t.UsuarioAssociado.SenhaUsuario,
                    }
                })
                .FirstOrDefaultAsync();

            if (tarefa == null)
                return NotFound();

            return Ok(tarefa);
        }


        [HttpPost("Tarefa_adicionar")]
        public async Task<ActionResult<Tarefa>> PostTarefa([FromBody] Tarefa novaTarefa)
        {
            novaTarefa.DataCriacaoTarefa = DateTime.UtcNow;
            // novaTarefa.DataCriacaoTarefa = DateTime.Now;
            _context.Tarefas.Add(novaTarefa);
            await _context.SaveChangesAsync();
            // return StatusCode(201, "ADICIONADO");
            return StatusCode(201, new { message = "ADICIONADO" });
        }

        [HttpPut("Tarefa_Alterar_Toda/{id}")]
        public async Task<ActionResult<Tarefa>> PutTarefa(string id, [FromBody] Tarefa novaTarefa)
        {
            // var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.IdTarefa == id);
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound("NÃO ENCONTRADO");
            }
            else
            {
                tarefa.ConteudoTarefa = novaTarefa.ConteudoTarefa;
                _context.Tarefas.Update(tarefa);
                await _context.SaveChangesAsync();
                return StatusCode(201, "ALTERADO");
            }
        }
        
        [HttpPatch("Tarefa_Alterar/{id}")]
        public async Task<ActionResult<Tarefa>> PatchTarefa(string id, [FromBody] JsonPatchDocument<Tarefa> patchDoc)
        {
            // var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.IdTarefa == id);
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound("NÃO ENCONTRADO");
            }
            else
            {
                patchDoc.ApplyTo(tarefa);
                if (!TryValidateModel(tarefa))
                {
                    return BadRequest(ModelState);
                }
                await _context.SaveChangesAsync();
                return StatusCode(201, "ALTERADO");
            }
        }


        [HttpDelete("Tarefa_deletar/{id}")]
        public async Task<ActionResult<Tarefa>> DeleteTarefa(string id)
        {
            var tarefa = _context.Tarefas.FirstOrDefault(t => t.IdTarefa == id);

            if (tarefa == null)
            {
                return NotFound("NÃO ENCONTRADO");
            }                
            else
            {
                _context.Tarefas.Remove(tarefa);
                await _context.SaveChangesAsync();
                return StatusCode(201, "REMOVIDO");
            }
        }

    }

}