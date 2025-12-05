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
        static private long lastId = -1;
        static readonly object lockLastId = new object();
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
        private static async Task fillDetailsFromCar(Part part)
        {
            if (part.carId != null)
            {
                CarView carView = await CarsDbSet.GetCarByIdAsync(part.carId.Value);
                EnrichManager.InitPartViewFromCar(carView, part);
            }
        }

        static public async Task<PartView[]> GetPartsByCarIdAsync(long carId, long userId)
        {
            PartView[] parts = await GetPartsByCarId(carId, userId);

            return parts;
        }
        
        static async public Task<PartView[]> GetPartsByCarId(long carId, long userId)
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

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
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
        static public async Task<PartView> GetPartAsync(long partId)
        {
            PartView partView = null;
            await Task.Run(() =>
            {
                partView = GetPart(partId);
            });

            return partView;
        }

        static public PartView GetPart(long partId)
        {
            string statement = "PartsById";
            PartView partView = new PartView();
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                    {
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
                }
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

        static public long GetNextId()
        {
            lock (lockLastId)
            {
                string storedProcedure = "GetNextId";
                if (lastId == -1)
                {
                    try
                    {
                        using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                        {
                            sqlConnection.Open();
                            using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                            {
                                SqlParameter nextIdParam = sqlCommand.Parameters.Add("@lastId", System.Data.SqlDbType.BigInt);
                                nextIdParam.Direction = ParameterDirection.Output;

                                sqlCommand.CommandType = CommandType.StoredProcedure;
                                sqlCommand.ExecuteNonQuery();

                                if (nextIdParam.Value == null)
                                    lastId = 1;
                                else
                                    lastId = (long)nextIdParam.Value + 1;
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new AppException(exception.Message);
                    }
                }
                else
                {
                    lastId++;
                }

                return lastId;
            }
        }


        static async public Task<NumberPartsPerCategory[]> GetNumberPartsPerCategoryAsync(FilterNumberPartsPerCategory filterNumberPartsPerCategory)
        {
            List<NumberPartsPerCategory> result = new List<NumberPartsPerCategory>();

            try
            {
                string statement = "CategoryView";
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                    {
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
                        List<string> modelsID= new List<string>();
                        if (filterNumberPartsPerCategory.modelsId != null && filterNumberPartsPerCategory.modelsId.Length > 0)
                        {
                            modelsID = filterNumberPartsPerCategory.modelsId.Split(',').ToList();
                        }

                        List<string> modificationsId = new List<string>();
                        if (filterNumberPartsPerCategory.modificationsId != null && filterNumberPartsPerCategory.modificationsId.Length > 0)
                        {
                            modificationsId = filterNumberPartsPerCategory.modificationsId.Split(',').ToList();
                        }

                        int g = 1;
                        int m = 1;
                        if (modelsID.Count > 0)
                        {
                            foreach (string modelID in modelsID)
                            {
                                long modelIdValue = Int64.Parse(modelID);
                                if (modelIdValue > 10000)
                                {
                                    sqlCommand.Parameters.Add($"@groupModel{m++}Id", System.Data.SqlDbType.BigInt).Value = modelIdValue;
                                }
                                else
                                {
                                    sqlCommand.Parameters.Add($"@model{g++}Id", System.Data.SqlDbType.BigInt).Value = modelIdValue;
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
                                sqlCommand.Parameters.Add($"@modification{i++}Id", System.Data.SqlDbType.BigInt).Value = modificationIdValue;
                                if (i > 5) break;
                            }

                        }
                        using (SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync())
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
                                if (result.Exists(item => count.Item1 == item.categoryId))
                                {
                                    NumberPartsPerCategory category = result.Find(item => count.Item1 == item.categoryId);
                                    category.numberParts += count.Item3;
                                    int subCategoryId = count.Item2;
                                    string subCategoryName = SubCategoriesDbSet.GetSubCategoryById(count.Item2).subCategoryName;
                                    category.subCategories.Add(new SubCategory()
                                    {
                                        categoryId = category.categoryId,
                                        subCategoryName = subCategoryName,
                                        subCategoryId = subCategoryId,
                                        count = count.Item3,
                                    });
                                }
                                else
                                {
                                    NumberPartsPerCategory category = new NumberPartsPerCategory()
                                    {
                                        categoryId = count.Item1,
                                        categoryName = (await CategoriesDbSet.GetCategoryByIdAsync(count.Item1)).categoryName,
                                        numberParts = count.Item3,
                                    };
                                    int subCategoryId = count.Item2;
                                    string subCategoryName = SubCategoriesDbSet.GetSubCategoryById(subCategoryId).subCategoryName;
                                    category.subCategories =
                                    [
                                        new SubCategory()
                                        {
                                            categoryId = category.categoryId,
                                            subCategoryName = subCategoryName,
                                            subCategoryId = subCategoryId,
                                            count = count.Item3,
                                        },
                                    ];

                                    result.Add(category);
                                }
                            }
                        }
                        await sqlConnection.CloseAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return result.ToArray(); //return GetAllCategories(); // 
        }
        #endregion

        #region Update Part

        static public async Task<DisplayPartView> UpdatePartAsync(Part part)
        {
            DisplayPartView displayPartView = await AddUpdatePartAsync(part, true);

            return displayPartView;
        }

        static public async Task<DisplayPartView> AddPartAsync(Part part)
        {
            DisplayPartView displayPartView = await AddUpdatePartAsync(part, false);

            return displayPartView;
        }

        static void ValidatePart(Part part)
        {
            if (part.userId == 0)
            {
                LoggerUtil.Log("User id is not provided").Wait();
                throw new AppException("User id is not provided");
            }
            if (part.bus == 0 && part.carId == null && part.modificationId == 0)
            {
                string message = "ModificationId is not provided if the part is not for a car";
                LoggerUtil.Log(message).Wait();
                throw new AppException(message);
            }

            if (part.dealerSubCategoryId == 0)
            {
                string message = "DealerSubCategoryId not provided";
                LoggerUtil.Log(message).Wait();
                throw new AppException(message);
            }

            if (part.price == 0)
            {
                string message = "Price is not provided";
                LoggerUtil.Log(message).Wait();
                throw new AppException(message);
            }

            if (part.dealerSubCategoryName == null || part.dealerSubCategoryName.Length == 0)
            {
                string message = "DealerSubCategoryName is not provided";
                LoggerUtil.Log(message).Wait();
                throw new AppException(message);
            }

        }

        static public async Task<DisplayPartView> AddUpdatePartAsync(Part part, bool update)
        {
            await LoggerUtil.Log("add part");
            await LoggerUtil.Log(JsonSerializer.Serialize(part));

            ValidatePart(part);

            string storeProcedureName;

            if (update)
            {
                storeProcedureName = "PartsUpd";
            }
            else
            {
                storeProcedureName = "PartsIns";
            }

            try
            {
                part.bus = part.bus ?? 0;
                part.carId = part.carId ?? 0;
                if (part.carId == null) part.carId = 0;
                if (part.partNumber == null)  part.partNumber = "";
                if (part.description == null) part.description = "";
                if (part.engineModel == null) part.engineModel = "";
                if (part.mainPicture == null) part.mainPicture = "";
                if (part.carId != 0)
                {
                    await LoggerUtil.Log("Fill car details");
                    await fillDetailsFromCar(part);
                }

                if (part.modelId == 0 || part.modelId == null && part.bus == 0)
                    part.modelId = ModificationsDbSet.GetModificationById(part.modificationId).modelId;

                int approved = 0;
                if (Validation.BlockPart(part))
                    approved = 2;

                part = Validation.RemoveInvalidWord(part);

                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@partId"        , System.Data.SqlDbType.BigInt).Value = part.partId;
                        command.Parameters.Add("@carId"         , System.Data.SqlDbType.BigInt).Value = part.carId ?? 0;

                        command.Parameters.Add("@modelId",      System.Data.SqlDbType.Int).Value = part.modelId ?? 0;
                        command.Parameters.Add("@modificationId", System.Data.SqlDbType.Int).Value = part.modificationId;
                        command.Parameters.Add("@dealerSubCategoryId", System.Data.SqlDbType.Int).Value = part.dealerSubCategoryId;
                        command.Parameters.Add("@year"          , System.Data.SqlDbType.Int).Value = part.year;

                        command.Parameters.Add("@dealerSubCategoryName", System.Data.SqlDbType.NVarChar).Value = part.dealerSubCategoryName;

                        command.Parameters.Add("@partNumber"    , System.Data.SqlDbType.NVarChar).Value = part.partNumber;
                        command.Parameters.Add("@description"   , System.Data.SqlDbType.NVarChar).Value = part.description;
                        command.Parameters.Add("@price"         , System.Data.SqlDbType.Decimal).Value = part.price;
                        command.Parameters.Add("@leftRightPosition", System.Data.SqlDbType.Int).Value = part.leftRightPosition ?? 0;
                        command.Parameters.Add("@frontBackPosition", System.Data.SqlDbType.Int).Value = part.frontBackPosition ?? 0; 

                        command.Parameters.Add("@engineType"    , System.Data.SqlDbType.Int).Value = part.engineType ?? 0;
                        command.Parameters.Add("@engineModel"   , System.Data.SqlDbType.NVarChar).Value = part.engineModel ?? "";
                        command.Parameters.Add("@gearboxType"   , System.Data.SqlDbType.Int).Value = part.gearboxType ?? 0;
                        command.Parameters.Add("@powerkWh"      , System.Data.SqlDbType.Int).Value = part.powerkWh ?? 0;
                        command.Parameters.Add("@powerBHP"      , System.Data.SqlDbType.Int).Value = part.powerBHP ?? 0;
                        command.Parameters.Add("@millage"        , System.Data.SqlDbType.Int).Value = part.millage ?? 0;

                        command.Parameters.Add("@regionId"      , System.Data.SqlDbType.Int).Value = part.regionId;
                        command.Parameters.Add("@mainPicture", System.Data.SqlDbType.NVarChar).Value = part.mainPicture ?? "";
                        command.Parameters.Add("@mainImageId", System.Data.SqlDbType.BigInt).Value = part.mainImageId;

                        command.Parameters.Add("@approved",         System.Data.SqlDbType.Int).Value = approved;
                        command.Parameters.Add("@modifiedTime"  , System.Data.SqlDbType.BigInt).Value = part.modifiedTime;
                        command.Parameters.Add("@userId"        , System.Data.SqlDbType.Int).Value = part.userId;
                        if (!update)
                            command.Parameters.Add("@bus", System.Data.SqlDbType.Int).Value = part.bus;

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in AddUpdatePart : {exception.Message}");
            }

            PartView partView = await GetPartAsync(part.partId);
            return EnrichManager.EnrichDisplayPartView(partView);
        }

        static public async Task<bool> DeletePartAsync(long partId, int userId)
        {
            bool result = await deletePartAsync(partId, userId);

            return result;
        }

        static public async Task<bool> deletePartAsync(long partId, int userId)
        {
            string storeProcedureName = "PartsDel";
            if (userId == 0)
            {
                throw new AppException("User id is not provided");
            }
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@partId", System.Data.SqlDbType.BigInt).Value = partId;
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int rows = await command.ExecuteNonQueryAsync();
                        if (rows == 0)
                        {
                            throw new AppException($"Частта не може да бъде изтрита");
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
        static public async Task<PartView[]> GetPartsAsync(Filter filterPart)
        {
            List<PartView> list = await getPartsAsync(filterPart);
            return list.ToArray();
        }

        static public async Task<List<PartView>> getPartsAsync(Filter filterPart)
        {
            string selectCommand = "SELECT * FROM PartFilterView WITH(NOLOCK)";
            if (filterPart.userId == null) filterPart.userId = 0;
            string test = "";
            List<string> where = new List<string>();
            List<PartView> parts = new List<PartView>();
            var startTime = Environment.TickCount;
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    if (filterPart.carId != 0)
                        where.Add(String.Format("carId = {0}", filterPart.carId));

                    if (filterPart.modificationId != 0)
                    {
                        where.Add(String.Format("modificationId = {0}", filterPart.modificationId));
                    }
                    else if (filterPart.modelId != 0)
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
                    else if (filterPart.companyId != 0)
                        where.Add(String.Format("companyId  = {0} ", filterPart.companyId));

                    if (filterPart.modelsId != null && filterPart.modelsId.Length > 0)
                    {
                        where.Add(String.Format("( modelId in ({0}) or groupModelId in ({0}) )", filterPart.modelsId));
                    }
                    if (filterPart.modificationsId != null && filterPart.modificationsId.Length > 0)
                    {
                        where.Add(String.Format("( modificationId in ({0}))", filterPart.modificationsId));
                    }
                    if (filterPart.year != 0)
                        where.Add(String.Format("year = {0}", filterPart.year));

                    if (filterPart.categoryId != 0)
                    {
                        where.Add(String.Format("categoryId = {0}", filterPart.categoryId));
                    }

                    if (filterPart.categoriesId != null && filterPart.categoriesId.Length > 0)
                    {
                        where.Add(String.Format("categoryId in ({0})", filterPart.categoriesId));
                    }

                    if (filterPart.subCategoryId != 0)
                    {
                        where.Add(String.Format("subCategoryId = {0}", filterPart.subCategoryId));
                    }

                    if (filterPart.subCategoriesId != null && filterPart.subCategoriesId.Length > 0)
                    {
                        where.Add(String.Format("subCategoryId in ({0})", filterPart.subCategoriesId));
                    }

                    if (filterPart.engineType != 0)
                        where.Add(String.Format("engineType = {0}", filterPart.engineType));

                    if (filterPart.engineModel != null && filterPart.engineModel.Length > 0)
                        where.Add(String.Format("partNumber like '{0}%'", filterPart.engineModel));

                    if (filterPart.gearboxType != 0)
                        where.Add(String.Format("gearboxType = {0}", filterPart.gearboxType));

                    if (filterPart.powerBHP != 0)
                        where.Add(String.Format("powerBHP = {0}", filterPart.powerBHP));

                    if (filterPart.regionId != 0)
                        where.Add(String.Format("regionId = {0}", filterPart.regionId));

                    if (filterPart.bus == -2)
                        where.Add("carId = 0");
                    if (filterPart.bus == 0 )
                    {
                        where.Add("bus = 0");
                    }
                    if (filterPart.bus == 1)
                    {
                        where.Add("bus = 1");
                    }

                    if (filterPart.adminRun)
                    {
                        if (filterPart.approved != ApprovedType.All)
                            where.Add(String.Format("approved = {0}", ((int)filterPart.approved)));
                        if (filterPart.userId != 0 && filterPart.userId != null)
                            where.Add(String.Format("userId = {0}", filterPart.userId));
                    }
                    else if (filterPart.userId != 0 && filterPart.userId != null)
                        where.Add(String.Format("userId = {0}", filterPart.userId));
                    else if (!filterPart.adminRun)
                    {
                        where.Add("approved <> 2" );
                        where.Add("suspended = 0");
                    }

                    if (filterPart.partNumber != null && filterPart.partNumber.Trim().Length > 0)
                        where.Add(String.Format("partNumber like '{0}%'", filterPart.partNumber));

                    if (filterPart.categories?.Length > 0)
                    {
                        where.Add(String.Format("categoryId in ({0})", filterPart.categories));
                    }

                    if (filterPart.keyword != null && filterPart.keyword.Length > 0)
                    {
                        string[] keywords = filterPart.keyword.Split(' ');
                        List<string> or = new List<string>();
                        foreach (string keyword in keywords)
                        {
                            double len = keyword.Length;
                            len = len * 0.75;
                            int lenInt = (int)(len + 0.5);
                            string newKeyword = keyword.ToLower().Substring(0, lenInt);

                            or.Add(String.Format("keyword like '%{0}%'", newKeyword));
                        }

                        if (or.Count > 0)
                        {
                            string orString = String.Format("({0})", String.Join(" OR ", or.ToArray()));
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
                            await LoggerUtil.Log(String.Format("PartDbSet::GetParts SQL {0}", Program.ConnectionString));
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
                            await LoggerUtil.Log(String.Format("PartDbSet::GetParts SQL {0} runs for {1} ms", test, Environment.TickCount - startTime));
                            LoggerUtil.LogInfo(String.Format("PartDbSet::GetParts Read all parts is {0} ms", Environment.TickCount - startTime));
                        });
                    }
                    await sqlConnection.CloseAsync();

                }
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
        static public async Task<bool> MainPictureAsync(long partId, string mainPicture, int userId)
        {
            string storeProcedureName = "UpdateMainPicturePart";

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

                        command.Parameters.Add("@partId", System.Data.SqlDbType.BigInt).Value = partId;
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

        static private PartView[] getParts(Filter filterPart)
        {
            string selectCommand = "SELECT * FROM Parts WITH(NOLOCK)";
            if (filterPart.userId == null) filterPart.userId = 0;
            string test = "";
            List<string> where = new List<string>();
            List<PartView> parts = new List<PartView>();
            var startTime = Environment.TickCount;
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    if (filterPart.carId != 0)
                        where.Add(String.Format("carId = {0}", filterPart.carId));

                    if (filterPart.companyId != 0)
                        where.Add(String.Format("modelId IN(SELECT modelId FROM Rado WHERE companyId = {0}) ", filterPart.companyId));

                    if (filterPart.modelId != 0)
                        where.Add(String.Format("modelId = {0}", filterPart.modelId));

                    if (filterPart.modificationId != 0)
                        where.Add(String.Format("modificationId = {0}", filterPart.modificationId));

                    if (filterPart.year != 0)
                        where.Add(String.Format("year = {0}", filterPart.year));

                    if (filterPart.categoryId != 0)
                    {
                        where.Add(String.Format("categoryId = {0}", filterPart.categoryId));
                    }

                    if (filterPart.subCategoryId != 0)
                    {
                        where.Add(String.Format("subCategoryId = {0}", filterPart.subCategoryId));
                    }

                    if (filterPart.engineType != 0)
                        where.Add(String.Format("engineType = {0}", filterPart.engineType));

                    if (filterPart.gearboxType != 0)
                        where.Add(String.Format("gearboxType = {0}", filterPart.gearboxType));

                    if (filterPart.powerBHP != 0)
                        where.Add(String.Format("powerBHP = {0}", filterPart.powerBHP));

                    if (filterPart.regionId != 0)
                        where.Add(String.Format("regionId = {0}", filterPart.regionId));

                    if (filterPart.userId != 0 && filterPart.userId != null)
                        where.Add(String.Format("userId = {0}", filterPart.userId));

                    if (filterPart.partNumber != null && filterPart.partNumber.Trim().Length > 0)
                        where.Add(String.Format("partNumber = {0}", filterPart.partNumber));

                    if (filterPart.categories?.Length > 0)
                    {
                        where.Add(String.Format("categoryId in ({0})", filterPart.categories));
                    }

                    if (filterPart.keyword != null && filterPart.keyword.Length > 0)
                    {
                        string[] keywords = filterPart.keyword.Split(' ');
                        List<string> or = new List<string>();
                        foreach (string keyword in keywords)
                        {
                            or.Add(String.Format("keyword like '%{0}%'", keyword.ToLower()));
                        }

                        if (or.Count > 0)
                        {
                            string orString = String.Format("({0)", String.Join(" OR ", or.ToArray()));
                            where.Add(orString);
                        }
                    }

                    if (where.Count > 0)
                    {
                        selectCommand += " WHERE " + String.Join(" AND ", where.ToArray());
                    }

                    test = test + selectCommand;
                    using (SqlCommand sqlCommand = new SqlCommand(selectCommand, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.Text;

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            while (sqlDataReader.Read())
                            {
                                PartView partView = EnrichManager.EnrichPartView(sqlDataReader);

                                parts.Add(partView);
                            }

                        }
                        sqlConnection.Close();

                        Task.Run(() => LoggerUtil.Log(String.Format("PartDbSet::GetParts Read all parts is {0} ms", Environment.TickCount - startTime)));
                    }


                }


                if (filterPart.hasImages)
                {
                    test = test + " Message ";
                    parts = parts.Where(x => x.numberImages > 0).ToList();
                }

                Task.Run(() => LoggerUtil.Log(String.Format("PartDbSet::GetParts Read all cars is {0} ms", Environment.TickCount - startTime)));
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