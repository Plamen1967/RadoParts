using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
using Rado.Abuse;
using Rado.Enrich;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class PartDbSet
    {
        static object dictionaryLock = new object();
        static private Dictionary<long, SearchResult> dictionaryParts = new Dictionary<long, SearchResult>();


        #region Search

        //public static bool checkItem(DisplayPartView item )
        //{
        //    return false;
        //}

        //static void checkDictionary(long id)
        //{
        //    return;
        //    SearchResult result = dictionaryParts[id];
        //    List<long> foundIds = new List<long>();
        //    using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
        //    {
        //        using (SqlCommand sqlCommand = new SqlCommand("CheckIds", sqlConnection))
        //        {
        //            sqlCommand.CommandType = CommandType.StoredProcedure;

        //            List<long> ids = new List<long>();
        //            foreach (var item in result.data)
        //            {
        //                ids.Add(item.id);
        //            }
        //            string stringIds = ToString.Join(",", ids);

        //            sqlCommand.Parameters.Add("@ids", SqlDbType.VarChar).Value = stringIds;
        //            sqlConnection.Open();
        //            using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
        //            {
        //                Stopwatch stopwatch = new Stopwatch();
        //                while (sqlDataReader.Read())
        //                {
        //                    foundIds.Add(Convert.ToInt64(sqlDataReader["id"]));
        //                }
        //            }
        //            sqlConnection.Close();
        //        }
        //    }

        //    List<DisplayPartView> list = result.data.ToList<DisplayPartView>();

        //    list.RemoveAll(item => !foundIds.Contains(item.id));

        //    result.data = list.ToArray();
        //    dictionaryParts[id].data = result.data;
        //}
        //// Used in Home search 

        //static public SearchResult updateDictionary(long id)
        //{
        //    var dictionary = dictionaryParts[id];
        //    List<DisplayPartView> data = new List<DisplayPartView>();
        //    foreach(var item in dictionary.data)
        //    {
        //        if (item.isCar)
        //        {
        //            try
        //            {
        //                CarView car = CarsDbSet.GetCarById(item.id);
        //                if (car != null)
        //                {
        //                    PartView partView = new PartView();
        //                    car.InitPartViewFromCar(ref partView, false);
        //                    DisplayPartView displayPartView = new DisplayPartView(partView);
        //                    data.Add(displayPartView);
        //                }
        //            }
        //            catch(Exception exeption)
        //            {

        //            }
        //        }
        //        else
        //        {

        //            try
        //            {
        //                PartView partView = GetPart(item.id, item.userId); ;
        //                if (partView != null)
        //                {
        //                    DisplayPartView displayPartView = new DisplayPartView(partView);
        //                    data.Add(displayPartView);
        //                }
        //            }
        //            catch (Exception exeption)
        //            {

        //            }
        //        }


        //    }

        //    dictionary.data = data.ToArray();
        //    return dictionary;
        //}

        //static public async Task<SearchResult> SearchForParts(FilterPart filterPart)
        //{
        //    lock(dictionaryLock)
        //    {
        //        try
        //        {
        //            if (filterPart.id != 0 && dictionaryParts.ContainsKey(filterPart.id))
        //            {
        //                updateDictionary(filterPart.id);
        //                return dictionaryParts[filterPart.id];
        //            }
        //        }
        //        catch(Exception exp)
        //        {
        //            Logger.LogFunctionInfo("SearchForParts");
        //            Logger.LogException(exp.Message);
        //            throw new Exception("Dictionary");
        //        }
        //    }
        //    PartView[] partView = await getPartsAsync(filterPart);
        //    DisplayPartView[] displayPartView = partView.Select((part) => new DisplayPartView(part)).ToArray();
           
            
        //    SearchResult searchResult = new SearchResult();
        //    searchResult.data = displayPartView;
        //    searchResult.size = displayPartView.Length;

        //    lock (dictionaryLock)
        //    {
        //        dictionaryParts[filterPart.id] = searchResult;
        //    }

        //    return searchResult;
        //}
        //#endregion

        //static async public Task<SearchResult> SearchForPartsPerUser(FilterPart filterPart)
        //{
        //    lock (dictionaryLock)
        //    {
        //        if (dictionaryParts.ContainsKey(filterPart.id))
        //        {
        //            updateDictionary(filterPart.id);
        //            return dictionaryParts[filterPart.id];
        //        }
        //    }
        //    Stopwatch stopwatch = new Stopwatch();
        //    stopwatch.Start();

        //    PartView[] partView = await getPartsAsync(filterPart);
        //    DisplayPartView[] displayPartView = partView.Select((part) => new DisplayPartView(part)).ToArray();

        //    stopwatch.Stop();

        //    SearchResult searchResult = new SearchResult();
        //    searchResult.data = displayPartView;
        //    searchResult.size = displayPartView.Length;
        //    searchResult.duration = stopwatch.ElapsedMilliseconds;

        //    lock (dictionaryLock)
        //    {
        //        dictionaryParts[filterPart.id] = searchResult;
        //    }

        //    return searchResult;
        //}

        //#region Serach by part number
        //static public SearchResult SearchPartByNumber(FilterPart filterPart)
        //{
        //    lock (dictionaryLock)
        //    {
        //        if (dictionaryParts.ContainsKey(filterPart.id))
        //        {
        //            updateDictionary(filterPart.id);
        //            return dictionaryParts[filterPart.id];
        //        }
        //    }

        //    filterPart.userId = 0;
        //    PartView[] partView = getPartsByNumber(filterPart);
        //    DisplayPartView[] displayPartView = partView.Select((part) => new DisplayPartView(part)).ToArray();

        //    SearchResult searchResult = new SearchResult();
        //    searchResult.data = displayPartView;
        //    searchResult.size = displayPartView.Length;

        //    lock (dictionaryLock)
        //    {
        //        dictionaryParts[filterPart.id] = searchResult;
        //    }

        //    return searchResult;
        //}

        //static private PartView[] getPartsByNumber(FilterPart filterPart)
        //{
        //    List<PartView> parts = new List<PartView>();
        //    if (filterPart.partNumber == null && filterPart.partNumber.Trim().Length == 0)
        //    {
        //        return parts.ToArray();
        //    }

        //    try
        //    {
        //        using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
        //        {
        //            using (SqlCommand sqlCommand = new SqlCommand("PartByNumberAll", sqlConnection))
        //            {
        //                sqlCommand.CommandType = CommandType.StoredProcedure;

        //                sqlCommand.Parameters.Add("@partNumber", System.Data.SqlDbType.Int).Value = filterPart.partNumber.Trim();

        //                sqlConnection.Open();
        //                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
        //                {
        //                    Stopwatch stopwatch = new Stopwatch();
        //                    stopwatch.Start();
        //                    while (sqlDataReader.Read())
        //                    {
        //                        PartView partView = new PartView();
        //                        partView.InitFromRow(sqlDataReader);

        //                        parts.Add(partView);
        //                    }
        //                    stopwatch.Stop();
        //                    Console.WriteLine("Elapsed Time PartsAll is {0} ms", stopwatch.ElapsedMilliseconds);
        //                }
        //                sqlConnection.Close();
        //            }
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        throw new AppException($" Error in GetParts : {exception.Message}");
        //    }
        //    finally
        //    {
        //    }

        //    return parts.ToArray();
        //}

        #endregion

        #region Others
        private static async Task FillDetailsFromCar(Part part)
        {
            if (part.CarId != null)
            {
                CarView carView = await CarsDbSet.GetCarByIdAsync(part.CarId.Value);
                EnrichManager.InitPartViewFromCar(carView, part);
            }
        }

        public static async Task<PartView[]> GetPartsByCarIdAsync(long carId, long userId)
        {
            PartView[] parts = await GetPartsByCarId(carId, userId);

            return parts;
        }

        private static async Task<PartView[]> GetPartsByCarId(long carId, long userId)
        {
            string storedProcedure = "PartsPerCar";

            List<PartView> parts = new List<PartView>();
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    _ = Task.Run(async () =>
                    {
                        await LoggerUtil.Log(String.Format("PartDbSet::GetParts SQL {0}", Program.ConnectionString));
                    });

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@carId", SqlDbType.BigInt).Value = carId;
                        sqlCommand.Parameters.Add("@userId", SqlDbType.BigInt).Value = userId;

                        await sqlConnection.OpenAsync();

                        await using (SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            while (await sqlDataReader.ReadAsync())
                            {
                                PartView part = EnrichManager.EnrichPartView(sqlDataReader);
                                parts.Add(part);
                            }
                        }
                        await sqlConnection.CloseAsync();
                    }
                }
            }
            catch (Exception e)
            {

                LoggerUtil.LogException(e);
                System.Console.WriteLine(e.ToString());
            }
            finally
            {
            }

            return parts.ToArray();

        }
        public static async Task<PartView> GetPartAsync(long partId)
        {
            PartView partView = null;
            await Task.Run(() =>
            {
                partView = GetPart(partId);
            });

            return partView;
        }

        public static PartView GetPart(long partId)
        {
            string statement = "PartsById";
            PartView partView = new PartView();
            try
            {
                using SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
                using SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.Add("partId", SqlDbType.BigInt).Value = partId;

                sqlConnection.Open();
                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                {
                    if (sqlDataReader.Read())
                    {
                        partView = EnrichManager.EnrichPartView(sqlDataReader);
                    }
                }
                sqlConnection.Close();
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
            }
            finally
            {
            }

            return partView;
        }


        public static async Task<NumberPartsPerCategory[]> GetNumberPartsPerCategoryAsync(FilterNumberPartsPerCategory filterNumberPartsPerCategory)
        {
            List<NumberPartsPerCategory> result = new List<NumberPartsPerCategory>();

            try
            {
                string statement = "CategoryView";
                await using SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
                await using SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection);
                sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                       
                if (filterNumberPartsPerCategory.companyId != 0)
                {
                    sqlCommand.Parameters.Add("@companyId", System.Data.SqlDbType.BigInt).Value = filterNumberPartsPerCategory.companyId;
                }

                sqlCommand.Parameters.Add("@bus", System.Data.SqlDbType.BigInt).Value = filterNumberPartsPerCategory.bus;

                if (filterNumberPartsPerCategory.modelId != 0)
                {
                    if (filterNumberPartsPerCategory.modelId > 10000)
                        sqlCommand.Parameters.Add("@groupModelId", System.Data.SqlDbType.BigInt).Value = filterNumberPartsPerCategory.modelId;
                    else
                        sqlCommand.Parameters.Add("@modelId", System.Data.SqlDbType.BigInt).Value = filterNumberPartsPerCategory.modelId;

                }

                if (filterNumberPartsPerCategory.modificationId != 0)
                {
                    sqlCommand.Parameters.Add("@modificationId", System.Data.SqlDbType.Int).Value = filterNumberPartsPerCategory.modificationId;
                }

                if (filterNumberPartsPerCategory.userId != 0)
                {
                    sqlCommand.Parameters.Add("@userId", System.Data.SqlDbType.BigInt).Value = filterNumberPartsPerCategory.userId;
                }
                else if (!filterNumberPartsPerCategory.adminRun)
                {
                    sqlCommand.Parameters.Add("@suspended", System.Data.SqlDbType.BigInt).Value = 0;
                }

                if (filterNumberPartsPerCategory.hasImages)
                {
                    sqlCommand.Parameters.Add("@hasImages", System.Data.SqlDbType.Int).Value = 1;
                }
                else
                {
                    sqlCommand.Parameters.Add("@hasImages", System.Data.SqlDbType.Int).Value = 0;
                }
                await sqlConnection.OpenAsync();
                List<string> modelsId= new List<string>();
                if (filterNumberPartsPerCategory.modelsId != null && filterNumberPartsPerCategory.modelsId.Length > 0)
                {
                    modelsId = filterNumberPartsPerCategory.modelsId.Split(',').ToList();
                }

                List<string> modificationsId = new List<string>();
                if (filterNumberPartsPerCategory.modificationsId != null && filterNumberPartsPerCategory.modificationsId.Length > 0)
                {
                    modificationsId = filterNumberPartsPerCategory.modificationsId.Split(',').ToList();
                }

                int g = 1;
                int m = 1;
                if (modelsId.Count > 0)
                {
                    foreach (string modelId in modelsId)
                    {
                        long modelIdValue = Int64.Parse(modelId);
                        if (modelIdValue > 10000)
                        {
                            sqlCommand.Parameters.Add($"@groupModel{m++}nextId", System.Data.SqlDbType.BigInt).Value = modelIdValue;
                        }
                        else
                        {
                            sqlCommand.Parameters.Add($"@model{g++}nextId", System.Data.SqlDbType.BigInt).Value = modelIdValue;
                        }
                        if (m > 5) break;
                        if (g > 5) break;
                    }
                }

                int i = 1;
                if (modificationsId.Count > 0)
                {
                    foreach (string modificationId in modificationsId)
                    {
                        long modificationIdValue = Int64.Parse(modificationId);
                        sqlCommand.Parameters.Add($"@modification{i++}nextId", System.Data.SqlDbType.BigInt).Value = modificationIdValue;
                        if (i > 5) break;
                    }

                }

                await using (var sqlDataReader = await sqlCommand.ExecuteReaderAsync())
                {
                    List<Tuple<int, int, int>> data = new ();

                    while (await sqlDataReader.ReadAsync())
                    {
                        int categoryId = Convert.ToInt32(sqlDataReader["categoryId"]);
                        int subCategoryId = Convert.ToInt32(sqlDataReader["subCategoryId"]);
                        int count = Convert.ToInt32(sqlDataReader["countPart"]);
                        data.Add(Tuple.Create(categoryId, subCategoryId, count));
                    }

                    foreach(var count in data)
                    {
                        if (result.Exists(item => count.Item1 == item.CategoryId))
                        {
                            NumberPartsPerCategory category = result.Find(item => count.Item1 == item.CategoryId);
                            category.NumberParts += count.Item3;
                            int subCategoryId = count.Item2;
                            string subCategoryName = SubCategoriesDbSet.GetSubCategoryById(count.Item2).SubCategoryName;
                            category.SubCategories.Add(new SubCategory()
                            {
                                CategoryId = category.CategoryId,
                                SubCategoryName = subCategoryName,
                                SubCategoryId = subCategoryId,
                                Count = count.Item3,
                            });
                        }
                        else
                        {
                            NumberPartsPerCategory category = new NumberPartsPerCategory()
                            {
                                CategoryId = count.Item1,
                                CategoryName = (await CategoriesDbSet.GetCategoryByIdAsync(count.Item1)).CategoryName,
                                NumberParts = count.Item3,
                            };
                            int subCategoryId = count.Item2;
                            string subCategoryName = SubCategoriesDbSet.GetSubCategoryById(subCategoryId).SubCategoryName;
                            category.SubCategories = 
                            [
                                new SubCategory()
                                {
                                    CategoryId = category.CategoryId,
                                    SubCategoryName = subCategoryName,
                                    SubCategoryId = subCategoryId,
                                    Count = count.Item3,
                                }
                            ];

                            result.Add(category);
                        }
                    }
                }
                await sqlConnection.CloseAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return result.ToArray(); //return GetAllCategories(); // 
        }
        #endregion

        #region Update Part

        public static async Task<DisplayPartView> UpdatePartAsync(Part part)
        {
            DisplayPartView displayPartView = await AddUpdatePartAsync(part, true);

            return displayPartView;
        }

        public static async Task<DisplayPartView> AddPartAsync(Part part)
        {
            DisplayPartView displayPartView = await AddUpdatePartAsync(part, false);

            return displayPartView;
        }

        private static async Task ValidatePartAsync(Part part)
        {
            if (part.Bus == 0 && part.ModificationId == 0)
            {
                var message = $"ModificationId is not provided if the part is not for a car {part.CarId}";
                await LoggerUtil.Log(message);
                throw new AppException(message);
            }

            if (part.PartId == 0)
            {
                var message = $"PartId is not provided ";
                await LoggerUtil.Log(message);
                throw new AppException(message);
            }

            if (part.DealerSubCategoryId == 0)
            {
                var message = $"DealerSubCategoryId not provided a car {part.CarId}";
                await LoggerUtil.Log(message);
                throw new AppException(message);
            }

            if (part.Price == 0)
            {
                var message = $"Price is not provided for a car {part.CarId}";
                await LoggerUtil.Log(message);
                throw new AppException(message);
            }

            if (part.DealerSubCategoryName.Length == 0)
            {
                var message = $"DealerSubCategoryName is not provided for a car {part.CarId}";
                await LoggerUtil.Log(message);
                throw new AppException(message);
            }

            part.Bus ??= 0;
            part.CarId ??= 0;
            part.PartNumber ??= "";
            part.Description ??= "";
            part.EngineModel ??= "";
            part.MainPicture ??= "";
        }

        private static async Task<DisplayPartView> AddUpdatePartAsync(Part part, bool update)
        {
            await LoggerUtil.Log("add part");
            await LoggerUtil.Log(JsonSerializer.Serialize(part));

            await ValidatePartAsync(part);

            var storeProcedureName = update ? "PartsUpd" : "PartsIns";

            try
            {
                if (part.CarId != 0)
                {
                    await LoggerUtil.Log("Fill car details");
                    await FillDetailsFromCar(part);
                }

                if (part.ModelId == 0 || part.ModelId == null && part.Bus == 0)
                    part.ModelId = ModificationsDbSet.GetModificationById(part.ModificationId).ModelId;

                int approved = 0;
                if (Validation.BlockPart(part))
                    approved = 2;

                part = Validation.RemoveInvalidWord(part);

                await using SqlConnection connection = new SqlConnection(Program.ConnectionString);
                await connection.OpenAsync();

                await using SqlCommand command = new SqlCommand(storeProcedureName, connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.Parameters.Add("@partId"        , SqlDbType.BigInt).Value = part.PartId;
                command.Parameters.Add("@carId"         , SqlDbType.BigInt).Value = part.CarId ?? 0;

                command.Parameters.Add("@modelId",      SqlDbType.Int).Value = part.ModelId ?? 0;
                command.Parameters.Add("@modificationId", SqlDbType.Int).Value = part.ModificationId;
                command.Parameters.Add("@dealerSubCategoryId", SqlDbType.Int).Value = part.DealerSubCategoryId;
                command.Parameters.Add("@year"          , SqlDbType.Int).Value = part.Year;

                command.Parameters.Add("@dealerSubCategoryName", SqlDbType.NVarChar).Value = part.DealerSubCategoryName;

                command.Parameters.Add("@partNumber"    , SqlDbType.NVarChar).Value = part.PartNumber;
                command.Parameters.Add("@description"   , SqlDbType.NVarChar).Value = part.Description;
                command.Parameters.Add("@price"         , SqlDbType.Decimal).Value = part.Price;
                command.Parameters.Add("@leftRightPosition", SqlDbType.Int).Value = part.LeftRightPosition ?? 0;
                command.Parameters.Add("@frontBackPosition", SqlDbType.Int).Value = part.FrontBackPosition ?? 0;

                command.Parameters.Add("@engineType"    , SqlDbType.Int).Value = part.EngineType ?? 0;
                command.Parameters.Add("@engineModel"   , SqlDbType.NVarChar).Value = part.EngineModel ?? "";
                command.Parameters.Add("@gearboxType"   , SqlDbType.Int).Value = part.GearboxType ?? 0;
                command.Parameters.Add("@powerkWh"      , SqlDbType.Int).Value = part.PowerkWh ?? 0;
                command.Parameters.Add("@powerBHP"      , SqlDbType.Int).Value = part.PowerBHP ?? 0;
                command.Parameters.Add("@millage"        , SqlDbType.Int).Value = part.Millage ?? 0;

                command.Parameters.Add("@regionId"      , SqlDbType.Int).Value = part.RegionId;
                command.Parameters.Add("@mainPicture", SqlDbType.NVarChar).Value = part.MainPicture ?? "";
                command.Parameters.Add("@mainImageId", SqlDbType.BigInt).Value = part.MainImageId;

                command.Parameters.Add("@approved",         SqlDbType.Int).Value = approved;
                command.Parameters.Add("@modifiedTime"  , SqlDbType.BigInt).Value = part.ModifiedTime;
                command.Parameters.Add("@userId"        , SqlDbType.Int).Value = part.UserId;
                if (!update)
                    command.Parameters.Add("@bus", SqlDbType.Int).Value = part.Bus;

                await command.ExecuteNonQueryAsync();
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in AddUpdatePart : {exception.Message}");
            }

            PartView partView = await GetPartAsync(part.PartId);
            return EnrichManager.EnrichDisplayPartView(partView);
        }


        public static async Task<bool> DeletePartAsync(long partId, int userId)
        {
            string storeProcedureName = "PartsDel";
            if (userId == 0)
            {
                throw new AppException("User id is not provided");
            }
            try
            {
                await using SqlConnection connection = new SqlConnection(Program.ConnectionString);
                await connection.OpenAsync();

                await using SqlCommand command = new SqlCommand(storeProcedureName, connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.Parameters.Add("@partId", SqlDbType.BigInt).Value = partId;
                command.Parameters.Add("@userId", SqlDbType.Int).Value = userId;

                int rows = await command.ExecuteNonQueryAsync();
                if (rows == 0)
                {
                    throw new AppException($"Частта не може да бъде изтрита");
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in DeletePart : {exception.Message}");
            }

            return true;
        }
        public static async Task<PartView[]> GetPartsAsync(Filter filterPart)
        {
            List<PartView> list = await getPartsAsync(filterPart);
            return list.ToArray();
        }

        public static async Task<List<PartView>> getPartsAsync(Filter filterPart)
        {
            string selectCommand = "SELECT * FROM PartFilterView WITH(NOLOCK)";
            if (filterPart.UserId == null) filterPart.UserId = 0;
            string test = "";
            List<string> where = new List<string>();
            List<PartView> parts = new List<PartView>();
            var startTime = Environment.TickCount;
            try
            {
                await using SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
                if (filterPart.CarId != 0)
                    where.Add($"(carId = {filterPart.CarId})");

                if (filterPart.ModificationId != 0)
                {
                    where.Add($"(modificationId = {filterPart.ModificationId})");
                }
                else if (filterPart.ModelId != 0)
                {
                    if (ModelsDbSet.isGroupModel(filterPart.ModelId))
                    {
                        where.Add($"(groupModelId  = {filterPart.ModelId})");
                    }
                    else
                    {
                        where.Add($"(modelId = {filterPart.ModelId})");
                    }
                }
                else if (filterPart.CompanyId != 0)
                    where.Add($"(companyId  = {filterPart.CompanyId})");

                if (filterPart.ModelsId != null && filterPart.ModelsId.Length > 0)
                {
                    where.Add($"(modelId in ({string.Join(",", filterPart.ModelsId)}) or groupModelId in ({string.Join(",", filterPart.ModelsId)}))");
                }
                if (filterPart.ModificationsId != null && filterPart.ModificationsId.Length > 0)
                {
                    where.Add($"(modificationId in ({string.Join(",", filterPart.ModificationsId)}))");
                }
                if (filterPart.Year != 0)
                    where.Add($"(year = {filterPart.Year})");

                if (filterPart.CategoryId != 0)
                {
                    where.Add($"(categoryId = {filterPart.CategoryId})");
                }

                if (filterPart.CategoriesId != null && filterPart.CategoriesId.Length > 0)
                {
                    where.Add($"(categoryId in ({string.Join(",", filterPart.CategoriesId)}))");
                }

                if (filterPart.SubCategoryId != 0)
                {
                    where.Add($"(subCategoryId = {filterPart.SubCategoryId})");
                }

                if (filterPart.SubCategoriesId != null && filterPart.SubCategoriesId.Length > 0)
                {
                    where.Add($"(subCategoryId in ({string.Join(",", filterPart.SubCategoriesId)}))");
                }

                if (filterPart.EngineType != 0)
                    where.Add($"(engineType = {filterPart.EngineType})");

                if (filterPart.EngineModel != null && filterPart.EngineModel.Length > 0)
                    where.Add($"(partNumber like '{filterPart.EngineModel}%')");

                if (filterPart.GearboxType != 0)
                    where.Add($"(gearboxType = {filterPart.GearboxType})");

                if (filterPart.PowerBHP != 0)
                    where.Add($"(powerBHP = {filterPart.PowerBHP})");

                if (filterPart.RegionId != 0)
                    where.Add($"(regionId = {filterPart.RegionId})");

                if (filterPart.Bus == -2)
                    where.Add("carId = 0");
                if (filterPart.Bus == 0)
                {
                    where.Add("bus = 0");
                }
                if (filterPart.Bus == 1)
                {
                    where.Add("bus = 1");
                }

                if (filterPart.AdminRun)
                {
                    if (filterPart.Approved != ApprovedType.All)
                        where.Add($"(approved = {(int)filterPart.Approved})");
                    if (filterPart.UserId != 0 && filterPart.UserId != null)
                        where.Add($"(userId = {filterPart.UserId})");
                }
                else if (filterPart.UserId != 0 && filterPart.UserId != null)
                    where.Add($"(userId = {filterPart.UserId})");
                else if (!filterPart.AdminRun)
                {
                    where.Add($"(approved <> 2)");
                    where.Add($"(suspended = 0)");
                }

                if (filterPart.PartNumber != null && filterPart.PartNumber.Trim().Length > 0)
                    where.Add($"(partNumber like '{filterPart.PartNumber}%')");

                if (filterPart.Categories?.Length > 0)
                {
                    where.Add($"(categoryId in ({string.Join(",", filterPart.Categories)}))");
                }

                if (filterPart.Keyword != null && filterPart.Keyword.Length > 0)
                {
                    string[] keywords = filterPart.Keyword.Split(' ');
                    List<string> or = new List<string>();
                    foreach (string keyword in keywords)
                    {
                        double len = keyword.Length;
                        len = len * 0.75;
                        int lenInt = (int)(len + 0.5);
                        string newKeyword = keyword.ToLower().Substring(0, lenInt);

                        or.Add($"(keyword like '%{newKeyword}%')");
                    }

                    if (or.Count > 0)
                    {
                        string orString = $"({string.Join(" OR ", or)})";
                        where.Add(orString);
                    }
                }

                if (where.Count > 0)
                {
                    selectCommand += " WHERE " + String.Join(" AND ", where.ToArray());
                }

                test = test + selectCommand;
                LoggerUtil.LogFunctionInfo($"Select command: {selectCommand}");
                await sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand(selectCommand, sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.Text;

                    _ = Task.Run(async() =>
                    {
                        await LoggerUtil.Log($"PartDbSet::GetParts SQL {Program.ConnectionString}");
                    });
                    LoggerUtil.LogFunctionInfo($"Execute command: {selectCommand}");

                    using (SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        while (await sqlDataReader.ReadAsync())
                        {
                            LoggerUtil.LogFunctionInfo($"ReadAsync: {selectCommand}");
                            PartView partView = EnrichManager.EnrichPartView(sqlDataReader);

                            parts.Add(partView);
                        }

                    }

                    _ = Task.Run(async () =>
                    {
                        await LoggerUtil.Log($"PartDbSet::GetParts SQL {test} runs for {Environment.TickCount - startTime} ms");
                        LoggerUtil.LogInfo($"PartDbSet::GetParts Read all parts is {Environment.TickCount - startTime} ms");
                    });
                }
                await sqlConnection.CloseAsync();
            }
            catch (Exception exception)
            {
                _ = Task.Run(() =>
                {
                    LoggerUtil.LogFunctionInfo("getPartAsync");
                    LoggerUtil.Log(exception);
                });

            }

            return parts;
        }
        public static async Task<bool> MainPictureAsync(long partId, string mainPicture, int userId)
        {
            string storeProcedureName = "UpdateMainPicturePart";

            if (userId == 0)
                throw new AppException("User id is not provided");

            if (mainPicture == null) mainPicture = "";

            try
            {
                await using SqlConnection connection = new SqlConnection(Program.ConnectionString);
                await connection.OpenAsync();
                await using SqlCommand command = new SqlCommand(storeProcedureName, connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.Parameters.Add("@partId", SqlDbType.BigInt).Value = partId;
                command.Parameters.Add("@mainPicture", SqlDbType.NVarChar).Value = mainPicture;
                command.Parameters.Add("@userId", SqlDbType.Int).Value = userId;

                await command.ExecuteNonQueryAsync();
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in MainPicture : {exception.Message}");
            }

            return true;

        }

        private static async Task<PartView[]> getParts(Filter filterPart)
        {
            string selectCommand = "SELECT * FROM Parts WITH(NOLOCK)";
            if (filterPart.UserId == null) filterPart.UserId = 0;
            string test = "";
            List<string> where = new List<string>();
            List<PartView> parts = new List<PartView>();
            var startTime = Environment.TickCount;
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    if (filterPart.CarId != 0)
                        where.Add($"carId = {filterPart.CarId}");

                    if (filterPart.CompanyId != 0)
                        where.Add($"modelId IN(SELECT modelId FROM Rado WHERE companyId = {filterPart.CompanyId}) ");

                    if (filterPart.ModelId != 0)
                        where.Add($"modelId = {filterPart.ModelId}");

                    if (filterPart.ModificationId != 0)
                        where.Add($"modificationId = {filterPart.ModificationId}");

                    if (filterPart.Year != 0)
                        where.Add($"year = {filterPart.Year}");

                    if (filterPart.CategoryId != 0)
                    {
                        where.Add($"categoryId = {filterPart.CategoryId}");
                    }

                    if (filterPart.SubCategoryId != 0)
                    {
                        where.Add($"subCategoryId = {filterPart.SubCategoryId}");
                    }

                    if (filterPart.EngineType != 0)
                        where.Add($"engineType = {filterPart.EngineType}");

                    if (filterPart.GearboxType != 0)
                        where.Add($"gearboxType = {filterPart.GearboxType}");

                    if (filterPart.PowerBHP != 0)
                        where.Add($"powerBHP = {filterPart.PowerBHP}");

                    if (filterPart.RegionId != 0)
                        where.Add($"regionId = {filterPart.RegionId}");

                    if (filterPart.UserId != 0 && filterPart.UserId != null)
                        where.Add($"userId = {filterPart.UserId}");

                    if (filterPart.PartNumber != null && filterPart.PartNumber.Trim().Length > 0)
                        where.Add($"partNumber = {filterPart.PartNumber}");
                        
                    if (filterPart.Categories?.Length > 0)
                    {
                        where.Add($"categoryId in ({filterPart.Categories})");
                    }

                    if (filterPart.Keyword != null && filterPart.Keyword.Length > 0)
                    {
                        string[] keywords = filterPart.Keyword.Split(' ');
                        List<string> or = new List<string>();
                        foreach (string keyword in keywords)
                        {
                            or.Add($"keyword like '%{keyword.ToLower()}%'");
                        }

                        if (or.Count > 0)
                        {
                            string orString = $"({String.Join(" OR ", or.ToArray())})";
                            where.Add(orString);
                        }
                    }

                    if (where.Count > 0)
                    {
                        selectCommand += " WHERE " + String.Join(" AND ", where.ToArray());
                    }

                    test = test + selectCommand;
                    await using SqlCommand sqlCommand = new SqlCommand(selectCommand, sqlConnection);
                    sqlCommand.CommandType = CommandType.Text;

                    await using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                    {
                        while (sqlDataReader.Read())
                        {
                            PartView partView = EnrichManager.EnrichPartView(sqlDataReader);

                            parts.Add(partView);
                        }

                    }
                    sqlConnection.Close();

                    await LoggerUtil.Log($"PartDbSet::GetParts Read all parts is {Environment.TickCount - startTime} ms");
                }

                if (filterPart.HasImages)
                {
                    test = test + " Message ";
                    parts = parts.Where(x => x.NumberImages > 0).ToList();
                }

                await LoggerUtil.Log(String.Format("PartDbSet::GetParts Read all cars is {0} ms", Environment.TickCount - startTime));
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in GetParts : {exception.Message} {test}");
            }
            finally
            {
            }

            //if (filterPart.orderBy == OrderBy.PriceAsc)
            //    parts.OrderBy(a => a.price);
            //else if (filterPart.orderBy == OrderBy.YearDesc)
            //    parts.OrderBy(a => a.year);
            //else if (filterPart.orderBy == OrderBy.modifiedTimeDesc)
            //    parts.OrderBy(a => a.modifiedTime);


            //if (filterPart.loadMainPicture)
            //{
            //    for (int i = 0; i < parts.Count && i < 10; i++)
            //    {
            //        parts[i].LoadMainImage();
            //    }
            //}

            //if (parts.Count < 500)
            //{
            //    while (parts.Count < 500)
            //    {
            //        parts.Add(parts[0]);
            //    }
            //}
            return parts.ToArray();

        }

        #endregion

        //static public PartView[] GetParts(Filter filterPart)
        //{
        //    return getParts(filterPart);
        //}

        //static public NumberPartsPerCategory[] GetAllCategories()
        //{
        //    List<NumberPartsPerCategory> result = new List<NumberPartsPerCategory>();
        //    Category[] categories = CategoriesDbSet.GetCategories();
        //    foreach(Category category in categories)
        //    {
        //        NumberPartsPerCategory numberCategory = new NumberPartsPerCategory()
        //        {
        //            categoryId = category.categoryId,
        //            numberParts = 1,
        //            categoryName = CategoriesDbSet.GetCategoryById(category.categoryId).categoryName
        //        };
        //        numberCategory.subCategories = SubCategoriesDbSet.GetSubCategories(category.categoryId).ToArray();
        //        result.Add(numberCategory);
        //    }

        //    return result.ToArray();

        //}

        //static public SearchResult GetSearchResult(long query)
        //{
        //    lock (dictionaryLock)
        //    {
        //        if (dictionaryParts.ContainsKey(query))
        //        {
        //            updateDictionary(query);z
        //            return dictionaryParts[query];
        //        }
        //    }

        //    return new SearchResult();
        //}
    }
}