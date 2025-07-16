using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bibliotecaReclamao.Banco.Modelos;

namespace bibliotecaReclamao.Banco.DTOs
{
    public class UsuarioDTO
    {
        public string UsuarioId { get; set; }
        public string NomeUsuario { get; set; }
        public string EmailUsuario { get; set; }
        public string? ImagemUsuario { get; set; }
        public ICollection<Reclamacao>? Reclamacoes { get; set; } 
    }
}