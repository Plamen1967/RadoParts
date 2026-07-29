using Microsoft.Data.SqlClient;
using Models.Models;
using Models.Models.Authentication;
using Models.Models.Utility;
using Rado;
using Rado.Enums;
using Rado.Models;

namespace Utility
{
    public class Loader
    {
        #region convertors
        public static long Int64(string fieldName, SqlDataReader sqlDataReader) => Convert.ToInt64(sqlDataReader[fieldName]);
        public static DateTime ToDateTime(string fieldName, SqlDataReader sqlDataReader) => Convert.ToDateTime(sqlDataReader[fieldName]);
        public static int Int32(string fieldName, SqlDataReader sqlDataReader) => Convert.ToInt32(sqlDataReader[fieldName]);
        public static short Short(string fieldName, SqlDataReader sqlDataReader) => Convert.ToInt16(sqlDataReader[fieldName]);
        public static decimal Decimal(string fieldName, SqlDataReader sqlDataReader) => Convert.ToDecimal(sqlDataReader[fieldName]);
        public static string ToString(string fieldName, SqlDataReader sqlDataReader) => Convert.ToString(sqlDataReader[fieldName]);

        private static void InitDataCol(Item item, SqlDataReader sqlDataReader)
        {
            item.Description = ToString("description", sqlDataReader);
            item.MainImageId = Int32("mainImageId", sqlDataReader);
            item.RegionId = Int32("regionId", sqlDataReader);
            item.UserId = Int32("userId", sqlDataReader);
            item.Approved = Int32("approved", sqlDataReader);
            item.CreatedTime = Int64("createdTime", sqlDataReader);
            item.ModifiedTime = Int64("modifiedTime", sqlDataReader);
        }

        #endregion
        public static Car LoadCar(SqlDataReader sqlDataReader)
        {
            Car car = new Car();
            LoadCar(car, sqlDataReader);

            return car;
        }
        public static void LoadCar(Car car, SqlDataReader sqlDataReader)
        {
            InitDataCol(car, sqlDataReader);

            car.CarId = Int64("carId", sqlDataReader);
            car.ModelId = Int32("modelId", sqlDataReader);
            car.ModificationId = Int32("modificationId", sqlDataReader);
            car.Year = Int32("year", sqlDataReader);
            car.Vin = ToString("VIN", sqlDataReader);
            car.RegNumber = ToString("regNumber", sqlDataReader);
            car.PowerkWh = Int32("powerkWh", sqlDataReader);
            car.PowerBHP = Int32("powerBHP", sqlDataReader);
            car.EngineType = Int32("engineType", sqlDataReader);
            car.EngineModel = ToString("engineModel", sqlDataReader);
            car.Millage = Int32("millage", sqlDataReader);
            car.GearboxType = Int32("gearboxType", sqlDataReader);
            car.Bus = Int32("bus", sqlDataReader);
            car.CreatedTime = Int64("createdTime", sqlDataReader);
        }

        public static Message LoadMessage(SqlDataReader sqlDataReader)
        {
            Message message = new Message();
            message.Id = Int64("id", sqlDataReader);
            message.SendUserId = Int32("sendUserId", sqlDataReader);
            message.ReceiveUserId = Int32("receiveUserId", sqlDataReader);
            message.MsgDate = Int64("msgDate", sqlDataReader);
            message.message = ToString("message", sqlDataReader);
            message.PreviousMsgId = Int64("previousMsgId", sqlDataReader);
            message.OriginalMsgId = Int64("originalMsgId", sqlDataReader);
            message.IsCar = Int32("isCar", sqlDataReader);
            message.PartId = Int64("partId", sqlDataReader);
            message.IsRead = Int32("isRead", sqlDataReader);
            message.SenderName = ToString("sendername", sqlDataReader);
            message.Email = ToString("email", sqlDataReader);
            message.Request = ToString("request", sqlDataReader);

            return message;
        }

