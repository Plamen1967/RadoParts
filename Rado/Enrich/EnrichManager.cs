using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Helper;
using Models.Models;
using Models.Models.Authentication;
using Rado.Datasets;
using Rado.Enums;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Utility;

namespace Rado.Enrich
{
    public static class EnrichManager
    {
        #region Load Car

        public static CarView LoadCarView(SqlDataReader sqlDataReader)
        {
            CarView carView = new();
            Loader.LoadCar(carView, sqlDataReader);

            return carView;
        }

        public static CarView EnrichCarView(SqlDataReader sqlDataReader)
        {
            CarView carView = new();
            Loader.LoadCar(carView, sqlDataReader);

            if (carView.bus == 1)
            {
                var result = ModelsDbSet.GetModelByIdAsync(carView.modelId.Value);
                result.Wait();
                var model = result.Result;
                carView.modelId = model.modelId;
                carView.modelName = model.modelName;
                carView.companyId = model.companyId;
            }
            else
            {
                var modification = ModificationsDbSet.GetModificationById(carView.modificationId);
                carView.modificationName = ModificationsDbSet.GetModificationNameById(carView.modificationId);
                
                if (modification != null)
                {
                    var result = ModelsDbSet.GetModelByIdAsync(modification.modelId).Result;
                    var model = result;
                    carView.modelId = model.modelId;
                    carView.modelName = model.modelName;
                    carView.companyId = model.companyId;
                }
            }

            if (carView.companyId != 0)
            {
                carView.companyName = CompaniesDbSet.getCompanyById(carView.companyId)?.companyName;
            }

            //User user = UserDbSet.GetUserById(carView.userId);
            //if (user != null)
            //{
            //    carView.sellerName = user.companyName;
            //    carView.sellerPhone = user.phone;
            //    carView.sellerPhone2 = user.phone2;
            //    carView.sellerViber = user.viber;
            //    carView.sellerWhats = user.whats;
            //    carView.sellerWebPage = user.webPage;
            //}

            var imageResult = ImageManager.GetNumberImages(carView.carId);
            imageResult.Wait();

            carView.numberImages = imageResult.Result; ;

            if (carView.mainImageId != 0)
            {
                ImageManager.CheckImageExists(carView.carId, carView.mainImageId);
                carView.mainPicture = ImageManager.GenerateImageHRef(carView.carId, carView.mainImageId, true);
            }

            return carView;
        }
        #endregion

        public static RimView EnrichRimView(SqlDataReader sqlDataReader)
        {
            RimView rimView = new RimView();

            Loader.LoadRim(rimView, sqlDataReader);
            User user = UserDbSet.GetUserById(rimView.userId);
            if (user != null)
            {
                rimView.sellerName = user.companyName;
                rimView.sellerPhone = user.phone;
                rimView.sellerPhone2 = user.phone2;
                rimView.sellerViber = user.viber;
                rimView.sellerWhats = user.whats;
                rimView.sellerWebPage = user.webPage;
            }

            var imageResult = ImageManager.GetNumberImages(rimView.rimId);
            imageResult.Wait();
            rimView.numberImages = imageResult.Result;

            return rimView;
        }

        public static void EnrichModification(Modification modification)
        {
            modification.modificationDisplayName = modification.modificationName;
            string yearToString = modification.yearTo.ToString();
            if (yearToString == "0")
                yearToString = "";
            if (modification.yearFrom != 0)
                modification.modificationDisplayName = modification.modificationDisplayName + $" ({modification.yearFrom} - {yearToString})";
        }

