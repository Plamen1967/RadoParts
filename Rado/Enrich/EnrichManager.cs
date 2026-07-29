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

            if (carView.Bus == 1)
            {
                var result = ModelsDbSet.GetModelByIdAsync(carView.ModelId ?? 0);
                result.Wait();
                var model = result.Result;
                carView.ModelId = model.ModelId;
                carView.ModelName = model.ModelName;
                carView.CompanyId = model.CompanyId;
            }
            else
            {
                var modification = ModificationsDbSet.GetModificationById(carView.ModificationId ?? 0);
                carView.ModificationName = ModificationsDbSet.GetModificationNameById(carView.ModificationId ?? 0);

                if (modification != null)
                {
                    var result = ModelsDbSet.GetModelByIdAsync(modification.ModelId).Result;
                    var model = result;
                    carView.ModelId = model.ModelId;
                    carView.ModelName = model.ModelName;
                    carView.CompanyId = model.CompanyId;
                }
            }

            if (carView.CompanyId != 0)
            {
                carView.CompanyName = CompaniesDbSet.GetCompanyById(carView.CompanyId)?.CompanyName;
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

            var imageResult = ImageManager.GetImageCount(carView.CarId);
            imageResult.Wait();

            carView.NumberImages = imageResult.Result;

            if (carView.MainImageId != 0)
            {
                ImageManager.CheckImageExists(carView.CarId, carView.MainImageId);
                carView.MainPicture = ImageManager.GenerateImageHRef(carView.CarId, carView.MainImageId, true);
            }

            return carView;
        }
        #endregion

        public static RimView EnrichRimView(SqlDataReader sqlDataReader)
        {
            RimView rimView = new RimView();

            Loader.LoadRim(rimView, sqlDataReader);
            var user = UserDbSet.GetUserById(rimView.UserId);
            if (user != null)
            {
                rimView.SellerName = user.CompanyName;
                rimView.SellerPhone = user.Phone;
                rimView.SellerPhone2 = user.Phone2;
                rimView.SellerViber = user.Viber;
                rimView.SellerWhats = user.Whats;
                rimView.SellerWebPage = user.WebPage;
            }

            var imageResult = ImageManager.GetImageCount(rimView.RimId);
            imageResult.Wait();
            rimView.NumberImages = imageResult.Result;

            return rimView;
        }

        public static void EnrichModification(Modification modification)
        {
            modification.ModificationDisplayName = modification.ModificationName;
            string yearToString = modification.YearTo.ToString();
            if (yearToString == "0")
                yearToString = "";
            if (modification.YearFrom != 0)
                modification.ModificationDisplayName = modification.ModificationDisplayName + $" ({modification.YearFrom} - {yearToString})";
        }

        public static void EnrichModel(Model model)
        {
            model.DisplayModelName = model.ModelName;
            string yearToString = model.YearTo.ToString();
            if (yearToString == "0")
                yearToString = "";
            if (model.YearFrom != 9999 && model.YearFrom != 0 && model.YearTo != -1)
                model.DisplayModelName = model.DisplayModelName + $" ({model.YearFrom} - {yearToString})";
        }
        public static RimWithTyreView EnrichRimWithTyreView(SqlDataReader sqlDataReader)
        {
            RimWithTyreView rimWithTyreView = new RimWithTyreView();

            Loader.LoadRimWithTyre(rimWithTyreView, sqlDataReader);

            if (rimWithTyreView.ItemType != ItemType.Tyre)
            {
                rimWithTyreView.CompanyName = CompaniesDbSet.GetCompanyById(rimWithTyreView.CompanyId).CompanyName;
                rimWithTyreView.ModelName = ModelsDbSet.GetModelNameById(rimWithTyreView.ModelId);
            }

            if (rimWithTyreView.MainImageId != 0)
            {
                ImageManager.CheckImageExists(rimWithTyreView.RimWithTyreId, rimWithTyreView.MainImageId);
                rimWithTyreView.MainPicture = ImageManager.GenerateImageHRef(rimWithTyreView.RimWithTyreId, rimWithTyreView.MainImageId, true);
            }

            if (rimWithTyreView.MainImageId != 0)
            {
                rimWithTyreView.MainImageData = ImageManager.GetMinImageById(rimWithTyreView.MainImageId);
            }
            else
            {
                var result = ImageManager.GetMainImageAsync(rimWithTyreView.RimWithTyreId); ;
                result.Wait();
                rimWithTyreView.MainImageData = result.Result;
                if (rimWithTyreView.MainImageData != null)
                {
                    LoggerUtil.Warning($"RimWithTyre {rimWithTyreView.RimWithTyreId} has images but does not have default image. User {rimWithTyreView.UserId}");
                    rimWithTyreView.MainImageId = rimWithTyreView.MainImageData.ImageId;
                    rimWithTyreView.MainPicture = ImageManager.GenerateImageHRef(rimWithTyreView.RimWithTyreId, rimWithTyreView.MainImageId, true);
                }
            }

            var imageResult = ImageManager.GetImageCount(rimWithTyreView.RimWithTyreId);
            imageResult.Wait();
            rimWithTyreView.NumberImages = imageResult.Result;

            return rimWithTyreView;
        }
        private static TraderDetails GetTraderDetails(int userId)
        {
            User user = UserDbSet.GetUserById(userId);
            if (user != null)
            {
                TraderDetails traderDetails = new TraderDetails();
                traderDetails.SellerName = user.CompanyName;
                traderDetails.SellerPhone = user.Phone;
                traderDetails.SellerPhone2 = user.Phone2;
                traderDetails.SellerViber = user.Viber;
                traderDetails.SellerWhats = user.Whats;
                traderDetails.SellerWebPage = user.WebPage;

                return traderDetails;
            }

            return null;
        }

        public static TyreView EnrichTyreView(SqlDataReader sqlDataReader)
        {
            TyreView tyreView = new TyreView();
            Loader.LoadTyre(tyreView, sqlDataReader);
            tyreView.TraderDetails = GetTraderDetails(tyreView.UserId);

            var imageResult = ImageManager.GetImageCount(tyreView.TyreId);
            imageResult.Wait();
            tyreView.NumberImages = imageResult.Result;

            return tyreView;
        }

        public static PartView EnrichPartView(SqlDataReader sqlDataReader)
        {
            var partView = new PartView();
            Loader.LoadPart(partView, sqlDataReader);

            LoggerUtil.LogFunctionInfo("Start InitFromRow: 1");
            partView.IsCar = false;
            try
            {
                var dealerSubCategory = DealerSubCategoryDbSet.GetDealerSubCategoryById(partView.DealerSubCategoryId);
                partView.SubCategoryId = dealerSubCategory.SubCategoryId;
                if (partView.SubCategoryId != 0)
                {
                    var subCategory = SubCategoriesDbSet.GetSubCategoryById(partView.SubCategoryId.Value);
                    partView.CategoryId = subCategory.CategoryId;
                    partView.CategoryName = $"{CategoriesDbSet.GetCategoryById(partView.CategoryId.Value)?.CategoryName} / {subCategory?.SubCategoryName}";
                }

            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
                throw new Exception("Dealer Subcategory");
            }
            try
            {
                if (partView.Bus == 0)
                {
                    Modification modification = ModificationsDbSet.GetModificationById(partView.ModificationId);
                    partView.ModelId = modification.ModelId;
                    if (modification != null) partView.ModificationName = modification?.ModificationName;
                    if (partView.Year == 0 && modification != null)
                    {
                        if (modification.YearFrom != 0 && modification.YearTo != 0)
                            partView.YearName = $"{modification.YearFrom} - {modification.YearTo}";
                        else if (modification.YearFrom == 0)
                            partView.YearName = $" - {modification.YearTo}";
                        else
                            partView.YearName = $"{modification.YearFrom} - ";
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
                var result = ModelsDbSet.GetModelByIdAsync(partView.ModelId.Value);
                model = result.Result;
                if (model != null)
                {
                    partView.CompanyId = model.CompanyId;
                    partView.CompanyName = CompaniesDbSet.GetCompanyById(model.CompanyId)?.CompanyName;
                }
                else
                {
                    LoggerUtil.Warning($"Part Id {partView.PartId} has no model");
                }
                LoggerUtil.LogFunctionInfo("End Image Part");
            }
            catch (Exception e)
            {
                LoggerUtil.LogFunctionInfo("InitFromRow");
                LoggerUtil.LogException($"Model ${e.Message} PartId: {partView.PartId}");
            }
                
            User user;
            partView.YearName = partView.Year.ToString();

            try
            {
                user = UserDbSet.GetUserById(partView.UserId);
            }
            catch (Exception e)
            {
                LoggerUtil.LogFunctionInfo("InitFromRow 5");
                LoggerUtil.LogException($"Category ${e.Message} PartId: {partView.PartId}");
            }

            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            LoggerUtil.LogFunctionInfo("CheckImageExists 1");
            if (partView.MainImageId != 0)
            {
                LoggerUtil.LogFunctionInfo("CheckImageExists 2");
                ImageManager.CheckImageExists(partView.PartId, partView.MainImageId);
                LoggerUtil.LogFunctionInfo("GenerateImageHRef 1");
                partView.MainPicture = ImageManager.GenerateImageHRef(partView.PartId, partView.MainImageId, true);
                LoggerUtil.LogFunctionInfo("GenerateImageHRef 2");
            }
            LoggerUtil.LogFunctionInfo("GetImageCount 1");
            var imageResult = ImageManager.GetImageCount(partView.PartId);
            imageResult.Wait();


            partView.NumberImages = imageResult.Result;
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

            var imageResult = ImageManager.GetImageCount(rimViewTyre.RimWithTyreId);
            imageResult.Wait();
            rimViewTyre.NumberImages = imageResult.Result;

            return rimViewTyre;
        }
        public static Message EnrichMessage(SqlDataReader sqlDataReader)
        {
            Message message = Loader.LoadMessage(sqlDataReader);
            if (message.IsCar == 0)
            {
                PartView part = PartDbSet.GetPart(message.PartId);
                message.PartDescription = part.CompanyName;
                message.PartDescription = $" {part.DealerSubCategoryName}  за {part.CompanyName} {part.ModelName}";
                message.ModificationName = part.ModificationName;
            }
            else
            {
                var task = CarsDbSet.GetCarByIdAsync(message.PartId);
                task.Wait();
                CarView carView = task.Result;

                message.PartDescription = $"{carView.CompanyName} {carView.ModelName} на части";
                message.ModificationName = carView.ModificationName;
            }

            return message;

        }
        public static void EnrichImageData(ImageDataClass imageDataClass, SqlDataReader sqlDataReader)
        {
            string path = ImageManager.GetPhotosPath(imageDataClass.ObjectId);
            imageDataClass.ImageSrc = ImageManager.GenerateImageSrc(imageDataClass.ObjectId, imageDataClass.ImageId);
            imageDataClass.ImageMinSrc = ImageManager.GenerateMinImageSrc(imageDataClass.ObjectId, imageDataClass.ImageId);
            byte[] imageBytes;
            bool imageSrcExist = File.Exists(imageDataClass.ImageSrc);
            bool imageMinSrcExist = File.Exists(imageDataClass.ImageMinSrc);

            imageBytes = (byte[])sqlDataReader["imageDataClass"];
            // ImageManager.ArchiveData(imageBytes);
            if (!imageSrcExist || !imageMinSrcExist)
            {
                if (!imageSrcExist)
                    ImageManager.CreateImage(imageDataClass.ImageSrc, imageBytes, false);
                if (!imageMinSrcExist)
                    ImageManager.CreateImage(imageDataClass.ImageMinSrc, imageBytes, true);

            }

            imageDataClass.ImageSrc = ImageManager.GenerateImageHRef(imageDataClass.ObjectId, imageDataClass.ImageId, false);
            imageDataClass.ImageMinSrc = ImageManager.GenerateImageHRef(imageDataClass.ObjectId, imageDataClass.ImageId, true);
        }

        public static DisplayPartView EnrichDisplayView(PartView part_)
        {
            DisplayPartView displayPartView = new DisplayPartView();
            displayPartView.IsCar = part_.IsCar;
            displayPartView.Part = part_;
            if (part_.Bus == 1)
            {
                displayPartView.ItemType = displayPartView.IsCar ? ItemType.OnlyBus : ItemType.BusPart;
            }
            else
            {
                displayPartView.ItemType = displayPartView.IsCar ? ItemType.OnlyCar : ItemType.CarPart;
            }
            displayPartView.ItemTypeStr = ConverterToString.ItemTypeStr(displayPartView.ItemType);
            displayPartView.Id = displayPartView.IsCar ? part_.CarId.Value : part_.PartId;
            displayPartView.Price = part_.Price;
            var imageResult = ImageManager.GetImageCount(displayPartView.Id);

            imageResult.Wait();
            var imageData = ImageManager.GetImagesAsync(displayPartView.Id);
            imageData.Wait();
            displayPartView.Images = imageData.Result;
            displayPartView.NumberImages = imageResult.Result;
            displayPartView.UserId = part_.UserId;
            displayPartView.RegionId = part_.RegionId;
            displayPartView.RegionStr = ConverterToString.RegionString(displayPartView.RegionId);
            displayPartView.Approved = part_.Approved;
            displayPartView.MainPicture = part_.MainPicture;
            displayPartView.Description = part_.Description;
            displayPartView.ModifiedTime = part_.ModifiedTime;
            SellerImage(displayPartView);

            return displayPartView;
        }
        public static void DisplayPartView(PartView part_)
        {
        }
        public static User EnrichUser(SqlDataReader sqlDataReader)
        {
            User user = Loader.LoadUser(sqlDataReader);

            if (user.WebPage.Length > 0 && !user.WebPage.StartsWith("http"))
                user.WebPage = $"http://{user.WebPage}.{Program.CompanyName}.com";


            try
            {
                user.ImageData = ImageManager.GetBusinessCard(user.UserId);
            }
            catch (Exception exception)
            {
                user.ImageData = null;
                LoggerUtil.LogException(exception);
            }

            return user;
        }

        public static void SellerImage(DisplayPartView displayPartView)
        {
            User user = UserDbSet.GetUserById(displayPartView.UserId);
            displayPartView.SellerCity = user.City;
            displayPartView.SellerCompanyName = user.CompanyName;
            if (user.ImageData != null)
                displayPartView.SellerLogo = user.ImageData.ImageMinSrc;

            if (user.Dealer == UserType.Dealer)
            {
                displayPartView.SellerName = user.CompanyName;
                displayPartView.SellerWebPage = user.WebPage;
            }
            else
            {
                displayPartView.SellerCity = string.Join(',', user.FirstName, user.LastName);
                displayPartView.SellerName = "Частно лице: " + displayPartView.SellerName;
            }

            if (user != null)
            {
                displayPartView.SellerPhone = user.Phone;
                displayPartView.SellerPhone2 = user.Phone2;
                displayPartView.SellerViber = user.Viber;
                displayPartView.SellerWhats = user.Whats;
                displayPartView.SellerWebPage = user.WebPage;
                displayPartView.Dealer = user.Dealer;
            }

        }

        public static void InitPartViewFromCar(CarView carView, PartView part, bool loadMainPicture = false)
        {
            part.CarId = carView.CarId;
            part.CompanyId = carView.CompanyId;
            part.CompanyName = carView.CompanyName;
            part.ModelId = carView.ModelId;
            part.ModelName = carView.ModelName;
            part.ModificationId = carView.ModificationId ?? 0;
            part.Modification = carView.ModificationName;
            part.EngineType = carView.EngineType;
            part.EngineModel = carView.EngineModel;
            part.Year = carView.Year;
            part.Description = carView.Description;
            part.Millage = carView.Millage;
            part.RegionId = carView.RegionId;
            part.GearboxType = carView.GearboxType;
            part.RegNumber = carView.RegNumber;
            part.Vin = carView.Vin;
            part.UserId = carView.UserId;
            part.Bus = carView.Bus;

            part.CategoryName = "Кола на части";
            part.IsCar = true;
            part.ModificationName = ModificationsDbSet.GetModificationById(carView.ModificationId ?? 0)?.ModificationName ?? "";

            if (loadMainPicture)
            {
                var result = ImageManager.GetMainImageAsync(carView.CarId);
                result.Wait();
                carView.MainImageData = result.Result;

                if (carView.MainImageData == null)
                {
                    var resultData = ImageManager.GetMainImageAsync(carView.CarId);
                    resultData.Wait();
                    carView.MainImageData = resultData.Result;
                }
            }

            var imageResult = ImageManager.GetImageCount(carView.CarId);
            imageResult.Wait();

            part.NumberImages = imageResult.Result;
            part.MainImageDataClass = carView.MainImageData;
            part.ModifiedTime = carView.ModifiedTime;
            part.Approved = carView.Approved;
            part.MainPicture = carView.MainPicture;
            part.UserId = carView.UserId;
        }
        public static void InitPartViewFromCar(CarView carView, Part part, bool loadMainPicture = false)
        {
            part.CarId = carView.CarId;
            part.ModelId = carView.ModelId;
            part.ModificationId = carView.ModificationId ?? 0;
            part.Modification = carView.ModificationName;
            part.EngineType = carView.EngineType;
            part.EngineModel = carView.EngineModel;
            part.Year = carView.Year;
            part.Description = carView.Description;
            part.Millage = carView.Millage;
            part.RegionId = carView.RegionId;
            part.GearboxType = carView.GearboxType;
            part.UserId = carView.UserId;
            part.Bus = carView.Bus;
        }

        public static void InitPartFromCar(ref Part part, CarView car)
        {
            part.Millage = car.ModelId;
            part.ModificationId = car.ModificationId ?? 0;
            part.Modification = car.ModificationName;
            part.Year = car.Year;
            part.Millage = car.Millage;
            part.EngineType = car.EngineType;
            part.EngineModel = car.EngineModel;
            part.RegionId = car.RegionId;
            part.GearboxType = car.GearboxType;
            part.PowerBHP = car.PowerBHP;
            part.PowerkWh = car.PowerkWh;
            part.Bus = car.Bus;
        }

        public static void EnrichFilter(Filter filter)
        {
            string description = "";
            filter.Keywords = new Dictionary<string, string>();
            try
            {
                switch (filter.ItemType)
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
                        description = $"Search by part number {filter.RegNumber}";
                        break;
                }
                filter.Keywords.Add("Описание", description);
                if (filter.CompanyId != 0)
                {
                    string companyName = CompaniesDbSet.GetCompanyById(filter.CompanyId).CompanyName;
                    filter.Keywords.Add("Компания", companyName);
                }
                else
                {
                    filter.Keywords.Add("Компания", "Всички");
                }
                if (filter.ModelId != 0)
                {
                    string modelName = ModelsDbSet.GetModelNameById(filter.ModelId);
                    description = $"{description} Модел: {modelName}";
                    filter.Keywords.Add("Модел", modelName);
                }
                else if (filter.ModelsId?.Length > 0)
                {
                    string[] ids = filter.ModelsId.Split(',');
                    description = $"{description} Модели:";
                    List<string> models = new List<string>();
                    foreach (string id in ids)
                    {
                        string modelName = ModelsDbSet.GetModelNameById(Convert.ToInt32(id));
                        description = $"{description} {modelName}";
                        models.Add(modelName);
                    }
                    filter.Keywords.Add("Модел", string.Join(',', models));
                }
                else
                {
                    filter.Keywords.Add("Модел", "Всички");
                }
                if (filter.ModificationId != 0)
                {
                    string modificationName = ModificationsDbSet.GetModificationNameById(filter.ModificationId);
                    filter.Keywords.Add("Модификация", modificationName);
                }
                else if (filter.ModificationsId?.Length > 0)
                {
                    string[] ids = filter.ModificationsId.Split(',');
                    List<string> modifications = new List<string>();
                    foreach (string id in ids)
                    {
                        string modificationName = ModificationsDbSet.GetModificationNameById(Convert.ToInt32(id));
                        modifications.Add(modificationName);
                    }
                    filter.Keywords.Add("Модификации", string.Join(',', modifications));
                }
                else
                {
                    filter.Keywords.Add("Модификация", "Всички");
                }

                if (filter.CategoryId != 0)
                {
                    string categoryName = CategoriesDbSet.GetCategoryNameById(filter.CategoryId);
                    filter.Keywords.Add("Категория", categoryName);
                }
                else if (filter.CategoriesId?.Length > 0)
                {
                    string[] ids = filter.CategoriesId.Split(',');
                    List<string> items = new List<string>();
                    foreach (string id in ids)
                    {
                        string categoryName = CategoriesDbSet.GetCategoryNameById(Convert.ToInt32(id));
                        items.Add(categoryName);
                    }
                    filter.Keywords.Add("Категории", string.Join(',', items));
                }
                else
                {
                    filter.Keywords.Add("Категория", "Всички");
                }

                if (filter.SubCategoryId != 0)
                {
                    string subCategoryName = SubCategoriesDbSet.GetSubCategoryNameById(filter.SubCategoryId);
                    filter.Keywords.Add("Подкатегория", subCategoryName);
                }
                else if (filter.CategoriesId?.Length > 0)
                {
                    string[] ids = filter.CategoriesId.Split(',');
                    List<string> items = new List<string>();
                    foreach (string id in ids)
                    {
                        string categoryName = SubCategoriesDbSet.GetSubCategoryNameById(Convert.ToInt32(id));
                        items.Add(categoryName);
                    }
                    filter.Keywords.Add("Подкатегория", string.Join(',', items));
                }
                else
                {
                    filter.Keywords.Add("Подкатегория", "Всички");
                }

                if (filter.Keyword?.Length > 0)
                    filter.Keywords.Add("Търси по", filter.Keyword);

                if (filter.PartNumber?.Length > 0)
                    filter.Keywords.Add("Номер част", filter.PartNumber);
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
        //    displayPartView.MainImageData = rimWithTyreView.MainImageData;
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

            displayPartView.IsCar = part.IsCar;
            displayPartView.Part = part;
            if (part.Bus == 1)
            {
                displayPartView.ItemType = displayPartView.IsCar ? ItemType.OnlyBus : ItemType.BusPart;
            }
            else
            {
                displayPartView.ItemType = displayPartView.IsCar ? ItemType.OnlyCar : ItemType.CarPart;
            }
            displayPartView.ItemTypeStr = ConverterToString.ItemTypeStr(displayPartView.ItemType);
            displayPartView.Id = part.IsCar ? part.CarId.Value : part.PartId;
            displayPartView.Price = part.Price;
            displayPartView.UserId = part.UserId;
            displayPartView.RegionId = part.RegionId;
            displayPartView.Approved = part.Approved;
            displayPartView.MainPicture = part.MainPicture;
            displayPartView.Description = part.Description;
            displayPartView.ModifiedTime = part.ModifiedTime;

            EnrichDisplay(displayPartView);

            return displayPartView;
        }

        public static DisplayPartView EnrichDisplayPartView(RimWithTyreView rimWithTyreView)
        {
            DisplayPartView displayPartView = new DisplayPartView();
            displayPartView.ItemType = rimWithTyreView.ItemType;
            displayPartView.ItemTypeStr = ConverterToString.ItemTypeStr(displayPartView.ItemType);
            displayPartView.Id = rimWithTyreView.RimWithTyreId;
            displayPartView.RimWithTyre = rimWithTyreView;

            displayPartView.Price = rimWithTyreView.Price;
            displayPartView.MainImageData = rimWithTyreView.MainImageData;

            displayPartView.Count = rimWithTyreView.Count;
            displayPartView.UserId = rimWithTyreView.UserId;
            displayPartView.RegionId = rimWithTyreView.RegionId;
            displayPartView.Approved = rimWithTyreView.Approved;
            displayPartView.MainPicture = rimWithTyreView.MainPicture;
            displayPartView.Description = rimWithTyreView.Description;
            displayPartView.ModifiedTime = rimWithTyreView.ModifiedTime;
            var companyName = CompaniesDbSet.GetCompanyNameById(rimWithTyreView.CompanyId);
            var modelName = ModelsDbSet.GetModelNameById(rimWithTyreView.ModelId);
            if (companyName.Length > 0)
                displayPartView.CompanyName = companyName;
            if (modelName.Length > 0)
                displayPartView.ModelName = modelName;
            EnrichDisplay(displayPartView);

            return displayPartView;
        }

        private static void EnrichDisplay(DisplayPartView displayPartView)
        {
            var images = ImageManager.GetImagesAsync(displayPartView.Id);
            images.Wait();

            displayPartView.NumberImages = images.Result.Length;
            displayPartView.Images = images.Result;
            displayPartView.RegionStr = ConverterToString.RegionString(displayPartView.RegionId);
            SellerImage(displayPartView);
        }
    }
}
