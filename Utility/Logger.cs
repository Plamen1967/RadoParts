using Microsoft.Data.SqlClient;
using Settings;

namespace Utility
{
    public class LoggerUtil
    {
        private static LoggerUtil instance = null;
        static public object userLock = new object();


        LoggerUtil()
        {
        }
        static public void LogFunctionInfo(string info)
        {
            LogInfo(info);
        }

        static public void LogInfo(string info)
        {
            lock (userLock)
            {
                try
                {
                    LogToFile(info);
                }
                catch (Exception exception)
                {
                    LogFunctionInfo("LogInfo");
                    LogException(exception.Message);
                }
            }
        }
        static public void Log(Exception exception)
        {
            lock (userLock)
            {
                try
                {
                    LogToFile(exception.Message);
                    LogToFile(exception.StackTrace);
                }
                catch (Exception exception2)
                {
                    LogFunctionInfo("Log");
                    LogException(exception2.Message);
                }
            }
        }
        static LoggerUtil get()
        {
            if (instance == null)
            {
                instance = new LoggerUtil();
            }

            return instance;
        }
        public async static Task Log(string message, int tickCount = 0)
        {
            try
            {
                if (tickCount == 0) tickCount = Environment.TickCount;
                using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("LogMessage", sqlConnection))
                    {
                        await sqlConnection.OpenAsync();
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("Message", System.Data.SqlDbType.NVarChar).Value = message;
                        sqlCommand.Parameters.Add("tickCount", System.Data.SqlDbType.Int).Value = tickCount;
                        await sqlCommand.ExecuteNonQueryAsync();
                    }

                    await sqlConnection.CloseAsync();
                }

                LogToFile(message);
            }
            catch (Exception exception)
            {
                LogFunctionInfo("Log(string message, int tickCount = 0)");
                Log(exception);
            }
        }

        private static void LogToFile(string message)
        {
            lock (userLock)
            {
                string logFileName = string.Format("Log_{0}_{1}_{2}.log", DateTime.Now.Day, DateTime.Now.Month, DateTime.Now.Year);
                if (!Directory.Exists(ProgramSettings.LogFolder))
                    Directory.CreateDirectory(ProgramSettings.LogFolder);

                using (StreamWriter writer = new StreamWriter(logFileName, append: true))
                {
                    writer.WriteLine(message);
                    writer.Close();

                }
            }


        }
        public static void LogException(string message)
        {
            //Logger.get().logging(message, Logger.get().exceptionLogFileName);
        }
        public static void LogException(Exception exception)
        {
            MailManager.SendEmail("plamen1967@gmail.com", "Exception", exception.Message + exception.StackTrace);
            //Logger.get().logging(message, Logger.get().exceptionLogFileName);
        }

        public static void PartAdded(ulong id)
        {
            string partAddress = $"{ProgramSettings.Api}/{id}";
            string body = $"<h5>Добавена част</h5><a href={partAddress}>";
            MailManager.SendEmail("", "Добавена част", body);
        }

        public static void CarAdded(ulong id)
        {

        }
        public static void BusAdded(ulong id)
        {

        }
        public static void RImWithTyreAdded(ulong id)
        {

        }


        private void logging(string message, string fileName)
        {
            //try
            //{
            //    using(StreamWriter writer = new StreamWriter(fileName))
            //    {
            //        message = DateTime.Now.ToShortDateString().ToString() + " " + DateTime.Now.ToLongTimeString().ToString() + " ==> " + message;
            //        writer.WriteLine(message);
            //        writer.Flush();
            //        writer.Close();
            //    }
            //}
            //finally {

            //}

        }
    }

}