        public static void EnrichModel(Model model)
        {
            model.displayModelName = model.modelName;
            string yearToString = model.yearTo.ToString();
            if (yearToString == "0")
                yearToString = "";
            if (model.yearFrom != 9999 && model.yearFrom != 0 && model.yearTo != -1)
                model.displayModelName = model.displayModelName + $" ({model.yearFrom} - {yearToString})";
        }
        public static RimWithTyreView EnrichRimWithTyreView(SqlDataReader sqlDataReader)
        {
            RimWithTyreView rimWithTyreView = new RimWithTyreView();

            Loader.LoadRimWithTyre(rimWithTyreView, sqlDataReader);

            if (rimWithTyreView.itemType != ItemType.Tyre)
            {
                rimWithTyreView.companyName = CompaniesDbSet.getCompanyById(rimWithTyreView.companyId).companyName;
                rimWithTyreView.modelName = ModelsDbSet.GetModelNameById(rimWithTyreView.modelId);
            }

            if (rimWithTyreView.mainImageId != 0)
            {
                ImageManager.CheckImageExists(rimWithTyreView.rimWithTyreId, rimWithTyreView.mainImageId);
                rimWithTyreView.mainPicture = ImageManager.GenerateImageHRef(rimWithTyreView.rimWithTyreId, rimWithTyreView.mainImageId, true);
            }

            if (rimWithTyreView.mainImageId != 0)
            {
                rimWithTyreView.mainImageData = ImageManager.GetMinImageById(rimWithTyreView.mainImageId);
            }
            else
            {
                var result = ImageManager.GetMainImageAsync(rimWithTyreView.rimWithTyreId); ;
                result.Wait();
                rimWithTyreView.mainImageData = result.Result;
            }

            var imageResult = ImageManager.GetNumberImages(rimWithTyreView.rimWithTyreId);
            imageResult.Wait();
            rimWithTyreView.numberImages = imageResult.Result;

            return rimWithTyreView;
        }
        private static TraderDetails GetTraderDetails(int userId)
        {
            User user = UserDbSet.GetUserById(userId);
            if (user != null)
            {
                TraderDetails traderDetails = new TraderDetails();
                traderDetails.sellerName = user.companyName;
                traderDetails.sellerPhone = user.phone;
                traderDetails.sellerPhone2 = user.phone2;
                traderDetails.sellerViber = user.viber;
                traderDetails.sellerWhats = user.whats;
                traderDetails.sellerWebPage = user.webPage;

                return traderDetails;
            }

            return null;
        }

        public static TyreView EnrichTyreView(SqlDataReader sqlDataReader)
        {
            TyreView tyreView = new TyreView();
            Loader.LoadTyre(tyreView, sqlDataReader);
            tyreView.traderDetails = GetTraderDetails(tyreView.userId);

            var imageResult = ImageManager.GetNumberImages(tyreView.tyreId);
            imageResult.Wait();
            tyreView.numberImages = imageResult.Result;

            return tyreView;
        }

