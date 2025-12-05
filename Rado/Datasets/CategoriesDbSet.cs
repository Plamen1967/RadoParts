using Microsoft.Data.SqlClient;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Utility;

namespace Rado.Datasets
{
    public class CategoriesDbSet
    {
        private static Mutex mut = new Mutex();
        private List<Category> categories = new List<Category>();
        static private CategoriesDbSet categoriesInstance_ = null;
        bool isCashLoaded = false;
        private CategoriesDbSet()
        {
        }

        static public async Task<Category[]> GetCategoriesAsync()
        {
            Category[] categories = null;
            await Task.Run(() =>
            {
                try
                {
                    categories = getInstance().categories.ToArray();
                }
                catch (Exception exception)
                {
                  LoggerUtil.LogException(exception.Message);
                }
            });

            return categories;
        }
        static public Category[] GetCategories()
        {
            Category[] categories = null;
            try
            {
                categories = getInstance().categories.ToArray();
            }
            catch (Exception exception)
            {
              LoggerUtil.LogException(exception.Message);
            }

      return categories;
        }

        static public async Task<Category> GetCategoryByIdAsync(int categoryId)
        {
            Category category = null;
            await Task.Run(() =>
            {
                category = getInstance().categories.Find(x => x.categoryId == categoryId);
            });

            return category;
        }

        static public Category GetCategoryById(int categoryId)
        {
            Category category = getInstance().categories.Find(x => x.categoryId == categoryId);

            return category;
        }

        static public string GetCategoryNameById(int categoryId)
        {
            Category category = getInstance().categories.Find(x => x.categoryId == categoryId);

            return category.categoryName;
        }


        void loadCash()
        {
            try
            {
                using(SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using(SqlCommand sqlCommand = new SqlCommand("CategoryAll", sqlConnection))
                    {
                        sqlConnection.Open();

                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            while(sqlDataReader.Read())
                            {
                                categories.Add(new Category()
                                {
                                    categoryId = Convert.ToInt32(sqlDataReader["categoryId"]),
                                    categoryName = Convert.ToString(sqlDataReader["categoryName"]),
                                    imageName = Convert.ToString(sqlDataReader["imageName"])
                                });
                            }
                        }
                        sqlConnection.Close();
                    }
                }

                categories.Sort(compare);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
            }
            finally
            {
            }
        }

        static private int compare(Category x, Category y)
        {
            if (x.categoryName.ToLower() == "други") return 1;
            if (y.categoryName.ToLower() == "други") return -1;
            return x.categoryName.CompareTo(y.categoryName);
        }

        static public void Refresh()
        {
            mut.WaitOne();

            if (categoriesInstance_ != null)
                categoriesInstance_.isCashLoaded = false;

            mut.ReleaseMutex();
        }
        static private CategoriesDbSet getInstance()
        {
            if (categoriesInstance_?.isCashLoaded == true)
                return categoriesInstance_;

            mut.WaitOne();

            if (categoriesInstance_?.isCashLoaded == true)
            {
                mut.ReleaseMutex();
                return categoriesInstance_;
            }

            try
            {
                categoriesInstance_ = new CategoriesDbSet();
                categoriesInstance_.loadCash();
                categoriesInstance_.isCashLoaded = true;
            }
            catch (Exception e)
            {
                categoriesInstance_.isCashLoaded = false;
                categoriesInstance_ = null;

                Console.WriteLine(e.Message);
            }

            mut.ReleaseMutex();

            return categoriesInstance_;
        }
    }
}
