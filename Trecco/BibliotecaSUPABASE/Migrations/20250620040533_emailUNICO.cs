using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BibliotecaSUPABASE.Migrations
{
    /// <inheritdoc />
    public partial class emailUNICO : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_EmailUsuario",
                table: "Usuarios",
                column: "EmailUsuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Usuarios_EmailUsuario",
                table: "Usuarios");
        }
    }
}