        public static PartView EnrichPartView(SqlDataReader sqlDataReader)
        {
            var partView = new PartView();
            Loader.LoadPart(partView, sqlDataReader);

            LoggerUtil.LogFunctionInfo("Start InitFromRow: 1");
            partView.isCar = false;
            try
            {
                var dealerSubCategory = DealerSubCategoryDbSet.GetDealerSubCategoryById(partView.dealerSubCategoryId);
                partView.subCategoryId = dealerSubCategory.subCategoryId;
                if (partView.subCategoryId != 0)
                {
                    var subCategory = SubCategoriesDbSet.GetSubCategoryById(partView.subCategoryId.Value);
                    partView.categoryId = subCategory.categoryId;
                    partView.categoryName = $"{CategoriesDbSet.GetCategoryById(partView.categoryId.Value)?.categoryName} / {subCategory?.subCategoryName}";
                }

            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
                throw new Exception("Dealer Subcategory");
            }
            try
            {
                if (partView.bus == 0)
                {
                    Modification modification = ModificationsDbSet.GetModificationById(partView.modificationId);
                    partView.modelId = modification.modelId;
                    if (modification != null) partView.modificationName = modification?.modificationName;
                    if (partView.year == 0 && modification != null)
                    {
                        if (modification.yearFrom != 0 && modification.yearTo != 0)
                            partView.yearName = $"{modification.yearFrom} - {modification.yearTo}";
                        else if (modification.yearFrom == 0)
                            partView.yearName = $" - {modification.yearTo}";
                        else
                            partView.yearName = $"{modification.yearFrom} - ";
                    }
                }

            }
            catch (Exception e)
            {
                LoggerUtil.LogFunctionInfo("InitFromRow 3");
                LoggerUtil.LogException(e.Message);
            }

            Model model;
            try
            {
                LoggerUtil.LogFunctionInfo("Load Image Part");
                var result = ModelsDbSet.GetModelByIdAsync(partView.modelId.Value);
                model = result.Result;
                partView.modelName = model.modelName;
                partView.companyId = model.companyId;
                if (model != null)
                    partView.companyName = CompaniesDbSet.getCompanyById(model.companyId)?.companyName;
                LoggerUtil.LogFunctionInfo("End Image Part");
            }
            catch (Exception e)
            {
                LoggerUtil.LogFunctionInfo("InitFromRow");
                LoggerUtil.LogException($"Model ${e.Message} PartId: {partView.partId}");
            }

            User user;
            partView.yearName = partView.year.ToString();

            try
            {
                user = UserDbSet.GetUserById(partView.userId);
            }
            catch (Exception e)
            {
                LoggerUtil.LogFunctionInfo("InitFromRow 5");
                LoggerUtil.LogException($"Category ${e.Message} PartId: {partView.partId}");
            }

            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            LoggerUtil.LogFunctionInfo("CheckImageExists 1");
            if (partView.mainImageId != 0)
            {
                LoggerUtil.LogFunctionInfo("CheckImageExists 2");
                ImageManager.CheckImageExists(partView.partId, partView.mainImageId);
                LoggerUtil.LogFunctionInfo("GenerateImageHRef 1");
                partView.mainPicture = ImageManager.GenerateImageHRef(partView.partId, partView.mainImageId, true);
                LoggerUtil.LogFunctionInfo("GenerateImageHRef 2");
            }
            LoggerUtil.LogFunctionInfo("GetNumberImages 1");
            var imageResult = ImageManager.GetNumberImages(partView.partId);
            imageResult.Wait();


            partView.numberImages = imageResult.Result;
            LoggerUtil.LogFunctionInfo("GetNumberImages 2");
            stopwatch.Stop();

            Console.WriteLine("Elapsed Time is {0} ms", stopwatch.ElapsedMilliseconds);
            LoggerUtil.Log($"Part:InitFromRow Elapsed Time is {stopwatch.ElapsedMilliseconds} ms").Wait();

            return partView;
        }

        public static RimWithTyreView EnrichRimWithTyre(SqlDataReader sqlDataReader)
        {
            RimWithTyreView rimViewTyre = new RimWithTyreView();

            Loader.LoadRimWithTyre(rimViewTyre, sqlDataReader);

            var imageResult = ImageManager.GetNumberImages(rimViewTyre.rimWithTyreId);
            imageResult.Wait();
            rimViewTyre.numberImages = imageResult.Result;

            return rimViewTyre;
        }
        public static Message EnrichMessage(SqlDataReader sqlDataReader)
        {
            Message message = Loader.LoadMessage(sqlDataReader);
            if (message.isCar == 0)
            {
                PartView part = PartDbSet.GetPart(message.partId);
                message.partDescription = part.companyName;
                message.partDescription = $" {part.dealerSubCategoryName}  за {part.companyName} {part.modelName}";
                message.modificationName = part.modificationName;
            }
            else
            {
                var task = CarsDbSet.GetCarByIdAsync(message.partId);
                task.Wait();
                CarView carView = task.Result;

                message.partDescription = $"{carView.companyName} {carView.modelName} на части";
                message.modificationName = carView.modificationName;
            }

            return message; ;

        }
        public static void EnrichImageData(ImageData imageData, SqlDataReader sqlDataReader)
        {
            string path = ImageManager.GetPhotosPath(imageData.objectId);
            imageData.imageSrc = ImageManager.GenerateImageSrc(imageData.objectId, imageData.imageId);
            imageData.imageMinSrc = ImageManager.GenerateMinImageSrc(imageData.objectId, imageData.imageId);
            byte[] imageBytes;
            bool imageSrcExist = File.Exists(imageData.imageSrc);
            bool imageMinSrcExist = File.Exists(imageData.imageMinSrc);

            imageBytes = (byte[])sqlDataReader["imageData"];
            // ImageManager.ArchiveData(imageBytes);
            if (!imageSrcExist || !imageMinSrcExist)
            {
                if (!imageSrcExist)
                    ImageManager.CreateImage(imageData.imageSrc, imageBytes, false);
                if (!imageMinSrcExist)
                    ImageManager.CreateImage(imageData.imageMinSrc, imageBytes, true);

            }

            imageData.imageSrc = ImageManager.GenerateImageHRef(imageData.objectId, imageData.imageId, false);
            imageData.imageMinSrc = ImageManager.GenerateImageHRef(imageData.objectId, imageData.imageId, true);
        }

