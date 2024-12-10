using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ARS_API.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c56aee1c-162c-42eb-bb38-7d615f03eb85");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e209a567-183a-4a13-901d-351cb8cddafa");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e4926389-9828-45dc-92cc-f690ca633083");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "28727cdc-abd3-4ffd-bd57-b4913b63b1cd", null, "User", "USER" },
                    { "9c4e5d60-fafd-4316-872e-66a5b76cd5c0", null, "Admin", "ADMIN" },
                    { "dda6a92d-620c-4f74-9ec8-146acd236321", null, "Manager", "MANAGER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "28727cdc-abd3-4ffd-bd57-b4913b63b1cd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9c4e5d60-fafd-4316-872e-66a5b76cd5c0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dda6a92d-620c-4f74-9ec8-146acd236321");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "c56aee1c-162c-42eb-bb38-7d615f03eb85", null, "Manager", "MANAGER" },
                    { "e209a567-183a-4a13-901d-351cb8cddafa", null, "User", "USER" },
                    { "e4926389-9828-45dc-92cc-f690ca633083", null, "Admin", "ADMIN" }
                });
        }
    }
}
