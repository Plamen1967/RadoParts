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
            item.description = ToString("description", sqlDataReader);
            item.mainImageId = Int32("mainImageId", sqlDataReader);
            item.regionId = Int32("regionId", sqlDataReader);
            item.userId = Int32("userId", sqlDataReader);
            item.approved = Int32("approved", sqlDataReader);
            item.createdTime = Int64("createdTime", sqlDataReader);
            item.modifiedTime = Int64("modifiedTime", sqlDataReader);
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

            car.carId = Int64("carId", sqlDataReader);
            car.modelId = Int32("modelId", sqlDataReader);
            car.modificationId = Int32("modificationId", sqlDataReader);
            car.year = Int32("year", sqlDataReader);
            car.vin = ToString("VIN", sqlDataReader);
            car.regNumber = ToString("regNumber", sqlDataReader);
            car.powerkWh = Int32("powerkWh", sqlDataReader);
            car.powerBHP = Int32("powerBHP", sqlDataReader);
            car.engineType = Int32("engineType", sqlDataReader);
            car.engineModel = ToString("engineModel", sqlDataReader);
            car.millage = Int32("millage", sqlDataReader);
            car.gearboxType = Int32("gearboxType", sqlDataReader);
            car.bus = Int32("bus", sqlDataReader);
            car.createdTime = Int64("createdTime", sqlDataReader);
        }

        public static Message LoadMessage(SqlDataReader sqlDataReader)
        {
            Message message = new Message();
            message.id = Int64("id", sqlDataReader);
            message.sendUserId = Int32("sendUserId", sqlDataReader);
            message.receiveUserId = Int32("receiveUserId", sqlDataReader);
            message.msgDate = Int64("msgDate", sqlDataReader);
            message.message = ToString("message", sqlDataReader);
            message.previousMsgId = Int64("previousMsgId", sqlDataReader);
            message.originalMsgId = Int64("originalMsgId", sqlDataReader);
            message.isCar = Int32("isCar", sqlDataReader);
            message.partId = Int64("partId", sqlDataReader);
            message.read = Int32("read", sqlDataReader);

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

            rim.price = Decimal("price", sqlDataReader);
            rim.companyId = Int32("companyId", sqlDataReader);
            rim.modelId = Int32("modelId", sqlDataReader);
            rim.rimWidth = Int32("rimWidth", sqlDataReader);
            rim.rimMaterial = Int32("rimMaterial", sqlDataReader);
            rim.rimOffset = Int32("rimOffset", sqlDataReader);
            rim.rimBoltCount = Int32("rimBoltCount", sqlDataReader);
            rim.rimBoltDistance = Int32("rimBoltDistance", sqlDataReader);
            rim.rimCenter = Int32("rimCenter", sqlDataReader);

            rim.description = ToString("description", sqlDataReader);
            rim.mainPicture = ToString("mainPicture", sqlDataReader);
            rim.mainImageId = Int32("mainImageId", sqlDataReader);
            rim.createdTime = Int64("createdTime", sqlDataReader);
            rim.modifiedTime = Int64("modifiedTime", sqlDataReader);
            rim.count = Int32("count", sqlDataReader);
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

            part.price = Decimal("price", sqlDataReader);
            part.partId = Int64("partId", sqlDataReader);
            part.carId = Int64("carId", sqlDataReader);
            part.modelId = Int32("modelId", sqlDataReader);
            part.modificationId = Int32("modificationId", sqlDataReader);
            part.year = Int32("year", sqlDataReader);
            part.description = ToString("description", sqlDataReader);
            part.price = Decimal("price", sqlDataReader);
            part.leftRightPosition = Int32("leftRightPosition", sqlDataReader);
            part.frontBackPosition = Int32("frontBackPosition", sqlDataReader);
            part.partNumber = ToString("partNumber", sqlDataReader);
            part.engineType = Int32("engineType", sqlDataReader);
            part.engineModel = ToString("engineModel", sqlDataReader);
            part.powerkWh = Int32("powerkWh", sqlDataReader);
            part.powerBHP = Int32("powerBHP", sqlDataReader);
            part.millage = Int32("millage", sqlDataReader);
            part.gearboxType = Int32("gearboxType", sqlDataReader);
            part.dealerSubCategoryId = Int32("dealerSubCategoryId", sqlDataReader);
            part.dealerSubCategoryName = ToString("dealerSubCategoryName", sqlDataReader);
            part.bus = Int32("bus", sqlDataReader);
            part.createdTime = Int64("createdTime", sqlDataReader);
        }

        public static Tyre LoadTyre(SqlDataReader sqlDataReader)
        {
            Tyre tyre = new Tyre();

            return tyre;
        }
        public static void LoadTyre(Tyre tyre, SqlDataReader sqlDataReader)
        {
            InitDataCol(tyre, sqlDataReader);

            tyre.price = Decimal("price", sqlDataReader);
            tyre.tyreId = Int64("tyreId", sqlDataReader);
            tyre.tyreCompanyId = Int32("tyreCompanyId", sqlDataReader);
            tyre.tyreWidth = Int32("tyreWidth", sqlDataReader);
            tyre.tyreHeight = Int32("tyreHeight", sqlDataReader);
            tyre.tyreRadius = Int32("tyreRadius", sqlDataReader);
            tyre.tyreType = Int32("tyreType", sqlDataReader);
            tyre.count = Int32("count", sqlDataReader);
            tyre.month = Int32("month", sqlDataReader);
            tyre.year = Int32("year", sqlDataReader);
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

            rimWithTyre.price = Decimal("price", sqlDataReader);
            rimWithTyre.rimWithTyreId = Int64("rimWithTyreId", sqlDataReader);

            rimWithTyre.tyreCompanyId = Int32("tyreCompanyId", sqlDataReader);
            rimWithTyre.tyreWidth = Int32("tyreWidth", sqlDataReader);
            rimWithTyre.tyreHeight = Int32("tyreHeight", sqlDataReader);
            rimWithTyre.tyreRadius = Int32("tyreRadius", sqlDataReader);
            rimWithTyre.tyreType = Int32("tyreType", sqlDataReader);
            rimWithTyre.itemType = (ItemType)Int32("itemType", sqlDataReader);

            rimWithTyre.companyId = Int32("companyId", sqlDataReader);
            rimWithTyre.modelId = Int32("modelId", sqlDataReader);
            rimWithTyre.rimWidth = Int32("rimWidth", sqlDataReader);
            rimWithTyre.rimMaterial = Int32("rimMaterial", sqlDataReader);
            rimWithTyre.rimOffset = Int32("rimOffset", sqlDataReader);
            rimWithTyre.rimBoltCount = Int32("rimBoltCount", sqlDataReader);
            rimWithTyre.rimBoltDistance = Int32("rimBoltDistance", sqlDataReader);
            rimWithTyre.rimCenter = Int32("rimCenter", sqlDataReader);
            rimWithTyre.count = Int32("count", sqlDataReader);
            rimWithTyre.monthDOT = Int32("month", sqlDataReader);
            rimWithTyre.yearDOT = Int32("year", sqlDataReader);
        }

        public static User LoadUser(SqlDataReader sqlDataReader)
        {
            User user = new();
            user.userId = Int32("userId", sqlDataReader);
            user.companyName = ToString("companyName", sqlDataReader);
            user.firstName = ToString("firstName", sqlDataReader);
            user.fatherName = ToString("fatherName", sqlDataReader);
            user.lastName = ToString("lastName", sqlDataReader);
            user.phone = ToString("phone", sqlDataReader);
            user.phone2 = ToString("phone2", sqlDataReader);
            user.viber = ToString("viber", sqlDataReader);
            user.whats = ToString("whats", sqlDataReader);
            user.email = ToString("email", sqlDataReader);
            user.address = ToString("address", sqlDataReader);
            user.city = ToString("city", sqlDataReader);
            user.regionId = Int32("regionId", sqlDataReader);
            user.userName = ToString("userName", sqlDataReader);
            user.dealer = (UserType)Int32("dealer", sqlDataReader);
            user.PasswordHash = ToString("password", sqlDataReader);
            user.webPage = ToString("webPage", sqlDataReader);
            user.activationCode = ToString("activationCode", sqlDataReader);
            user.activated = Int32("activated", sqlDataReader);
            user.blocked = Int32("blocked", sqlDataReader);
            user.attempt = Int32("attempt", sqlDataReader);
            user.description = ToString("description", sqlDataReader);
            user.creationDate = ToDateTime("creationDate", sqlDataReader).ToString();
            user.suspended = Int32("suspended", sqlDataReader);
            user.imageId = Int32("imageId", sqlDataReader);
            user.suspendedDateTime = Int64("suspendedDateTime", sqlDataReader);

            return user;
        }

        public static ImageData LoadImageData(SqlDataReader sqlDataReader)
        {
            ImageData imageData = new ImageData();

            LoadImageData(imageData, sqlDataReader);

            return imageData;
        }
        public static void LoadImageData(ImageData imageData, SqlDataReader sqlDataReader)
        {
            imageData.imageId = Int32("imageId", sqlDataReader);
            imageData.userId = Int32("userId", sqlDataReader);
            imageData.objectId = Int64("objectId", sqlDataReader);
            imageData.imageFile = ToString("imageFile", sqlDataReader);
            imageData.imageType = Int32("imageType", sqlDataReader);
            imageData.originalImageId = Int32("originalImageId", sqlDataReader);
            imageData.deleted = Int32("deleted", sqlDataReader);
            imageData.deleteDateTime = ToDateTime("deleteDateTime", sqlDataReader);
            imageData.imageMinSrc = ImageManager.GenerateImageHRef(imageData.objectId, imageData.imageId, true);
            imageData.imageSrc = ImageManager.GenerateImageHRef(imageData.objectId, imageData.imageId, false);


        }

        public static Filter LoadFilter()
        {
            Filter filter = new Filter();

            return filter;
        }

        public static Filter LoadFilter(SqlDataReader sqlDataReader)
        {
            Filter filter = new Filter();

            filter.id = Int64("filterId", sqlDataReader);
            filter.itemType = (ItemType)Int32("itemType", sqlDataReader);
            filter.carId = Int64("carId", sqlDataReader);
            filter.companyId = Int32("companyId", sqlDataReader);
            filter.modelId = Int32("modelId", sqlDataReader);
            filter.modificationId = Int32("modificationId", sqlDataReader);
            filter.year = Int32("year", sqlDataReader);
            filter.categoryId = Int32("categoryId", sqlDataReader);
            filter.subCategoryId = Int32("subCategoryId", sqlDataReader);
            filter.categoriesId = ToString("categoriesId", sqlDataReader);
            filter.subCategoryId = Int32("subCategoryId", sqlDataReader);
            filter.subCategoriesId = ToString("subCategoriesId", sqlDataReader);
            filter.engineType = Int32("engineType", sqlDataReader);
            filter.engineModel = ToString("engineModel", sqlDataReader);
            filter.partNumber = ToString("partNumber", sqlDataReader);
            filter.powerkWh = Int32("powerkWh", sqlDataReader);
            filter.powerBHP = Int32("powerBHP", sqlDataReader);
            filter.gearboxType = Int32("gearboxType", sqlDataReader);
            filter.categories = ToString("categories", sqlDataReader);
            filter.partOnly = Short("partOnly", sqlDataReader) > 0 ? true : false;
            filter.extendedSearch = Short("extendedSearch", sqlDataReader) > 0 ? true : false;
            int search = Short("searchBy", sqlDataReader);
            filter.regNumber = ToString("regNumber", sqlDataReader);
            filter.modelsId = ToString("modelsId", sqlDataReader);
            filter.modificationsId = ToString("modificationsId", sqlDataReader);

            filter.clientId = Int64("clientId", sqlDataReader);
            filter.userId = Int32("userId", sqlDataReader);
            filter.loadMainPicture = Short("loadMainPicture", sqlDataReader) > 0 ? true : false;
            filter.orderBy = Int32("orderBy", sqlDataReader);
            filter.regionId = Int32("regionId", sqlDataReader);

            filter.hasImages = Short("hasImages", sqlDataReader) > 0 ? true : false;
            filter.keyword = ToString("keyword", sqlDataReader);
            filter.description = ToString("description", sqlDataReader);
            filter.adminRun = Short("adminRun", sqlDataReader) > 0 ? true : false;
            filter.approved = (ApprovedType)Short("approved", sqlDataReader);

            filter.tyreCompanyId = Int32("tyreCompanyId", sqlDataReader);
            filter.tyreWidth = Int32("tyreWidth", sqlDataReader);
            filter.tyreHeight = Int32("tyreHeight", sqlDataReader);
            filter.tyreRadius = Int32("tyreRadius", sqlDataReader);
            filter.tyreType = Int32("tyreType", sqlDataReader);

            filter.rimCompanyId = Int32("rimCompanyId", sqlDataReader);
            filter.rimModelId = Int32("rimModelId", sqlDataReader);
            filter.rimWidth = Int32("rimWidth", sqlDataReader);
            filter.rimMaterial = Int32("rimMaterial", sqlDataReader);
            filter.rimOffset = Int32("rimOffset", sqlDataReader);
            filter.rimBoltCount = Int32("rimBoltCount", sqlDataReader);
            filter.rimBoltDistance = Int32("rimBoltDistance", sqlDataReader);
            filter.rimCenter = Int32("rimCenter", sqlDataReader);
            filter.bus = Int32("bus", sqlDataReader);
            filter.partForCar = Int32("partForCar", sqlDataReader);

            switch (search)
            {
                case 0:
                    filter.searchBy = SearchBy.Filter;
                    break;
                case 1:
                    filter.searchBy = SearchBy.PartNumber;
                    break;
                default:
                    filter.searchBy = SearchBy.Filter;
                    break;
            }

            return filter;
        }

        //public static User LoadUser(SqlDataReader sqlDataReader)
        //{
        //    User user = new User();

        //    user.userId = Int32("userId", sqlDataReader);
        //    user.companyName = ToString("companyName", sqlDataReader);
        //    user.firstName = ToString("firstName", sqlDataReader);
        //    user.fatherName = ToString("fatherName", sqlDataReader);
        //    user.lastName = ToString("lastName", sqlDataReader);
        //    user.address = ToString("address", sqlDataReader);
        //    user.city = ToString("city", sqlDataReader);
        //    user.phone = ToString("phone", sqlDataReader);
        //    user.phone2 = ToString("phone2", sqlDataReader);
        //    user.viber = ToString("viber", sqlDataReader);
        //    user.whats = ToString("whats", sqlDataReader);
        //    user.webPage = ToString("webPage", sqlDataReader);
        //    user.description = ToString("description", sqlDataReader);
        //    user.imageData = ImageManager.GetBusinessCard(user.userId);

        //    return user;
        //}
    }
}

