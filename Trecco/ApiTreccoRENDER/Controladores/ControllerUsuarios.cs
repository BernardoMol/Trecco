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
using Microsoft.AspNetCore.Authorization;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Newtonsoft.Json;


namespace ApiTreccoRENDER.Controladores
{
    [ApiController]
    [Route("api/[controller]")]
    public class ControllerUsuarios : ControllerBase
    {

        // Propriedades
        private readonly ConexaoContexto _context;
        private readonly Cloudinary _cloudinary;
        // Construtor
        public ControllerUsuarios(ConexaoContexto context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        #region busca sem a lista de reclamações
        // [HttpGet("Usuario_Buscar_todos")]
        // public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        // {
        //     var lista = await _context.Usuarios.ToListAsync();
        //     return Ok(lista);
        // }

        // [HttpGet("Usuario_Buscar_Id/{id}")]
        // public async Task<ActionResult<Usuario>> GetUsuarioID(string id)
        // {
        //     var tarefa = await _context.Usuarios.FirstOrDefaultAsync(t => t.UsuarioId== id);

        //     if (tarefa == null)
        //         return NotFound();

        //     return Ok(tarefa);
        // }
        #endregion

        #region FUNCIONA mas achei meio paia
        // [HttpGet("Usuario_Buscar_todos")]
        // public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        // {
        //     var lista = await _context.Usuarios.Include(u => u.Tarefas).ToListAsync();

        //     var listaDto = lista.Select(u => new UsuarioGetDTO
        //     {
        //         UsuarioId = u.UsuarioId,
        //         NomeUsuario = u.NomeUsuario,
        //         // Senha = u.SenhaUsuario, // nao funciona pois no DTO nao tenho campo "Senha"
        //         Tarefas = u.Tarefas?.Select(t => new TarefaGetDTO
        //         {
        //             IdTarefa = t.IdTarefa,
        //             ConteudoTarefa = t.ConteudoTarefa,
        //             DataCriacaoTarefa = t.DataCriacaoTarefa
        //         }).ToList()
        //     }).ToList();

        //     return Ok(listaDto);
        // }

        // [HttpGet("Usuario_Buscar_Id/{id}")]
        // public async Task<ActionResult<Usuario>> GetUsuarioID(string id)
        // {
        //     var usuario = await _context.Usuarios.Include(u => u.Tarefas).FirstOrDefaultAsync(t => t.UsuarioId == id);

        //     if (usuario == null)
        //         return NotFound();

        //     var dto = new UsuarioGetDTO
        //     {
        //         UsuarioId = usuario.UsuarioId,
        //         NomeUsuario = usuario.NomeUsuario,
        //         Tarefas = usuario.Tarefas?.Select(t => new TarefaGetDTO
        //         {
        //             IdTarefa = t.IdTarefa,
        //             ConteudoTarefa = t.ConteudoTarefa,
        //             DataCriacaoTarefa = t.DataCriacaoTarefa
        //         }).ToList()
        //     };


        //     return Ok(dto);
        // }
        #endregion

        [HttpGet("Usuario_Buscar_todos")]
        public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        {
            var lista = await _context.Usuarios
                .Include(u => u.Tarefas)
                .Select(u => new UsuarioGetDTO
                {
                    UsuarioId = u.UsuarioId,
                    NomeUsuario = u.NomeUsuario,
                    EmailUsuario = u.EmailUsuario,
                    ImagemUsuario = u.ImagemUsuario, // ← Agora incluindo a imagem
                    Tarefas = u.Tarefas.Select(t => new TarefaGetDTO
                    {
                        IdTarefa = t.IdTarefa,
                        ConteudoTarefa = t.ConteudoTarefa,
                        DataCriacaoTarefa = t.DataCriacaoTarefa
                    }).ToList()
                })
                .ToListAsync();

            return Ok(lista);
        }

        [Authorize]
        [HttpGet("Usuario_Buscar_Id/{id}")]
        public async Task<ActionResult<Usuario>> GetUsuarioID(string id)
        {
            var usuario = await _context.Usuarios
                .Where(u => u.UsuarioId == id)
                .Include(u => u.Tarefas)
                .Select(u => new UsuarioGetDTO
                {
                    UsuarioId = u.UsuarioId,
                    NomeUsuario = u.NomeUsuario,
                    EmailUsuario = u.EmailUsuario,
                    ImagemUsuario = u.ImagemUsuario, // ← Agora incluindo a imagem
                    Tarefas = u.Tarefas.Select(t => new TarefaGetDTO
                    {
                        IdTarefa = t.IdTarefa,
                        ConteudoTarefa = t.ConteudoTarefa,
                        DataCriacaoTarefa = t.DataCriacaoTarefa
                    }).ToList()
                })
                .ToListAsync();

            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        [Authorize]
        [HttpGet("Usuario_Buscar_Identificador/{identificador}")]
        public async Task<ActionResult<Usuario>> GetUsuarioIdentificador(string identificador)
        {
            var usuario = await _context.Usuarios
                .Where(u => u.NomeUsuario == identificador || u.EmailUsuario == identificador)
                .Include(u => u.Tarefas)
                .Select(u => new UsuarioGetDTO
                {
                    UsuarioId = u.UsuarioId,
                    NomeUsuario = u.NomeUsuario,
                    EmailUsuario = u.EmailUsuario,
                    ImagemUsuario = u.ImagemUsuario, // ← Agora incluindo a imagem
                    Tarefas = u.Tarefas.Select(t => new TarefaGetDTO
                    {
                        IdTarefa = t.IdTarefa,
                        ConteudoTarefa = t.ConteudoTarefa,
                        DataCriacaoTarefa = t.DataCriacaoTarefa
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        [Authorize]
        [HttpGet("Usuario_Buscar_MeuPerfil")]
        public async Task<IActionResult> BuscarMeuPerfil()
        {
            // Da pra pegar o ID diretamente aqui vindo do TOKEN....doidera
            var id = User.Claims.FirstOrDefault(c => c.Type == "UsuarioId")?.Value;
            Console.WriteLine("meu id");  
            Console.WriteLine(id);        

            if (string.IsNullOrEmpty(id))
                return Unauthorized();

            var usuario = await _context.Usuarios
                .Include(u => u.Tarefas)
                .FirstOrDefaultAsync(u => u.UsuarioId == id);

            if (usuario == null)
                return NotFound();

            var dto = new UsuarioGetDTO
            {
                UsuarioId = usuario.UsuarioId,
                NomeUsuario = usuario.NomeUsuario,
                EmailUsuario = usuario.EmailUsuario,
                ImagemUsuario = usuario.ImagemUsuario,
                Tarefas = usuario.Tarefas.Select(t => new TarefaGetDTO
                {
                    IdTarefa = t.IdTarefa,
                    ConteudoTarefa = t.ConteudoTarefa,
                    DataCriacaoTarefa = t.DataCriacaoTarefa
                }).ToList()
            };

            return Ok(dto);
        }


        #region sem imagem
        // [Authorize]
        // [HttpPost("Usuario_adicionar")]
        // public async Task<ActionResult<Usuario>> PostUsuario([FromBody] Usuario novoUsuario)
        // {
        //     bool emailJaExiste = await _context.Usuarios.AnyAsync(u => u.EmailUsuario == novoUsuario.EmailUsuario);
        //     if (emailJaExiste)
        //     {
        //         return BadRequest("Este e-mail já está em uso.");
        //     }

        //     novoUsuario.SenhaUsuario = BCrypt.Net.BCrypt.HashPassword(novoUsuario.SenhaUsuario); 
        //     _context.Usuarios.Add(novoUsuario);
        //     await _context.SaveChangesAsync();
        //     return StatusCode(201, "ADICIONADO");
        // }

        // [HttpPut("Usuario_Alterar_Todo/{id}")]
        //     public async Task<ActionResult<Usuario>> PutUsuario(string id, [FromBody] Usuario novoUsuario)
        //     {
        //         // var usuario = await _context.Usuarios.FirstOrDefaultAsync(t => t.UsuarioId == id);
        //         var usuario = await _context.Usuarios.FindAsync(id);
        //         if (usuario == null)
        //         {
        //             return NotFound("NÃO ENCONTRADO");
        //         }
        //         else
        //         {
        //             usuario.ImagemUsuario = novoUsuario.ImagemUsuario;
        //             _context.Usuarios.Update(usuario);
        //             await _context.SaveChangesAsync();
        //             return StatusCode(201, "ALTERADO");
        //         }
        //     }

        // [HttpPatch("Usuario_Alterar/{id}")]
        // public async Task<ActionResult<Usuario>> PatchUsuario(string id, [FromBody] JsonPatchDocument<Usuario> patchDoc)
        // {
        //     // var usuario = await _context.Usuarios.FirstOrDefaultAsync(t => t.UsuarioId == id);
        //     var usuario = await _context.Usuarios.FindAsync(id);
        //     if (usuario == null)
        //     {
        //         return NotFound("NÃO ENCONTRADO");
        //     }
        //     else
        //     {
        //         patchDoc.ApplyTo(usuario);
        //         if (!TryValidateModel(usuario))
        //         {
        //             return BadRequest(ModelState);
        //         }
        //         await _context.SaveChangesAsync();
        //         return Ok(usuario);
        //     }
        // }
        #endregion

        [HttpPost("Usuario_adicionar")]
        public async Task<ActionResult> PostUsuario([FromForm] UsuarioManipulacaoImagemDTO novoUsuarioDTO)
        {
            // Validação inicial
            if (novoUsuarioDTO == null)
            {
                return BadRequest("Dados do usuário não foram fornecidos");
            }

            try
            {
                // Verificação de email
                if (await _context.Usuarios.AnyAsync(u => u.EmailUsuario == novoUsuarioDTO.EmailUsuario))
                {
                    return BadRequest("E-mail já cadastrado");
                }

                var usuario = new Usuario
                {
                    NomeUsuario = novoUsuarioDTO.NomeUsuario,
                    EmailUsuario = novoUsuarioDTO.EmailUsuario,
                    SenhaUsuario = BCrypt.Net.BCrypt.HashPassword(novoUsuarioDTO.SenhaUsuario)
                };

                // Upload da imagem (com tratamento de erro)
                if (novoUsuarioDTO.ArquivoImagem != null && novoUsuarioDTO.ArquivoImagem.Length > 0)
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(novoUsuarioDTO.ArquivoImagem.FileName, 
                                                novoUsuarioDTO.ArquivoImagem.OpenReadStream()),
                        Folder = "TreccolmagensDeUsuarios",
                        PublicId = $"user_{usuario.UsuarioId}",
                        Overwrite = false
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    
                    if (uploadResult.Error != null)
                    {
                        return StatusCode(500, $"Erro no Cloudinary: {uploadResult.Error.Message}");
                    }

                    usuario.ImagemUsuario = uploadResult.SecureUrl.ToString();
                }

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUsuarioID), new { id = usuario.UsuarioId }, usuario);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO: {ex}");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        [HttpPut("Usuario_Alterar_Todo/{id}")]
        public async Task<ActionResult<Usuario>> PutUsuario(string id, [FromForm] UsuarioManipulacaoImagemDTO usuarioAlterado)
        {
            // var usuario = await _context.Usuarios.FirstOrDefaultAsync(t => t.UsuarioId == id);

            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                {
                    return StatusCode(404,"NÃO ENCONTRADO");
                    
                }
                else
                {
                    if (usuarioAlterado.ArquivoImagem != null && usuarioAlterado.ArquivoImagem.Length > 0)
                    {
                        var uploadParams = new ImageUploadParams
                        {
                            File = new FileDescription(usuarioAlterado.ArquivoImagem.FileName,
                                                    usuarioAlterado.ArquivoImagem.OpenReadStream()),
                            Folder = "TreccolmagensDeUsuarios",
                            PublicId = $"user_{usuario.UsuarioId}",
                            Overwrite = false
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                        if (uploadResult.Error != null)
                        {
                            return StatusCode(500, $"Erro no Cloudinary: {uploadResult.Error.Message}");
                        }

                        usuario.ImagemUsuario = uploadResult.SecureUrl.ToString();

                        _context.Usuarios.Update(usuario);
                        await _context.SaveChangesAsync();
                        return Ok(usuario);
                    }
                    else
                    {
                        _context.Usuarios.Update(usuario);
                        await _context.SaveChangesAsync();
                        return StatusCode(201, "ALTERADO");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO: {ex}");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)] // ignora este cara no swagger pq ele nao reconhece
        // /é BO do swagger, tem como resolver com um filtro, mas o foco neste momento é outro
        [HttpPatch("Usuario_Alterar/{id}")]
        public async Task<ActionResult<Usuario>> PatchUsuario(
            string id,
            [FromForm] IFormFile arquivoImagem,
            [FromForm] string patchOperations = null)
        {
            // [
            //     {
            //         "op": "replace",
            //         "path": "/ImagemUsuario",
            //         "value": "imagem PATCH"
            //     }
            // ]
            try
            {
                // var usuario = await _context.Usuarios.FirstOrDefaultAsync(t => t.UsuarioId == id);
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                {
                    return NotFound("NÃO ENCONTRADO");
                }

                var patchDoc = JsonConvert.DeserializeObject<JsonPatchDocument<Usuario>>(patchOperations ?? "[]");
                if (arquivoImagem != null && arquivoImagem.Length > 0)
                {
                    // Upload para o Cloudinary
                    var uploadResult = await _cloudinary.UploadAsync(new ImageUploadParams
                    {
                        File = new FileDescription(arquivoImagem.FileName, arquivoImagem.OpenReadStream()),
                        Folder = "TreccolmagensDeUsuarios",
                        PublicId = $"user_{usuario.UsuarioId}",
                        Overwrite = true
                    });

                    if (uploadResult.Error != null)
                        return StatusCode(500, $"Erro no Cloudinary: {uploadResult.Error.Message}");

                    patchDoc.Replace(u => u.ImagemUsuario, uploadResult.SecureUrl.ToString());
                }

                if (patchDoc.Operations.Count > 0)
                {
                    patchDoc.ApplyTo(usuario);
                    if (!TryValidateModel(usuario))
                    {
                        return BadRequest(ModelState);
                    }
                    await _context.SaveChangesAsync();
                    return Ok(usuario);
                }
                
                else
                {
                    return BadRequest("Operações PATCH não enviadas");
                }                   

            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO: {ex}");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        [HttpDelete("Usuario_deletar/{id}")]
        public async Task<ActionResult<Usuario>> DeletarUsuario(string id)
        {
            // var usuario = await _context.Usuarios.FirstOrDefaultAsync(t => t.UsuarioId == id);
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            else
            {
                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();
                return StatusCode(201, "REMOVIDO");
            }
        }

    }
}

