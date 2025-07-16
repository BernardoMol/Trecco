using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BibliotecaSUPABASE.Banco.DTOs
{
    public class LoginRequestDTO
    {
        public required string Email { get; set; }
        public required string Senha { get; set; }
    }
}