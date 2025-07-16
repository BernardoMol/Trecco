using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BibliotecaSUPABASE.Banco.Modelos;

namespace BibliotecaSUPABASE.Banco.DTOs
{
    public class TarefaGetDTO
    {
        public string IdTarefa { get; set; } = null!;
        public string ConteudoTarefa { get; set; } = null!;
        public DateTime DataCriacaoTarefa { get; set; }
        public Usuario UsuarioAssociado { get; set; } = null!;
    }
}