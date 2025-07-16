using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bibliotecaReclamao.Banco.DTOs
{
    public class RespostaLoginDTO
    {
        public string Token { get; set; }
        public UsuarioDTO User { get; set; } // Dados do usuário
        public string Mensagem { get; set; } // Mensagem de sucesso

        public List<ReclamacaoDTO> Reclamacoes { get; set; }
    }
}