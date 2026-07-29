using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Microsoft.CodeAnalysis.Elfie.Model.Tree;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Models.Enums;
using Models.Models;
using Models.Models.Authentication;
using Rado.Abuse;
using Rado.Enrich;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using Utility;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace Rado.Datasets
{
    public class CarsDbSet
    {
        static public async Task<DisplayPartView> AddUpdateCar(Car car, bool update)
        {
            string storeProcedureName;
            if (update)
            {
                storeProcedureName = "CarsUpd";
            }
            else
            {
                storeProcedureName = "CarsIns";
            }

            if (car.Vin == null) car.Vin = "";
            if (car.RegNumber == null) car.RegNumber = "";
            if (car.Description == null) car.Description = "";
            if (car.EngineModel == null) car.EngineModel = "";
            if (car.CarId == 0)
            {

                NextId nextId = UserDbSet.GetNextId(ItemType.OnlyCar, car.UserId);
                if (nextId.Error.Length > 0)
                {
                    throw new AppException($"Колата не може да бъде добавена");
                }

            }

            ValidationCar(car);

            int approved = 0;
            if (Validation.BlockCar(car))
                approved = 2;

            car = Validation.RemoveInvalidWord(car);

            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        SqlParameter carIdParam = command.Parameters.Add("@carId", SqlDbType.BigInt);
                        SqlParameter modelIdParam = command.Parameters.Add("@modelId", SqlDbType.Int);
                        SqlParameter modificationIdParam = command.Parameters.Add("@modificationId", SqlDbType.Int);
                        SqlParameter yearParam = command.Parameters.Add("@year", SqlDbType.Int);
                        SqlParameter vinParam = command.Parameters.Add("@vin", SqlDbType.NVarChar);
                        SqlParameter regNumberParam = command.Parameters.Add("@regNumber", SqlDbType.NVarChar);
                        SqlParameter descriptionParam = command.Parameters.Add("@description", SqlDbType.NVarChar);
                        SqlParameter priceParam = command.Parameters.Add("@price", SqlDbType.Decimal);
                        SqlParameter powerkWhParam = command.Parameters.Add("@powerkWh", SqlDbType.Int);
                        SqlParameter powerBHPParam = command.Parameters.Add("@powerBHP", SqlDbType.Int);
                        SqlParameter engineTypeParam = command.Parameters.Add("@engineType", SqlDbType.Int);
                        SqlParameter engineModelParam = command.Parameters.Add("@engineModel", SqlDbType.NVarChar);
                        SqlParameter userIdParam = command.Parameters.Add("@userId", SqlDbType.Int);
                        SqlParameter millageParam = command.Parameters.Add("@millage", SqlDbType.Int);
                        SqlParameter regionIdParam = command.Parameters.Add("@regionId", SqlDbType.Int);
                        SqlParameter gearboxTypeParam = command.Parameters.Add("@gearboxType", SqlDbType.Int);
                        SqlParameter modifiedTimeParam = command.Parameters.Add("@modifiedTime", SqlDbType.BigInt);
                        SqlParameter mainPictureParam = command.Parameters.Add("@mainPicture", SqlDbType.NVarChar);
                        command.Parameters.Add("@approved", SqlDbType.Int).Value = approved;
                        command.Parameters.Add("@mainImageId", SqlDbType.NVarChar).Value = car.MainImageId;

                        if (car.MainPicture == null) car.MainPicture = "";
                        if (!update)
                        {
                            command.Parameters.Add("@bus", SqlDbType.Int).Value = car.Bus;
                        }
                        carIdParam.Value = car.CarId;
                        if (car.Bus == 1)
                        {
                            modelIdParam.Value = car.ModelId;
                            modificationIdParam.Value = 0;
                        }
                        else if (car.ModificationId != null)
                        {
                            modelIdParam.Value = ModificationsDbSet.GetModificationById(car.ModificationId ?? 0).ModelId;
                            modificationIdParam.Value = car.ModificationId;
                        }
                        yearParam.Value = car.Year;
                        vinParam.Value = car.Vin;
                        regNumberParam.Value = car.RegNumber;
                        descriptionParam.Value = car.Description;
                        priceParam.Value = 0;
                        engineTypeParam.Value = car.EngineType;
                        engineModelParam.Value = car.EngineModel;
                        powerkWhParam.Value = car.PowerkWh;
                        powerBHPParam.Value = car.PowerBHP;
                        userIdParam.Value = car.UserId;
                        millageParam.Value = car.Millage;
                        regionIdParam.Value = car.RegionId;
                        gearboxTypeParam.Value = car.GearboxType;
                        modifiedTimeParam.Value = car.ModifiedTime;
                        mainPictureParam.Value = car.MainPicture;

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                LoggerUtil.LogException(e);
                if (update)
                    throw new AppException($"Колата не може да бъде актуализирана");
                else
                    throw new AppException($"Колата не може да бъде добавена");

            }

            CarView carView = await getCarByIdAsync(car.CarId);
            PartView partView = new PartView();
            EnrichManager.InitPartViewFromCar(carView, partView, true);

            return EnrichManager.EnrichDisplayView(partView);
        }

        static public async Task<bool> DeleteCarAsync(long carId, int userId)
        {
            // TODO - SQL must delete not flag us deleted
            string storeProcedureName = "CarsDel";

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
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add("@carId", SqlDbType.BigInt).Value = carId;
                        command.Parameters.Add("@userId", SqlDbType.Int).Value = userId;

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw new AppException($" Колата не може да бъде изтрита ");

            }

            return true;
        }


        static public async Task<CarView> GetCarByIdAsync(long carId)
        {
            CarView carView = await getCarByIdAsync(carId);

            return carView;
        }

        static public async Task<bool> CheckForUniqueness(string regNumber, int bus, int userId)
        {
            bool result = true;
            try
            {
                string storedProcedure = "CheckUnique";
                SqlConnection connection = new SqlConnection();
                SqlCommand command = new SqlCommand();
                connection.ConnectionString = Program.ConnectionString;
                command.Connection = connection;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = storedProcedure;

                command.Parameters.AddWithValue("@regNumber", regNumber);
                command.Parameters.AddWithValue("@userId", userId);
                command.Parameters.AddWithValue("@bus",bus);

                command.Parameters.Add("@result", SqlDbType.Int);
                command.Parameters["@result"].Direction = ParameterDirection.Output;

                connection.Open();
                int i = command.ExecuteNonQuery();

                var o = command.Parameters["@result"].Value;
                if (o != null)
                {
                    int value = (int)o;
                    if (value > 0)
                        return false;
                }
            }
            catch (Exception e)
            {
                throw new AppException($"Exception in CheckForUniqueness {e.Message}");
            }

            return result;
        }

        private static async Task<CarView> getCarByIdAsync(long carId)
        {
            string storedProcedure = "CarsAll";
            CarView carView = new CarView();
            try
            {
                SqlConnection connection = new SqlConnection(Program.ConnectionString);
                await connection.OpenAsync();
                {
                    SqlCommand command = new SqlCommand(storedProcedure, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@carId", SqlDbType.BigInt).Value = carId;

                    SqlDataReader sqlDataReader = await command.ExecuteReaderAsync();
                    if (await sqlDataReader.ReadAsync())
                    {
                        carView = EnrichManager.EnrichCarView(sqlDataReader);
                    }
                }

                {
                    SqlCommand command = new SqlCommand("GetNumberPartsByCarId", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@carId", SqlDbType.BigInt).Value = carId;

                    SqlDataReader sqlDataReader = await command.ExecuteReaderAsync();
                    {
                        if (await sqlDataReader.ReadAsync())
                        {
                            carView.CountParts = Convert.ToInt32(sqlDataReader["Count"]);
                        }
                    }
                    await connection.CloseAsync();
                }
            }
            catch (Exception e)
            {
                throw new AppException($"Exception in GetCarById {e.Message}");
            }
            return carView;
        }

        public static bool MainPicture(long partId, string mainPicture, int userId)
        {
            string storeProcedureName = "UpdateMainPictureCar";
            try
            {
                SqlConnection connection = new SqlConnection(Program.ConnectionString);
                connection.Open();

                SqlCommand command = new SqlCommand(storeProcedureName, connection);
                command.CommandType = CommandType.StoredProcedure;

                SqlParameter carIdParam = command.Parameters.Add("@carId", SqlDbType.BigInt);
                SqlParameter mainPictureParam = command.Parameters.Add("@mainPicture", SqlDbType.NVarChar);
                SqlParameter userIdParam = command.Parameters.Add("@userId", SqlDbType.Int);

                carIdParam.Value = partId;
                mainPictureParam.Value = mainPicture;
                userIdParam.Value = userId;

                command.ExecuteNonQuery();
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in MainPicture : {exception.Message}");
            }

            return true;

        }


        public static async Task<bool> ValidateNameAsync(int userid, long carId, string name)
        {
            bool validate = await validateNameAsync(userid, carId, name);

            return validate;
        }

        private static async Task<bool> validateNameAsync(int userId, long carId, string name)
        {
            string storeProcedureName = "ValidateCarName";
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                        command.Parameters.Add("@regNumber", SqlDbType.VarChar, 50).Value = name;
                        command.Parameters.Add("@carId", SqlDbType.Int).Direction = ParameterDirection.Output;
                        await command.ExecuteNonQueryAsync();

                        var value = command.Parameters["@carId"].Value;
                        if (value is not DBNull)
                        {
                            long outputCarId = Convert.ToInt64(command.Parameters["@carId"].Value);
                            if (outputCarId > 0 && outputCarId != carId)
                                return false;
                        }
                        else
                        {
                            return false;
                        }

                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                return false;
            }

            return true;
        }
        static public async Task<DisplayPartView> AddCarAsync(Car car)
        {
            DisplayPartView displayPartView = await AddUpdateCar(car, false);

            return displayPartView;
        }

        static public async Task<DisplayPartView> UpdateCarAsync(Car car)
        {
            DisplayPartView displayPartView = await AddUpdateCar(car, true);

            return displayPartView;
        }
        private static void ValidationCar(Car car)
        {
            if (car.Bus == 0)
            {
                bool check = ModificationsDbSet.CheckModificationById(car.ModificationId ?? 0);
                if (!check)
                    throw new AppException($"Модификация с ID {car.ModificationId} за кола {car.RegNumber} не е валидна");
            }
            else if (car.Bus == 1)
            {
                if (car.ModelId == null)
                    throw new AppException($"Модел за бус e задължителен");

                bool check = ModelsDbSet.CheckModelById(car.ModelId ?? 0);
                if (!check)
                    throw new AppException($"Модел с ID {car.ModificationId} за кола {car.RegNumber} не е валидна");
            }
            else
            {
                throw new AppException($"{car.RegNumber} няма избран тип car/bus");
            }

            if (car.RegNumber == "")
                throw new AppException($"Колата/Буса няма избрано име");

        }
        static public async Task<CarNameId[]> GetCarNameId(Filter filter)
        {
            List<CarNameId> carNameId = new List<CarNameId>();
            CarView[] cars = await GetCars(filter);
            foreach (var car in cars)
            {
                carNameId.Add(new CarNameId()
                {
                    carId = car.CarId,
                    companyId = car.CompanyId,
                    modelId = car.ModelId.Value,
                    regNumber = car.RegNumber,
                    engineType = car.EngineType,
                    engineModel = car.EngineModel
                });
            }

            return carNameId.ToArray();
        }

        static public async Task<CarView[]> GetCars(Filter filter)
        {
            if (filter.UserId == null) filter.UserId = 0;

            List<CarView> cars = new List<CarView>();
            try
            {
                List<string> where = new List<string>();
                if (filter.Bus == 0 || filter.Bus == 1)
                    where.Add(string.Format("bus = {0}", filter.Bus));

                if (filter.CarId != 0)
                    where.Add(string.Format("carId = {0}", filter.CarId));

                if (filter.ModificationId != 0)
                {
                    where.Add(string.Format("modificationId = {0}", filter.ModificationId));
                }
                else if (filter.ModelId != 0)
                {
                    if (ModelsDbSet.isGroupModel(filter.ModelId))
                    {
                        where.Add($"groupModelId  = {filter.ModelId} ");
                    }
                    else
                    {
                        where.Add($"modelId = {filter.ModelId}");
                    }
                }
                else if (filter.CompanyId != 0)
                    where.Add($"companyId  = {filter.CompanyId} ");

                if (filter.ModelsId != null && filter.ModelsId.Length > 0)
                {
                    where.Add($"( modelId in ({filter.ModelsId}) or groupModelId in ({filter.ModelsId}) )");
                }
                if (filter.ModificationsId != null && filter.ModificationsId.Length > 0)
                {
                    where.Add($"( modificationId in ({filter.ModificationsId}))");
                }

                if (filter.ItemType == ItemType.OnlyCar || filter.ItemType == ItemType.AllCarAndPart)
                    where.Add($"bus = 0");
                else if (filter.ItemType == ItemType.OnlyBus || filter.ItemType == ItemType.AllBusAndPart)
                    where.Add($"bus = 1");

                if (filter.Year != 0)
                    where.Add($"year = {filter.Year}");

                if (filter.EngineType != 0)
                    where.Add($"engineType = {filter.EngineType}");

                if (filter.EngineModel != null && filter.EngineModel.Length > 0)
                    where.Add($"engineModel like '{filter.EngineModel}%'");

                if (filter.GearboxType != 0)
                    where.Add($"gearboxType = {filter.GearboxType}");

                if (filter.PowerBHP != 0)
                    where.Add($"powerBHP = {filter.PowerBHP}");

                if (filter.RegionId != 0)
                    where.Add($"regionId = {filter.RegionId}");

                if (filter.RegNumber?.Length > 0)
                    where.Add($"regNumber = '{filter.RegNumber}'");

                if (filter.AdminRun)
                {
                    if (filter.Approved != ApprovedType.All)
                        where.Add($"approved = {(int)filter.Approved}");
                    if (filter.UserId != 0 && filter.UserId != null)
                        where.Add($"userId = {filter.UserId}");
                }
                else if (filter.UserId != 0 && filter.UserId != null)
                    where.Add($"userId = {filter.UserId}");
                else if (!filter.AdminRun)
                {
                    where.Add("approved <> 2");
                    where.Add("suspended = 0");
                }

                if (filter.Keyword != null && filter.Keyword.Length > 0)
                {
                    string[] keywords = filter.Keyword.Split(' ');
                    List<string> or = [];
                    foreach (string keyword in keywords)
                    {
                        double len = keyword.Length;
                        len = len * 0.75;
                        int lenInt = (int)(len + 0.5);
                        string newKeyword = keyword.ToLower().Substring(0, lenInt);

                        or.Add($"description like '%{newKeyword}%'");
                    }

                    if (or.Count > 0)
                    {
                        string orString = $"({string.Join(" OR ", or.ToArray())})";
                        where.Add(orString);
                    }
                }
                where.Add($"deleted = 0");

                string selectCommand = "SELECT * FROM CarView WITH(NOLOCK)";
                if (where.Count > 0)
                {
                    selectCommand += " WHERE " + string.Join(" AND ", where.ToArray());
                }
                Console.WriteLine($"Command : {selectCommand}");

                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    await sqlConnection.OpenAsync();
                    Stopwatch carsAllwatch = new Stopwatch();
                    carsAllwatch.Start();

                    using (SqlCommand sqlCommand = new SqlCommand(selectCommand, sqlConnection))
                    {

                        sqlCommand.CommandType = CommandType.Text;
                        Stopwatch executewatch = new Stopwatch();
                        executewatch.Start();
                        Console.WriteLine($"Before execution Command : {selectCommand}");

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            executewatch.Stop();
                            Console.WriteLine("Execute CarsAll is {0} ms", executewatch.ElapsedMilliseconds);
                            while (await sqlDataReader.ReadAsync())
                            {
                                CarView carView = EnrichManager.EnrichCarView(sqlDataReader);

                                cars.Add(carView);
                            }
                        }
                    }
                    carsAllwatch.Stop();
                    Console.WriteLine("Elapsed Time CarsAll Details is {0} ms", carsAllwatch.ElapsedMilliseconds);


                    if (filter.UserId != 0)
                    {
                        Dictionary<long, int> partPerCar = new Dictionary<long, int>();
                        string storedProcedure = "PartPerCar";

                        Stopwatch stopwatch = new Stopwatch();
                        stopwatch.Start();

                        using (SqlCommand command = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            command.CommandType = CommandType.StoredProcedure;
                            var userIdParam = command.Parameters.Add("@userId", SqlDbType.BigInt);
                            userIdParam.Value = filter.UserId;

                            using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                            {
                                while (await sqlDataReader.ReadAsync())
                                {
                                    long carId = Convert.ToInt64(sqlDataReader["carId"]);
                                    int count = Convert.ToInt32(sqlDataReader["count"]);

                                    partPerCar[carId] = count;
                                }
                            }
                        }

                        stopwatch.Stop();
                        Console.WriteLine($"Elapsed Time PartPerCar is {stopwatch.ElapsedMilliseconds} ms");

                        Stopwatch countwatch = new Stopwatch();
                        countwatch.Start();

                        foreach (var car in cars)
                        {
                            int count = 0;
                            if (partPerCar.TryGetValue(car.CarId, out count))
                            {
                                car.CountParts = count;
                            }
                        }
                        countwatch.Stop();
                        Console.WriteLine("Elapsed Time Count Parts is {0} ms", countwatch.ElapsedMilliseconds);
                    }

                    await sqlConnection.CloseAsync();
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw new AppException($"Exception in function GetCars {exception.Message}");
            }
            finally
            {

            }

            return cars.ToArray();

        }

        static public async Task<CarView[]> GetCarsv2(Filter filter)
        {
            if (filter.UserId == null) filter.UserId = 0;

            List<CarView> cars = new List<CarView>();
            try
            {
                List<string> where = new List<string>();

                string[] models = filter.ModelsId.Split(',');
                List<string> modelsId = new List<string>();
                List<string> groupModelsId = new List<string>();

                foreach (string model in models)
                {
                    int modelInt = Convert.ToInt32(model);
                    if (modelInt > 10000)
                        groupModelsId.Add(model);
                    else
                        modelsId.Add(model);
                }

                string[] keywords = { };
                if (filter.Keyword != null && filter.Keyword.Length > 0)
                {
                    keywords = filter.Keyword.Split(' ');
                    List<string> or = new List<string>();
                    foreach (string keyword in keywords)
                    {
                        double len = keyword.Length;
                        len = len * 0.75;
                        int lenInt = (int)(len + 0.5);
                        string newKeyword = keyword.ToLower().Substring(0, lenInt);

                        or.Add(string.Format("description like '%{0}%'", newKeyword));
                    }

                    if (or.Count > 0)
                    {
                        string orString = string.Format("({0})", string.Join(" OR ", or.ToArray()));
                        where.Add(orString);
                    }
                }

                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    Stopwatch carsAllwatch = new Stopwatch();
                    carsAllwatch.Start();

                    using (SqlCommand sqlCommand = new SqlCommand("SearchCarViewAll", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        if (filter.CarId != 0)
                            sqlCommand.Parameters.Add("@carId", SqlDbType.BigInt).Value = filter.CarId;

                        if (filter.ModificationId != 0)
                        {
                            sqlCommand.Parameters.Add("@modificationId", SqlDbType.Int).Value = filter.ModificationId;
                        }
                        else if (filter.ModelId != 0)
                        {
                            if (ModelsDbSet.isGroupModel(filter.ModelId))
                            {
                                sqlCommand.Parameters.Add("@groupModelId", SqlDbType.Int).Value = filter.ModelId;
                            }
                            else
                            {
                                sqlCommand.Parameters.Add("@modelId", SqlDbType.Int).Value = filter.ModelId;
                            }
                        }
                        else if (filter.CompanyId != 0)
                            sqlCommand.Parameters.Add("@companyId", SqlDbType.Int).Value = filter.CompanyId;

                        if (filter.ModificationsId != null && filter.ModificationsId.Length > 0)
                            sqlCommand.Parameters.Add("@modificationId", SqlDbType.VarChar).Value = filter.ModificationsId;

                        if (filter.Bus == 0 || filter.Bus == 1)
                            sqlCommand.Parameters.Add("@bus", SqlDbType.Int).Value = filter.Bus;

                        if (filter.Year != 0)
                            sqlCommand.Parameters.Add("@year", SqlDbType.Int).Value = filter.Year;

                        if (filter.EngineType != 0)
                            sqlCommand.Parameters.Add("@engineType", SqlDbType.Int).Value = filter.EngineType;

                        if (filter.GearboxType != 0)
                            sqlCommand.Parameters.Add("@gearboxType", SqlDbType.Int).Value = filter.GearboxType;

                        if (filter.EngineModel != null && filter.EngineModel.Length > 0)
                            sqlCommand.Parameters.Add("@engineModel", SqlDbType.VarChar).Value = filter.EngineModel;

                        if (filter.PowerBHP != 0)
                            sqlCommand.Parameters.Add("@powerBHP", SqlDbType.Int).Value = filter.PowerBHP;

                        if (filter.RegionId != 0)
                            sqlCommand.Parameters.Add("@regionId", SqlDbType.Int).Value = filter.RegionId;

                        if (filter.AdminRun)
                            sqlCommand.Parameters.Add("@adminRun", SqlDbType.Int).Value = filter.AdminRun;

                        if (filter.Approved != ApprovedType.All)
                            sqlCommand.Parameters.Add("@approved", SqlDbType.Int).Value = filter.Approved;

                        if (filter.UserId != 0 && filter.UserId != null)
                            sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = filter.UserId;

                        if (modelsId.Count > 0)
                        {
                            sqlCommand.Parameters.Add("@modelsId", SqlDbType.VarChar).Value = string.Join(',', modelsId);
                        }
                        if (groupModelsId.Count > 0)
                        {
                            sqlCommand.Parameters.Add("@groupModelsId", SqlDbType.VarChar).Value = string.Join(',', groupModelsId);
                        }

                        for (int i = 0; i < keywords.Length && i < 6; i++)
                        {
                            sqlCommand.Parameters.Add($"@keyword{i + 1}", SqlDbType.VarChar).Value = $"%{keywords[i]}%";
                        }

                        sqlCommand.Parameters.Add("@deleted", SqlDbType.Int).Value = 0;

                        Stopwatch executewatch = new Stopwatch();
                        executewatch.Start();
                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            executewatch.Stop();
                            Console.WriteLine("Execute CarsAll is {0} ms", executewatch.ElapsedMilliseconds);
                            while (sqlDataReader.Read())
                            {
                                CarView carView = EnrichManager.EnrichCarView(sqlDataReader);

                                cars.Add(carView);
                            }
                        }
                    }
                    carsAllwatch.Stop();
                    Console.WriteLine("Elapsed Time CarsAll Details is {0} ms", carsAllwatch.ElapsedMilliseconds);


                    if (filter.UserId != 0)
                    {
                        Dictionary<long, int> partPerCar = new Dictionary<long, int>();
                        string storedProcedure = "PartPerCar";

                        Stopwatch stopwatch = new Stopwatch();
                        stopwatch.Start();

                        using (SqlCommand command = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            command.CommandType = CommandType.StoredProcedure;
                            var userIdParam = command.Parameters.Add("@userId", SqlDbType.BigInt);
                            userIdParam.Value = filter.UserId;

                            using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                            {
                                while (await sqlDataReader.ReadAsync())
                                {
                                    long carId = Convert.ToInt64(sqlDataReader["carId"]);
                                    int count = Convert.ToInt32(sqlDataReader["count"]);

                                    partPerCar[carId] = count;
                                }
                            }
                        }

                        stopwatch.Stop();
                        Console.WriteLine("Elapsed Time PartPerCar is {0} ms", stopwatch.ElapsedMilliseconds);

                        Stopwatch countwatch = new Stopwatch();
                        countwatch.Start();

                        foreach (var car in cars)
                        {
                            int count = 0;
                            if (partPerCar.TryGetValue(car.CarId, out count))
                            {
                                car.CountParts = count;
                            }
                        }
                        countwatch.Stop();
                        Console.WriteLine("Elapsed Time Count Parts is {0} ms", countwatch.ElapsedMilliseconds);
                    }

                    await sqlConnection.CloseAsync();
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"Exception in function GetCarsv2 {exception.Message}");
            }
            finally
            {

            }

            return cars.ToArray();

        }
    }
}

