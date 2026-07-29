using Microsoft.Data.SqlClient;
using Rado.Models;
using Rado.Enrich;
using Rado.Exceptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class ModelsDbSet
    {
        private static Mutex mut = new Mutex();
        private readonly List<Model> models = new List<Model>();
        private List<Model> allModels = new List<Model>();
        private List<Model> groupModels = new List<Model>();

        private static ModelsDbSet modelsInstance_ = null;
        bool isCashLoaded = false;

        private ModelsDbSet()
        {
        }

        private void resetCash()
        {
            isCashLoaded = false;
            models.Clear();
        }

        static public Model UpdateModel(Model model)
        {
            Model model_ = new Model();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SELECT * FROM Companies ORDER BY companyName", connection))
                    {
                        connection.Open();
                    }
                    connection.Close();
                }
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }

            return model_;
        }

        public static bool isGroupModel(int modelId)
        {
            var found = getInstance().groupModels.Find(element => element.ModelId == modelId);
            if (found == null)
                return false;
            return true;
        }
        private void getGroupModels()
        {
            string storedProcedure = "GroupModelAll";

            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                    {
                        connection.Open();
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            while (sqlDataReader.Read())
                            {
                                groupModels.Add(new Model
                                {
                                    GroupModelId = Convert.ToInt32(sqlDataReader["groupModelId"]),
                                    CompanyId = Convert.ToInt32(sqlDataReader["companyID"]),
                                    ModelName = Convert.ToString(sqlDataReader["groupModelName"]),
                                    DisplayModelName = Convert.ToString(sqlDataReader["groupModelName"]),
                                    YearFrom = 0,
                                    YearTo = 0,
                                    ModelId = Convert.ToInt32(sqlDataReader["groupModelId"])
                                });
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


        private void loadCash() 
        {
            // ModelUpdate.StoreInDB();
            getGroupModels();
            List<Model> tempSearch = groupModels; 
            allModels = new List<Model>();
            string storedProcedure = "ModelAll";
            try
            {
                using(SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    using(SqlCommand command = new SqlCommand(storedProcedure, connection))
                    {
                        connection.Open();
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            while(sqlDataReader.Read())
                            {

                                Model model = new Models.Model()
                                {
                                    ModelId = Convert.ToInt32(sqlDataReader["modelID"]),
                                    CompanyId = Convert.ToInt32(sqlDataReader["companyID"]),
                                    ModelName = Convert.ToString(sqlDataReader["modelName"]),
                                    YearFrom = Convert.ToInt32(sqlDataReader["yearFrom"]),
                                    YearTo = Convert.ToInt32(sqlDataReader["yearTo"]),
                                    GroupModelId = Convert.ToInt32(sqlDataReader["groupModelId"]),
                                };

                                EnrichManager.EnrichModel(model);
                                allModels.Add(model);
                            }
                        }
                    }
                }


                foreach(var model in tempSearch)
                {
                    models.Add(model);
                    List<Model> modelList = allModels.FindAll(modelTemp => modelTemp.GroupModelId == model.GroupModelId);
                    foreach (var temp2 in modelList)
                        models.Add(temp2);
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

        static async public Task<bool> AddModelAsync(int companyId, string model)
        {
            if (CompaniesDbSet.GetCompanyByIdAsync(companyId) == null)
                return false;
            
            try
            {
                using(SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    await sqlConnection.OpenAsync();
                    using (SqlCommand sqlCommand = new SqlCommand("ModelIns", sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        sqlCommand.Parameters.Add("@companyId", SqlDbType.Int).Value = companyId;
                        sqlCommand.Parameters.Add("@model", SqlDbType.NVarChar).Value = model;

                        int rows = await sqlCommand.ExecuteNonQueryAsync();
                        if (rows != 1)
                            return false;
                    }
                }
            } 
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
            return true;
        }

        //static public async Task<Rado.ModelMin[]> GetModelsAsync()
        //{
        //    List<Rado.ModelMin> modelMins = null;
        //    await Task.Run(() =>
        //    {
        //        Model[] models = getInstance().models.ToArray();
        //        modelMins = new List<Rado.ModelMin>();
        //        foreach (var model in models)
        //        {
        //            modelMins.Add(model.GetModelMin());
        //        }
        //    });

        //    return modelMins.ToArray();
        //}
        static public Model[] GetModels()
        {
            return getInstance().models.ToArray();
        }
        static public async Task<Model[]> GetModelsAsync()
        {
            Model[] models = null;
            await Task.Run(() =>
            {
                models = getInstance().models.ToArray();
            });

            return models;
        }
        static public async Task<ModelMin[]> GetModelsByCompanyIdAsync(int companyId)
        {
            List<ModelMin> modelMins = null;
            await Task.Run(() =>
            {
                List<Model> list = getInstance().models.FindAll(x => x.CompanyId == companyId);
                if (list.Count == 0)
                    list = getInstance().allModels.FindAll(x => x.CompanyId == companyId);

                modelMins = new List<ModelMin>();
                foreach (var model in list) {
                    modelMins.Add(model.GetModelMin());
                }
                
            });
            return modelMins.ToArray();
        }

        static public List<Model> GetModelsByCompanyId(int companyId)
        {
            List<Model> models = null;
            try
            {
            models = getInstance().models.FindAll(x => x.CompanyId == companyId);
                if (models.Count == 0)
                    models = getInstance().allModels.FindAll(x => x.CompanyId == companyId);

            }
            catch(Exception ex)
            {
              LoggerUtil.LogException(ex);
            }

      return models;
        }

        static async public Task<Model> GetModelByIdAsync(int modelId)
        {
            if (modelId == 0)
                return null;

            Model model = null;

            await Task.Run(() =>
            {
                model = getInstance().allModels.Find(x => x.ModelId == modelId);
            });

            return model;
        }
        static public bool CheckModelById(int modelId)
        {
            if (modelId == 0)
                return false;

            bool exist = getInstance().allModels.Exists(x => x.ModelId == modelId);

            return exist;
        }
        static public void UpdatePartCount(int modelId, int number)
        {
            try
            {
                var model = getInstance().allModels.Find(x => x.ModelId == modelId);
                if (model != null) 
                    model.CountParts = number;
            }
            catch(Exception ex)
            {
                LoggerUtil.LogException(ex);
            }
        }
        static public void UpdateCarCount(int modelId, int number)
        {
            try
            {
                var model = getInstance().allModels.Find(x => x.ModelId == modelId);
                if (model != null)
                    model.CountCars = number;
            }
            catch (Exception ex)
            {
                LoggerUtil.LogException(ex);
            }
        }

        static public async Task<ModelMin> GetModelMinByIdAsync(int modelId)
        {
            ModelMin modelMin = null;

            if (modelId == 0)
                return null;
            await Task.Run(() =>
            {
                Model model = getInstance().allModels.Find(x => x.ModelId == modelId);
                modelMin = model.GetModelMin();
            });

            return modelMin;

        }
        public static string GetModelNameById(int modelId)
        {
            if (modelId == 0)
                return "";

            Model model = getInstance().allModels.Find(x => x.ModelId == modelId);

            return (model != null) ? model.ModelName : "";

        }
        public static void Refresh()
        {
            mut.WaitOne();

            if (modelsInstance_ != null)
                modelsInstance_.isCashLoaded = false;

            mut.ReleaseMutex();
        }

        static public void Init()
        {
            getInstance();
        }

        static private ModelsDbSet getInstance()
        {
            if (modelsInstance_?.isCashLoaded == true)
                return modelsInstance_;

            mut.WaitOne();

            if (modelsInstance_?.isCashLoaded == true)
            {
                mut.ReleaseMutex();
                return modelsInstance_;
            }

            try
            {
                modelsInstance_ = new ModelsDbSet();
                modelsInstance_.loadCash();
                modelsInstance_.isCashLoaded = true;
            }
            catch (Exception e)
            {
                modelsInstance_.isCashLoaded = false;
                modelsInstance_ = null;
                Console.Write(e.Message);
            }

            mut.ReleaseMutex();

            return modelsInstance_;
        }

        internal static void UpdateModelCountParts()
        {
            foreach(var model in GetModels())
            {
                var modifications = ModificationsDbSet.GetModificationByModelId(model.ModelId);
                int countParts = modifications.Sum(item => item.CountParts);
                int countCarBus = modifications.Sum(item => item.CountCarBus);
                model.CountParts = countParts;
                model.CountCarBus = countCarBus;
            }

            foreach (var groupmodel in getInstance().groupModels)
            {
                var models = getInstance().models.FindAll(item => item.GroupModelId == groupmodel.ModelId);
                groupmodel.CountParts = models.Sum(item => item.CountParts);
                groupmodel.CountCarBus = models.Sum(item => item.CountCarBus);
            }

            CompaniesDbSet.UpdateCumpanyCountParts();
        }

        internal static async Task<ModelMin> GetModelByName(int companyId, string name)
        {
            ModelMin[] modelMins = await GetModelsByCompanyIdAsync(companyId);
            ModelMin model = modelMins.First(_ => _.displayModelName == name);

            return model;
            
        }
    }
}