        public static DisplayPartView EnrichDisplayView(PartView part_)
        {
            DisplayPartView displayPartView = new DisplayPartView();
            displayPartView.isCar = part_.isCar;
            displayPartView.part = part_;
            if (part_.bus == 1)
            {
                displayPartView.itemType = displayPartView.isCar ? ItemType.OnlyBus : ItemType.BusPart;
            }
            else
            {
                displayPartView.itemType = displayPartView.isCar ? ItemType.OnlyCar : ItemType.CarPart;
            }
            displayPartView.ItemTypeStr = ConverterToString.ItemTypeStr(displayPartView.itemType);
            displayPartView.id = displayPartView.isCar ? part_.carId.Value : part_.partId;
            displayPartView.price = part_.price;
            var imageResult = ImageManager.GetNumberImages(displayPartView.id);

            imageResult.Wait();
            var imageData = ImageManager.GetImagesAsync(displayPartView.id);
            imageData.Wait();
            displayPartView.images = imageData.Result;
            displayPartView.numberImages = imageResult.Result;
            displayPartView.userId = part_.userId;
            displayPartView.regionId = part_.regionId;
            displayPartView.RegionStr = ConverterToString.RegionString(displayPartView.regionId);
            displayPartView.approved = part_.approved;
            displayPartView.mainPicture = part_.mainPicture;
            displayPartView.description = part_.description;
            displayPartView.modifiedTime = part_.modifiedTime;
            sellerImage(displayPartView);

            return displayPartView;
        }
        public static void DisplayPartView(PartView part_)
        {
        }
        public static User EnrichUser(SqlDataReader sqlDataReader)
        {
            User user = Loader.LoadUser(sqlDataReader);

            if (user.webPage.Length > 0 && !user.webPage.StartsWith("http"))
                user.webPage = $"http://{user.webPage}.{Program.CompanyName}.com";


            try
            {
                user.imageData = ImageManager.GetBusinessCard(user.userId);
            }
            catch (Exception exception)
            {
                user.imageData = null;
                LoggerUtil.LogException(exception);
            }

            return user;
        }

        public static void sellerImage(DisplayPartView displayPartView)
        {
            User user = UserDbSet.GetUserById(displayPartView.userId);
            displayPartView.sellerCity = user.city;
            displayPartView.sellerCompanyName = user.companyName;
            if (user.imageData != null)
                displayPartView.sellerLogo = user.imageData.imageMinSrc;

            if (user.dealer == UserType.Dealer)
            {
                displayPartView.sellerName = user.companyName;
                displayPartView.sellerWebPage = user.webPage;
            }
            else
            {
                displayPartView.sellerName = string.Join(',', user.firstName, user.lastName);
                displayPartView.sellerName = "Частно лице: " + displayPartView.sellerName;
            }

            if (user != null)
            {
                displayPartView.sellerPhone = user.phone;
                displayPartView.sellerPhone2 = user.phone2;
                displayPartView.sellerViber = user.viber;
                displayPartView.sellerWhats = user.whats;
                displayPartView.sellerWebPage = user.webPage;
                displayPartView.dealer = user.dealer;
            }

        }

