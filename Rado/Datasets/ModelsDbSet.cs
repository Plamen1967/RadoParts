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
            var found = getInstance().groupModels.Find(element => element.modelId == modelId);
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
                                    groupModelId = Convert.ToInt32(sqlDataReader["groupModelId"]),
                                    companyId = Convert.ToInt32(sqlDataReader["companyID"]),
                                    modelName = Convert.ToString(sqlDataReader["groupModelName"]),
                                    displayModelName = Convert.ToString(sqlDataReader["groupModelName"]),
                                    yearFrom = 0, 
                                    yearTo = 0,
                                    modelId = Convert.ToInt32(sqlDataReader["groupModelId"])
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
                                    modelId = Convert.ToInt32(sqlDataReader["modelID"]),
                                    companyId = Convert.ToInt32(sqlDataReader["companyID"]),
                                    modelName = Convert.ToString(sqlDataReader["modelName"]),
                                    yearFrom = Convert.ToInt32(sqlDataReader["yearFrom"]),
                                    yearTo = Convert.ToInt32(sqlDataReader["yearTo"]),
                                    groupModelId = Convert.ToInt32(sqlDataReader["groupModelId"]),
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
                    List<Model> modelList = allModels.FindAll(modelTemp => modelTemp.groupModelId == model.groupModelId);
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
                List<Model> list = getInstance().models.FindAll(x => x.companyId == companyId);
                if (list.Count == 0)
                    list = getInstance().allModels.FindAll(x => x.companyId == companyId);

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
            models = getInstance().models.FindAll(x => x.companyId == companyId);
                if (models.Count == 0)
                    models = getInstance().allModels.FindAll(x => x.companyId == companyId);

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
                model = getInstance().allModels.Find(x => x.modelId == modelId);
            });

            return model;
        }
        static public bool CheckModelById(int modelId)
        {
            if (modelId == 0)
                return false;

            bool exist = getInstance().allModels.Exists(x => x.modelId == modelId);

            return exist;
        }
        static public void UpdatePartCount(int modelId, int number)
        {
            try
            {
                var model = getInstance().allModels.Find(x => x.modelId == modelId);
                if (model != null) 
                    model.countParts = number;
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
                var model = getInstance().allModels.Find(x => x.modelId == modelId);
                if (model != null)
                    model.countCars = number;
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
                Model model = getInstance().allModels.Find(x => x.modelId == modelId);
                modelMin = model.GetModelMin();
            });

            return modelMin;

        }
        static public string GetModelNameById(int modelId)
        {
            if (modelId == 0)
                return "";

            Model model = getInstance().allModels.Find(x => x.modelId == modelId);

            return (model != null) ? model.modelName : "";

        }
        static public void Refresh()
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
                var modifications = ModificationsDbSet.GetModificationByModelId(model.modelId);
                int countParts = modifications.Sum(item => item.countParts);
                int countCarBus = modifications.Sum(item => item.countCarBus);
                model.countParts = countParts;
                model.countCarBus = countCarBus;
            }

            foreach (var groupmodel in getInstance().groupModels)
            {
                var models = getInstance().models.FindAll(item => item.groupModelId == groupmodel.modelId);
                groupmodel.countParts = models.Sum(item => item.countParts);
                groupmodel.countCarBus = models.Sum(item => item.countCarBus);
            }

            CompaniesDbSet.UpdateCumpanyCountParts();
        }
    }
}
