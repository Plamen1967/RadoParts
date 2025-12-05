using Microsoft.Data.SqlClient;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Rado.Datasets
{
    public class DealerSubCategoryDbSet
    {
        private static Mutex mut = new Mutex();
        private readonly List<DealerSubCategory> dealerSubCategories = new List<DealerSubCategory>();
        static DealerSubCategoryDbSet dealerSubCategoriesInstance = null;
        bool isCashLoaded = false;
        DealerSubCategoryDbSet()
        {
        }

        void loadCash()
        {
            dealerSubCategories.Clear();
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    using(SqlCommand sqlCommand = new SqlCommand("DealerSubCategoryAll", connection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        using(SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            while(sqlDataReader.Read())
                            {
                                dealerSubCategories.Add(new DealerSubCategory()
                                {
                                    dealerSubCategoryId = Convert.ToInt32(sqlDataReader["dealerSubCategoryId"]),
                                    subCategoryId = Convert.ToInt32(sqlDataReader["subCategoryId"]),
                                    dealerSubCategoryName = Convert.ToString(sqlDataReader["dealerSubCategoryName"]),
                                    categoryId = Convert.ToInt32(sqlDataReader["categoryId"])

                                });
                            }
                        }
                    }
                }
            }
            catch( Exception exception)
            {
                throw new AppException(exception.Message);
            }
        }

        static public DealerSubCategory[] GetDealerSubCategories()
        {
            return getInstance().dealerSubCategories.ToArray();
        }
        static public DealerSubCategory GetDealerSubCategoryById(int dealerSubCategoryId)
        {
            return getInstance().dealerSubCategories.Find(x => x.dealerSubCategoryId == dealerSubCategoryId);
        }
        static public DealerSubCategory[] GetDealerSubCategoriesPerSubCategory(int subCategoryid)
        {
            return getInstance().dealerSubCategories.FindAll(x => x.subCategoryId == subCategoryid).ToArray();
        }
        static public DealerSubCategory[] GetDealerSubCategoriesPerCategory(int categoryid)
        {
            return getInstance().dealerSubCategories.FindAll(x => x.categoryId == categoryid).ToArray();
        }
        static public int GetCategoryId(int? dealerSubCategoryId)
        {
            if (dealerSubCategoryId == null) return 0;

            DealerSubCategory dealerSubCategory = getInstance().dealerSubCategories.Find(x => x.dealerSubCategoryId == dealerSubCategoryId);
            return dealerSubCategory != null ? dealerSubCategory.subCategoryId : 0;
        }

        static public void Refresh()
        {
            mut.WaitOne();

            if (dealerSubCategoriesInstance != null)
                dealerSubCategoriesInstance.isCashLoaded = false;

            mut.ReleaseMutex();
        }

        static DealerSubCategoryDbSet getInstance()
        {
            if (dealerSubCategoriesInstance?.isCashLoaded == true)
                return dealerSubCategoriesInstance;

            mut.WaitOne();

            if (dealerSubCategoriesInstance?.isCashLoaded == true)
            {
                mut.ReleaseMutex();
                return dealerSubCategoriesInstance;
            }

            try
            {
                dealerSubCategoriesInstance = new DealerSubCategoryDbSet();
                dealerSubCategoriesInstance.loadCash();
                dealerSubCategoriesInstance.isCashLoaded = true;
            }
            catch (Exception e)
            {
                dealerSubCategoriesInstance.isCashLoaded = false;
                dealerSubCategoriesInstance = null;
                Console.WriteLine(e.Message);
            }

            mut.ReleaseMutex();

            return dealerSubCategoriesInstance;
        }

    }
}
