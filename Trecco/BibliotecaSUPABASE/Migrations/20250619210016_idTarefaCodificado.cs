using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BibliotecaSUPABASE.Migrations
{
    /// <inheritdoc />
    public partial class idTarefaCodificado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            {
    // Remove identity da coluna (se existir)
    migrationBuilder.Sql("ALTER TABLE \"Tarefas\" ALTER COLUMN \"IdTarefa\" DROP IDENTITY IF EXISTS;");

    // Altera tipo para texto
    migrationBuilder.AlterColumn<string>(
        name: "IdTarefa",
        table: "Tarefas",
        type: "text",
        nullable: false,
        oldClrType: typeof(int),
        oldType: "integer");
}
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "IdTarefa",
                table: "Tarefas",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
        }
    }
}
