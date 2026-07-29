using Microsoft.Data.SqlClient;
using Models.Models;
using Rado.Enrich;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class TyreDbSet
    {
        string connetionString = Program.ConnectionString;
        static object dictionaryLock = new object();
        static private Dictionary<long, SearchResult> dictionaryParts = new Dictionary<long, SearchResult>();

        static public async Task<TyreView> GetTyreByIdAsync(long tyreId)
        {
            TyreView tyreView = null;
            await Task.Run(() =>
            {
                tyreView = GetTyreById(tyreId);
            });

            return tyreView;
        }
        static public TyreView GetTyreById(long tyreId)
        {
            string storeProcedureName = "TyreById";
            TyreView tyreView = null;
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@tyreId", System.Data.SqlDbType.BigInt).Value = tyreId;

                        connection.Open();
                        int rows = command.ExecuteNonQuery();
                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            if (sqlDataReader.Read())
                            {
                                tyreView = EnrichManager.EnrichTyreView(sqlDataReader);
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
            return tyreView;
        }

        static public async Task<SearchResult> GetSearchResult(long query)
        {
            SearchResult result = new SearchResult();

            await Task.Run(() =>
            {
                try
                {
                    lock (dictionaryLock)
                    {
                        if (dictionaryParts.ContainsKey(query))
                        {
                            result = dictionaryParts[query];
                        }
                    }

                }
                catch (Exception e)
                {
                    throw new AppException($"Exception in GetSearchResult {e.Message}");
                }

            });

            return result;
        }

        static public TyreView[] SearchForTyres(Filter filter)
        {
            List <TyreView> tyres = new List<TyreView>();
            try
            {
                List<string> where = new List<string>();

                if (filter.TyreCompanyId != 0)
                    where.Add($"tyreCompanyId = {filter.TyreCompanyId}");

                if (filter.TyreWidth != 0)
                    where.Add($"tyreWidth  = {filter.TyreWidth}");

                if (filter.TyreHeight != 0)
                    where.Add($"tyreHeight = {filter.TyreHeight}");

                if (filter.TyreRadius != 0)
                    where.Add($"tyreRadius = {filter.TyreRadius}");

                if (filter.TyreType != 0)
                    where.Add($"year = {filter.TyreType}");

                if (filter.UserId != 0 && filter.UserId != null)
                    where.Add($"userId = {filter.UserId}");

                string selectCommand = "SELECT * FROM TyreView WITH(NOLOCK)";
                if (where.Count > 0)
                {
                    selectCommand += " WHERE " + String.Join(" AND ", where.ToArray());
                }

                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    Stopwatch carsAllwatch = new Stopwatch();
                    carsAllwatch.Start();

                    using (SqlCommand sqlCommand = new SqlCommand(selectCommand, sqlConnection))
                    {

                        sqlCommand.CommandType = CommandType.Text;
                        Stopwatch executewatch = new Stopwatch();
                        executewatch.Start();
                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            executewatch.Stop();
                            Console.WriteLine("Execute CarsAll is {0} ms", executewatch.ElapsedMilliseconds);
                            while (sqlDataReader.Read())
                            {
                                TyreView tyreView = EnrichManager.EnrichTyreView(sqlDataReader);
                                tyres.Add(tyreView);
                            }
                        }
                    }
                    carsAllwatch.Stop();
                    Console.WriteLine("Elapsed Time GetTyres Details is {0} ms", carsAllwatch.ElapsedMilliseconds);


                    sqlConnection.Close();
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"Exception in function SearchForTyres {exception.Message}");
            }
            finally
            {

            }

            return tyres.ToArray();

        }

        static public bool DeleteTyre(long tyreId, int userId)
        {
            string storeProcedureName = "TyreDel";
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

                        command.Parameters.Add("@tyreId", System.Data.SqlDbType.BigInt).Value = tyreId;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int rows = command.ExecuteNonQuery();
                        if (rows != 1)
                        {
                            throw new AppException($"The tyre could not be deleted");
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in DeletePart : {exception.Message}");
            }

            return true;
        }


        static public async Task<TyreView> AddTyreAsync(Tyre tyre)
        {
            TyreView tyreView = null;
            await Task.Run(() =>
            {
                tyreView = AddUpdateTyreAsync(tyre, false);
            });

            return tyreView;
        }

        static public async Task<TyreView> UpdateTyreAsync(Tyre tyre)
        {
            TyreView tyreView = null;
            await Task.Run(() =>
            {
                tyreView = AddUpdateTyreAsync(tyre, true); ;
            });

            return tyreView;
        }

        static public TyreView AddUpdateTyreAsync(Tyre tyre, bool update)
        {
            string storeProcedureName;
            if (tyre.MainPicture == null) tyre.MainPicture = "";
            if (!update)
            {
                storeProcedureName = "TyreIns";
            }
            else
            {
                storeProcedureName = "TyreUpd";
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

                        command.Parameters.Add("@tyreId", System.Data.SqlDbType.BigInt).Value = tyre.TyreId;
                        command.Parameters.Add("@tyreCompanyId", System.Data.SqlDbType.Int).Value = tyre.TyreCompanyId;
                        command.Parameters.Add("@tyreWidth", System.Data.SqlDbType.Int).Value = tyre.TyreWidth;
                        command.Parameters.Add("@tyreHeight", System.Data.SqlDbType.Int).Value = tyre.TyreHeight;
                        command.Parameters.Add("@tyreRadius", System.Data.SqlDbType.Int).Value = tyre.TyreRadius;
                        command.Parameters.Add("@tyreType", System.Data.SqlDbType.Int).Value = tyre.TyreType;
                        command.Parameters.Add("@price", System.Data.SqlDbType.Decimal).Value = tyre.Price;
                        command.Parameters.Add("@description", System.Data.SqlDbType.NVarChar).Value = tyre.Description;
                        command.Parameters.Add("@regionId", System.Data.SqlDbType.Int).Value = tyre.RegionId;
                        command.Parameters.Add("@mainImageId", System.Data.SqlDbType.Int).Value = tyre.MainImageId;
                        command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = tyre.MainPicture;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = tyre.UserId;
                        command.Parameters.Add("@modifiedTime", System.Data.SqlDbType.BigInt).Value = tyre.ModifiedTime;
                        command.Parameters.Add("@count", System.Data.SqlDbType.Int).Value = tyre.Count;
                        command.Parameters.Add("@month", System.Data.SqlDbType.Int).Value = tyre.Month;
                        command.Parameters.Add("@year", System.Data.SqlDbType.Int).Value = tyre.Year;

                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new AppException($"Tyre can not be updated. Message {e.Message}");
            }

            return GetTyreById(tyre.TyreId);
        }

        #region unused finctions
        //static public bool MainPicture(long tyreId, string mainPicture, int mainImageId, int userId)
        //{
        //    string storeProcedureName = "UpdateMainPictureTyre";
        //    try
        //    {
        //        using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
        //        {
        //            connection.Open();

        //            using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
        //            {
        //                command.CommandType = System.Data.CommandType.StoredProcedure;

        //                command.Parameters.Add("@tyreId", System.Data.SqlDbType.BigInt).Value = tyreId;
        //                command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = mainPicture;
        //                command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
        //                command.Parameters.Add("@mainImageId", System.Data.SqlDbType.Int).Value = mainImageId;

        //                command.ExecuteNonQuery();
        //            }
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        throw new AppException($" Error in MainPicture : {exception.Message}");
        //    }

        //    return true;

        //}

        #endregion
    }
}

