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
        private static readonly Mutex _mutex = new Mutex();
        private readonly List<Category> _categories = new List<Category>();
        private static CategoriesDbSet _categoriesInstance = null;
        private bool _isCashLoaded;

        private CategoriesDbSet()
        {
        }

        public static async Task<Category[]> GetCategoriesAsync()
        {
            Category[] categories = null;
            await Task.Run(() =>
            {
                try
                {
                    categories = GetInstance()._categories.ToArray();
                }
                catch (Exception exception)
                {
                  LoggerUtil.LogException(exception.Message);
                }
            });

            return categories;
        }
        public static Category[] GetCategories()
        {
            Category[] categories = null;
            try
            {
                categories = GetInstance()._categories.ToArray();
            }
            catch (Exception exception)
            {
              LoggerUtil.LogException(exception.Message);
            }

            return categories;
        }

        public static async Task<Category> GetCategoryByIdAsync(int categoryId)
        {
            Category category = null;
            await Task.Run(() =>
            {
                category = GetInstance()._categories.Find(x => x.categoryId == categoryId);
            });

            return category;
        }

        public static Category GetCategoryById(int categoryId)
        {
            Category category = GetInstance()._categories.Find(x => x.categoryId == categoryId);

            return category;
        }

        public static string GetCategoryNameById(int categoryId)
        {
            Category category = GetInstance()._categories.Find(x => x.categoryId == categoryId);

            return category.categoryName;
        }

        private void updateOnceOff()
        {
            string sqlCommandText = $@"
            update Categories SET CategoryName = 'МОТОРЧЕТА, МАШИНКИ И МЕХАН.' where categoryid = 12
            update Categories SET CategoryName = 'ОХЛАДИТЕЛНА И КЛИМАТИЧНА С-МА' where categoryid = 14
            update Categories SET CategoryName = 'АУДИО, ВИДЕО, НАВИГАЦИИ и ДР.' where categoryid = 1";

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand(sqlCommandText, sqlConnection))
                    {
                        sqlConnection.Open();

                        sqlCommand.CommandType = CommandType.Text;

                        sqlCommand.ExecuteNonQuery();

                    }
                }
            }
            catch (Exception ex)
            {
                LoggerUtil.LogException(ex);
            }
        }

        private void LoadCash()
        {
            updateOnceOff();
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
                                _categories.Add(new Category()
                                {
                                    categoryId = Convert.ToInt32(sqlDataReader["categoryId"]),
                                    categoryName = Convert.ToString(sqlDataReader["categoryName"]) ?? "",
                                    imageName = Convert.ToString(sqlDataReader["imageName"]) ?? ""
                                });
                            }
                        }
                        sqlConnection.Close();
                    }
                }

                _categories.Sort(Compare);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
            }
            finally
            {
            }
        }

        private static int Compare(Category x, Category y)
        {
            if (x.categoryName.ToLower() == "други") return 1;
            if (y.categoryName.ToLower() == "други") return -1;
            return String.Compare(x.categoryName, y.categoryName, StringComparison.Ordinal);
        }

        public static void Refresh()
        {
            _mutex.WaitOne();

            if (_categoriesInstance != null)
                _categoriesInstance._isCashLoaded = false;

            _mutex.ReleaseMutex();
        }

        private static CategoriesDbSet GetInstance()
        {
            if (_categoriesInstance?._isCashLoaded == true)
                return _categoriesInstance;

            _mutex.WaitOne();

            if (_categoriesInstance?._isCashLoaded == true)
            {
                _mutex.ReleaseMutex();
                return _categoriesInstance;
            }

            try
            {
                _categoriesInstance = new CategoriesDbSet();
                _categoriesInstance.LoadCash();
                _categoriesInstance._isCashLoaded = true;
            }
            catch (Exception e)
            {
                _categoriesInstance = null;

                Console.WriteLine(e.Message);
            }

            _mutex.ReleaseMutex();

            return _categoriesInstance;
        }
    }
}