        public static Rim LoadRim(SqlDataReader sqlDataReader)
        {
            Rim rim = new Rim();
            LoadRim(rim, sqlDataReader);

            return rim;
        }
        public static void LoadRim(Rim rim, SqlDataReader sqlDataReader)
        {
            InitDataCol(rim, sqlDataReader);

            rim.Price = Decimal("price", sqlDataReader);
            rim.CompanyId = Int32("companyId", sqlDataReader);
            rim.ModelId = Int32("modelId", sqlDataReader);
            rim.RimWidth = Int32("rimWidth", sqlDataReader);
            rim.RimMaterial = Int32("rimMaterial", sqlDataReader);
            rim.RimOffset = Int32("rimOffset", sqlDataReader);
            rim.RimBoltCount = Int32("rimBoltCount", sqlDataReader);
            rim.RimBoltDistance = Int32("rimBoltDistance", sqlDataReader);
            rim.RimCenter = Int32("rimCenter", sqlDataReader);

            rim.Description = ToString("description", sqlDataReader);
            rim.MainPicture = ToString("mainPicture", sqlDataReader);
            rim.MainImageId = Int32("mainImageId", sqlDataReader);
            rim.CreatedTime = Int64("createdTime", sqlDataReader);
            rim.ModifiedTime = Int64("modifiedTime", sqlDataReader);
            rim.Count = Int32("count", sqlDataReader);
        }
        public static Part LoadPart(SqlDataReader sqlDataReader)
        {
            Part part = new Part();

            LoadPart(part, sqlDataReader);

            return part;
        }
        public static void LoadPart(Part part, SqlDataReader sqlDataReader)
        {
            InitDataCol(part, sqlDataReader);

            part.Price = Decimal("price", sqlDataReader);
            part.PartId = Int64("partId", sqlDataReader);
            part.CarId = Int64("carId", sqlDataReader);
            part.ModelId = Int32("modelId", sqlDataReader);
            part.ModificationId = Int32("modificationId", sqlDataReader);
            part.Year = Int32("year", sqlDataReader);
            part.Description = ToString("description", sqlDataReader);
            part.Price = Decimal("price", sqlDataReader);
            part.LeftRightPosition = Int32("leftRightPosition", sqlDataReader);
            part.FrontBackPosition = Int32("frontBackPosition", sqlDataReader);
            part.PartNumber = ToString("partNumber", sqlDataReader);
            part.EngineType = Int32("engineType", sqlDataReader);
            part.EngineModel = ToString("engineModel", sqlDataReader);
            part.PowerkWh = Int32("powerkWh", sqlDataReader);
            part.PowerBHP = Int32("powerBHP", sqlDataReader);
            part.Millage = Int32("millage", sqlDataReader);
            part.GearboxType = Int32("gearboxType", sqlDataReader);
            part.DealerSubCategoryId = Int32("dealerSubCategoryId", sqlDataReader);
            part.DealerSubCategoryName = ToString("dealerSubCategoryName", sqlDataReader);
            part.Bus = Int32("bus", sqlDataReader);
            part.CreatedTime = Int64("createdTime", sqlDataReader);
        }

        public static Tyre LoadTyre(SqlDataReader sqlDataReader)
        {
            Tyre tyre = new Tyre();

            return tyre;
        }
        public static void LoadTyre(Tyre tyre, SqlDataReader sqlDataReader)
        {
            InitDataCol(tyre, sqlDataReader);

            tyre.Price = Decimal("price", sqlDataReader);
            tyre.TyreId = Int64("tyreId", sqlDataReader);
            tyre.TyreCompanyId = Int32("tyreCompanyId", sqlDataReader);
            tyre.TyreWidth = Int32("tyreWidth", sqlDataReader);
            tyre.TyreHeight = Int32("tyreHeight", sqlDataReader);
            tyre.TyreRadius = Int32("tyreRadius", sqlDataReader);
            tyre.TyreType = Int32("tyreType", sqlDataReader);
            tyre.Count = Int32("count", sqlDataReader);
            tyre.Month = Int32("month", sqlDataReader);
            tyre.Year = Int32("year", sqlDataReader);
        }
        public static RimWithTyre LoadRimWithTyre(SqlDataReader sqlDataReader)
        {
            RimWithTyre rimWithTyre = new RimWithTyre();

            LoadRimWithTyre(rimWithTyre, sqlDataReader);

            return rimWithTyre;
        }
        public static void LoadRimWithTyre(RimWithTyre rimWithTyre, SqlDataReader sqlDataReader)
        {
            InitDataCol(rimWithTyre, sqlDataReader);

            rimWithTyre.Price = Decimal("price", sqlDataReader);
            rimWithTyre.RimWithTyreId = Int64("rimWithTyreId", sqlDataReader);

            rimWithTyre.TyreCompanyId = Int32("tyreCompanyId", sqlDataReader);
            rimWithTyre.TyreWidth = Int32("tyreWidth", sqlDataReader);
            rimWithTyre.TyreHeight = Int32("tyreHeight", sqlDataReader);
            rimWithTyre.TyreRadius = Int32("tyreRadius", sqlDataReader);
            rimWithTyre.TyreType = Int32("tyreType", sqlDataReader);
            rimWithTyre.ItemType = (ItemType)Int32("itemType", sqlDataReader);

            rimWithTyre.CompanyId = Int32("companyId", sqlDataReader);
            rimWithTyre.ModelId = Int32("modelId", sqlDataReader);
            rimWithTyre.RimWidth = Int32("rimWidth", sqlDataReader);
            rimWithTyre.RimMaterial = Int32("rimMaterial", sqlDataReader);
            rimWithTyre.RimOffset = Int32("rimOffset", sqlDataReader);
            rimWithTyre.RimBoltCount = Int32("rimBoltCount", sqlDataReader);
            rimWithTyre.RimBoltDistance = Int32("rimBoltDistance", sqlDataReader);
            rimWithTyre.RimCenter = Int32("rimCenter", sqlDataReader);
            rimWithTyre.Count = Int32("count", sqlDataReader);
            rimWithTyre.MonthDOT = Int32("month", sqlDataReader);
            rimWithTyre.YearDOT = Int32("year", sqlDataReader);
        }

