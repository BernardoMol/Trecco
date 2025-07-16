using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using BibliotecaSUPABASE.Banco.Modelos;

namespace BibliotecaSUPABASE.Banco.Conexao
{
    public class ConexaoContexto : DbContext // Dbcontext vem do Entityframework
    {
        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public ConexaoContexto(DbContextOptions<ConexaoContexto> options) : base(options) { }
    }
}