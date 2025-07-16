using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;

namespace BibliotecaSUPABASE.Banco.DTOs
{
    public class UsuarioManipulacaoImagemDTO
    {
        public string NomeUsuario { get; set; }
        public string EmailUsuario { get; set; }
        public string SenhaUsuario { get; set; }
        public IFormFile? ArquivoImagem { get; set; } // Campo apenas para upload

    }
}