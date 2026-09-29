using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KohTaoBack.Migrations
{
    /// <inheritdoc />
    public partial class RolesYVersionSesion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DebeCambiarPassword",
                table: "Usuarios",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "VersionSesion",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Roles: Admin => Propietario; el primer usuario (creado por el seeder) => Desarrollador
            migrationBuilder.Sql("UPDATE `Usuarios` SET `Rol` = 'Propietario' WHERE `Rol` = 'Admin';");
            migrationBuilder.Sql("UPDATE `Usuarios` SET `Rol` = 'Desarrollador' ORDER BY `Id` LIMIT 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE `Usuarios` SET `Rol` = 'Admin';");

            migrationBuilder.DropColumn(
                name: "DebeCambiarPassword",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "VersionSesion",
                table: "Usuarios");
        }
    }
}
