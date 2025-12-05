using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
using Models.Models.Utility;
using Rado.Enrich;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using Rado.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class RimWithTyreDbSet
    {

        static public async Task<CountTyres> GetCountAsync()
        {
            CountTyres countTyres = null;

            await Task.Run(() =>
            {
                countTyres = GetCount();
            });

            return countTyres;
        }

        static public CountTyres GetCount()
        {
            string storeProcedureName = "CountTyres";

            CountTyres countTyres = new CountTyres();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        var countTyresParam = command.Parameters.Add("@countTyres", System.Data.SqlDbType.Int);
                        var countRimsParam = command.Parameters.Add("@countRims", System.Data.SqlDbType.Int);
                        var countRimWithTyresParam = command.Parameters.Add("@countRimWithTyres", System.Data.SqlDbType.Int);
                        countTyresParam.Direction = ParameterDirection.Output;
                        countRimsParam.Direction = ParameterDirection.Output;
                        countRimWithTyresParam.Direction = ParameterDirection.Output;

                        command.ExecuteNonQuery();

                        countTyres.countTyres = Convert.ToInt32(countTyresParam.Value);
                        countTyres.countRims = Convert.ToInt32(countRimsParam.Value);
                        countTyres.countTyreWithRims = Convert.ToInt32(countRimWithTyresParam.Value);


                    }
                }
                return countTyres;
            }
            catch (Exception ex)
            {
                throw new AppException($" Error in DeleteRimWithTyre : {ex.Message}");
            }
        }

        static public async Task<bool> DeleteRimWithTyreAsync(long rimWithTyreId, int userId)
        {
            bool result = false;

            await Task.Run(() =>
            {
                result = DeleteRimWithTyre(rimWithTyreId, userId);
            });

            return result;
        }

        static public bool DeleteRimWithTyre(long rimWithTyreId, int userId)
        {
            string storeProcedureName = "RimWithTyreDel";
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

                        command.Parameters.Add("@rimWithTyreId", System.Data.SqlDbType.BigInt).Value = rimWithTyreId;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int rows = command.ExecuteNonQuery();
                        if (rows != 1)
                        {
                            throw new AppException($"The Rim With Tyre could not be deleted");
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in DeleteRimWithTyre : {exception.Message}");
            }

            return true;
        }

        static public async Task<DisplayPartView> AddRimWithTyreAsync(RimWithTyre rimWithTyre)
        {
            var displayPartView = await AddUpdateRimWithTyreAsync(rimWithTyre, false);

            return displayPartView;

        }

        static public async Task<DisplayPartView> UpdateRimWithTyreAsync(RimWithTyre rimWithTyre)
        {
            var displayPartView = await AddUpdateRimWithTyreAsync(rimWithTyre, true);

            return displayPartView;
        }

        static public async Task<DisplayPartView> AddUpdateRimWithTyreAsync(RimWithTyre rimWithTyre, bool update)
        {
            string storeProcedureName;
            if (update)
            {
                storeProcedureName = "RimWithTyreUpd";
            }
            else
            {
                storeProcedureName = "RimWithTyreIns";
            }


            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();

                    if (rimWithTyre.mainPicture == null) rimWithTyre.mainPicture = "";

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@rimWithTyreId", System.Data.SqlDbType.BigInt).Value = rimWithTyre.rimWithTyreId;
                        command.Parameters.Add("@tyreCompanyId", System.Data.SqlDbType.Int).Value = rimWithTyre.tyreCompanyId;
                        command.Parameters.Add("@tyreWidth", System.Data.SqlDbType.Int).Value = rimWithTyre.tyreWidth;
                        command.Parameters.Add("@tyreHeight", System.Data.SqlDbType.Int).Value = rimWithTyre.tyreHeight;
                        command.Parameters.Add("@tyreRadius", System.Data.SqlDbType.Int).Value = rimWithTyre.tyreRadius;
                        command.Parameters.Add("@tyreType", System.Data.SqlDbType.Int).Value = rimWithTyre.tyreType;
                        command.Parameters.Add("@companyId", System.Data.SqlDbType.Int).Value = rimWithTyre.companyId;
                        command.Parameters.Add("@modelId", System.Data.SqlDbType.Int).Value = rimWithTyre.modelId;
                        command.Parameters.Add("@rimWidth", System.Data.SqlDbType.Int).Value = rimWithTyre.rimWidth;
                        command.Parameters.Add("@rimMaterial", System.Data.SqlDbType.Int).Value = rimWithTyre.rimMaterial;
                        command.Parameters.Add("@rimOffset", System.Data.SqlDbType.Int).Value = rimWithTyre.rimOffset;
                        command.Parameters.Add("@rimBoltCount", System.Data.SqlDbType.Int).Value = rimWithTyre.rimBoltCount;
                        command.Parameters.Add("@rimBoltDistance", System.Data.SqlDbType.Int).Value = rimWithTyre.rimBoltDistance;
                        command.Parameters.Add("@rimCenter", System.Data.SqlDbType.Int).Value = rimWithTyre.rimCenter;
                        command.Parameters.Add("@price", System.Data.SqlDbType.Decimal).Value = rimWithTyre.price;
                        command.Parameters.Add("@description", System.Data.SqlDbType.NVarChar).Value = rimWithTyre.description;
                        command.Parameters.Add("@mainImageId", System.Data.SqlDbType.Int).Value = rimWithTyre.mainImageId;
                        command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = rimWithTyre.mainPicture;
                        command.Parameters.Add("@regionId", System.Data.SqlDbType.Int).Value = rimWithTyre.regionId;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = rimWithTyre.userId;
                        command.Parameters.Add("@modifiedTime", System.Data.SqlDbType.BigInt).Value = rimWithTyre.modifiedTime;
                        command.Parameters.Add("@count", System.Data.SqlDbType.Int).Value = rimWithTyre.count;
                        command.Parameters.Add("@month", System.Data.SqlDbType.Int).Value = rimWithTyre.monthDOT;
                        command.Parameters.Add("@year", System.Data.SqlDbType.Int).Value = rimWithTyre.yearDOT;

                        if (!update) command.Parameters.Add("@itemType", System.Data.SqlDbType.Int).Value = rimWithTyre.itemType;

                        await command.ExecuteNonQueryAsync();
                    }

                    await connection.CloseAsync();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new AppException($"Tyre can not be updated. Message {e.Message}");
            }

            return EnrichManager.EnrichDisplayPartView(await GetRimWithTyreByIdAsync(rimWithTyre.rimWithTyreId));
        }

        static public SearchResult SearchForRimTyres(Filter filterPart)
        {
            List<DisplayPartView> items = new List<DisplayPartView>();
            try
            {
                List<string> where = new List<string>();
                if (filterPart.itemType != ItemType.None && filterPart.itemType != ItemType.AllTyre)
                where.Add(String.Format("itemType = {0}", ((int)filterPart.itemType)));

                if (filterPart.tyreCompanyId != 0)
                    where.Add(String.Format("tyreCompanyId = {0}", filterPart.tyreCompanyId));

                if (filterPart.tyreWidth != 0)
                    where.Add(String.Format("tyreWidth  = {0} ", filterPart.tyreWidth));

                if (filterPart.tyreHeight != 0)
                    where.Add(String.Format("tyreHeight = {0}", filterPart.tyreHeight));

                if (filterPart.tyreRadius != 0)
                    where.Add(String.Format("tyreRadius = {0}", filterPart.tyreRadius));

                if (filterPart.tyreType != 0)
                    where.Add(String.Format("tyreType = {0}", filterPart.tyreType));

                if (filterPart.companyId != 0)
                    where.Add(String.Format("companyId = {0}", filterPart.companyId));

                if (filterPart.modelId != 0)
                {
                    if (ModelsDbSet.isGroupModel(filterPart.modelId))
                    {
                        where.Add(String.Format("groupModelId  = {0} ", filterPart.modelId));
                    }
                    else
                    {
                        where.Add(String.Format("modelId = {0}", filterPart.modelId));
                    }
                }

                if (filterPart.rimWidth != 0)
                    where.Add(String.Format("rimWidth = {0}", filterPart.rimWidth));

                if (filterPart.rimMaterial != 0)
                    where.Add(String.Format("rimMaterial = {0}", filterPart.rimMaterial));

                if (filterPart.rimOffset != 0)
                    where.Add(String.Format("rimOffset = {0}", filterPart.rimOffset));

                if (filterPart.rimBoltCount != 0)
                    where.Add(String.Format("rimBoltCount = {0}", filterPart.rimBoltCount));

                if (filterPart.rimBoltDistance != 0)
                    where.Add(String.Format("rimBoltDistance = {0}", filterPart.rimBoltDistance));

                if (filterPart.rimCenter != 0)
                    where.Add(String.Format("rimCenter = {0}", filterPart.rimCenter));

                if (filterPart.regionId != 0)
                    where.Add(String.Format("regionId = {0}", filterPart.regionId));

                if (filterPart.userId != 0 && filterPart.userId != null)
                    where.Add(String.Format("userId = {0}", filterPart.userId));

                string selectCommand = "SELECT * FROM RimWithTyreView WITH(NOLOCK)";
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
                            Console.WriteLine("Execute RiwmWithTyreAll is {0} ms", executewatch.ElapsedMilliseconds);
                            while (sqlDataReader.Read())
                            {
                                RimWithTyreView itemView = EnrichManager.EnrichRimWithTyreView(sqlDataReader);

                                items.Add(EnrichManager.EnrichDisplayPartView(itemView));
                            }
                        }
                    }
                    carsAllwatch.Stop();
                    Console.WriteLine("Elapsed Time GetTyres Details is {0} ms", carsAllwatch.ElapsedMilliseconds);


                    sqlConnection.Close();
                }

                if (filterPart.hasImages)
                {
                    items = items.Where(x => x.numberImages > 0).ToList();
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);

                throw new AppException($"Exception in function SearchForRimTyres {exception.Message}");
            }
            finally
            {

            }
            SearchResult searchResult = new SearchResult();
            searchResult.data = items.ToArray();
            foreach (var item in searchResult.data) item.Normalize();

            searchResult.size = items.Count;
            searchResult.filter = filterPart;
            return searchResult;
        }

        static public async Task<RimWithTyreView> GetRimWithTyreByIdAsync(long rimId)
        {
            RimWithTyreView rimWithTyre = null;

            await Task.Run(() =>
            {
                rimWithTyre = GetRimWithTyreById(rimId);
            });

            return rimWithTyre;
        }


        static public RimWithTyreView GetRimWithTyreById(long rimId)
        {
            string storeProcedureName = "RimWithTyreById";
            RimWithTyreView rimWithTyreView = new RimWithTyreView();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {


                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@rimWithTyreId", System.Data.SqlDbType.BigInt).Value = rimId;

                        connection.Open();
                        int rows = command.ExecuteNonQuery();
                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            if (sqlDataReader.Read())
                            {
                                rimWithTyreView = EnrichManager.EnrichRimWithTyre(sqlDataReader);
                            }
                        }
                        connection.Close();
                    }
                }
            }
            catch (Exception e)
            {
                throw new AppException($"Exception in RimWithTyreById {e.Message}");
            }
            return rimWithTyreView;
        }

        internal static async Task<bool> MainPictureAsync(long id, string mainPicture, int userId)
        {
            string storeProcedureName = "UpdateMainPictureTyre";

            if (userId == 0)
                throw new AppException("User id is not provided");

            if (mainPicture == null) mainPicture = "";

            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@partId", System.Data.SqlDbType.BigInt).Value = id;
                        command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = mainPicture;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in MainPicture : {exception.Message}");
            }

            return true;
        }
    }
}
