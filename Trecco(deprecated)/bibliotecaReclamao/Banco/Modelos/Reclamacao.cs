using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bibliotecaReclamao.Banco.Modelos
{
    public class Reclamacao
    {
        [Key]
        public int IdReclamacao { get; set; }
        public required string ConteudoReclamacao { get; set; }
        public DateTime DataCriacaoReclamacao { get; set; }

        // Chave estrangeira para ligar ao Usuario
        public string UsuarioId { get; set; }

        // Propriedade de navegação para representar o Usuario associado
        // [NotMapped]
        public Usuario? UsuarioAssociado { get; set; }
    }
}

