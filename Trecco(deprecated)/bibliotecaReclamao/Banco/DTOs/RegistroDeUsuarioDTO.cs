using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bibliotecaReclamao.Banco.DTOs
{
    public class RegistroDeUsuarioDTO
    {
        public required string NomeUsuario { get; set; }
        public required string EmailUsuario { get; set; }
        public required string SenhaUsuario { get; set; }
    }
}