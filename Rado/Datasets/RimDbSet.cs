using Microsoft.Data.SqlClient;
using Rado.Enrich;
using Rado.Exceptions;
using Rado.Models;
using Rado.Models.Authentication;
using System;
using System.Data;
using Utility;

namespace Rado.Datasets
{
    public class RimDbSet
    {

        static public bool DeleteRim(long rimId, int userId)
        {
            string storeProcedureName = "RimDel";
            if (userId == 0)
            {
                throw new AppException("User id is not provided");
            }
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@rimId", System.Data.SqlDbType.BigInt).Value = rimId;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int rows = command.ExecuteNonQuery();
                        if (rows != 1)
                        {
                            throw new AppException($"The rim could not be deleted");
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in DeleteRim : {exception.Message}");
            }

            return true;
        }

        static public RimView AddRim(Rim rim)
        {
            return AddUpdateRim(rim, false);
        }

        static public RimView UpdateRim(Rim rim)
        {
            return AddUpdateRim(rim, true);
        }
        static public RimView AddUpdateRim(Rim rim, bool update)
        {
            string storeProcedureName;
            if (!update)
            {
                storeProcedureName = "RimIns";
            }
            else
            {
                storeProcedureName = "RimUpd";
            }


            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@rimId", System.Data.SqlDbType.BigInt).Value = rim.RimId;
                        command.Parameters.Add("@companyId", System.Data.SqlDbType.Int).Value = rim.CompanyId;
                        command.Parameters.Add("@modelId", System.Data.SqlDbType.Int).Value = rim.ModelId;
                        command.Parameters.Add("@rimWidth", System.Data.SqlDbType.Int).Value = rim.RimWidth;
                        command.Parameters.Add("@rimMaterial", System.Data.SqlDbType.Int).Value = rim.RimMaterial;
                        command.Parameters.Add("@rimOffset", System.Data.SqlDbType.Int).Value = rim.RimOffset;
                        command.Parameters.Add("@rimBoltCount", System.Data.SqlDbType.Int).Value = rim.RimBoltCount;
                        command.Parameters.Add("@rimBoltDistance", System.Data.SqlDbType.Int).Value = rim.RimBoltDistance;
                        command.Parameters.Add("@rimCenter", System.Data.SqlDbType.Int).Value = rim.RimCenter;
                        command.Parameters.Add("@price", System.Data.SqlDbType.Decimal).Value = rim.Price;
                        command.Parameters.Add("@description", System.Data.SqlDbType.NVarChar).Value = rim.Description;
                        command.Parameters.Add("@mainImageId", System.Data.SqlDbType.Int).Value = rim.MainImageId;
                        command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = rim.MainPicture;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = rim.UserId;
                        command.Parameters.Add("@modifiedTime", System.Data.SqlDbType.BigInt).Value = rim.ModifiedTime;
                        command.Parameters.Add("@count", System.Data.SqlDbType.Int).Value = rim.Count;

                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new AppException($"Tyre can not be updated. Message {e.Message}");
            }

            return GetRimById(rim.RimId);
        }
        static public RimView GetRimById(long rimId)
        {
            string storeProcedureName = "RimById";
            RimView rimView = new RimView();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {


                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@rimId", System.Data.SqlDbType.BigInt).Value = rimId;

                        int rows = command.ExecuteNonQuery();
                        connection.Open();
                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            if (sqlDataReader.Read())
                            {
                                rimView = EnrichManager.EnrichRimView(sqlDataReader);
                            }
                        }
                        connection.Close();
                    }
                }
            }
            catch (Exception e)
            {
                throw new AppException($"Exception in GetTyreById {e.Message}");
            }
            return rimView;
        }
    }
}

   
