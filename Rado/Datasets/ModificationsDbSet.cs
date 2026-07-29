using Microsoft.Data.SqlClient;
using Rado.Enrich;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class ModificationsDbSet
    {
        private static Mutex mut = new Mutex();
        private readonly List<Models.Modification> modifications = new List<Models.Modification>();
        static ModificationsDbSet modificationInstance_ = null;
        bool isCashLoaded = false;
        ModificationsDbSet()
        {
        }

        void loadCash()
        {
            try
            {
                using(SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    using(SqlCommand command = new SqlCommand("ModificationAll", connection))
                    {
                        connection.Open();
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var modificaion = new Models.Modification()
                                {
                                    ModificationId = Convert.ToInt32(reader["modificationId"]),
                                    ModelId = Convert.ToInt32(reader["modelId"]),
                                    ModificationName = Convert.ToString(reader["modificationName"]),
                                    YearFrom = Convert.ToInt32(reader["yearFrom"]),
                                    YearTo = Convert.ToInt32(reader["yearTo"]),
                                    PowerHP = Convert.ToInt32(reader["powerHP"]),
                                    Engine = Convert.ToInt32(reader["engine"]),
                                    Doors = Convert.ToInt32(reader["doors"]),
                                    Kupe = Convert.ToInt32(reader["kupe"])
                                };
                                EnrichManager.EnrichModification(modificaion);

                                modifications.Add(modificaion); 
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
            }
            finally
            {
            }
        }

        static public async Task<Modification> GetModificationByNameAsync(string modificationName)
        {
            Modification modification = null;

            await Task.Run(() =>
            {
                modification = getInstance().modifications.Find(element => element.ModificationName == modificationName);
            });

            return modification;

        }

        static public async Task<Modification[]> GetModificationsAsync()
        {
            Modification[] modifications = null;

            await Task.Run(() =>
            {
                modifications = getInstance().modifications.ToArray();
            });

            return modifications;

        }
        static public Modification[] GetModifications()
        {
            Modification[] modifications = getInstance().modifications.ToArray();

            return modifications;

        }

        static public async Task<ModificationMin[]> GetModificationByModelIdAsync(int modelId)
        {
            ModificationMin[] modificationMins = null;

            await Task.Run(() =>
            {
                IEnumerable<Modification> modifications = getInstance().modifications.FindAll(x => x.ModelId == modelId);
                List<ModificationMin> min = new List<ModificationMin>();
                foreach (Modification modification in modifications)
                {
                    min.Add(modification.GetModificationMin());
                }

                modificationMins = min.ToArray();
            });

            return modificationMins;
        }

        static public async Task<Modification[]> GetModificationFullByModelIdAsync(int modelId)
        {
            Modification[] modifications = null;
            
            await Task.Run(() =>
            {
                modifications = getInstance().modifications.FindAll(x => x.ModelId == modelId).ToArray();
            });

            return modifications;
        }
        static public Modification[] GetModificationByModelId(int modelId)
        {

            Modification[] modifications = getInstance().modifications.FindAll(x => x.ModelId == modelId).ToArray();

            return modifications;
        }

        static public Modification[] GetModificationByModelsId(string modelsId)
        {
            String[] modelIds = modelsId.Split(',');
            List<Models.Modification> allModifications = new List<Models.Modification>();

            foreach (String modelId in modelIds)
            {
                try
                {
                    int id = Int32.Parse(modelId);
                    if (id > 10000)
                    {
                        Model[] models = Array.FindAll<Model>(ModelsDbSet.GetModels(), x => x.GroupModelId == id);
                        foreach (var model in models)
                        {
                            List<Models.Modification> modifications = getInstance().modifications.FindAll(x => x.ModelId == model.ModelId);
                            foreach (Modification modification in modifications)
                            {
                                var result = allModifications.Find(item => item.ModificationId == modification.ModificationId);
                                if (result == null)
                                    allModifications.Add(modification);
                            }
                        }
                    }
                    else
                    {
                        List<Models.Modification> modifications = getInstance().modifications.FindAll(x => x.ModelId == id);
                        foreach (Modification modification in modifications)
                        {
                            var result = allModifications.Find(item => item.ModificationId == modification.ModificationId);
                            if (result == null)
                                allModifications.Add(modification);
                        }
                    }
                }
                catch (Exception exception)
                {
                    LoggerUtil.LogException(exception);
                }
            }

            return allModifications.ToArray();
        }

        static async public Task<Models.ModificationMin[]> GetModificationByModelsIdAsync(string modelsId)
        {
            String[] modelIds = modelsId.Split(',');
            List<Models.ModificationMin> allModifications = new List<Models.ModificationMin>();
            await Task.Run(() =>
            {
                Modification[] modifications = GetModificationByModelsId(modelsId);

                foreach (var modification in modifications)
                {
                   allModifications.Add(modification.GetModificationMin());
                }
            });

            return allModifications.ToArray();
        }

        static async public Task<Models.Modification[]> GetModificationFullByModelsIdAsync(string modelsId)
        {
            String[] modelIds = modelsId.Split(',');
            Modification[] modifications = null;
            await Task.Run(() =>
            {
                modifications = GetModificationByModelsId(modelsId);

            });

            return modifications;
        }

        static public string GetModificationNameById(int modificationlId)
        {
            try
            {
                return getInstance().modifications.Find(x => x.ModificationId == modificationlId)?.ModificationName;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }

            return "";
        }

        static public Models.Modification GetModificationById(int modificationId)
        {
            return getInstance().modifications.Find(x => x.ModificationId == modificationId);
        }
        static public bool CheckModificationById(int modificationId)
        {
            bool exist = getInstance().modifications.Exists(x => x.ModificationId == modificationId);

            return exist;
        }

        static public void UpdateCount(int modificationId, int number)
        {
            try
            {
                var modification = getInstance().modifications.Find(x => x.ModificationId == modificationId);
                if (modification != null) 
                    modification.CountParts = number;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }
        }
        static public void UpdateCarCount(int modificationId, int number)
        {
            try
            {
                var modification = getInstance().modifications.Find(x => x.ModificationId == modificationId);
                if (modification != null)
                    modification.CountCars += number;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }
        }

        static public void Refresh()
        {
            mut.WaitOne();

            if (modificationInstance_ != null)
                modificationInstance_.isCashLoaded = false;

            mut.ReleaseMutex();
        }

        static void ModificationUpd(Rado.Models.Modification modification)
        {
            try
            {
                string statement = "ModificationUpd";
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                    {
                        sqlConnection.Open();
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@modificationId", System.Data.SqlDbType.Int).Value = modification.ModificationId;
                        sqlCommand.Parameters.Add("@modificationName", System.Data.SqlDbType.NVarChar, 50).Value = modification.ModificationName;
                        sqlCommand.Parameters.Add("@modelId", System.Data.SqlDbType.Int).Value = modification.ModelId;
                        sqlCommand.Parameters.Add("@yearFrom", System.Data.SqlDbType.Int).Value = modification.YearFrom;
                        sqlCommand.Parameters.Add("@yearTo", System.Data.SqlDbType.Int).Value = modification.YearTo;
                        sqlCommand.Parameters.Add("@powerHP", System.Data.SqlDbType.Int).Value = modification.PowerHP;
                        sqlCommand.Parameters.Add("@engine", System.Data.SqlDbType.Int).Value = modification.Engine;
                        sqlCommand.Parameters.Add("@doors", System.Data.SqlDbType.Int).Value = modification.Doors;
                        sqlCommand.Parameters.Add("@kupe", System.Data.SqlDbType.Int).Value = modification.Kupe;

                        sqlCommand.ExecuteNonQuery();
                        sqlConnection.Close();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

        }


        static public void UpdatePartCount(int modificationId, int number)
        {
            try
            {
                var modification = getInstance().modifications.Find(x => x.ModificationId == modificationId);
                if (modification != null) 
                    modification.CountParts = number;
            }
            catch (Exception ex)
            {
                LoggerUtil.LogException(ex);
            }
        }

        //static public void UpdatePartCount()
        //{
        //    List<KeyValuePair<int, int>> modificationCountIds = new List<KeyValuePair<int, int>>();

        //    try
        //    {
        //        string statement = "SELECT * FROM ModificationPartCountView WITH(NOLOCK)";
        //        using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
        //        {
        //            using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
        //            {
        //                sqlConnection.Open();
        //                sqlCommand.CommandType = System.Data.CommandType.Text;
        //                using (SqlDataReader reader = sqlCommand.ExecuteReader())
        //                {
        //                    while (reader.Read())
        //                    {
        //                        int count = Convert.ToInt32(reader["Count"]);
        //                        int modificationId = Convert.ToInt32(reader["modificationId"]);
        //                        modificationCountIds.Add(new KeyValuePair<int, int>(modificationId, count));
        //                    }
        //                }
        //            }
        //        }
        //        foreach(var item in modificationCountIds)
        //        {
        //            var modification = GetModificationById(item.Key);
        //            modification.countParts = item.Value;
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e.Message);
        //    }

        //}

        //static public void UpdateCarCount()
        //{
        //    List<KeyValuePair<int, int>> modificationCountIds = new List<KeyValuePair<int, int>>();

        //    try
        //    {
        //        string statement = "SELECT * FROM ModificationCarCountView WITH(NOLOCK)";
        //        using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
        //        {
        //            using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
        //            {
        //                sqlConnection.Open();
        //                sqlCommand.CommandType = System.Data.CommandType.Text;
        //                using (SqlDataReader reader = sqlCommand.ExecuteReader())
        //                {
        //                    while (reader.Read())
        //                    {
        //                        int count = Convert.ToInt32(reader["Count"]);
        //                        int modificationId = Convert.ToInt32(reader["modificationId"]);
        //                        modificationCountIds.Add(new KeyValuePair<int, int>(modificationId, count));
        //                    }
        //                }
        //            }
        //        }
        //        foreach (var item in modificationCountIds)
        //        {
        //            var modification = GetModificationById(item.Key);
        //            modification.countCarBus= item.Value;
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e.Message);
        //    }

        //}

        static public void UpdateCounts(int modificationId, int number)
        {
            try
            {
                var model = getInstance().modifications.Find(x => x.ModificationId == modificationId);
                if (model != null) 
                    model.CountParts += number;
            }
            catch (Exception ex)
            {
                LoggerUtil.LogException(ex);
            }
        }

        static public void Init()
        {
            getInstance();
        }

        static private ModificationsDbSet getInstance()
        {
            if (modificationInstance_?.isCashLoaded == true)
                return modificationInstance_;

            mut.WaitOne();

            if (modificationInstance_?.isCashLoaded == true)
            {
                mut.ReleaseMutex();
                return modificationInstance_;
            }

            try
            {
                modificationInstance_ = new ModificationsDbSet();
                modificationInstance_.loadCash();
                modificationInstance_.isCashLoaded = true;
            }
            catch (Exception e)
            {
                modificationInstance_.isCashLoaded = false;
                modificationInstance_ = null;
                Console.WriteLine(e.Message);
            }

            mut.ReleaseMutex();

            return modificationInstance_;
        }

        internal static async Task<ModificationMin> GetModificationByName(int modelId, string name)
        {
            ModificationMin[] modificationMins = await GetModificationByModelIdAsync(modelId);
            ModificationMin modificationMin = modificationMins.First(_ => _.ModificationDisplayName == name);

            return modificationMin;
        }
    }
}
