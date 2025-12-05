using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
using Models.Models.Authentication;
using Rado.Enrich;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using Rado.Models.Authentication;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Utility;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Rado.Datasets
{
    public class UserDbSet
    {
        static private List<User> _user = new List<User>();
        static private bool _initialized = false;
        static public object userLock = new object();

        UserDbSet()
        {
        }
        ~UserDbSet()
        {
        }


        #region NumberOfPartsPerUser
        public static async Task<NumberParts> NumberOfPartsPerUser(int userId)
        {
            string storedProcedure = "GetNumberPartsPerUser";
            try
            {
                NumberParts numberParts = new NumberParts();
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    await sqlConnection.OpenAsync();
                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        SqlParameter numberCarPartsParam = new SqlParameter("@carnumberParts", SqlDbType.Int);
                        numberCarPartsParam.Direction = ParameterDirection.Output;
                        SqlParameter numberBusPartsParam = new SqlParameter("@busnumberParts", SqlDbType.Int);
                        numberBusPartsParam.Direction = ParameterDirection.Output;

                        SqlParameter userIdParam = new SqlParameter("@userId", SqlDbType.Int);
                        userIdParam.Value = userId;

                        sqlCommand.Parameters.Add(userIdParam);
                        sqlCommand.Parameters.Add(numberCarPartsParam);
                        sqlCommand.Parameters.Add(numberBusPartsParam);

                        await sqlCommand.ExecuteNonQueryAsync();

                        numberParts.car = (int)numberCarPartsParam.Value;
                        numberParts.bus = (int)numberBusPartsParam.Value;

                        return numberParts;
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"GetRemainingAlowance : {exception.Message}");
            }

        }

        #endregion

        #region GetUserCount
        public async static Task<UserCount> GetUserCountAsync(int userId)
        {
            UserCount userCount = new UserCount();
            string storedProcedure = "GetUserCount";
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    await sqlConnection.OpenAsync();
                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        SqlParameter partCarCountParam = new SqlParameter("@partCarCount", SqlDbType.Int);
                        partCarCountParam.Direction = ParameterDirection.Output;

                        SqlParameter partBusCountParam = new SqlParameter("@partBusCount", SqlDbType.Int);
                        partBusCountParam.Direction = ParameterDirection.Output;

                        SqlParameter carCountParam = new SqlParameter("@carCount", SqlDbType.Int);
                        carCountParam.Direction = ParameterDirection.Output;

                        SqlParameter busCountParam = new SqlParameter("@busCount", SqlDbType.Int);
                        busCountParam.Direction = ParameterDirection.Output;

                        SqlParameter tyreCountParam = new SqlParameter("@tyreCount", SqlDbType.Int);
                        tyreCountParam.Direction = ParameterDirection.Output;

                        SqlParameter rimCountParam = new SqlParameter("@rimCount", SqlDbType.Int);
                        rimCountParam.Direction = ParameterDirection.Output;

                        SqlParameter rimWithTyreCountParam = new SqlParameter("@rimWithTyreCount", SqlDbType.Int);
                        rimWithTyreCountParam.Direction = ParameterDirection.Output;

                        SqlParameter userIdParam = new SqlParameter("@userId", SqlDbType.Int);
                        userIdParam.Value = userId;

                        sqlCommand.Parameters.Add(userIdParam);
                        sqlCommand.Parameters.Add(partCarCountParam);
                        sqlCommand.Parameters.Add(partBusCountParam);
                        sqlCommand.Parameters.Add(carCountParam);
                        sqlCommand.Parameters.Add(busCountParam);
                        sqlCommand.Parameters.Add(tyreCountParam);
                        sqlCommand.Parameters.Add(rimCountParam);
                        sqlCommand.Parameters.Add(rimWithTyreCountParam);

                        await sqlCommand.ExecuteNonQueryAsync();

                        userCount.partCarCount = (int)partCarCountParam.Value;
                        userCount.partBusCount = (int)partBusCountParam.Value;
                        userCount.carCount = (int)carCountParam.Value;
                        userCount.busCount = (int)busCountParam.Value;
                        userCount.tyreCount = (int)tyreCountParam.Value;
                        userCount.rimCount = (int)rimCountParam.Value;
                        userCount.rimWithTyreCount = (int)rimWithTyreCountParam.Value;
                        userCount.user = UserDbSet.GetUserById(userId);

                        return userCount;
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"GetRemainingAlowance : {exception.Message}");
            }
        }
        #endregion

        #region Login

        #region SuccessfullLogin
        public static int SuccessfullLogin(int userId)
        {
            try
            {
                string storedProcedure = "UserLogin";
                int row = 0;
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@userId", userId);
                        row = sqlCommand.ExecuteNonQuery();
                    }

                }

                refresh();
            }
            catch (Exception exception)
            {
                new AppException(exception.Message);
            }
            finally
            {
            }

            return 1;
        }
        #endregion

        #region WrongAttempt
        public static int WrongAttempt(int userId)
        {
            try
            {
                int attempts;
                string storedProcedure = "UserWrongLogging";
                int row = 0;
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@userId", userId);
                        var returnParameter = sqlCommand.Parameters.Add("@attempt", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.Output;
                        row = sqlCommand.ExecuteNonQuery();
                        attempts = (int)returnParameter.Value;
                    }

                }
                if (attempts >= 3)
                {
                    if (LockAccount(userId))
                    {
                        return -1;
                    }
                }

                refresh();
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }
            finally
            {
            }

            return 1;
        }
        #endregion

        #region LockAccount
        public static bool LockAccount(int userId)
        {
            try
            {
                string storedProcedure = "UserLock";
                int row = 0;
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@userId", userId);
                        row = sqlCommand.ExecuteNonQuery();
                    }

                }
                if (row == 0)
                {
                    throw new AppException("User account not locked");
                }

                refresh();
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }
            finally
            {
            }

            return true;

        }

        #endregion

        #endregion

        class DisplayPartViewComparer : IComparer
        {
            public int Compare(object x, object y)
            {
                return (new CaseInsensitiveComparer()).Compare(((DisplayPartView)x).modifiedTime,
                       ((DisplayPartView)y).modifiedTime);
            }
        }
        public static async Task<string> UserPrivateAsync(int userId)
        {
            string storeProcedureName = "UserToPrivate";
            User user = GetUserById(userId);
            Filter filterPart = new Filter() { userId = userId };

            SearchResult result = await SearchDbSet.Search(filterPart);
            foreach (var item in result.data) item.Normalize();

            foreach (var data in result.data)
            {
                if (data.isCar)
                {
                    await CarsDbSet.DeleteCarAsync(data.id, userId);
                }
            }
            DisplayPartView[] myArray = result.data.Where((val, idx) => val.isCar == true).ToArray();

            if (result.data.Length > 3)
            {

                Array.Sort(result.data, new DisplayPartViewComparer());
                for (int i = 0; i < result.data.Length - 3; i++)
                {
                    DisplayPartView view = result.data[i];
                    if (view.isCar)
                    {
                        await CarsDbSet.DeleteCarAsync(view.id, userId);
                    } else if (view.itemType == ItemType.BusPart || view.itemType == ItemType.CarPart)
                    {
                        await PartDbSet.DeletePartAsync(view.id, userId);
                    }
                    else
                    {
                        await RimWithTyreDbSet.DeleteRimWithTyreAsync(view.id, userId);
                    }
                }
            }

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    await sqlConnection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int columns = await command.ExecuteNonQueryAsync();

                        if (columns !=  1)
                        {
                            throw new AppException($"Потребителя {user.userName} неуспешно е прехвърлен на частно лице");
                        }
                        refresh();

                        return $"Потребителя {user.userName} успешно е прехвърлен на частно лице";
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("UserPrivate");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Потребителя {user.userName} неуспешно е прехвърлен на частно лице");
            }

        }

        public static User GetUserByActivationCode(string activationCode)
        {
            string storeProcedureName = "GetUserByActivationCode";
            User user = null;
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@ActivationCode", System.Data.SqlDbType.NVarChar, 200).Value = activationCode;
                        sqlConnection.Open();

                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            if (sqlDataReader.Read())
                            {
                                user = EnrichManager.EnrichUser(sqlDataReader);
                                user.PasswordHash = "";
                            }
                        }

                        sqlConnection.Close();
                        return user;
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("UserPrivate");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Потребителя с активационен коде{activationCode} не е намерен");
            }

        }
        public static UserView GetUserByDomainName(string domainName)
        {
            domainName = domainName.ToUpper();
            lock (userLock)
            {
                IEnumerable<User> users = getUsers();
                var user = users.First(user => user.webPage.Trim().ToUpper() == domainName);
                var images = ImageManager.GetImagesAsync(user.userId);
                images.Wait();
                UserView userView = new UserView()
                {
                    userId = user.userId,
                    companyName = user.companyName,
                    firstName = user.firstName,
                    lastName = user.lastName,
                    phone = user.phone,
                    phone2 = user.phone2,
                    viber = user.viber,
                    whats = user.whats,
                    webPage = user.webPage,
                    description = user.description,
                    regionId = user.regionId,
                    address = user.address,
                    city = user.city,
                    busimessCard = ImageManager.GetBusinessCard(user.userId),
                    images = images.Result
                };

                return userView;
            }

        }

        public static string UserDealer(int userId)
        {
            string storeProcedureName = "UserToDealer";
            User user = GetUserById(userId);

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int columns = command.ExecuteNonQuery();

                        if (columns != 1)
                        {
                            throw new AppException($"Потребителя {user.userName} неуспешно е прехвърлен на дилър");
                        }
                        refresh();

                        return $"Потребителя {user.userName} успешно е прехвърлен на дилър";
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("UserDealer");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Потребителя {user.userName} неуспешно е прехвърлен на дилър");
            }

        }
        #region User Management

        public static BackendMessage AdminActivateUser(int userId, int userAdminId)
        {
            string activationCode = String.Format("{0}{1}", randomString(6), Guid.NewGuid().ToString());
            string storeProcedureName = "AdminUserActivate";
            User user = GetUserById(userId);
            User userAdmin = GetUserById(userAdminId);

            try
            {

                if (user == null)
                {
                    throw new Exception("User can not be found");
                }

                if (userAdmin == null|| !userAdmin.isAdmin())
                {
                    throw new Exception("Only administrator could activate an User");
                }

                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
                        SqlParameter activationCodeParam = command.Parameters.Add("@ActivationCode", System.Data.SqlDbType.NVarChar);
                        activationCodeParam.Value = activationCode;

                        int columns = command.ExecuteNonQuery();

                        if (columns > 0)
                        {
                            try
                            {
                                MailManager.SendActivationEmail(Program.api, activationCode, user.userName, user.email);
                            }
                            catch (Exception exception)
                            {
                                throw new AppException(exception.Message);
                            }
                        }
                        refresh();

                        string address;
                        if (Program.DevelopmentMode)
                            address = $"/activateUser?id={activationCode}";
                        else
                            address = $"/";

                        return new BackendMessage() { account = user.email, url = address };
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("AdminActivateUser");
                LoggerUtil.LogException(exception.Message);
            }

            return null;
        }

        public static BackendMessage AdminUnLockUser(int userId, int userAdminId)
        {
            string activationCode = String.Format("{0}{1}", randomString(6), Guid.NewGuid().ToString());
            string storeProcedureName = "AdminUserUnLock";
            User user = GetUserById(userId);
            User userAdmin = GetUserById(userAdminId);

            try
            {

                if (user == null)
                {
                    throw new Exception("User can not be found");
                }

                if (userAdmin == null || !userAdmin.isAdmin())
                {
                    throw new Exception("Only administrator could activate an User");
                }

                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
                        SqlParameter activationCodeParam = command.Parameters.Add("@ActivationCode", System.Data.SqlDbType.NVarChar);
                        activationCodeParam.Value = activationCode;

                        int columns = command.ExecuteNonQuery();

                        if (columns > 0)
                        {
                            try
                            {
                                MailManager.SendRecoveryEmail(Program.api, activationCode, user.userName, user.email);
                            }
                            catch (Exception exception)
                            {
                                throw new AppException(exception.Message);
                            }
                        }
                        refresh();

                        string address;
                        if (Program.DevelopmentMode)
                            address = $"/recovery?id={activationCode}";
                        else
                            address = $"/";

                        return new BackendMessage() { account = user.email, url = address };
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("AdminUnLockUser");
                LoggerUtil.LogException(exception.Message);
            }

            return null;
        }

        public static string AdminDeleteUser(int userId, int userAdminId)
        {
            string storeProcedureName = "UserDel";
            User user = GetUserById(userId);
            User userAdmin = GetUserById(userAdminId);

            try
            {

                if (user == null)
                {
                    throw new Exception("User can not be found");
                }

                if (userAdmin == null || !userAdmin.isAdmin())
                {
                    throw new Exception("Only administrator could activate an User");
                }

                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int columns = command.ExecuteNonQuery();

                        if (columns == 0)
                        {
                            throw new AppException($"Потребител { user.userName} не може да бъде изтрит!");
                        }
                        refresh();

                        return $"Потребител: { user.userName} е успешно е изтрит!";
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("AdminDeleteUser");
                LoggerUtil.LogException(exception.Message);
            }

            return $"Потребител { user.userName} не може да бъде изтрит!";
        }

        public async static Task<User> SuspendUser(int userId, long suspendedDateTime)
        {
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("UserSuspend", sqlConnection))
                    {
                        await sqlConnection.OpenAsync();

                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
                        sqlCommand.Parameters.Add("@suspendedDateTime", System.Data.SqlDbType.BigInt).Value = suspendedDateTime;

                        int result = await sqlCommand.ExecuteNonQueryAsync();
                        refresh();
                        if (result != 1)
                        {
                            throw new Exception(HttpStatusCode.NotFound.ToString());
                        }

                        await sqlConnection.CloseAsync();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }

            return UserDbSet.GetUserById(userId);
        }

        public async static Task<User> UnSuspendUser(int userId)
        {
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("UserUnSuspend", sqlConnection))
                    {
                        await sqlConnection.OpenAsync();

                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;

                        int result = await sqlCommand.ExecuteNonQueryAsync();
                        refresh();
                        if (result != 1)
                        {
                            throw new Exception(HttpStatusCode.NotFound.ToString()  );
                        }

                        await sqlConnection.CloseAsync();
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw new AppException(exception.Message);
            }

            return UserDbSet.GetUserById(userId);
        }


        #region UpdateUser
        public static BackendMessage UpdateUser(User user, InsertUpdate update)
        {
            string storeProcedureName;
            string activationCode = String.Format("{0}{1}", randomString(6), Guid.NewGuid().ToString());

            if (update == InsertUpdate.Insert)
            {
                storeProcedureName = "UserIns";
                try
                {
                    checkUniqueness(user.userName, user.email, user.phone, user.userId);
                }
                catch (AppException exception)
                {
                    LoggerUtil.LogException(exception);
                }
            }
            else
            {
                storeProcedureName = "UserUpd";
                try
                {
                    checkUniqueness(user.userName, user.email, user.phone, user.userId);
                }
                catch (AppException exception)
                {
                  LoggerUtil.LogException(exception);
                }
            }

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        SqlParameter userNameParam = command.Parameters.Add("@userName", System.Data.SqlDbType.NVarChar);
                        userNameParam.Value = user.userName;
                        SqlParameter emailParam = command.Parameters.Add("@email", System.Data.SqlDbType.NVarChar);
                        emailParam.Value = user.email;
                        SqlParameter phoneParam = command.Parameters.Add("@phone", System.Data.SqlDbType.NVarChar);
                        phoneParam.Value = user.phone;

                        if (update == InsertUpdate.Insert)
                        {
                            SqlParameter passwordParam = command.Parameters.Add("@password", System.Data.SqlDbType.NVarChar);
                            passwordParam.Value = BCryptNet.HashPassword(user.password);
                            SqlParameter activationCodeParam = command.Parameters.Add("@ActivationCode", System.Data.SqlDbType.NVarChar);
                            activationCodeParam.Value = activationCode;
                            SqlParameter dealerParam = command.Parameters.Add("@dealer", System.Data.SqlDbType.Int);
                            dealerParam.Value = user.dealer;
                        }
                        else
                        {
                            command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = user.userId;
                            SqlParameter companyNameParam = command.Parameters.Add("@companyName", System.Data.SqlDbType.NVarChar);
                            SqlParameter firstNameParam = command.Parameters.Add("@firstName", System.Data.SqlDbType.NVarChar);
                            SqlParameter fatherNameParam = command.Parameters.Add("@fatherName", System.Data.SqlDbType.NVarChar);
                            SqlParameter lastNameParam = command.Parameters.Add("@lastName", System.Data.SqlDbType.NVarChar);
                            SqlParameter phone2Param = command.Parameters.Add("@phone2", System.Data.SqlDbType.NVarChar);
                            command.Parameters.Add("viber", System.Data.SqlDbType.NVarChar).Value = user.viber;
                            command.Parameters.Add("whats", System.Data.SqlDbType.NVarChar).Value = user.whats;
                            SqlParameter addressParam = command.Parameters.Add("@address", System.Data.SqlDbType.NVarChar);
                            SqlParameter cityParam = command.Parameters.Add("@city", System.Data.SqlDbType.NVarChar);
                            SqlParameter dealerParam = command.Parameters.Add("@dealer", System.Data.SqlDbType.Int);
                            SqlParameter regionIdParam = command.Parameters.Add("@regionId", System.Data.SqlDbType.Int);
                            SqlParameter webPageParam = command.Parameters.Add("@webPage", System.Data.SqlDbType.NVarChar);
                            SqlParameter descriptionParam = command.Parameters.Add("@description", System.Data.SqlDbType.NVarChar);
                            command.Parameters.Add("@imageId", System.Data.SqlDbType.Int).Value = user.imageId;

                            companyNameParam.Value = user.companyName;
                            firstNameParam.Value = user.firstName;
                            fatherNameParam.Value = user.fatherName;
                            lastNameParam.Value = user.lastName;
                            phone2Param.Value = user.phone2;
                            addressParam.Value = user.address;
                            cityParam.Value = user.city;
                            dealerParam.Value = user.dealer;
                            regionIdParam.Value = user.regionId;
                            webPageParam.Value = user.webPage;
                            descriptionParam.Value = user.description;
                        }

                        SqlParameter returnValue = new SqlParameter();
                        returnValue.Direction = ParameterDirection.ReturnValue;
                        command.Parameters.Add(returnValue);


                        int columns = command.ExecuteNonQuery();

                        if (update == InsertUpdate.Insert)
                        {
                            try
                            {
                                MailManager.SendActivationEmail(Program.api, activationCode, user.userName, user.email);
                            }
                            catch (Exception exception)
                            {
                                LoggerUtil.LogInfo(user.userName);
                                LoggerUtil.LogException(exception.Message);
                                throw new AppException(exception.Message);
                            }
                        }
                        refresh();

                        string address = "/";
                        if (Program.DevelopmentMode)
                            if (user.dealer == UserType.Dealer)
                                address = $"/dealerUpdate?activationcode={activationCode}";
                            else
                               address = $"/userdetails?activationcode={activationCode}"; 
                        else
                            if (user.dealer == UserType.Dealer)
                               address = $"/dealerUpdate?activationcode={activationCode}";
                        else
                            address = $"/";

                        return new BackendMessage() { account = user.email, url = address };
                    }
                }
            }

            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }

        }
        public static BackendMessage RegisterUser(RegisterUser user)
        {
            string storeProcedureName;
            string activationCode = String.Format("{0}{1}", randomString(6), Guid.NewGuid().ToString());

            storeProcedureName = "UserIns";
            try
            {
                checkUniqueness(user.userName, user.email, user.phone);
            }
            catch (AppException exception)
            {
                LoggerUtil.LogException(exception);
            }
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        SqlParameter userNameParam = command.Parameters.Add("@userName", System.Data.SqlDbType.NVarChar);
                        userNameParam.Value = user.userName;
                        SqlParameter emailParam = command.Parameters.Add("@email", System.Data.SqlDbType.NVarChar);
                        emailParam.Value = user.email;
                        SqlParameter phoneParam = command.Parameters.Add("@phone", System.Data.SqlDbType.NVarChar);
                        phoneParam.Value = user.phone;

                        SqlParameter passwordParam = command.Parameters.Add("@password", System.Data.SqlDbType.NVarChar);
                        passwordParam.Value = BCryptNet.HashPassword(user.password);
                        SqlParameter activationCodeParam = command.Parameters.Add("@ActivationCode", System.Data.SqlDbType.NVarChar);
                        activationCodeParam.Value = activationCode;
                        SqlParameter dealerParam = command.Parameters.Add("@dealer", System.Data.SqlDbType.Int);
                        dealerParam.Value = user.dealer;

                        SqlParameter returnValue = new SqlParameter();
                        returnValue.Direction = ParameterDirection.ReturnValue;
                        command.Parameters.Add(returnValue);


                        int columns = command.ExecuteNonQuery();

                        try
                        {
                            MailManager.SendActivationEmail(Program.api, activationCode, user.userName, user.email);
                        }
                        catch (Exception exception)
                        {
                            LoggerUtil.LogInfo(user.userName);
                            LoggerUtil.LogException(exception.Message);
                            throw new AppException(exception.Message);
                        }

                        refresh();

                        string address = "/";
                        if (Program.DevelopmentMode)
                            if (user.dealer == UserType.Dealer)
                                address = $"user/dealerUpdate?activationcode={activationCode}";
                            else
                                address = $"user/userdetails?activationcode={activationCode}";
                        else
                        {
                            if (user.dealer == UserType.Dealer)
                                address = $"user/dealerUpdate?activationcode={activationCode}";
                            else
                                address = $"/";
                        }

                        return new BackendMessage() { activationCode = activationCode, account = user.email, url = address, userId = (int)returnValue.Value };
                    }
                }
            }

            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }

        }
        #endregion

        #region ActivateUser
        public static string ActivateUser(string activationCode)
        {
            try
            {
                int row = 0;
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    using (SqlCommand sqlCommand = new SqlCommand("UserActivate", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@activationCode", SqlDbType.NVarChar).Value = activationCode;
                        row = sqlCommand.ExecuteNonQuery();
                    }
                    sqlConnection.Close();
                }
                if (row == 0)
                {
                    throw new AppException("Not valid activaction code");
                }

                refresh();
                return "Your account is successfully activated!";
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("ActivateUser");
                LoggerUtil.LogException($"Активикационен код: {activationCode}");
                throw new AppException(exception.Message);
            }
            finally
            {
            }
        }

        #endregion

        #region UnLockUser
        public static string UnLockUser(ActivationCode activationCode)
        {
            try
            {
                int row = 0;
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    using (SqlCommand sqlCommand = new SqlCommand("UserUnLock", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@activationCode", SqlDbType.VarChar).Value = activationCode.activationCode;
                        SqlParameter passwordParam = sqlCommand.Parameters.Add("@password", SqlDbType.NVarChar);
                        passwordParam.Value = BCryptNet.HashPassword(activationCode.password);

                        row = sqlCommand.ExecuteNonQuery();
                    }
                }
                if (row == 0)
                {
                    throw new AppException("Not valid Unlock code");
                }

                refresh();

                return "Your account is successfully unlocked!";
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }
            finally
            {
            }
        }
        #endregion

        #region UpdatePassword
        public static bool UpdatePassword(Password password, long userId)
        {
            lock (userLock)
            {
                bool returtValue = false;
                string storedProcedure = "PasswordUpd";
                User user = getUsers().First(x => x.userId == userId);
                if (user != null)
                {
                    if (!BCryptNet.Verify(password.oldPassword, user.PasswordHash))
                    {
                        throw new AppException("Old password is incorrect!");
                    }
                }
                try
                {
                    using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                    {
                        using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            sqlConnection.Open();

                            sqlCommand.CommandType = CommandType.StoredProcedure;

                            SqlParameter passwordParam = sqlCommand.Parameters.Add("@password", SqlDbType.NVarChar);
                            SqlParameter userIdParam = sqlCommand.Parameters.Add("@userId", SqlDbType.BigInt);

                            passwordParam.Value = BCryptNet.HashPassword(password.password);
                            userIdParam.Value = userId;

                            int columns = sqlCommand.ExecuteNonQuery();

                            sqlConnection.Close();

                            if (columns != 1)
                            {
                                throw new Exception(" Password not updated correctly");
                            }

                            returtValue = true;
                            if (user != null)
                            {
                                user.PasswordHash = BCryptNet.HashPassword(password.password);
                            }
                        }
                    }
                }
                catch (Exception exception)
                {
                    throw new AppException($"Password not updated correctly : ${exception.Message}");
                }
                finally
                {
                }

                return returtValue;
            }
        }

        #endregion

        #region RecoverUser
        public static BackendMessage RecoverUser(string userAccount)
        {
            string storeProcedureName = "UserRecovery";
            string userName = userAccount.Trim().ToUpper();
            string activationCode = String.Format("{0}{1}", randomString(6), Guid.NewGuid().ToString());
            User user = GetUserByName(userAccount);
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand command = new SqlCommand(storeProcedureName, sqlConnection))
                    {
                        command.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = user.userId;
                        command.Parameters.Add("@activationCode", System.Data.SqlDbType.NVarChar).Value = activationCode;
                        command.CommandType = CommandType.StoredProcedure;

                        int columns = command.ExecuteNonQuery();
                        MailManager.SendRecoveryEmail(Program.api, activationCode, user.userName, user.email);
                        user.activationCode = activationCode;
                    }
                }
            }

            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }

            string address = $"/recovery?id={activationCode}";
            if (Program.DevelopmentMode)
                address = $"/recovery?id={activationCode}";
            else
                address = $"/";

            return new BackendMessage() { account = user.email, url = address };
        }
        #endregion

        #region DeleteUser
        public static string DeleteUser(int userId, int deletedUserId)
        {
            try
            {
                if (!IsAdmin(userId) && userId != deletedUserId)
                {
                    throw new Exception("Only administrator can delete user!");
                }
                int row = 0;
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();
                    using (SqlCommand sqlCommand = new SqlCommand("UserDel", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@userId", SqlDbType.VarChar).Value = deletedUserId;
                        row = sqlCommand.ExecuteNonQuery();
                    }
                }
                if (row == 0)
                {
                    throw new AppException("User can not be deleted");
                }

                refresh();

                return "User successfully is deleted!";
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }
            finally
            {
            }
        }
        #endregion

        #endregion

        #region IsAdmin
        public static bool IsAdmin(int userId)
        {
            lock (userLock)
            {
                try
                {
                    User user = getUsers().First(x => x.userId == userId);
                    if (user == null)
                        throw new AppException("User is not found");

                    return user.isAdmin();
                }
                catch (Exception exception)
                {
                    LoggerUtil.LogFunctionInfo("IsAdmin");
                    LoggerUtil.LogException(exception.Message);
                }
            }
            return false;
        }
        #endregion

        #region GetAccountByActivationCode
        public static User GetAccountByActivationCode(string activationCode)
        {
            User user = null;
            lock (userLock)
            {
                try
                {
                    user = getUsers().Find(user => user.activationCode == activationCode);
                }
                catch (Exception exception)
                {
                    LoggerUtil.LogFunctionInfo("GetAccountByActivationCode");
                    LoggerUtil.LogException(exception.Message);
                }
            }
            if (user  == null)
            {
                throw new Exception("Такъв потребител не можде да бъде намерен");
            }
            return user;
        }
        #endregion

        public static UserView GetUserViewById(int userId)
        {
            User user = UserDbSet.GetUserById(userId);
            var images = ImageManager.GetImagesAsync(userId);
            images.Wait();
            UserView userView = new UserView()
            {
                userId = user.userId,
                companyName = user.companyName,
                firstName = user.firstName,
                lastName = user.lastName,
                phone = user.phone,
                phone2 = user.phone2,
                viber = user.viber,
                whats = user.whats,
                webPage = user.webPage,
                description = user.description,
                regionId = user.regionId,
                address = user.address,
                city = user.city,
                busimessCard = ImageManager.GetBusinessCard(user.userId),
                images = images.Result

            };


            return userView;
        }

        #region GetUserById
        public static User GetUserById(long userId)
        {
            User user = null;
            lock (userLock)
            {
                try
                {
                    user = getUsers().First(x => x.userId == userId);
                    if (user == null)
                        throw new AppException("User is not found");
                }
                catch(Exception exception)
                {
                    LoggerUtil.LogFunctionInfo("GetUserById");
                    LoggerUtil.LogException(exception.Message);
                }
            }
            return user;
        }
        #endregion

        #region GetUserByName
        public static User GetUserByName(string userName)
        {
            userName = userName.ToUpper();
            lock(userLock)
            {
                IEnumerable<User> users = getUsers();
                var user = users.First(user => user.userName.Trim().ToUpper() == userName ||
                                                     user.email.Trim().ToUpper() == userName ||
                        user.phone.Trim().ToUpper() == userName ||
                        user.phone2.Trim().ToUpper() == userName);

                return user;
            }
        }
        #endregion

        #region GetUsers
        public static IEnumerable<User> GetUsers()
        {
            lock(userLock)
            {
                return getUsers();
            }
        }
        #endregion

        #region random
        private static Random random = new Random();

        private static string randomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        #endregion

        #region refresh
        private static void refresh()
        {
            lock (userLock)
            {
                _initialized = false;
            }
        }
        #endregion

        #region getUsers
        private static List<User> getUsers()
        {
            if (_initialized) return _user;
            try
            {
                _user.Clear();
                string storedProcedure = "UserAll";
                try
                {
                    using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                    {
                        sqlConnection.Open();
                        using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            sqlCommand.CommandType = CommandType.StoredProcedure;

                            using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                            {
                                while (sqlDataReader.Read())
                                {
                                    User user = EnrichManager.EnrichUser(sqlDataReader);
                                    user.PasswordHash = user.PasswordHash;
                                    _user.Add(user);
                                }
                            }
                        }
                    }
                }
                catch (Exception excception)
                {
                    throw new AppException($"Get user throw {excception.Message}");
                }

                _initialized = true;
            }
            catch (Exception exception)
            {
                LoggerUtil.Log(exception);
            }
            finally
            {
            }
            return _user;
        }

        #endregion

        #region checkUniquenss
        private static void checkUniqueness(string userName, string email, string phone, int userId = 0)
        {
            lock (userLock)
            {
                IEnumerable<User> users = getUsers();
                var found = users.Where(user => user.userName.Trim().ToUpper() == userName.Trim().ToUpper() ||
                                    //                                user.email.Trim().ToUpper() == email.Trim().ToUpper() ||
                                    user.phone.Trim().ToUpper() == phone.Trim().ToUpper() ||
                                    user.phone2.Trim().ToUpper() == phone.Trim().ToUpper());

                if (userId != 0)
                    found = found.Where(user => user.userId != userId);

                if (found.Count() > 0)
                {
                    User user = found.First();
                    if (user.userName.Trim().ToUpper() == userName.Trim().ToUpper())
                        throw new AppException("Потребител с такова потребителско име вече съществува");
                    //if (user.email.Trim().ToUpper() == email.Trim().ToUpper())
                    //    throw new AppException("Потребител с такъв е-майл вече съществува");
                    if (user.phone.Trim().ToUpper() == phone.Trim().ToUpper() || user.phone2.Trim().ToUpper() == phone.Trim().ToUpper())
                        throw new AppException("Потребител с такъв телефон вече съществува");
                }
            }
        }

        internal static async Task<UserData> GetUserData(int id)
        {
            UserData userData = new UserData();
            User user = UserDbSet.GetUserById(id);
            Filter filterPart = new Filter() { itemType = ItemType.None, userId = id };
            userData.companyName = user.companyName;
            userData.phone = user.phone;    
            userData.phone2 = user.phone2;
            userData.businessCard = user.imageData;
            userData.description = user.description;
            userData.viber = user.viber;
            userData.whats = user.whats;
            userData.email = user.email;
            userData.address = user.address;
            userData.city = user.city;
            userData.region = user.regionId.ToString();

            userData.images = await ImageManager.GetImagesAsync(id);
            var result = await SearchDbSet.Search(filterPart);
            userData.data = result.data;

            return userData;
        }


        #endregion
    }
}
