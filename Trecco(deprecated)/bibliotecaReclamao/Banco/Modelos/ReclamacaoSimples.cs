using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bibliotecaReclamao.Banco.Modelos
{
    public class ReclamacaoSimples
    {
        public int id { get; set; }
        public string ConteudoReclamacao { get; set; }
        public string DataCriacaoReclamacao { get; set; }
        public int UsuarioId { get; set; }
    }
}