        public static User LoadUser(SqlDataReader sqlDataReader)
        {
            User user = new();
            user.UserId = Int32("userId", sqlDataReader);
            user.CompanyName = ToString("companyName", sqlDataReader);
            user.FirstName = ToString("firstName", sqlDataReader);
            user.FatherName = ToString("fatherName", sqlDataReader);
            user.LastName = ToString("lastName", sqlDataReader);
            user.Phone = ToString("phone", sqlDataReader);
            user.Phone2 = ToString("phone2", sqlDataReader);
            user.Viber = ToString("viber", sqlDataReader);
            user.Whats = ToString("whats", sqlDataReader);
            user.Email = ToString("email", sqlDataReader);
            user.Address = ToString("address", sqlDataReader);
            user.City = ToString("city", sqlDataReader);
            user.RegionId = Int32("regionId", sqlDataReader);
            user.UserName = ToString("userName", sqlDataReader);
            user.Dealer = (UserType)Int32("dealer", sqlDataReader);
            user.PasswordHash = ToString("password", sqlDataReader);
            user.WebPage = ToString("webPage", sqlDataReader);
            user.ActivationCode = ToString("activationCode", sqlDataReader);
            user.Activated = Int32("activated", sqlDataReader);
            user.Blocked = Int32("blocked", sqlDataReader);
            user.Attempt = Int32("attempt", sqlDataReader);
            user.Description = ToString("description", sqlDataReader);
            user.CreationDate = ToDateTime("creationDate", sqlDataReader).ToString();
            user.Suspended = Int32("suspended", sqlDataReader);
            user.ImageId = Int32("imageId", sqlDataReader);
            user.SuspendedDateTime = Int64("suspendedDateTime", sqlDataReader);

            return user;
        }

        public static ImageDataClass LoadImageData(SqlDataReader sqlDataReader)
        {
            ImageDataClass imageDataClass = new ImageDataClass();

            LoadImageData(imageDataClass, sqlDataReader);

            return imageDataClass;
        }

        private static void LoadImageData(ImageDataClass imageDataClass, SqlDataReader sqlDataReader)
        {
            imageDataClass.ImageId = Int32("imageId", sqlDataReader);
            imageDataClass.UserId = Int32("userId", sqlDataReader);
            imageDataClass.ObjectId = Int64("objectId", sqlDataReader);
            imageDataClass.ImageFile = ToString("imageFile", sqlDataReader);
            imageDataClass.ImageType = Int32("imageType", sqlDataReader);
            imageDataClass.OriginalImageId = Int32("originalImageId", sqlDataReader);
            imageDataClass.Deleted = Int32("deleted", sqlDataReader);
            imageDataClass.DeleteDateTime = ToDateTime("deleteDateTime", sqlDataReader);
            imageDataClass.ImageMinSrc = ImageManager.GenerateImageHRef(imageDataClass.ObjectId, imageDataClass.ImageId, true);
            imageDataClass.ImageSrc = ImageManager.GenerateImageHRef(imageDataClass.ObjectId, imageDataClass.ImageId, false);


        }

