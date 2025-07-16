using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaSUPABASE.Banco.Modelos
{
    [Index(nameof(EmailUsuario), IsUnique = true)] 
    public class Usuario
    {
        public Usuario()
        {
            // Gerar um GUID para UsuarioId no construtor
            // Isso garante que cada nova instância de Usuario terá um ID único gerado automaticamente.
            UsuarioId = Guid.NewGuid().ToString();
        }

        [Key]
        // UsuarioId agora é uma string para armazenar o GUID
        public string UsuarioId { get; set; }

        [Required] // Garante que o NomeUsuario não seja nulo
        [StringLength(80, ErrorMessage = "O Nome de Usuário não pode exceder 80 caracteres.")]
        public string NomeUsuario { get; set; }

        [StringLength(255)]
        public string? ImagemUsuario { get; set; }

        [Required] // Garante que o EmailUsuario não seja nulo
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")] // Validação de formato de e-mail
        [StringLength(30, ErrorMessage = "O Email de Usuário não pode exceder 30 caracteres.")]
        public string EmailUsuario { get; set; }

        [Required] // Garante que a SenhaUsuario não seja nula
        [StringLength(255, MinimumLength = 6, ErrorMessage = "A Senha deve ter entre 6 e 20 caracteres.")] // Exemplo de MinimumLength
        public string SenhaUsuario { get; set; }

        // Propriedade de navegação para representar a coleção de Tarefas
        public ICollection<Tarefa>? Tarefas { get; set; }
    }
}