        public static void InitPartViewFromCar(CarView carView, PartView part, bool loadMainPicture = false)
        {
            part.carId = carView.carId;
            part.companyId = carView.companyId;
            part.companyName = carView.companyName;
            part.modelId = carView.modelId;
            part.modelName = carView.modelName;
            part.modificationId = carView.modificationId;
            part.modification = carView.modificationName;
            part.engineType = carView.engineType;
            part.engineModel = carView.engineModel;
            part.year = carView.year;
            part.description = carView.description;
            part.millage = carView.millage;
            part.regionId = carView.regionId;
            part.gearboxType = carView.gearboxType;
            part.regNumber = carView.regNumber;
            part.vin = carView.vin;
            part.userId = carView.userId;
            part.bus = carView.bus;

            part.categoryName = "Кола на части";
            part.isCar = true;
            part.modificationName = ModificationsDbSet.GetModificationById(carView.modificationId)?.modificationName;

            if (loadMainPicture)
            {
                var result = ImageManager.GetMainImageAsync(carView.carId);
                result.Wait();
                carView.mainImageData = result.Result;

                if (carView.mainImageData == null)
                {
                    var resultData = ImageManager.GetMainImageAsync(carView.carId);
                    resultData.Wait();
                    carView.mainImageData = resultData.Result;
                }
            }

            var imageResult = ImageManager.GetNumberImages(carView.carId);
            imageResult.Wait();

            part.numberImages = imageResult.Result;
            part.mainImageData = carView.mainImageData;
            part.modifiedTime = carView.modifiedTime;
            part.approved = carView.approved;
            part.mainPicture = carView.mainPicture;
            part.userId = carView.userId;
        }
        public static void InitPartViewFromCar(CarView carView, Part part, bool loadMainPicture = false)
        {
            part.carId = carView.carId;
            part.modelId = carView.modelId;
            part.modificationId = carView.modificationId;
            part.modification = carView.modificationName;
            part.engineType = carView.engineType;
            part.engineModel = carView.engineModel;
            part.year = carView.year;
            part.description = carView.description;
            part.millage = carView.millage;
            part.regionId = carView.regionId;
            part.gearboxType = carView.gearboxType;
            part.userId = carView.userId;
            part.bus = carView.bus;
        }

        public static void InitPartFromCar(ref Part part, CarView car)
        {
            part.modelId = car.modelId;
            part.modificationId = car.modificationId;
            part.modification = car.modificationName;
            part.year = car.year;
            part.millage = car.millage;
            part.engineType = car.engineType;
            part.engineModel = car.engineModel;
            part.regionId = car.regionId;
            part.gearboxType = car.gearboxType;
            part.powerBHP = car.powerBHP;
            part.powerkWh = car.powerkWh;
            part.bus = car.bus;
        }

