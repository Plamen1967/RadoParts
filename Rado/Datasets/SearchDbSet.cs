using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
using Rado.Enrich;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class SearchDbSet
    {
        private static Dictionary<long, SearchResult> _dictionaryParts = new Dictionary<long, SearchResult>();

        #region database operations

        private static Filter GetFilterById(long filterId)
        {
            Filter filterPart = new Filter();
            try
            {
                SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand("GetFilterById", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.Add("@filterId", SqlDbType.BigInt).Value = filterId;
                sqlConnection.Open();

                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                {
                    if (sqlDataReader.Read())
                        filterPart = Loader.LoadFilter(sqlDataReader);
                    else
                        return null;
                }
                sqlConnection.Close();
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }

            filterPart.Loaded = true;
            return filterPart;
        }
        private static async Task SaveFilter(Filter filterPart)
        {
            if (filterPart.UserId == null) filterPart.UserId = 0;
            if (filterPart.EngineModel == null) filterPart.EngineModel = "";
            if (filterPart.Description == null) filterPart.Description = "";
            if (filterPart.Categories == null) filterPart.Categories = "";
            if (filterPart.PartNumber == null) filterPart.PartNumber = "";
            if (filterPart.Keyword == null) filterPart.Keyword = "";
            if (filterPart.RegNumber == null) filterPart.RegNumber = "";
            if (filterPart.ModelsId == null) filterPart.ModelsId = "";
            if (filterPart.ModificationsId == null) filterPart.ModificationsId = "";
            if (filterPart.CategoriesId == null) filterPart.CategoriesId = "";
            if (filterPart.SubCategoriesId == null) filterPart.SubCategoriesId = "";

            EnrichManager.EnrichFilter(filterPart);

            try
            {
                SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand("FilterPartIns", sqlConnection);
                await sqlConnection.OpenAsync();

                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@filterId", SqlDbType.BigInt).Value = filterPart.Id;
                sqlCommand.Parameters.Add("@itemType", SqlDbType.Int).Value = filterPart.ItemType;
                sqlCommand.Parameters.Add("@carId", SqlDbType.BigInt).Value = filterPart.CarId;
                sqlCommand.Parameters.Add("@companyId", SqlDbType.BigInt).Value = filterPart.CompanyId;
                sqlCommand.Parameters.Add("@modelId", SqlDbType.Int).Value = filterPart.ModelId;
                sqlCommand.Parameters.Add("@modificationId", SqlDbType.Int).Value = filterPart.ModificationId;
                sqlCommand.Parameters.Add("@year", SqlDbType.Int).Value = filterPart.Year;
                sqlCommand.Parameters.Add("@categoryId", SqlDbType.Int).Value = filterPart.CategoryId;
                sqlCommand.Parameters.Add("@categoriesId", SqlDbType.VarChar).Value = filterPart.CategoriesId;
                sqlCommand.Parameters.Add("@subCategoryId", SqlDbType.Int).Value = filterPart.SubCategoryId;
                sqlCommand.Parameters.Add("@subCategoriesId", SqlDbType.VarChar).Value = filterPart.SubCategoriesId;
                sqlCommand.Parameters.Add("@engineType", SqlDbType.Int).Value = filterPart.EngineType;
                sqlCommand.Parameters.Add("@engineModel", SqlDbType.NVarChar).Value = filterPart.EngineModel.Trim();
                sqlCommand.Parameters.Add("@partNumber", SqlDbType.NVarChar).Value = filterPart.PartNumber.Trim();
                sqlCommand.Parameters.Add("@powerkWh", SqlDbType.Int).Value = filterPart.PowerkWh;
                sqlCommand.Parameters.Add("@powerBHP", SqlDbType.Int).Value = filterPart.PowerBHP;
                sqlCommand.Parameters.Add("@gearboxType", SqlDbType.Int).Value = filterPart.GearboxType;
                sqlCommand.Parameters.Add("@categories", SqlDbType.NVarChar).Value = filterPart.Categories.Trim();
                sqlCommand.Parameters.Add("@partOnly", SqlDbType.Int).Value = filterPart.PartOnly;
                sqlCommand.Parameters.Add("@searchBy", SqlDbType.SmallInt).Value = filterPart.SearchBy;
                sqlCommand.Parameters.Add("@regNumber", SqlDbType.NVarChar).Value = filterPart.RegNumber;
                sqlCommand.Parameters.Add("@extendedSearch", SqlDbType.SmallInt).Value = filterPart.ExtendedSearch;
                sqlCommand.Parameters.Add("@tyreCompanyId", SqlDbType.Int).Value = filterPart.TyreCompanyId;
                sqlCommand.Parameters.Add("@tyreWidth", SqlDbType.Int).Value = filterPart.TyreWidth;
                sqlCommand.Parameters.Add("@tyreHeight", SqlDbType.Int).Value = filterPart.TyreHeight;
                sqlCommand.Parameters.Add("@tyreRadius", SqlDbType.Int).Value = filterPart.TyreRadius;
                sqlCommand.Parameters.Add("@tyreType", SqlDbType.Int).Value = filterPart.TyreType;
                sqlCommand.Parameters.Add("@rimCompanyId", SqlDbType.Int).Value = filterPart.RimCompanyId;
                sqlCommand.Parameters.Add("@rimModelId", SqlDbType.Int).Value = filterPart.RimModelId;
                sqlCommand.Parameters.Add("@rimWidth", SqlDbType.Int).Value = filterPart.RimWidth;
                sqlCommand.Parameters.Add("@rimMaterial", SqlDbType.Int).Value = filterPart.RimMaterial;
                sqlCommand.Parameters.Add("@rimOffset", SqlDbType.Int).Value = filterPart.RimOffset;
                sqlCommand.Parameters.Add("@rimBoltCount", SqlDbType.Int).Value = filterPart.RimBoltCount;
                sqlCommand.Parameters.Add("@rimBoltDistance", SqlDbType.Int).Value = filterPart.RimBoltDistance;
                sqlCommand.Parameters.Add("@rimCenter", SqlDbType.Int).Value = filterPart.RimCenter;
                sqlCommand.Parameters.Add("@clientId", SqlDbType.BigInt).Value = filterPart.ClientId;
                sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = filterPart.UserId;
                sqlCommand.Parameters.Add("@loadMainPicture", SqlDbType.SmallInt).Value = filterPart.LoadMainPicture;
                sqlCommand.Parameters.Add("@orderBy", SqlDbType.SmallInt).Value = filterPart.OrderBy;
                sqlCommand.Parameters.Add("@regionId", SqlDbType.Int).Value = filterPart.RegionId;
                sqlCommand.Parameters.Add("@hasImages", SqlDbType.Int).Value = filterPart.HasImages;
                sqlCommand.Parameters.Add("@keyword", SqlDbType.NVarChar).Value = filterPart.Keyword.Trim();
                sqlCommand.Parameters.Add("@description", SqlDbType.NVarChar).Value = filterPart.Description.Trim();
                sqlCommand.Parameters.Add("@adminRun", SqlDbType.Int).Value = filterPart.AdminRun;
                sqlCommand.Parameters.Add("@approved", SqlDbType.Int).Value = filterPart.Approved;
                sqlCommand.Parameters.Add("@bus", SqlDbType.Int).Value = filterPart.Bus;
                sqlCommand.Parameters.Add("@partForCar", SqlDbType.Int).Value = filterPart.PartForCar;
                sqlCommand.Parameters.Add("@modelsId", SqlDbType.NVarChar).Value = filterPart.ModelsId.Trim();
                sqlCommand.Parameters.Add("@modificationsId", SqlDbType.NVarChar).Value = filterPart.ModificationsId.Trim();

                await sqlCommand.ExecuteNonQueryAsync();
                await sqlConnection.CloseAsync();
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);

            }
        }
        #endregion

        public static async Task<SearchResult> SearchPartByNumber(Filter filterPart)
        {
            filterPart.ItemType = ItemType.RegNumber;
            if (filterPart.Id != 0 && !filterPart.Loaded)
                await SaveFilter(filterPart);

            Filter filter = new Filter()
            {
                Id = filterPart.Id,
                ItemType = filterPart.ItemType,
                PartNumber = filterPart.PartNumber
            };
            EnrichManager.EnrichFilter(filterPart);
            return await SearchForParts(filterPart);
        }

        private static async Task<SearchResult> SearchForTyres(Filter filterPart)
        {
            EnrichManager.EnrichFilter(filterPart);
            SearchResult searchResult = RimWithTyreDbSet.SearchForRimTyres(filterPart); ;
            return await Task.FromResult<SearchResult>(searchResult);
        }

        private static async Task<SearchResult> SearchForParts(Filter filterPart)
        {
            if (filterPart.SearchBy == SearchBy.PartNumber ||
               (filterPart.CategoriesId?.Length > 0 || filterPart.SubCategoriesId?.Length > 0 || filterPart.CategoryId != 0 || filterPart.SubCategoryId != 0))
            {
                filterPart.ItemType = filterPart.Bus == 1 ? ItemType.BusPart : ItemType.CarPart;
            }

            EnrichManager.EnrichFilter(filterPart);
            PartView[] partView = await GetCarAndPartsAsync(filterPart);
            int count = 0;
            List<DisplayPartView> parts = new List<DisplayPartView>();
            List<string> log = new List<string>();
            foreach(var part in partView)
            {
                parts.Add(EnrichManager.EnrichDisplayPartView(part));
                count++;
                if (count >= Program.ReturnPartCount) break;
            }

            SearchResult searchResult = new SearchResult
            {
                data = parts.ToArray()
            };
            foreach (DisplayPartView item in searchResult.data) item.Normalize();
            searchResult.size = partView.Length;
            searchResult.filter = filterPart;
            return await Task.FromResult<SearchResult>(searchResult); ;
        }

        #region Search for parts
   
        private static async Task<PartView[]> GetCarAndPartsAsync(Filter filterPart)
        {
            var startTime = Environment.TickCount;
            Task<List<PartView>> parts = null;
            Task<List<PartView>> cars = null;
            if (filterPart.CategoriesId == null) filterPart.CategoriesId = "";
            if (filterPart.SubCategoriesId == null) filterPart.SubCategoriesId = "";

            if (filterPart.CategoryId != 0 || filterPart.CategoriesId != "" ||
                filterPart.SubCategoryId != 0 || filterPart.SubCategoriesId != "" )
            {
                if (filterPart.Bus == 1)
                    filterPart.ItemType = ItemType.BusPart;
                else
                    filterPart.ItemType = ItemType.CarPart;

            }

            if (filterPart.PartNumber != null && filterPart.PartNumber.Length > 0)
            {
                if (filterPart.Bus == 1)
                    filterPart.ItemType = ItemType.BusPart;
                else
                    filterPart.ItemType = ItemType.CarPart;
            }

            if (filterPart.ItemType == ItemType.AllCarAndPart ||
                filterPart.ItemType == ItemType.OnlyCar ||
                filterPart.ItemType == ItemType.AllBusAndPart ||
                filterPart.ItemType == ItemType.OnlyBus ||
                filterPart.ItemType == ItemType.None ||
                filterPart.ItemType == ItemType.All ||
                filterPart.ItemType == ItemType.AllCarAndPart)
                cars = GetCarAsync(filterPart);

            if (filterPart.ItemType == ItemType.CarPart ||
                filterPart.ItemType == ItemType.BusPart ||
                filterPart.ItemType == ItemType.None ||
                filterPart.ItemType == ItemType.All ||
                filterPart.ItemType == ItemType.AllParts ||
                filterPart.ItemType == ItemType.AllCarAndPart ||
                filterPart.ItemType == ItemType.AllBusAndPart)
                parts = PartDbSet.getPartsAsync(filterPart);

            List<PartView> partsAll = new List<PartView>();
            List<PartView> carsAll = new List<PartView>();
            try
            {

                if (parts != null)
                    partsAll = await parts;
                if (cars != null)
                    carsAll = await cars;

                partsAll.AddRange(carsAll);

                if (filterPart.HasImages)
                {
                    partsAll = partsAll.Where(x => x.NumberImages > 0).ToList();
                }

                if (filterPart.AdminRun)
                {
                    if (filterPart.ItemType == ItemType.AllCarAndPart || filterPart.ItemType == ItemType.OnlyCar || filterPart.ItemType == ItemType.AllBusAndPart || filterPart.ItemType == ItemType.OnlyBus)
                    {
                        partsAll = partsAll.Where(x => x.IsCar).ToList();
                    }
                    else if (filterPart.ItemType == ItemType.BusPart || filterPart.ItemType == ItemType.CarPart || filterPart.ItemType == ItemType.AllParts)
                    {
                        partsAll = partsAll.Where(x => !x.IsCar).ToList();
                    }
                }

                _ = Task.Run(async () =>
                  {
                      await LoggerUtil.Log(String.Format("PartDbSet::GetCars Read all cars is {0} ms", Environment.TickCount - startTime));
                      LoggerUtil.LogInfo(String.Format("PartDbSet::GetCarts Read all cars is {0} ms", Environment.TickCount - startTime));
                  });

                IEnumerable<PartView> sortPart = new List<PartView>();

                if (filterPart.OrderBy == 0)
                    sortPart = partsAll.OrderBy(a => a.Price);
                else if (filterPart.OrderBy == 5)
                    sortPart = partsAll.OrderBy(a => a.Year);
                else if (filterPart.OrderBy == 7)
                    sortPart = partsAll.OrderBy(a => a.ModifiedTime);

                List<PartView> list = new List<PartView>();
                foreach (var partView in sortPart)
                {
                    list.Add(partView);
                }
                partsAll.Clear();
                partsAll = list;

                _ = Task.Run(async () =>
                  {
                      await LoggerUtil.Log(String.Format("PartDbSet::Load Images Read {0} ms", Environment.TickCount - startTime));
                      LoggerUtil.LogInfo(String.Format("PartDbSet::Load Images Read {0} ms", Environment.TickCount - startTime));
                  });
            }
            catch (Exception exception) 
            {
                throw new AppException($" Error in GetParts : {exception.Message} getPartsAsync");
            }
            finally
            {
            }

            return await Task.FromResult<PartView[]>(partsAll.ToArray());

        }
        #endregion

        private static async Task<List<PartView>> GetCarAsync(Filter filterPart)
        {
            if (filterPart.PartOnly) return new List<PartView>();
            if (filterPart.SearchBy == SearchBy.PartNumber) return new List<PartView>();

            IEnumerable<CarView> cars = await CarsDbSet.GetCars(filterPart);
            List<PartView> parts = new List<PartView>();
            foreach (var car in cars)
            {
                PartView partView = new PartView();
                EnrichManager.InitPartViewFromCar(car, partView);
                parts.Add(partView);
            }
            return parts;
        }
        public static async Task<DisplayPartView> GetItemAsync(long id)
        {
            int itemType = 0;
            SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
            SqlCommand sqlCommand = new SqlCommand("GetItemType", sqlConnection);
            await sqlConnection.OpenAsync();

            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.Add("@id", SqlDbType.BigInt).Value = id;

            SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync();
            if (await sqlDataReader.ReadAsync())
            {
                itemType = (int)Convert.ToInt64(sqlDataReader["itemType"]);
            }
            await sqlConnection.CloseAsync();

            PartView partView;
            switch (itemType)
            {
                case 1:
                    CarView carView = await CarsDbSet.GetCarByIdAsync(id);
                    partView = new PartView();
                    EnrichManager.InitPartViewFromCar(carView, partView);
                    DisplayPartView viewCar = EnrichManager.EnrichDisplayPartView(partView);
                    viewCar.Normalize();
                    return viewCar;
                case 2:
                    partView = await PartDbSet.GetPartAsync(id);
                    DisplayPartView viewPart = EnrichManager.EnrichDisplayPartView(partView);
                    viewPart.Normalize();
                    return viewPart;
                case 3:
                case 4:
                case 5:
                    {
                        DisplayPartView viewTyre = EnrichManager.EnrichDisplayPartView(await RimWithTyreDbSet.GetRimWithTyreByIdAsync(id));
                        viewTyre.Normalize();
                        return viewTyre;
                    }
            }
            return null;
        }
        public static async Task<Filter> GetFilter(long query)
        {
            Filter filter = GetFilterById(query);
            if (filter == null)
            {
                throw new Exception("Няма намерен филтер");
            }

            return await Task.FromResult<Filter>(filter);
        }

        public static async Task<SearchResult> GetSearchResult(long query)
        {
            Filter filter = GetFilterById(query);
            if (filter == null)
            {
              await Task.FromResult<SearchResult>(null);
            }

            SearchResult result = await Search(filter);
            return await Task.FromResult <SearchResult>(result);
        }
        public static async Task<SearchResult> Search(Filter filterPart)
        {
            if (filterPart.Id != 0 && !filterPart.Loaded)
                await SaveFilter(filterPart);

            UserCount result = null;
            if (filterPart.UserId != 0)
            {
                result = await UserDbSet.GetUserCountAsync(filterPart.UserId.Value);
            }
            
            var startTime = Environment.TickCount;
            if (filterPart.ModelId == -1) filterPart.ModelId = 0;

            SearchResult searchResult = new SearchResult();
            switch (filterPart.ItemType)
            {
                case ItemType.AllCarAndPart:
                case ItemType.AllBusAndPart:
                case ItemType.CarPart:
                case ItemType.BusPart:
                case ItemType.OnlyCar:
                case ItemType.OnlyBus:
                    {
                        searchResult = await SearchDbSet.SearchForParts(filterPart);
                        searchResult.duration = Environment.TickCount - startTime;
                        searchResult.filter = filterPart;
                        foreach (var item in searchResult.data) item.Normalize();

                        _ = Task.Run(() => LoggerUtil.Log(String.Format("Part & Car SearchController::Search Elapsed Time is {0} ms", searchResult.duration)));
                        if (filterPart.UserId != 0) {
                            searchResult.userCount = result;
                            searchResult.userView = UserDbSet.GetUserViewById(filterPart.UserId.Value);
                        }
                        return searchResult;
                    }
                case ItemType.Tyre:
                case ItemType.Rim:
                case ItemType.RimWithTyre:
                case ItemType.AllTyre:                    {
                        searchResult = await SearchDbSet.SearchForTyres(filterPart);
                        searchResult.duration = Environment.TickCount - startTime;
                        searchResult.filter = filterPart;
                        foreach (var item in searchResult.data) item.Normalize();

                        _ = Task.Run(() => LoggerUtil.Log(String.Format("Tyre SearchController::Search Elapsed Time is {0} ms", searchResult.duration)));

                        if (filterPart.UserId != 0)
                        {
                            searchResult.userCount = result;
                            searchResult.userView = UserDbSet.GetUserViewById(filterPart.UserId.Value);
                        }
                        return await Task.FromResult<SearchResult>(searchResult);
                    }
                case ItemType.None:
                    {
                        Task< SearchResult> tyreResult = SearchDbSet.SearchForTyres(filterPart);
                        filterPart.Id = 0;
                        Task<SearchResult> partResult =  SearchDbSet.SearchForParts(filterPart);
                        await tyreResult;
                        await partResult;
                        List<DisplayPartView> data = tyreResult.Result.data.ToList();
                        List<DisplayPartView> data2 = partResult.Result.data.ToList();
                        var dataNew = new[] { data, data2 }.SelectMany(x => x);

                        searchResult.duration = Environment.TickCount - startTime;
                        searchResult.data = dataNew.ToArray();
                        foreach (var item in searchResult.data) item.Normalize();
                        searchResult.size = searchResult.data.Count();
                        searchResult.filter = filterPart;

                        _ = Task.Run(() => LoggerUtil.Log(
                            $"All SearchController::Search Elapsed Time is {searchResult.duration} ms"));

                        if (filterPart.UserId == 0) return await Task.FromResult<SearchResult>(searchResult);
                        searchResult.userCount = result;
                        searchResult.userView = UserDbSet.GetUserViewById(filterPart.UserId.Value);

                        return searchResult;
                    }
                default:
                    {
                        throw new NotImplementedException("Грешка в търсенето.");
                    }
            }
        }

    }

    #region not used
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
    // Used in Home search 

    //public static async Task<SearchResult> updateDictionary(long id)
    //{
    //    var dictionary = dictionaryParts[id];
    //    List<DisplayPartView> data = new List<DisplayPartView>();
    //    foreach (var item in dictionary.data)
    //    {
    //        if (item.IsCar)
    //        {
    //            try
    //            {
    //                CarView carView = await CarsDbSet.GetCarByIdAsync(item.Id);
    //                if (carView != null)
    //                {
    //                    PartView partView = new PartView();
    //                    EnrichManager.InitPartViewFromCar(carView, partView);
    //                    DisplayPartView displayPartView = EnrichManager.EnrichDisplayPartView(partView);
    //                    data.Add(displayPartView);
    //                }
    //            }
    //            catch (Exception exeption)
    //            {
    //              LoggerUtil.LogException(exeption);
    //            }
    //        }
    //        else
    //        {

    //            try
    //            {
    //                PartView partView = await PartDbSet.GetPartAsync(item.Id);
    //                if (partView != null)
    //                {
    //                    DisplayPartView displayPartView = EnrichManager.EnrichDisplayPartView(partView);
    //                    data.Add(displayPartView);
    //                }
    //            }
    //            catch (Exception exeption)
    //            {
    //              LoggerUtil.LogException(exeption);
    //            }
    //}


    //    }

    //    dictionary.data = data.ToArray();
    //    foreach (var item in dictionary.data) item.Normalize();

    //    return dictionary;
    //}

    //static private PartView[] GetPartsByNumber(Filter filterPart)
    //{
    //    List<PartView> parts = new List<PartView>();
    //    if (filterPart.PartNumber == null && filterPart.PartNumber.Trim().Length == 0)
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

    //                sqlCommand.Parameters.Add("@partNumber", System.Data.SqlDbType.Int).Value = filterPart.PartNumber.Trim();

    //                sqlConnection.Open();
    //                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
    //                {
    //                    Stopwatch stopwatch = new Stopwatch();
    //                    stopwatch.Start();
    //                    while (sqlDataReader.Read())
    //                    {
    //                        PartView partView = EnrichManager.EnrichPartView(sqlDataReader);

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
    //public static async Task<SearchResult> SearchForPartsPerUser(Filter filterPart)
    //{
    //    Filter filter = new Filter()
    //    {
    //        UserId = filterPart.UserId
    //    };

    //    EnrichManager.EnrichFilter(filterPart);

    //    PartView[] partView = await GetCarAndPartsAsync(filterPart);
    //    DisplayPartView[] displayPartView = partView.Select((part) => EnrichManager.EnrichDisplayPartView(part)).ToArray();


    //    SearchResult searchResult = new SearchResult();
    //    searchResult.data = displayPartView;
    //    foreach (var item in searchResult.data) item.Normalize();
    //    searchResult.size = displayPartView.Length;

    //    return await Task.FromResult<SearchResult>(searchResult);
    //}


        #endregion
}
