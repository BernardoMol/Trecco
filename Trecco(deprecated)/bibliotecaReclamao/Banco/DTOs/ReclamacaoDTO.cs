using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bibliotecaReclamao.Banco.Modelos;

namespace bibliotecaReclamao.Banco.DTOs
{
    public class ReclamacaoDTO
    {
        public int IdReclamacao { get; set; }
        public string ConteudoReclamacao { get; set; }
        public string NomeUsuario { get; set; }
        public DateTime DataCriacaoReclamacao { get; set; }
        // OBJETO ANINHADO PORQUE EU QUERO ASIM
        public UsuarioDTO UsuarioDTO { get; set; }

    }
}