        public static void EnrichFilter(Filter filter)
        {
            string description = "";
            filter.keywords = new Dictionary<string, string>();
            try
            {
                switch (filter.itemType)
                {
                    case ItemType.AllCarAndPart:
                        description = $"{description} Всички обяви за коли";
                        break;
                    case ItemType.AllBusAndPart:
                        description = $"{description} Всички обяви за бусове";
                        break;
                    case ItemType.OnlyCar:
                        description = $"{description} Коли на части";
                        break;
                    case ItemType.OnlyBus:
                        description = $"{description} Бус на части";
                        break;
                    case ItemType.CarPart:
                        description = $"{description} Част за кола";
                        break;
                    case ItemType.BusPart:
                        description = $"{description} Бус на части";
                        break;
                    case ItemType.Tyre:
                        description = $"{description} Гуми";
                        break;
                    case ItemType.Rim:
                        description = $"{description} Джанти";
                        break;
                    case ItemType.RimWithTyre:
                        description = $"{description} Гуми с джанти";
                        break;
                    case ItemType.AllTyre:
                        description = $"{description} Гуми/Джанти";
                        break;
                    case ItemType.RegNumber:
                        description = $"Search by part number {filter.regNumber}";
                        break;
                }
                filter.keywords.Add("Описание", description);
                if (filter.companyId != 0)
                {
                    string companyName = CompaniesDbSet.getCompanyById(filter.companyId).companyName;
                    filter.keywords.Add("Компания", companyName);
                }
                else
                {
                    filter.keywords.Add("Компания", "Всички");
                }
                if (filter.modelId != 0)
                {
                    string modelName = ModelsDbSet.GetModelNameById(filter.modelId);
                    description = $"{description} Модел: {modelName}";
                    filter.keywords.Add("Модел", modelName);
                }
                else if (filter.modelsId?.Length > 0)
                {
                    string[] ids = filter.modelsId.Split(',');
                    description = $"{description} Модели:";
                    List<string> models = new List<string>();
                    foreach (string id in ids)
                    {
                        string modelName = ModelsDbSet.GetModelNameById(Convert.ToInt32(id));
                        description = $"{description} {modelName}";
                        models.Add(modelName);
                    }
                    filter.keywords.Add("Модел", string.Join(',', models));
                }
                else
                {
                    filter.keywords.Add("Модел", "Всички");
                }
                if (filter.modificationId != 0)
                {
                    string modificationName = ModificationsDbSet.GetModificationNameById(filter.modificationId);
                    filter.keywords.Add("Модификация", modificationName);
                }
                else if (filter.modificationsId?.Length > 0)
                {
                    string[] ids = filter.modificationsId.Split(',');
                    List<string> modifications = new List<string>();
                    foreach (string id in ids)
                    {
                        string modificationName = ModificationsDbSet.GetModificationNameById(Convert.ToInt32(id));
                        modifications.Add(modificationName);
                    }
                    filter.keywords.Add("Модификации", string.Join(',', modifications));
                }
                else
                {
                    filter.keywords.Add("Модификация", "Всички");
                }

                if (filter.categoryId != 0)
                {
                    string categoryName = CategoriesDbSet.GetCategoryNameById(filter.categoryId);
                    filter.keywords.Add("Категория", categoryName);
                }
                else if (filter.categoriesId?.Length > 0)
                {
                    string[] ids = filter.categoriesId.Split(',');
                    List<string> items = new List<string>();
                    foreach (string id in ids)
                    {
                        string categoryName = CategoriesDbSet.GetCategoryNameById(Convert.ToInt32(id));
                        items.Add(categoryName);
                    }
                    filter.keywords.Add("Категории", string.Join(',', items));
                }
                else
                {
                    filter.keywords.Add("Категория", "Всички");
                }

                if (filter.subCategoryId != 0)
                {
                    string subCategoryName = SubCategoriesDbSet.GetSubCategoryNameById(filter.subCategoryId);
                    filter.keywords.Add("Подкатегория", subCategoryName);
                }
                else if (filter.categoriesId?.Length > 0)
                {
                    string[] ids = filter.categoriesId.Split(',');
                    List<string> items = new List<string>();
                    foreach (string id in ids)
                    {
                        string categoryName = SubCategoriesDbSet.GetSubCategoryNameById(Convert.ToInt32(id));
                        items.Add(categoryName);
                    }
                    filter.keywords.Add("Подкатегория", string.Join(',', items));
                }
                else
                {
                    filter.keywords.Add("Подкатегория", "Всички");
                }

                if (filter.keyword?.Length > 0)
                    filter.keywords.Add("Търси по", filter.keyword);

                if (filter.partNumber?.Length > 0)
                    filter.keywords.Add("Номер част", filter.partNumber);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }
        }

        //public static DisplayPartView EnrichDisplayPartView(RimWithTyreView rimWithTyreView)
        //{
        //    DisplayPartView displayPartView = new DisplayPartView();

