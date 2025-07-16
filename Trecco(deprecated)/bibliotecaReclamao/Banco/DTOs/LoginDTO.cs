using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bibliotecaReclamao.Banco.DTOs
{
    public class LoginDTO
    {
        public required string Identificador  { get; set; }
        public required string SenhaUsuario { get; set; }
    }
}