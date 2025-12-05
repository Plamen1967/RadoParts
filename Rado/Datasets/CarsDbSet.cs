using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Rado.Models;
using Rado.Abuse;
using Rado.Enums;
using Rado.Exceptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using Utility;
using Models.Models;
using Models.Enums;
using Rado.Enrich;

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

            if (car.vin == null) car.vin = "";
            if (car.regNumber == null) car.regNumber = "";
            if (car.description == null) car.description = "";
            if (car.engineModel == null) car.engineModel = "";

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
                        command.Parameters.Add("@mainImageId", SqlDbType.NVarChar).Value = car.mainImageId;

                        if (car.mainPicture == null) car.mainPicture = "";
                        if (!update)
                        {
                            command.Parameters.Add("@bus", SqlDbType.Int).Value = car.bus;
                        }
                        carIdParam.Value = car.carId;
                        if (car.bus == 1)
                        {
                            modelIdParam.Value = car.modelId;
                            modificationIdParam.Value = 0;
                        }
                        else
                        {
                            modelIdParam.Value = ModificationsDbSet.GetModificationById(car.modificationId).modelId;
                            modificationIdParam.Value = car.modificationId;
                        }
                        yearParam.Value = car.year;
                        vinParam.Value = car.vin;
                        regNumberParam.Value = car.regNumber;
                        descriptionParam.Value = car.description;
                        priceParam.Value = 0;
                        engineTypeParam.Value = car.engineType;
                        engineModelParam.Value = car.engineModel;
                        powerkWhParam.Value = car.powerkWh;
                        powerBHPParam.Value = car.powerBHP;
                        userIdParam.Value = car.userId;
                        millageParam.Value = car.millage;
                        regionIdParam.Value = car.regionId;
                        gearboxTypeParam.Value = car.gearboxType;
                        modifiedTimeParam.Value = car.modifiedTime;
                        mainPictureParam.Value = car.mainPicture;

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

            CarView carView = await getCarByIdAsync(car.carId);
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
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@regNumber", SqlDbType.NVarChar).Value = regNumber;
                        command.Parameters.Add("@userId", SqlDbType.BigInt).Value = userId;
                        command.Parameters.Add("@bus", SqlDbType.BigInt).Value = bus;
                        command.Parameters.Add("@result", SqlDbType.BigInt);
                        command.Parameters["@result"].Direction = ParameterDirection.Output;


                        await command.ExecuteNonQueryAsync();

                        long value = (long)command.Parameters["@result"].Value;
                        if (value > 0)
                            return false;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException($"Exception in CheckForUniqueness {e.Message}");
            }

            return result;
        }
        static public async Task<CarView> getCarByIdAsync(long carId)
        {
            string storedProcedure = "CarsAll";
            CarView carView = new CarView();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@carId", SqlDbType.BigInt).Value = carId;

                        using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                        {
                            if (await sqlDataReader.ReadAsync())
                            {
                                carView = EnrichManager.EnrichCarView(sqlDataReader);
                            }
                        }
                    }

                    using (SqlCommand command = new SqlCommand("GetNumberPartsByCarId", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@carId", SqlDbType.BigInt).Value = carId;

                        using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                        {
                            if (await sqlDataReader.ReadAsync())
                            {
                                carView.countParts = Convert.ToInt32(sqlDataReader["Count"]);
                            }
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

        static public bool MainPicture(long partId, string mainPicture, int userId)
        {
            string storeProcedureName = "UpdateMainPictureCar";
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        SqlParameter carIdParam = command.Parameters.Add("@carId", SqlDbType.BigInt);
                        SqlParameter mainPictureParam = command.Parameters.Add("@mainPicture", SqlDbType.NVarChar);
                        SqlParameter userIdParam = command.Parameters.Add("@userId", SqlDbType.Int);

                        carIdParam.Value = partId;
                        mainPictureParam.Value = mainPicture;
                        userIdParam.Value = userId;

                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in MainPicture : {exception.Message}");
            }

            return true;

        }


        static public async Task<bool> ValidateNameAsync(int userid, long carId, string name)
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
            if (car.bus == 0)
            {
                bool check = ModificationsDbSet.CheckModificationById(car.modificationId);
                if (!check)
                    throw new AppException($"Модификация с ID {car.modificationId} за кола {car.regNumber} не е валидна");
            }
            else if (car.bus == 1)
            {
                if (car.modelId == null)
                    throw new AppException($"Модел за бус e задължителен");

                bool check = ModelsDbSet.CheckModelById(car.modelId.Value);
                if (!check)
                    throw new AppException($"Модел с ID {car.modificationId} за кола {car.regNumber} не е валидна");
            }
            else
            {
                throw new AppException($"{car.regNumber} няма избран тип car/bus");
            }

            if (car.regNumber == "")
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
                    carId = car.carId,
                    companyId = car.companyId,
                    modelId = car.modelId.Value,
                    regNumber = car.regNumber,
                    engineType = car.engineType,
                    engineModel = car.engineModel
                });
            }

            return carNameId.ToArray();
        }

        static public async Task<CarView[]> GetCars(Filter filter)
        {
            if (filter.userId == null) filter.userId = 0;

            List<CarView> cars = new List<CarView>();
            try
            {
                List<string> where = new List<string>();
                if (filter.bus == 0 || filter.bus == 1)
                    where.Add(string.Format("bus = {0}", filter.bus));

                if (filter.carId != 0)
                    where.Add(string.Format("carId = {0}", filter.carId));

                if (filter.modificationId != 0)
                {
                    where.Add(string.Format("modificationId = {0}", filter.modificationId));
                }
                else if (filter.modelId != 0)
                {
                    if (ModelsDbSet.isGroupModel(filter.modelId))
                    {
                        where.Add(string.Format("groupModelId  = {0} ", filter.modelId));
                    }
                    else
                    {
                        where.Add(string.Format("modelId = {0}", filter.modelId));
                    }
                }
                else if (filter.companyId != 0)
                    where.Add(string.Format("companyId  = {0} ", filter.companyId));

                if (filter.modelsId != null && filter.modelsId.Length > 0)
                {
                    where.Add(string.Format("( modelId in ({0}) or groupModelId in ({0}) )", filter.modelsId));
                }
                if (filter.modificationsId != null && filter.modificationsId.Length > 0)
                {
                    where.Add(string.Format("( modificationId in ({0}))", filter.modificationsId));
                }

                if (filter.itemType == ItemType.OnlyCar || filter.itemType == ItemType.AllCarAndPart)
                    where.Add($"bus = 0");
                else if (filter.itemType == ItemType.OnlyBus || filter.itemType == ItemType.AllBusAndPart)
                    where.Add($"bus = 1");

                if (filter.year != 0)
                    where.Add(string.Format("year = {0}", filter.year));

                if (filter.engineType != 0)
                    where.Add(string.Format("engineType = {0}", filter.engineType));

                if (filter.engineModel != null && filter.engineModel.Length > 0)
                    where.Add(string.Format("engineModel like '{0}%'", filter.engineModel));

                if (filter.gearboxType != 0)
                    where.Add(string.Format("gearboxType = {0}", filter.gearboxType));

                if (filter.powerBHP != 0)
                    where.Add(string.Format("powerBHP = {0}", filter.powerBHP));

                if (filter.regionId != 0)
                    where.Add(string.Format("regionId = {0}", filter.regionId));

                if (filter.regNumber?.Length > 0)
                    where.Add(string.Format("regNumber = '{0}'", filter.regNumber));

                if (filter.adminRun)
                {
                    if (filter.approved != ApprovedType.All)
                        where.Add(string.Format("approved = {0}", (int)filter.approved));
                    if (filter.userId != 0 && filter.userId != null)
                        where.Add(string.Format("userId = {0}", filter.userId));
                }
                else if (filter.userId != 0 && filter.userId != null)
                    where.Add(string.Format("userId = {0}", filter.userId));
                else if (!filter.adminRun)
                {
                    where.Add("approved <> 2");
                    where.Add("suspended = 0");
                }

                if (filter.keyword != null && filter.keyword.Length > 0)
                {
                    string[] keywords = filter.keyword.Split(' ');
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
                where.Add(string.Format("deleted = 0"));

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


                    if (filter.userId != 0)
                    {
                        Dictionary<long, int> partPerCar = new Dictionary<long, int>();
                        string storedProcedure = "PartPerCar";

                        Stopwatch stopwatch = new Stopwatch();
                        stopwatch.Start();

                        using (SqlCommand command = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            command.CommandType = CommandType.StoredProcedure;
                            var userIdParam = command.Parameters.Add("@userId", SqlDbType.BigInt);
                            userIdParam.Value = filter.userId;

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
                            if (partPerCar.TryGetValue(car.carId, out count))
                            {
                                car.countParts = count;
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
            if (filter.userId == null) filter.userId = 0;

            List<CarView> cars = new List<CarView>();
            try
            {
                List<string> where = new List<string>();

                string[] models = filter.modelsId.Split(',');
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
                if (filter.keyword != null && filter.keyword.Length > 0)
                {
                    keywords = filter.keyword.Split(' ');
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

                        if (filter.carId != 0)
                            sqlCommand.Parameters.Add("@carId", SqlDbType.BigInt).Value = filter.carId;

                        if (filter.modificationId != 0)
                        {
                            sqlCommand.Parameters.Add("@modificationId", SqlDbType.Int).Value = filter.modificationId;
                        }
                        else if (filter.modelId != 0)
                        {
                            if (ModelsDbSet.isGroupModel(filter.modelId))
                            {
                                sqlCommand.Parameters.Add("@groupModelId", SqlDbType.Int).Value = filter.modelId;
                            }
                            else
                            {
                                sqlCommand.Parameters.Add("@modelId", SqlDbType.Int).Value = filter.modelId;
                            }
                        }
                        else if (filter.companyId != 0)
                            sqlCommand.Parameters.Add("@modecompanyIdlId", SqlDbType.Int).Value = filter.companyId;

                        if (filter.modificationsId != null && filter.modificationsId.Length > 0)
                            sqlCommand.Parameters.Add("@modificationId", SqlDbType.VarChar).Value = filter.modificationId;

                        if (filter.bus == 0 || filter.bus == 1)
                            sqlCommand.Parameters.Add("@bus", SqlDbType.Int).Value = filter.bus;

                        if (filter.year != 0)
                            sqlCommand.Parameters.Add("@year", SqlDbType.Int).Value = filter.year;

                        if (filter.engineType != 0)
                            sqlCommand.Parameters.Add("@engineType", SqlDbType.Int).Value = filter.engineType;

                        if (filter.gearboxType != 0)
                            sqlCommand.Parameters.Add("@gearboxType", SqlDbType.Int).Value = filter.gearboxType;

                        if (filter.engineModel != null && filter.engineModel.Length > 0)
                            sqlCommand.Parameters.Add("@engineModel", SqlDbType.VarChar).Value = filter.engineModel;

                        if (filter.powerBHP != 0)
                            sqlCommand.Parameters.Add("@powerBHP", SqlDbType.Int).Value = filter.powerBHP;

                        if (filter.regionId != 0)
                            sqlCommand.Parameters.Add("@regionId", SqlDbType.Int).Value = filter.regionId;

                        if (filter.adminRun)
                            sqlCommand.Parameters.Add("@adminRun", SqlDbType.Int).Value = filter.adminRun;

                        if (filter.approved != ApprovedType.All)
                            sqlCommand.Parameters.Add("@approved", SqlDbType.Int).Value = filter.approved;

                        if (filter.userId != 0 && filter.userId != null)
                            sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = filter.userId;

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


                    if (filter.userId != 0)
                    {
                        Dictionary<long, int> partPerCar = new Dictionary<long, int>();
                        string storedProcedure = "PartPerCar";

                        Stopwatch stopwatch = new Stopwatch();
                        stopwatch.Start();

                        using (SqlCommand command = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            command.CommandType = CommandType.StoredProcedure;
                            var userIdParam = command.Parameters.Add("@userId", SqlDbType.BigInt);
                            userIdParam.Value = filter.userId;

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
                            if (partPerCar.TryGetValue(car.carId, out count))
                            {
                                car.countParts = count;
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

