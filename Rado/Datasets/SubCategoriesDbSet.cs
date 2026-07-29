using Microsoft.Data.SqlClient;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Rado.Datasets
{
    public class SubCategoriesDbSet
    {
        private static Mutex mut = new Mutex();
        List<SubCategory> subCategories = new List<SubCategory>();
        static SubCategoriesDbSet subCategoriesInstance = null;
        bool isCashLoaded = false;
        SubCategoriesDbSet()
        {
        }

        void loadCash()
        {
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("SubCategoryAll", sqlConnection))
                    {
                        sqlConnection.Open();

                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {
                            while (sqlDataReader.Read())
                            {
                                while (sqlDataReader.Read())
                                {
                                    subCategories.Add(new SubCategory()
                                    {
                                        SubCategoryId = Convert.ToInt32(sqlDataReader["subCategoryId"]),
                                        CategoryId = Convert.ToInt32(sqlDataReader["categoryId"]),
                                        SubCategoryName = Convert.ToString(sqlDataReader["subCategoryName"])
                                    });
                                }
                            }
                            sqlConnection.Close();
                        }
                    }
                }

                subCategories.Sort(compare);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
            }
        }

        static private int compare(SubCategory x, SubCategory y)
        {
            if (x.SubCategoryName.ToLower() == "други") return 1;
            if (y.SubCategoryName.ToLower() == "други") return -1;
            return String.Compare(x.SubCategoryName, y.SubCategoryName, StringComparison.Ordinal);
        }


        static public async Task<SubCategory[]> GetSubCategoriesAsync()
        {
            SubCategory[] subCategories = null;

            await Task.Run(() =>
            {
                try
                {
                    subCategories = getInstance().subCategories.ToArray();
                }
                catch (Exception e)
                {
                    System.Console.WriteLine(e.ToString());
                }
            });

            return subCategories;
        }
        static public async Task<SubCategory[]> GetSubCategoriesAsync(int categoryid)
        {
            SubCategory[] subCategories = null;

            await Task.Run(() =>
            {
                try
                {
                    subCategories = getInstance().subCategories.FindAll(x => x.CategoryId == categoryid).ToArray();
                }
                catch (Exception e)
                {
                    System.Console.WriteLine(e.ToString());
                }

            });
            return subCategories;
        }

        static public SubCategory[] GetSubCategories(int categoryid)
        {
            return getInstance().subCategories.FindAll(x => x.CategoryId == categoryid).ToArray();
        }

        static public Task<SubCategory[]> GetSubCategoriesByCategoriesId(string categoriesId)
        {
            List< SubCategory> subCategories = new List< SubCategory >();
            if (categoriesId != null)
            {
                var ids = categoriesId.Split(',');
                foreach (String modelId in ids)
                {
                    int id = Int32.Parse(modelId);

                    subCategories.AddRange(getInstance().subCategories.FindAll(x => x.CategoryId == id));
                }
            }

            return Task.FromResult(subCategories.ToArray());
        }

        static public List<int> GetSubCategoriesIds(int categoryid)
        {
            List<SubCategory> subCategories = getInstance().subCategories.FindAll(x => x.CategoryId == categoryid);
            return subCategories.ConvertAll(x => x.SubCategoryId);
        }

        static public SubCategory GetSubCategoryById(int subCategoryId)
        {
            return getInstance().subCategories.Find(x => x.SubCategoryId == subCategoryId);
        }
        static public string GetSubCategoryNameById(int subCategoryId)
        {
            return getInstance().subCategories.Find(x => x.SubCategoryId == subCategoryId).SubCategoryName;
        }

        static public int GetCategoryId(int? subCategoryId)
        {
            if (subCategoryId == null) return 0;

            SubCategory subCategory = getInstance().subCategories.Find(x => x.SubCategoryId == subCategoryId);
            return subCategory != null ? subCategory.CategoryId : 0;
        }

        static public void Refresh()
        {
            mut.WaitOne();

            if (subCategoriesInstance != null)
                subCategoriesInstance.isCashLoaded = false;

            mut.ReleaseMutex();
        }

        static SubCategoriesDbSet getInstance()
        {
            if (subCategoriesInstance?.isCashLoaded == true)
                return subCategoriesInstance;

            mut.WaitOne();

            if (subCategoriesInstance?.isCashLoaded == true)
            {
                mut.ReleaseMutex();
                return subCategoriesInstance;
            }

            try
            {
                subCategoriesInstance = new SubCategoriesDbSet();
                subCategoriesInstance.loadCash();
                subCategoriesInstance.isCashLoaded = true;
            }
            catch (Exception e)
            {
                subCategoriesInstance.isCashLoaded = false;
                subCategoriesInstance = null;
                Console.WriteLine(e.Message);
            }

            mut.ReleaseMutex();

            return subCategoriesInstance;
        }
        #region unused function
        //static public SubCategory[] GetSubCategories()
        //{
        //    return getInstance().subCategories.ToArray();
        //}
        #endregion

    }
}
