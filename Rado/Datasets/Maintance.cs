using Microsoft.Data.SqlClient;
using Rado.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Datasets
{
    public class Maintance
    {
        public static void Init()
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand importantceCmd = new SqlCommand("ImportanceUpd", connection))
                    {
                        importantceCmd.CommandType = System.Data.CommandType.StoredProcedure;
                        importantceCmd.ExecuteNonQuery();
                    }

                    connection.Close();
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Exception in Maintance::Init {exception.Message}");
            }
            finally
            {
            }

        }
    }
}
