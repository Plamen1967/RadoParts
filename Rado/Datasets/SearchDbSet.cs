using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
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
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class SearchDbSet
    {
        static object dictionaryLock = new object();
        static private Dictionary<long, SearchResult> dictionaryParts = new Dictionary<long, SearchResult>();

        #region database operations
        static public Filter GetFilterById(long filterId)
        {
            Filter filterPart = new Filter();
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("GetFilterById", sqlConnection))
                    {
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

                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }

      filterPart.loaded = true;
            return filterPart;
        }

        static public async Task SaveFilter(Filter filterPart)
        {

            if (filterPart.userId == null) filterPart.userId = 0;
            if (filterPart.engineModel == null) filterPart.engineModel = "";
            if (filterPart.description == null) filterPart.description = "";
            if (filterPart.categories == null) filterPart.categories = "";
            if (filterPart.partNumber == null) filterPart.partNumber = "";
            if (filterPart.keyword == null) filterPart.keyword = "";
            if (filterPart.regNumber == null) filterPart.regNumber = "";
            if (filterPart.modelsId == null) filterPart.modelsId = "";
            if (filterPart.modificationsId == null) filterPart.modificationsId = "";
            if (filterPart.categoriesId == null) filterPart.categoriesId = "";
            if (filterPart.subCategoriesId == null) filterPart.subCategoriesId = "";
            
            EnrichManager.EnrichFilter(filterPart);

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("FilterPartIns", sqlConnection))
                    {
                        await sqlConnection.OpenAsync();

                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@filterId", SqlDbType.BigInt).Value = filterPart.id;
                        sqlCommand.Parameters.Add("@itemType", SqlDbType.Int).Value = filterPart.itemType;
                        sqlCommand.Parameters.Add("@carId", SqlDbType.BigInt).Value = filterPart.carId;
                        sqlCommand.Parameters.Add("@companyId", SqlDbType.BigInt).Value = filterPart.companyId;
                        sqlCommand.Parameters.Add("@modelId", SqlDbType.Int).Value = filterPart.modelId;
                        sqlCommand.Parameters.Add("@modificationId", SqlDbType.Int).Value = filterPart.modificationId;
                        sqlCommand.Parameters.Add("@year", SqlDbType.Int).Value = filterPart.year;
                        sqlCommand.Parameters.Add("@categoryId", SqlDbType.Int).Value = filterPart.categoryId;
                        sqlCommand.Parameters.Add("@categoriesId", SqlDbType.VarChar).Value = filterPart.categoriesId;
                        sqlCommand.Parameters.Add("@subCategoryId", SqlDbType.Int).Value = filterPart.subCategoryId;
                        sqlCommand.Parameters.Add("@subCategoriesId", SqlDbType.VarChar).Value = filterPart.subCategoriesId;
                        sqlCommand.Parameters.Add("@engineType", SqlDbType.Int).Value = filterPart.engineType;
                        sqlCommand.Parameters.Add("@engineModel", SqlDbType.NVarChar).Value = filterPart.engineModel.Trim();
                        sqlCommand.Parameters.Add("@partNumber", SqlDbType.NVarChar).Value = filterPart.partNumber.Trim();
                        sqlCommand.Parameters.Add("@powerkWh", SqlDbType.Int).Value = filterPart.powerkWh;
                        sqlCommand.Parameters.Add("@powerBHP", SqlDbType.Int).Value = filterPart.powerBHP;
                        sqlCommand.Parameters.Add("@gearboxType", SqlDbType.Int).Value = filterPart.gearboxType;
                        sqlCommand.Parameters.Add("@categories", SqlDbType.NVarChar).Value = filterPart.categories.Trim();
                        sqlCommand.Parameters.Add("@partOnly", SqlDbType.Int).Value = filterPart.partOnly;
                        sqlCommand.Parameters.Add("@searchBy", SqlDbType.SmallInt).Value = filterPart.searchBy;
                        sqlCommand.Parameters.Add("@regNumber", SqlDbType.NVarChar).Value = filterPart.regNumber;
                        sqlCommand.Parameters.Add("@extendedSearch", SqlDbType.SmallInt).Value = filterPart.extendedSearch;
                        sqlCommand.Parameters.Add("@tyreCompanyId", SqlDbType.Int).Value = filterPart.tyreCompanyId;
                        sqlCommand.Parameters.Add("@tyreWidth", SqlDbType.Int).Value = filterPart.tyreWidth;
                        sqlCommand.Parameters.Add("@tyreHeight", SqlDbType.Int).Value = filterPart.tyreHeight;
                        sqlCommand.Parameters.Add("@tyreRadius", SqlDbType.Int).Value = filterPart.tyreRadius;
                        sqlCommand.Parameters.Add("@tyreType", SqlDbType.Int).Value = filterPart.tyreType;
                        sqlCommand.Parameters.Add("@rimCompanyId", SqlDbType.Int).Value = filterPart.rimCompanyId;
                        sqlCommand.Parameters.Add("@rimModelId", SqlDbType.Int).Value = filterPart.rimModelId;
                        sqlCommand.Parameters.Add("@rimWidth", SqlDbType.Int).Value = filterPart.rimWidth;
                        sqlCommand.Parameters.Add("@rimMaterial", SqlDbType.Int).Value = filterPart.rimMaterial;
                        sqlCommand.Parameters.Add("@rimOffset", SqlDbType.Int).Value = filterPart.rimOffset;
                        sqlCommand.Parameters.Add("@rimBoltCount", SqlDbType.Int).Value = filterPart.rimBoltCount;
                        sqlCommand.Parameters.Add("@rimBoltDistance", SqlDbType.Int).Value = filterPart.rimBoltDistance;
                        sqlCommand.Parameters.Add("@rimCenter", SqlDbType.Int).Value = filterPart.rimCenter;
                        sqlCommand.Parameters.Add("@clientId", SqlDbType.BigInt).Value = filterPart.clientId;
                        sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = filterPart.userId;
                        sqlCommand.Parameters.Add("@loadMainPicture", SqlDbType.SmallInt).Value = filterPart.loadMainPicture;
                        sqlCommand.Parameters.Add("@orderBy", SqlDbType.SmallInt).Value = filterPart.orderBy;
                        sqlCommand.Parameters.Add("@regionId", SqlDbType.Int).Value = filterPart.regionId;
                        sqlCommand.Parameters.Add("@hasImages", SqlDbType.Int).Value = filterPart.hasImages;
                        sqlCommand.Parameters.Add("@keyword", SqlDbType.NVarChar).Value = filterPart.keyword.Trim();
                        sqlCommand.Parameters.Add("@description", SqlDbType.NVarChar).Value = filterPart.description.Trim();
                        sqlCommand.Parameters.Add("@adminRun", SqlDbType.Int).Value = filterPart.adminRun;
                        sqlCommand.Parameters.Add("@approved", SqlDbType.Int).Value = filterPart.approved;
                        sqlCommand.Parameters.Add("@bus", SqlDbType.Int).Value = filterPart.bus;
                        sqlCommand.Parameters.Add("@partForCar", SqlDbType.Int).Value = filterPart.partForCar;
                        sqlCommand.Parameters.Add("@modelsId", SqlDbType.NVarChar).Value = filterPart.modelsId.Trim();
                        sqlCommand.Parameters.Add("@modificationsId", SqlDbType.NVarChar).Value = filterPart.modificationsId.Trim();


                        await sqlCommand.ExecuteNonQueryAsync();
                        await sqlConnection.CloseAsync();
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);

            }
        }

        #endregion
        static async public Task<SearchResult> SearchForPartsPerUser(Filter filterPart)
        {
            Filter filter = new Filter()
            {
                userId = filterPart.userId
            };

            EnrichManager.EnrichFilter(filterPart);

            PartView[] partView = await getCarAndPartsAsync(filterPart);
            DisplayPartView[] displayPartView = partView.Select((part) => EnrichManager.EnrichDisplayPartView(part)).ToArray();


            SearchResult searchResult = new SearchResult();
            searchResult.data = displayPartView;
            foreach (var item in searchResult.data) item.Normalize();
            searchResult.size = displayPartView.Length;

            return await Task.FromResult <SearchResult>(searchResult);
        }

        static public async Task<SearchResult> SearchPartByNumber(Filter filterPart)
        {
            filterPart.itemType = ItemType.RegNumber;
            if (filterPart.id != 0 && !filterPart.loaded)
                await SaveFilter(filterPart);

            Filter filter = new Filter()
            {
                id = filterPart.id,
                itemType = filterPart.itemType,
                partNumber = filterPart.partNumber
            };
            EnrichManager.EnrichFilter(filterPart);
            return await SearchForParts(filterPart);
        }

        static public async Task<SearchResult> SearchForTyres(Filter filterPart)
        {
            EnrichManager.EnrichFilter(filterPart);
            SearchResult searchResult = RimWithTyreDbSet.SearchForRimTyres(filterPart); ;
            return await Task.FromResult<SearchResult>(searchResult);
        }



        static public async Task<SearchResult> SearchForParts(Filter filterPart)
        {
            if (filterPart.searchBy == SearchBy.PartNumber ||
               (filterPart.categoriesId?.Length > 0 || filterPart.subCategoriesId?.Length > 0 || filterPart.categoryId != 0 || filterPart.subCategoryId != 0))
            {
                if (filterPart.bus == 1)
                    filterPart.itemType = ItemType.BusPart;
                else
                    filterPart.itemType = ItemType.CarPart;

            }

            EnrichManager.EnrichFilter(filterPart);
            PartView[] partView = await getCarAndPartsAsync(filterPart);
            int count = 0;
            List<DisplayPartView> parts = new List<DisplayPartView>();
            foreach(var part in partView)
            {
                parts.Add(EnrichManager.EnrichDisplayPartView(part));
                count++;
                if (count >= Program.ReturnPartCount) break;
            }

            SearchResult searchResult = new SearchResult();
            searchResult.data = parts.ToArray();
            foreach (var item in searchResult.data) item.Normalize();
            searchResult.size = partView.Length;
            searchResult.filter = filterPart;
            return await Task.FromResult<SearchResult>(searchResult); ;
        }

        #region Serach by part number
        static private PartView[] getPartsByNumber(Filter filterPart)
        {
            List<PartView> parts = new List<PartView>();
            if (filterPart.partNumber == null && filterPart.partNumber.Trim().Length == 0)
            {
                return parts.ToArray();
            }

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("PartByNumberAll", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@partNumber", System.Data.SqlDbType.Int).Value = filterPart.partNumber.Trim();

                        sqlConnection.Open();
                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            Stopwatch stopwatch = new Stopwatch();
                            stopwatch.Start();
                            while (sqlDataReader.Read())
                            {
                                PartView partView = EnrichManager.EnrichPartView(sqlDataReader);

                                parts.Add(partView);
                            }
                            stopwatch.Stop();
                            Console.WriteLine("Elapsed Time PartsAll is {0} ms", stopwatch.ElapsedMilliseconds);
                        }
                        sqlConnection.Close();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in GetParts : {exception.Message}");
            }
            finally
            {
            }

            return parts.ToArray();
        }

        #endregion

        #region Search for parts
   
        static private async Task<PartView[]> getCarAndPartsAsync(Filter filterPart)
        {
            var startTime = Environment.TickCount;
            Task<List<PartView>> parts = null;
            Task<List<PartView>> cars = null;
            if (filterPart.categoriesId == null) filterPart.categoriesId = "";
            if (filterPart.subCategoriesId == null) filterPart.subCategoriesId = "";

            if (filterPart.categoryId != 0 || filterPart.categoriesId != "" ||
                filterPart.subCategoryId != 0 || filterPart.subCategoriesId != "" )
            {
                if (filterPart.bus == 1)
                    filterPart.itemType = ItemType.BusPart;
                else
                    filterPart.itemType = ItemType.CarPart;

            }

            if (filterPart.partNumber != null && filterPart.partNumber.Length > 0)
            {
                if (filterPart.bus == 1)
                    filterPart.itemType = ItemType.BusPart;
                else
                    filterPart.itemType = ItemType.CarPart;
            }

            if (filterPart.itemType == ItemType.AllCarAndPart ||
                filterPart.itemType == ItemType.OnlyCar ||
                filterPart.itemType == ItemType.AllBusAndPart ||
                filterPart.itemType == ItemType.OnlyBus ||
                filterPart.itemType == ItemType.None ||
                filterPart.itemType == ItemType.All ||
                filterPart.itemType == ItemType.AllCarAndPart)
                cars = getCarAsync(filterPart);

            if (filterPart.itemType == ItemType.CarPart ||
                filterPart.itemType == ItemType.BusPart ||
                filterPart.itemType == ItemType.None ||
                filterPart.itemType == ItemType.All ||
                filterPart.itemType == ItemType.AllParts ||
                filterPart.itemType == ItemType.AllCarAndPart ||
                filterPart.itemType == ItemType.AllBusAndPart)
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

                if (filterPart.hasImages)
                {
                    partsAll = partsAll.Where(x => x.numberImages > 0).ToList();
                }

                if (filterPart.adminRun )
                {
                    if (filterPart.itemType == ItemType.AllCarAndPart || filterPart.itemType == ItemType.OnlyCar || filterPart.itemType == ItemType.AllBusAndPart || filterPart.itemType == ItemType.OnlyBus)
                    {
                        partsAll = partsAll.Where(x => x.isCar).ToList();
                    }
                    else if (filterPart.itemType == ItemType.BusPart || filterPart.itemType == ItemType.CarPart || filterPart.itemType == ItemType.AllParts)
                    {
                        partsAll = partsAll.Where(x => !x.isCar).ToList();
                    }
                }

                _ = Task.Run(async () =>
                  {
                      await LoggerUtil.Log(String.Format("PartDbSet::GetCars Read all cars is {0} ms", Environment.TickCount - startTime));
                      LoggerUtil.LogInfo(String.Format("PartDbSet::GetCarts Read all cars is {0} ms", Environment.TickCount - startTime));
                  });

                IEnumerable<PartView> sortPart = new List<PartView>();

                if (filterPart.orderBy == 0)
                    sortPart = partsAll.OrderBy(a => a.price);
                else if (filterPart.orderBy == 5)
                    sortPart = partsAll.OrderBy(a => a.year);
                else if (filterPart.orderBy == 7)
                    sortPart = partsAll.OrderBy(a => a.modifiedTime); 

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

        private static async Task<List<PartView>> getCarAsync(Filter filterPart)
        {
            if (filterPart.partOnly) return new List<PartView>();
            if (filterPart.searchBy == SearchBy.PartNumber) return new List<PartView>();

            IEnumerable<CarView> cars = await CarsDbSet.GetCars(filterPart);
            List<PartView> parts = new List<PartView>();
            foreach (var car in cars)
            {
                PartView partView = new PartView();
                EnrichManager.InitPartViewFromCar(car, partView);
                parts.Add(partView);
            }
            return await Task.FromResult<List<PartView>>(parts); ;
        }



        public static bool checkItem(DisplayPartView item)
        {
            return false;
        }

        static public async Task<DisplayPartView> GetItemAsync(long id)
        {
            int itemType = 0;
            using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("GetItemType", sqlConnection))
                {
                    await sqlConnection.OpenAsync();

                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@id", SqlDbType.BigInt).Value = id;

                    using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                    {
                        if (await sqlDataReader.ReadAsync())
                        {
                            itemType = (int)Convert.ToInt64(sqlDataReader["itemType"]);
                        }
                    }
                    await sqlConnection.CloseAsync();
                }
            }

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

        static public async Task<SearchResult> updateDictionary(long id)
        {
            var dictionary = dictionaryParts[id];
            List<DisplayPartView> data = new List<DisplayPartView>();
            foreach (var item in dictionary.data)
            {
                if (item.isCar)
                {
                    try
                    {
                        CarView carView = await CarsDbSet.GetCarByIdAsync(item.id);
                        if (carView != null)
                        {
                            PartView partView = new PartView();
                            EnrichManager.InitPartViewFromCar(carView, partView);
                            DisplayPartView displayPartView = EnrichManager.EnrichDisplayPartView(partView);
                            data.Add(displayPartView);
                        }
                    }
                    catch (Exception exeption)
                    {
                      LoggerUtil.LogException(exeption);
                    }
                }
                else
                {

                    try
                    {
                        PartView partView = await PartDbSet.GetPartAsync(item.id); ;
                        if (partView != null)
                        {
                            DisplayPartView displayPartView = EnrichManager.EnrichDisplayPartView(partView);
                            data.Add(displayPartView);
                        }
                    }
                    catch (Exception exeption)
                    {
                      LoggerUtil.LogException(exeption);
                    }
        }


            }

            dictionary.data = data.ToArray();
            foreach (var item in dictionary.data) item.Normalize();

            return dictionary;
        }
        static public async Task<Filter> GetFilter(long query)
        {
            Filter filter = GetFilterById(query);
            if (filter == null)
            {
                throw new Exception("Няма намерен филтер");
            }

            return await Task.FromResult<Filter>(filter);
        }

        static public async Task<SearchResult> GetSearchResult(long query)
        {
            Filter filter = GetFilterById(query);
            if (filter == null)
            {
              await Task.FromResult<SearchResult>(null);
            }

            SearchResult result = await Search(filter);
            return await Task.FromResult <SearchResult>(result);
        }

        static public async Task<SearchResult> Search(Filter filterPart)
        {
            if (filterPart.id != 0 && !filterPart.loaded)
                await SaveFilter(filterPart);

            UserCount result = null;
            if (filterPart.userId != 0)
            {
                result = await UserDbSet.GetUserCountAsync(filterPart.userId.Value);
            }
            
            var startTime = Environment.TickCount;
            if (filterPart.modelId == -1) filterPart.modelId = 0;

            SearchResult searchResult = new SearchResult();
            switch (filterPart.itemType)
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
                        if (filterPart.userId != 0) {
                            searchResult.userCount = result;
                            searchResult.userView = UserDbSet.GetUserViewById(filterPart.userId.Value);
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

                        if (filterPart.userId != 0)
                        {
                            searchResult.userCount = result;
                            searchResult.userView = UserDbSet.GetUserViewById(filterPart.userId.Value);
                        }
                        return await Task.FromResult<SearchResult>(searchResult);
                    }
                case ItemType.None:
                    {
                        Task< SearchResult> tyreResult = SearchDbSet.SearchForTyres(filterPart);
                        filterPart.id = 0;
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

                        _ = Task.Run(() => LoggerUtil.Log(String.Format("All SearchController::Search Elapsed Time is {0} ms", searchResult.duration)));

                        if (filterPart.userId != 0)
                        {
                            searchResult.userCount = result;
                            searchResult.userView = UserDbSet.GetUserViewById(filterPart.userId.Value);
                        }
                        return await Task.FromResult<SearchResult>(searchResult);
                    }
                default:
                    {
                        throw new NotImplementedException("Грешка в търсенето.");
                    }
            }
        }

    }
}