        public static Filter LoadFilter()
        {
            Filter filter = new Filter();

            return filter;
        }

        public static Filter LoadFilter(SqlDataReader sqlDataReader)
        {
            Filter filter = new Filter();

            filter.Id = Int64("filterId", sqlDataReader);
            filter.ItemType = (ItemType)Int32("itemType", sqlDataReader);
            filter.CarId = Int64("carId", sqlDataReader);
            filter.CompanyId = Int32("companyId", sqlDataReader);
            filter.ModelId = Int32("modelId", sqlDataReader);
            filter.ModificationId = Int32("modificationId", sqlDataReader);
            filter.Year = Int32("year", sqlDataReader);
            filter.CategoryId = Int32("categoryId", sqlDataReader);
            filter.SubCategoryId = Int32("subCategoryId", sqlDataReader);
            filter.CategoriesId = ToString("categoriesId", sqlDataReader);
            filter.SubCategoryId = Int32("subCategoryId", sqlDataReader);
            filter.SubCategoriesId = ToString("subCategoriesId", sqlDataReader);
            filter.EngineType = Int32("engineType", sqlDataReader);
            filter.EngineModel = ToString("engineModel", sqlDataReader);
            filter.PartNumber = ToString("partNumber", sqlDataReader);
            filter.PowerkWh = Int32("powerkWh", sqlDataReader);
            filter.PowerBHP = Int32("powerBHP", sqlDataReader);
            filter.GearboxType = Int32("gearboxType", sqlDataReader);
            filter.Categories = ToString("categories", sqlDataReader);
            filter.PartOnly = Short("partOnly", sqlDataReader) > 0 ? true : false;
            filter.ExtendedSearch = Short("extendedSearch", sqlDataReader) > 0 ? true : false;
            int search = Short("searchBy", sqlDataReader);
            filter.RegNumber = ToString("regNumber", sqlDataReader);
            filter.ModelsId = ToString("modelsId", sqlDataReader);
            filter.ModificationsId = ToString("modificationsId", sqlDataReader);

            filter.ClientId = Int64("clientId", sqlDataReader);
            filter.UserId = Int32("userId", sqlDataReader);
            filter.LoadMainPicture = Short("loadMainPicture", sqlDataReader) > 0 ? true : false;
            filter.OrderBy = Int32("orderBy", sqlDataReader);
            filter.RegionId = Int32("regionId", sqlDataReader);

            filter.HasImages = Short("hasImages", sqlDataReader) > 0 ? true : false;
            filter.Keyword = ToString("keyword", sqlDataReader);
            filter.Description = ToString("description", sqlDataReader);
            filter.AdminRun = Short("adminRun", sqlDataReader) > 0 ? true : false;
            filter.Approved = (ApprovedType)Short("approved", sqlDataReader);

            filter.TyreCompanyId = Int32("tyreCompanyId", sqlDataReader);
            filter.TyreWidth = Int32("tyreWidth", sqlDataReader);
            filter.TyreHeight = Int32("tyreHeight", sqlDataReader);
            filter.TyreRadius = Int32("tyreRadius", sqlDataReader);
            filter.TyreType = Int32("tyreType", sqlDataReader);

            filter.RimCompanyId = Int32("rimCompanyId", sqlDataReader);
            filter.RimModelId = Int32("rimModelId", sqlDataReader);
            filter.RimWidth = Int32("rimWidth", sqlDataReader);
            filter.RimMaterial = Int32("rimMaterial", sqlDataReader);
            filter.RimOffset = Int32("rimOffset", sqlDataReader);
            filter.RimBoltCount = Int32("rimBoltCount", sqlDataReader);
            filter.RimBoltDistance = Int32("rimBoltDistance", sqlDataReader);
            filter.RimCenter = Int32("rimCenter", sqlDataReader);
            filter.Bus = Int32("bus", sqlDataReader);
            filter.PartForCar = Int32("partForCar", sqlDataReader);

            switch (search)
            {
                case 0:
                    filter.SearchBy = SearchBy.Filter;
                    break;
                case 1:
                    filter.SearchBy = SearchBy.PartNumber;
                    break;
                default:
                    filter.SearchBy = SearchBy.Filter;
                    break;
            }

            return filter;
        }
    }
}