        //    displayPartView.itemType = rimWithTyreView.itemType;
        //    displayPartView.id = rimWithTyreView.rimWithTyreId;
        //    displayPartView.rimWithTyre = rimWithTyreView;

        //    displayPartView.price = rimWithTyreView.price;
        //    displayPartView.mainImageData = rimWithTyreView.mainImageData;
        //    var imageResult = ImageManager.GetNumberImages(displayPartView.id);
        //    imageResult.Wait();

        //    displayPartView.numberImages = imageResult.Result;
        //    displayPartView.userId = rimWithTyreView.userId;
        //    displayPartView.regionId = rimWithTyreView.regionId;
        //    displayPartView.approved = rimWithTyreView.approved;
        //    displayPartView.mainPicture = rimWithTyreView.mainPicture;
        //    displayPartView.description = rimWithTyreView.description;
        //    displayPartView.modifiedTime = rimWithTyreView.modifiedTime;

        //    sellerImage(displayPartView);

        //    return displayPartView;
        //}

        public static DisplayPartView EnrichDisplayPartView(PartView part)
        {
            DisplayPartView displayPartView = new DisplayPartView();

            displayPartView.isCar = part.isCar;
            displayPartView.part = part;
            if (part.bus == 1)
            {
                displayPartView.itemType = displayPartView.isCar ? ItemType.OnlyBus : ItemType.BusPart;
            }
            else
            {
                displayPartView.itemType = displayPartView.isCar ? ItemType.OnlyCar : ItemType.CarPart;
            }
            displayPartView.ItemTypeStr = ConverterToString.ItemTypeStr(displayPartView.itemType);
            displayPartView.id = part.isCar ? part.carId.Value : part.partId;
            displayPartView.price = part.price;
            displayPartView.userId = part.userId;
            displayPartView.regionId = part.regionId;
            displayPartView.approved = part.approved;
            displayPartView.mainPicture = part.mainPicture;
            displayPartView.description = part.description;
            displayPartView.modifiedTime = part.modifiedTime;

            enrichDisplay(displayPartView);

            return displayPartView;
        }

        public static DisplayPartView EnrichDisplayPartView(RimWithTyreView rimWithTyreView)
        {
            DisplayPartView displayPartView = new DisplayPartView();
            displayPartView.itemType = rimWithTyreView.itemType;
            displayPartView.ItemTypeStr = ConverterToString.ItemTypeStr(displayPartView.itemType);
            displayPartView.id = rimWithTyreView.rimWithTyreId;
            displayPartView.rimWithTyre = rimWithTyreView;

            displayPartView.price = rimWithTyreView.price;
            displayPartView.mainImageData = rimWithTyreView.mainImageData;

            displayPartView.Count = rimWithTyreView.count;
            displayPartView.userId = rimWithTyreView.userId;
            displayPartView.regionId = rimWithTyreView.regionId;
            displayPartView.approved = rimWithTyreView.approved;
            displayPartView.mainPicture = rimWithTyreView.mainPicture;
            displayPartView.description = rimWithTyreView.description;
            displayPartView.modifiedTime = rimWithTyreView.modifiedTime;
            var companyName = CompaniesDbSet.GetCompanyNameById(rimWithTyreView.companyId);
            var modelName = ModelsDbSet.GetModelNameById(rimWithTyreView.modelId);
            if (companyName.Length > 0)
                displayPartView.companyName = companyName;
            if (modelName.Length > 0)
                displayPartView.modelName = modelName;
            enrichDisplay(displayPartView);

            return displayPartView;
        }

        public static void enrichDisplay(DisplayPartView displayPartView)
        {
            var images = ImageManager.GetImagesAsync(displayPartView.id);
            images.Wait();

            displayPartView.numberImages = images.Result.Length;
            displayPartView.images = images.Result;
            displayPartView.RegionStr = ConverterToString.RegionString(displayPartView.regionId);
            sellerImage(displayPartView);
        }
    }
}
