using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
using Models.Models.Utility;
using Rado.Enrich;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
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

                    if (rimWithTyre.MainPicture == null) rimWithTyre.MainPicture = "";

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@rimWithTyreId", System.Data.SqlDbType.BigInt).Value = rimWithTyre.RimBoltCount;
                        command.Parameters.Add("@tyreCompanyId", System.Data.SqlDbType.Int).Value = rimWithTyre.TyreCompanyId;
                        command.Parameters.Add("@tyreWidth", System.Data.SqlDbType.Int).Value = rimWithTyre.TyreCompanyId;
                        command.Parameters.Add("@tyreHeight", System.Data.SqlDbType.Int).Value = rimWithTyre.TyreCompanyId;
                        command.Parameters.Add("@tyreRadius", System.Data.SqlDbType.Int).Value = rimWithTyre.TyreHeight;
                        command.Parameters.Add("@tyreType", System.Data.SqlDbType.Int).Value = rimWithTyre.TyreCompanyId;
                        command.Parameters.Add("@companyId", System.Data.SqlDbType.Int).Value = rimWithTyre.CompanyId;
                        command.Parameters.Add("@modelId", System.Data.SqlDbType.Int).Value = rimWithTyre.ModelId;
                        command.Parameters.Add("@rimWidth", System.Data.SqlDbType.Int).Value = rimWithTyre.RimWidth;
                        command.Parameters.Add("@rimMaterial", System.Data.SqlDbType.Int).Value = rimWithTyre.RimMaterial;
                        command.Parameters.Add("@rimOffset", System.Data.SqlDbType.Int).Value = rimWithTyre.RimOffset;
                        command.Parameters.Add("@rimBoltCount", System.Data.SqlDbType.Int).Value = rimWithTyre.RimBoltCount;
                        command.Parameters.Add("@rimBoltDistance", System.Data.SqlDbType.Int).Value = rimWithTyre.RimBoltDistance;
                        command.Parameters.Add("@rimCenter", System.Data.SqlDbType.Int).Value = rimWithTyre.RimCenter;
                        command.Parameters.Add("@price", System.Data.SqlDbType.Decimal).Value = rimWithTyre.Price;
                        command.Parameters.Add("@description", System.Data.SqlDbType.NVarChar).Value = rimWithTyre.Description;
                        command.Parameters.Add("@mainImageId", System.Data.SqlDbType.Int).Value = rimWithTyre.MainImageId;
                        command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = rimWithTyre.MainPicture;
                        command.Parameters.Add("@regionId", System.Data.SqlDbType.Int).Value = rimWithTyre.RegionId;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = rimWithTyre.UserId;
                        command.Parameters.Add("@modifiedTime", System.Data.SqlDbType.BigInt).Value = rimWithTyre.ModifiedTime;
                        command.Parameters.Add("@count", System.Data.SqlDbType.Int).Value = rimWithTyre.Count;
                        command.Parameters.Add("@month", System.Data.SqlDbType.Int).Value = rimWithTyre.MonthDOT;
                        command.Parameters.Add("@year", System.Data.SqlDbType.Int).Value = rimWithTyre.YearDOT;

                        if (!update) command.Parameters.Add("@itemType", System.Data.SqlDbType.Int).Value = rimWithTyre.ItemType;

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

            return EnrichManager.EnrichDisplayPartView(await GetRimWithTyreByIdAsync(rimWithTyre.RimWithTyreId));
        }

        public static SearchResult SearchForRimTyres(Filter filterPart)
        {
            List<DisplayPartView> items = new List<DisplayPartView>();
            try
            {
                List<string> where = new List<string>();
                if (filterPart.ItemType != ItemType.None && filterPart.ItemType != ItemType.AllTyre)
                where.Add($"itemType = {((int)filterPart.ItemType)}");

                if (filterPart.TyreCompanyId != 0)
                    where.Add($"tyreCompanyId = {filterPart.TyreCompanyId}");

                if (filterPart.TyreWidth != 0)
                    where.Add($"tyreWidth  = {filterPart.TyreWidth}");

                if (filterPart.TyreHeight != 0)
                    where.Add($"tyreHeight = {filterPart.TyreHeight}");

                if (filterPart.TyreRadius != 0)
                    where.Add($"tyreRadius = {filterPart.TyreRadius}");

                if (filterPart.TyreType != 0)
                    where.Add($"tyreType = {filterPart.TyreType}");

                if (filterPart.CompanyId != 0)
                    where.Add($"companyId = {filterPart.CompanyId}");

                if (filterPart.ModelId != 0)
                {
                    if (ModelsDbSet.isGroupModel(filterPart.ModelId))
                    {
                        where.Add($"groupModelId  = {filterPart.ModelId}");
                    }
                    else
                    {
                        where.Add($"modelId = {filterPart.ModelId}");
                    }
                }

                if (filterPart.RimWidth != 0)
                    where.Add($"rimWidth = {filterPart.RimWidth}");

                if (filterPart.RimMaterial != 0)
                    where.Add($"rimMaterial = {filterPart.RimMaterial}");

                if (filterPart.RimOffset != 0)
                    where.Add($"rimOffset = {filterPart.RimOffset}");

                if (filterPart.RimBoltCount != 0)
                    where.Add($"rimBoltCount = {filterPart.RimBoltCount}");

                if (filterPart.RimBoltDistance != 0)
                    where.Add($"rimBoltDistance = {filterPart.RimBoltDistance}");

                if (filterPart.RimCenter != 0)
                    where.Add($"rimCenter = {filterPart.RimCenter}");

                if (filterPart.RegionId != 0)
                    where.Add($"regionId = {filterPart.RegionId}");

                if (filterPart.UserId != 0 && filterPart.UserId != null)
                    where.Add($"userId = {filterPart.UserId}");

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

                if (filterPart.HasImages)
                {
                    items = items.Where(x => x.NumberImages > 0).ToList();
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
