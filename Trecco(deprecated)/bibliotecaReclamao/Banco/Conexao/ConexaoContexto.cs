using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using bibliotecaReclamao.Banco.Modelos;


namespace bibliotecaReclamao.Banco.Conexao
{
    public class ConexaoContexto : DbContext
    {
        public DbSet<Reclamacao> Reclamacao { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public ConexaoContexto(DbContextOptions<ConexaoContexto> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }

}