using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace BibliotecaSUPABASE.Banco.Modelos
{
    public class Tarefa
    {

        public Tarefa()
        {
            IdTarefa = Guid.NewGuid().ToString();
        }

        [Key]
        public string IdTarefa { get; set; }
        public required string ConteudoTarefa { get; set; }
        public DateTime DataCriacaoTarefa { get; set; }

        // Chave estrangeira para ligar ao Usuario
        public string UsuarioId { get; set; }

        // Propriedade de navegação para representar o Usuario associado
        public Usuario? UsuarioAssociado { get; set; }
    }
}