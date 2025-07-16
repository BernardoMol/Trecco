using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient; // permite a conexão com o mysql

namespace bibliotecaReclamao.Banco.Conexao
{
    public class Conexao
    {
        // mysql://root:fZsXuTGhNhkmhaJXgGIEkfdzefXQAycW@metro.proxy.rlwy.net:45511/railway
        public readonly string connectionString = "Server=metro.proxy.rlwy.net;Port=45511;Database=railway;Uid=root;Pwd=fZsXuTGhNhkmhaJXgGIEkfdzefXQAycW;";

        public MySqlConnection Conectar()
        {
            Console.Write("Conectamos s2");
            return new MySqlConnection(connectionString);
        }
    }
}

// // EXEMPLO 2
// // CONSTUINDO A CONEXÃO DE FORMA "DINAMICA"
// namespace Reclamao.Banco
// {
//     internal class Conexao_MySQL
//     {
//         // private string connectionString = "mysql://root:fZsXuTGhNhkmhaJXgGIEkfdzefXQAycW@metro.proxy.rlwy.net:45511/railway";
//         private readonly string server = "metro.proxy.rlwy.net";
//         private readonly string port = "45511";
//         private readonly string database = "railway";
//         private readonly string uid = "root";
//         private readonly string password = "fZsXuTGhNhkmhaJXgGIEkfdzefXQAycW";
//         private string connectionString;

//         public Conexao_MySQL()
//         {
//             connectionString = $"SERVER={server};PORT={port};DATABASE={database};UID={uid};PASSWORD={MySqlHelper.EscapeString(password)};";
//         }

//         public MySqlConnection Conectar()
//         {
//             return new MySqlConnection(connectionString);
//         }
//     }
// }