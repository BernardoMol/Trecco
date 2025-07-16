using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BibliotecaSUPABASE.Banco.DTOs
{
    public class UsuarioGetDTO
    {
        public string UsuarioId { get; set; } = null!;
        public string NomeUsuario { get; set; } = null!;
        public string EmailUsuario { get; set; }
        public string? ImagemUsuario { get; set; }
        public List<TarefaGetDTO>? Tarefas { get; set; }
    }
}