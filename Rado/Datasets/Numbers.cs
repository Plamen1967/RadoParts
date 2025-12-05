using Microsoft.Data.SqlClient;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    static public class Numbers
    {
        public static async Task<CountStats> GetPartNumbers(int userId = 0)
        {
            CountStats countStats = new CountStats();
            string storedProcedure = "NumberParts";
            using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (userId != 0)
                    {
                        command.Parameters.Add("@userId", SqlDbType.BigInt).Value = userId;

                    }
                    await command.ExecuteNonQueryAsync();

                    using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                    {
                        while (await sqlDataReader.ReadAsync())
                        {
                            int number = Convert.ToInt32(sqlDataReader["number"]);
                            int companyId = Convert.ToInt32(sqlDataReader["companyId"]);
                            int groupModelId = Convert.ToInt32(sqlDataReader["groupModelId"]);
                            int modelId = Convert.ToInt32(sqlDataReader["modelId"]);
                            int modificationId = Convert.ToInt32(sqlDataReader["modificationId"]);

                            if (companyId != 0)
                            {
                                if (!countStats.companyNumber.ContainsKey(companyId))
                                    countStats.companyNumber.Add(companyId, number);
                                else
                                    countStats.companyNumber[companyId] += number;
                            }

                            if (groupModelId != 0)
                            {
                                if (!countStats.groupModelNumber.ContainsKey(groupModelId))
                                    countStats.groupModelNumber.Add(groupModelId, number);
                                else
                                    countStats.groupModelNumber[groupModelId] += number;
                            }

                            if (modelId != 0)
                            {
                                if (!countStats.modelNumber.ContainsKey(modelId))
                                    countStats.modelNumber.Add(modelId, number);
                                else
                                    countStats.modelNumber[modelId] += number;
                            }

                            if (modificationId != 0)
                            {
                                if (!countStats.modificationNumber.ContainsKey(modificationId))
                                    countStats.modificationNumber.Add(modificationId, number);
                                else
                                    countStats.modificationNumber[modificationId] += number;
                            }
                        }

                    }

                }
                await connection.CloseAsync();
            }

            return countStats;
        }
        public static async Task<CountStats> GetCarNumbers(int userId = 0)
        {
            CountStats countStats = new CountStats();
            string storedProcedure = "NumberCars";
            using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (userId != 0)
                    {
                        command.Parameters.Add("@userId", SqlDbType.BigInt).Value = userId;

                    }
                    await command.ExecuteNonQueryAsync();

                    using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                    {
                        while (await sqlDataReader.ReadAsync())
                        {

                            {
                                int number = Convert.ToInt32(sqlDataReader["number"]);
                                int companyId = Convert.ToInt32(sqlDataReader["companyId"]);
                                int modelId = Convert.ToInt32(sqlDataReader["modelId"]);
                                int modificationId = Convert.ToInt32(sqlDataReader["modificationId"]);

                                if (companyId != 0)
                                {
                                    if (!countStats.companyNumber.ContainsKey(companyId))
                                        countStats.companyNumber.Add(companyId, number);
                                    else
                                        countStats.companyNumber[companyId] += number;
                                }

                                if (modelId != 0)
                                {
                                    if (!countStats.modelNumber.ContainsKey(modelId))
                                        countStats.modelNumber.Add(modelId, number);
                                    else
                                        countStats.modelNumber[modelId] += number;
                                }

                                if (modificationId != 0)
                                {
                                    if (!countStats.modificationNumber.ContainsKey(modificationId))
                                        countStats.modificationNumber.Add(modificationId, number);
                                    else
                                        countStats.modificationNumber[modificationId] += number;

                                }
                            }
                        }
                    }

                }
                await connection.CloseAsync();
            }

            return countStats;
        }

        public static async Task<List<Company>> GetCompaniesPerUser(int userId)
        {
            try
            {
                CountStats countStats = await GetPartNumbers(userId);
                CountStats carCountStats = await GetCarNumbers(userId);

                Company[] companies = await CompaniesDbSet.GetAllCompanies();
                List<Company> companies1 = companies.ToList();
                foreach (var company in companies1) 
                    company.countCars = company.countParts = 0;

                foreach (var companyNum in countStats.companyNumber)
                {
                    var foundCompanies = companies1.Where(company => company.companyId == companyNum.Key);
                    foreach (var company in foundCompanies)
                    {
                        company.countParts += companyNum.Value;
                    }
                }

                foreach (var companyNum in carCountStats.companyNumber)
                {
                    var foundCompanies = companies1.Where(company => company.companyId == companyNum.Key);
                    foreach (var company in foundCompanies)
                    {
                        company.countCars += companyNum.Value;
                    }
                }
                return companies1;
            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
            }

            return [];
        }
        public static async Task<ModelMin[]> GetModelsPerUser(int userId, int companyId)
        {
            try
            {
                CountStats countStats = await GetPartNumbers(userId);
                CountStats carCountStats = await GetCarNumbers(userId);

                ModelMin[] models = await ModelsDbSet.GetModelsByCompanyIdAsync(companyId);
                List<ModelMin> models1 = models.ToList();
                foreach (var model in models1)
                    model.countCars = model.countParts = 0;

                foreach (var modelNum in countStats.modelNumber)
                {
                    var foundModels = models1.Where(model => model.modelId == modelNum.Key);
                    foreach (var model in foundModels)
                    {
                        model.countParts += modelNum.Value;
                    }
                }

                foreach (var modelNum in carCountStats.modelNumber)
                {
                    var foundModels = models1.Where(model => model.modelId == modelNum.Key);
                    foreach (var model in foundModels)
                    {
                        model.countCars += modelNum.Value;
                    }
                }
                return models1.ToArray();
            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
            }

            return [];
        }
        public static async Task<ModificationMin[]> GetModificationsPerUserAsync(int userId, string modelId)
        {
            try
            {
                CountStats countStats = await GetPartNumbers(userId);
                CountStats carCountStats = await GetCarNumbers(userId);

                ModificationMin[] modifications = await ModificationsDbSet.GetModificationByModelsIdAsync(modelId);
                List<ModificationMin> modifications1 = modifications.ToList();
                foreach (var modification in modifications1)
                    modification.countCars = modification.countParts = 0;

                foreach (var modificationNum in countStats.modificationNumber)
                {
                    var foundModifications = modifications.Where(modification => modification.modificationId == modificationNum.Key);
                    foreach (var modification in foundModifications)
                    {
                        modification.countParts += modificationNum.Value;
                    }
                }

                foreach (var modificationNum in carCountStats.modificationNumber)
                {
                    var foundModifications = modifications.Where(modification => modification.modificationId == modificationNum.Key);
                    foreach (var modification in foundModifications)
                    {
                        modification.countCars += modificationNum.Value;
                    }
                }

                return modifications1.ToArray();
            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
            }

            return [];
        }

        public static async Task GetNumbersAsync(int userId = 0)
        {
            try
            {
                CountStats countStats = await GetPartNumbers(userId);
                CountStats carCountStats = await GetCarNumbers(userId);

                foreach (var companyNum in countStats.companyNumber)
                {
                    CompaniesDbSet.UpdatePartCount(companyNum.Key, companyNum.Value);
                }

                foreach (var modelNum in countStats.modelNumber)
                {
                    ModelsDbSet.UpdatePartCount(modelNum.Key, modelNum.Value);
                }

                foreach(var modificationNum in countStats.modificationNumber)
                {
                    ModificationsDbSet.UpdatePartCount(modificationNum.Key, modificationNum.Value);
                }

                foreach (var companyNum in carCountStats.companyNumber)
                {
                    CompaniesDbSet.UpdateCarCount(companyNum.Key, companyNum.Value);
                }

                foreach (var modelNum in carCountStats.modelNumber)
                {
                    ModelsDbSet.UpdateCarCount(modelNum.Key, modelNum.Value);
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }

        }
        //public static async Task GetCarNumberAsync()
        //{
        //    try
        //    {
        //        Dictionary<int, int> companyNumber = new();
        //        Dictionary<int, int> modelNumber = new();
        //        Dictionary<long, int> groupModelNumber = new();
        //        Dictionary<int, int> modificationNumber = new();
        //        Dictionary<long, int> userNumber = new();

        //        string storedProcedure = "NumberCarParts";
        //        using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
        //        {
        //            await connection.OpenAsync();
        //            using (SqlCommand command = new SqlCommand(storedProcedure, connection))
        //            {
        //                command.CommandType = CommandType.StoredProcedure;
        //                await command.ExecuteNonQueryAsync();

        //                using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
        //                {
        //                    while (await sqlDataReader.ReadAsync())
        //                    {
        //                        int number = Convert.ToInt32(sqlDataReader["number"]);
        //                        int companyId = Convert.ToInt32(sqlDataReader["companyId"]);
        //                        int modelId = Convert.ToInt32(sqlDataReader["modelId"]);

        //                        if (companyId != 0)
        //                        {
        //                            if (!companyNumber.ContainsKey(companyId))
        //                                companyNumber.Add(companyId, number);
        //                            else
        //                                companyNumber[companyId] += number;
        //                        }

        //                        if (modelId != 0)
        //                        {
        //                            if (!modelNumber.ContainsKey(modelId))
        //                                modelNumber.Add(modelId, number);
        //                            else
        //                                modelNumber[modelId] += number;
        //                        }

        //                    }

        //                }

        //            }
        //            await connection.CloseAsync();
        //        }
        //        return 
        //    }
        //    catch (Exception exception)
        //    {
        //        LoggerUtil.LogException(exception);
        //    }

        //}
    }
}
