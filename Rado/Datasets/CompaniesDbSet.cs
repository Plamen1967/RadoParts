using Microsoft.Data.SqlClient;
using Rado.Exceptions;
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
    public class CompaniesDbSet
    {
        private static Mutex mut = new Mutex();
        Company[] AllCompanies = null;
        Company[] BusCompanies = null;
        Company[] CarCompanies = null;

        static CompaniesDbSet companyInstance_ = null;
        bool isCashLoaded = false;
        CompaniesDbSet()
        {
        }

        public static async Task<Company[]> GetCompaniesByUserId(int userId)
        {
            var companies = await Numbers.GetCompaniesPerUser(userId);

            return companies.Where(company => company.bus == 0).ToArray();
        }
        public static async Task<Company[]> GetBusCompaniesByUserId(int userId)
        {
            var companies = await Numbers.GetCompaniesPerUser(userId);

            return companies.Where(company => company.bus == 1).ToArray();
        }

        void loadCash()
        {
            List<Company> companies = new List<Company>();
            List<Company> importantCompanies = new List<Company>();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("CompanyAll", connection))
                    {
                        connection.Open();
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            while (sqlDataReader.Read())
                            {
                                int important = Convert.ToInt32(sqlDataReader["important"]);

                                companies.Add(new Company()
                                {
                                    companyId = Convert.ToInt32(sqlDataReader["companyID"]),
                                    companyName = Convert.ToString(sqlDataReader["companyName"]),
                                    bus = Convert.ToInt32(sqlDataReader["bus"])
                                });

                                if (important != 0)
                                {
                                    importantCompanies.Add(new Company()
                                    {
                                        companyId = Convert.ToInt32(sqlDataReader["companyID"]),
                                        companyName = Convert.ToString(sqlDataReader["companyName"]),
                                        bus = Convert.ToInt32(sqlDataReader["bus"]),
                                        important = 1
                                    });
                                }
                            }
                        }

                        connection.Close();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }
            finally
            {
            }

            importantCompanies.Insert(0, new Company() { companyName = "Популярни", companyId = Program.DISIABLED });
            importantCompanies.Add(new Company() { companyName = "Всички", companyId = Program.DISIABLED });
            companies = importantCompanies.Concat(companies).ToList();

            AllCompanies = companies.ToArray();
            BusCompanies = companies.Where(company => company.bus == 1 || company.companyId == Program.DISIABLED).ToArray();
            CarCompanies = companies.Where(company => company.bus == 0).ToArray();
        }

        static public async Task<Company[]> GetAllCompanies()
        {
            try
            {
                Company[] companies = null;
                await Task.Run(() =>
                {
                    companies = getInstance().AllCompanies;
                });

                return companies;
            }
            catch
            {
                throw new AppException("Can not provide companies");
            }
        }

        static public async Task<Company[]> GetCarCompanies()
        {
            try
            {
                Company[] companies = null;
                await Task.Run(() =>
                {
                    companies = getInstance().CarCompanies;
                });

                return companies;
            }
            catch
            {
                throw new AppException("Can not provide car companies");
            }
        }


        static public async Task<Company[]> GetBusCompaniesAsync()
        {
            try
            {
                Company[] companies = null;
                await Task.Run(() =>
                {
                    companies = getInstance().BusCompanies;
                });

                return companies;
            }
            catch
            {
                throw new AppException("Can not provide bus companies");
            }
        }
        static public async Task<Company> GetCompanyByIdAsync(int companyId)
        {
            try
            {
                Company company = null;
                await Task.Run(() =>
                {
                    company = getCompanyById(companyId);
                });

                return company;
            }
            catch
            {
                throw new AppException($"Company {companyId} cannot be found");
            }
        }

        static public void UpdatePartCount(int companyId, int number)
        {
            try
                {
                    var companies = Array.FindAll(getInstance().AllCompanies, x => x.companyId == companyId);
                    foreach (var company in companies)
                    {
                        company.countParts += number;
                    }
                }
                catch
                {
                    throw new AppException($"Company {companyId} cannot be found");
                }
        }
        static public void UpdateCarCount(int companyId, int number)
        {
            try
            {
                var companies = Array.FindAll(getInstance().AllCompanies, x => x.companyId == companyId);
                foreach (var company in companies)
                {
                    company.countCars += number;
                }
            }
            catch
            {
                throw new AppException($"Company {companyId} cannot be found");
            }
        }


        static public void Refresh()
        {
            mut.WaitOne();

            if (companyInstance_ != null)
                companyInstance_.isCashLoaded = false;

            mut.ReleaseMutex();
        }

        static public Company getCompanyByName(string companyName)
        {
            Company company = Array.Find(getInstance().AllCompanies, x => x.companyName == companyName);
            return company;
        }
        static public Company getCompanyById(int companyId)
        {
            Company company = Array.Find(getInstance().AllCompanies, x => x.companyId == companyId);
            return company;
        }

        static public string GetCompanyNameById(int companyId)
        {
            Company company = Array.Find(getInstance().AllCompanies, x => x.companyId == companyId);
            return (company != null) ? company.companyName : "";
        }
        static public void Init()
        {
            getInstance();    
        }

        static private CompaniesDbSet getInstance()
        {
            if (companyInstance_?.isCashLoaded == true) 
                return companyInstance_;

            mut.WaitOne();

            if (companyInstance_?.isCashLoaded == true)
            {
                mut.ReleaseMutex();
                return companyInstance_;
            }

            try
            {
                Maintance.Init();

                companyInstance_ = new CompaniesDbSet();
                companyInstance_.loadCash();
                companyInstance_.isCashLoaded = true;
                Numbers.GetNumbersAsync().Wait();
            }
            catch (Exception e)
            {
                _ = Task.Run(async () =>
                {
                    await LoggerUtil.Log(e.Message);

                });
                companyInstance_.isCashLoaded = false;

                Console.WriteLine(e.Message);
                mut.ReleaseMutex();

                return companyInstance_;
            }

            mut.ReleaseMutex();

            return companyInstance_;
        }

        internal static Company[] getAllCompanies()
        {
            return getInstance().AllCompanies;
        }
        internal static void UpdateCumpanyCountParts()
        {
            foreach (var company in getAllCompanies())
            {
                //var models = ModelsDbSet.GetModelsByCompanyId(company.companyId).FindAll(item => item.groupModelId == item.modelId);
                //company.countParts = models.Sum(item => item.countParts); ;
                //company.countCarBus = models.Sum(item => item.countCarBus); ;
            }
        }
    }

    /*
     *         static public async string GetCompanyNameById(int companyId)
        {
            Company company = getInstance().companies.Find(x => x.companyId == companyId);
            return (company != null) ? company.companyName : "";
        }

    */
}
