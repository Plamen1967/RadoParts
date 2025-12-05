using Microsoft.Data.SqlClient;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Utility;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Rado.Datasets
{
    public class AdminDbSet
    {
        public static string RecoverPassword(int userId)
        {
            Guid guid = Guid.NewGuid();
            string url = guid.ToString();

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("RecoverPassword", sqlConnection))
                    {
                        sqlConnection.Open();

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                        sqlCommand.Parameters.Add("@guid", SqlDbType.NVarChar).Value = url;

                        int result = sqlCommand.ExecuteNonQuery();
                    }
                }
            }
            catch(Exception exception)
            {
                throw new AppException(exception.Message);
            }

            return url;
        }


        public static bool ApproveAd(ApproveAd approveAd)
        {
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("ApproveAd", sqlConnection))
                    {
                        sqlConnection.Open();

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@id", SqlDbType.BigInt).Value = approveAd.id;
                        sqlCommand.Parameters.Add("@approved", SqlDbType.Int).Value = approveAd.approved;

                        int result = sqlCommand.ExecuteNonQuery();
                        if (result == 1)
                            return true;
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }

            return false;
        }
        public static bool UpdatePassword(NewPassword newPassword)
        {
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    using (SqlCommand sqlCommand = new SqlCommand("UpdatePasssword", sqlConnection))
                    {
                        string password = BCryptNet.HashPassword(newPassword.newPassword); ;
                        sqlConnection.Open();

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.Parameters.Add("@password", SqlDbType.NVarChar).Value = password;
                        sqlCommand.Parameters.Add("@guid", SqlDbType.NVarChar).Value = newPassword.guid;

                        int result = sqlCommand.ExecuteNonQuery();

                        if (result != 1)
                        {
                            throw new AppException("The password could not be updated");
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException(exception.Message);
            }
            return false;
        }
        public static Category UpdateCategory(Category category)
        {
            string storedProcedure = "Category";
            InsertUpdate update = InsertUpdate.Update;
            if (category.categoryId == 0)
            {
                update = InsertUpdate.Insert;
                storedProcedure = storedProcedure + "Ins";
            }
            else
            {
                storedProcedure = storedProcedure + "Upd";
            }

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter categoryNameParam = sqlCommand.Parameters.Add("@categoryName", SqlDbType.VarChar);
                        categoryNameParam.Value = category.categoryName;
                        SqlParameter returnCategoryIdParam = null;

                        if (update == InsertUpdate.Update)
                        {
                            SqlParameter categoryIdParam = sqlCommand.Parameters.Add("@categoryId", SqlDbType.Int);
                            categoryIdParam.Value = category.categoryId;
                        }
                        else
                        {
                            returnCategoryIdParam = sqlCommand.Parameters.Add("@returnCategoryId", SqlDbType.Int);
                            returnCategoryIdParam.Direction = ParameterDirection.Output;
                        }

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();


                        CategoriesDbSet.Refresh();

                        int categoryId = category.categoryId;

                        if (update == InsertUpdate.Insert)
                            categoryId = (int)returnCategoryIdParam.Value;
                        
                        category = CategoriesDbSet.GetCategoryById(categoryId);

                        return category;
                    }

                }
            }
            catch(Exception e)
            {
                throw new AppException(e.Message);
            }
        }

        public static SubCategory UpdateSubCategory(SubCategory subCategory)
        {
            string storedProcedure = "SubCategory";
            InsertUpdate update = InsertUpdate.Update;
            if (subCategory.subCategoryId == 0)
            {
                update = InsertUpdate.Insert;
                storedProcedure = storedProcedure + "Ins";
            }
            else
            {
                storedProcedure = storedProcedure + "Upd";
            }

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter subCategoryNameParam = sqlCommand.Parameters.Add("@subCategoryName", SqlDbType.VarChar);
                        subCategoryNameParam.Value = subCategory.subCategoryName;

                        SqlParameter returnSubCategoryIdNameParam = null;

                        if (update == InsertUpdate.Update)
                        {
                            SqlParameter subCategoryIdParam = sqlCommand.Parameters.Add("@subCategoryId", SqlDbType.Int);
                            subCategoryIdParam.Value = subCategory.subCategoryId;
                        }
                        else
                        {
                            SqlParameter categoryIdNameParam = sqlCommand.Parameters.Add("@categoryId", SqlDbType.Int);
                            categoryIdNameParam.Value = subCategory.categoryId;

                            returnSubCategoryIdNameParam = sqlCommand.Parameters.Add("@returnSubCategoryId", SqlDbType.Int);
                            returnSubCategoryIdNameParam.Direction = ParameterDirection.Output;
                        }

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();


                        SubCategoriesDbSet.Refresh();

                        int subCategoryId = subCategory.subCategoryId;

                        if (update == InsertUpdate.Insert)
                            subCategoryId = (int)returnSubCategoryIdNameParam.Value;


                        subCategory = SubCategoriesDbSet.GetSubCategoryById(subCategoryId);

                        return subCategory;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }

        }
        public static DealerSubCategory UpdateDealerSubCategory(DealerSubCategory dealerSubCategory)
        {
            string storedProcedure = "DealerSubCategory";
            InsertUpdate update = InsertUpdate.Update;
            if (dealerSubCategory.dealerSubCategoryId == 0)
            {
                update = InsertUpdate.Insert;
                storedProcedure = storedProcedure + "Ins";
            }
            else
            {
                storedProcedure = storedProcedure + "Upd";
            }

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter dealerSubCategoryNameParam = sqlCommand.Parameters.Add("@dealerSubCategoryName", SqlDbType.VarChar);
                        dealerSubCategoryNameParam.Value = dealerSubCategory.dealerSubCategoryName;

                        SqlParameter returnDealerSubCategoryIdNameParam = null;

                        if (update == InsertUpdate.Update)
                        {
                            SqlParameter dealerSubCategoryIdParam = sqlCommand.Parameters.Add("@dealerSubCategoryId", SqlDbType.Int);
                            dealerSubCategoryIdParam.Value = dealerSubCategory.dealerSubCategoryId;
                        }
                        else
                        {
                            SqlParameter subCategoryIdNameParam = sqlCommand.Parameters.Add("@subCategoryId", SqlDbType.Int);
                            subCategoryIdNameParam.Value = dealerSubCategory.subCategoryId;

                            returnDealerSubCategoryIdNameParam = sqlCommand.Parameters.Add("@returnDealerSubCategoryId", SqlDbType.Int);
                            returnDealerSubCategoryIdNameParam.Direction = ParameterDirection.Output;
                        }

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();


                        DealerSubCategoryDbSet.Refresh();

                        int dealerSubCategoryId = dealerSubCategory.dealerSubCategoryId;

                        if (update == InsertUpdate.Insert)
                            dealerSubCategoryId = (int)returnDealerSubCategoryIdNameParam.Value;


                        dealerSubCategory = DealerSubCategoryDbSet.GetDealerSubCategoryById(dealerSubCategoryId);

                        return dealerSubCategory;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }
        public static async Task<Company> UpdateCompany(Company company)
        {
            await Task.Run(() =>
            {
                string storedProcedure = "Company";
                InsertUpdate update = InsertUpdate.Update;
                if (company.companyId == 0)
                {
                    update = InsertUpdate.Insert;
                    storedProcedure = storedProcedure + "Ins";
                    var company1 = CompaniesDbSet.getAllCompanies().OrderByDescending(x => x.companyId).FirstOrDefault();
                    int max = company1.companyId;
                    company.companyId = ++max;
                }
                else
                {
                    storedProcedure = storedProcedure + "Upd";
                }

                try
                {
                    using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                    {
                        sqlConnection.Open();

                        using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            //SqlParameter returnCompanyIdParam = null;

                            sqlCommand.Parameters.Add("@companyName", SqlDbType.VarChar).Value = company.companyName;
                            sqlCommand.Parameters.Add("@important", SqlDbType.Int).Value = company.important;

                            if (update == InsertUpdate.Update)
                            {
                                SqlParameter companyIdParam = sqlCommand.Parameters.Add("@companyId", SqlDbType.Int);
                                companyIdParam.Value = company.companyId;
                            }
                            else
                            {
                                SqlParameter companyIdParam = sqlCommand.Parameters.Add("@companyId", SqlDbType.Int);
                                companyIdParam.Value = company.companyId;
                                sqlCommand.Parameters.Add("@bus", SqlDbType.Int).Value = company.bus;
                                //returnCompanyIdParam = sqlCommand.Parameters.Add("@returnCompanyId", System.Data.SqlDbType.Int);
                                //returnCompanyIdParam.Direction = System.Data.ParameterDirection.Output;
                            }

                            CompaniesDbSet.Refresh();
                            sqlCommand.CommandType = CommandType.StoredProcedure;
                            int rows = sqlCommand.ExecuteNonQuery();



                            int companyId = company.companyId;
                            company = CompaniesDbSet.getCompanyById(companyId);
                        }

                    }
                }
                catch (Exception e)
                {
                    throw new AppException(e.Message);
                }

            });

            return company;
        }


        public static async Task<Modification> UpdateModificationAsync(Modification updatedModification)
        {
            Modification modification = null;

            await Task.Run(() => {
                string storedProcedure = "Modification";
                InsertUpdate update = InsertUpdate.Update;
                if (updatedModification.modificationId == 0)
                {
                    update = InsertUpdate.Insert;
                    storedProcedure = storedProcedure + "Ins";
                }
                else
                {
                    storedProcedure = storedProcedure + "Upd";
                }

                try
                {
                    using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                    {
                        sqlConnection.Open();

                        using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                        {
                            SqlParameter modelNameParam = sqlCommand.Parameters.Add("@modificationName", SqlDbType.VarChar);
                            modelNameParam.Value = updatedModification.modificationName;
                            SqlParameter returnModificationIdParam = null;

                            if (update == InsertUpdate.Update)
                            {
                                SqlParameter modelIdParam = sqlCommand.Parameters.Add("@modificationId", SqlDbType.Int);
                                modelIdParam.Value = updatedModification.modificationId;
                            }
                            else
                            {
                                SqlParameter modelIdParam = sqlCommand.Parameters.Add("@modelId", SqlDbType.Int);
                                modelIdParam.Value = updatedModification.@modelId;
                                returnModificationIdParam = sqlCommand.Parameters.Add("@returnModificationId", SqlDbType.Int);
                                returnModificationIdParam.Direction = ParameterDirection.Output;
                            }

                            sqlCommand.Parameters.Add("@yearFrom", SqlDbType.Int).Value = updatedModification.yearFrom;
                            sqlCommand.Parameters.Add("@yearTo", SqlDbType.Int).Value = updatedModification.yearTo;
                            sqlCommand.Parameters.Add("@powerHP", SqlDbType.Int).Value = updatedModification.powerHP;
                            sqlCommand.Parameters.Add("@engine", SqlDbType.Int).Value = updatedModification.engine;
                            sqlCommand.Parameters.Add("@doors", SqlDbType.Int).Value = updatedModification.doors;
                            sqlCommand.Parameters.Add("@kupe", SqlDbType.Int).Value = updatedModification.kupe;

                            sqlCommand.CommandType = CommandType.StoredProcedure;
                            int rows = sqlCommand.ExecuteNonQuery();


                            ModificationsDbSet.Refresh();

                            int modificationId = updatedModification.modificationId;

                            if (update == InsertUpdate.Insert)
                                modificationId = (int)returnModificationIdParam.Value;

                            modification = ModificationsDbSet.GetModificationById(modificationId);

                        }

                    }
                }
                catch (Exception e)
                {
                    throw new AppException(e.Message);
                }

            });

            return modification;
        }

        public static bool DeleteModel(int modelId)
        {
            string storedProcedure = "ModelDel";

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter modelIdParam = sqlCommand.Parameters.Add("modelId", SqlDbType.Int);
                        modelIdParam.Value = modelId;

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();

                        ModelsDbSet.Refresh();

                        return rows != 0;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }

        public static bool DeleteModification(int modificationId)
        {
            string storedProcedure = "ModificationDel";

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter modificationIdParam = sqlCommand.Parameters.Add("modificationId", SqlDbType.Int);
                        modificationIdParam.Value = modificationId;

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();

                        ModificationsDbSet.Refresh();

                        return rows != 0;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }
        public static bool DeleteCategory(int categoryId)
        {
            string storedProcedure = "CategoryDel";

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter categoryIdParam = sqlCommand.Parameters.Add("categoryId", SqlDbType.Int);
                        categoryIdParam.Value = categoryId;

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();

                        CategoriesDbSet.Refresh();

                        return rows != 0;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }
        public static bool DeleteSubCategory(int subCategoryId)
        {
            string storedProcedure = "SubCategoryDel";

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter subCategoryIdParam = sqlCommand.Parameters.Add("subCategoryId", SqlDbType.Int);
                        subCategoryIdParam.Value = subCategoryId;

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();


                        SubCategoriesDbSet.Refresh();

                        return rows != 0;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }
        public static bool DeleteDealerSubCategory(int dealerSubCategoryId)
        {
            string storedProcedure = "DealerSubCategoryDel";

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        SqlParameter dealerSubCategoryIdParam = sqlCommand.Parameters.Add("dealerSubCategoryId", SqlDbType.Int);
                        dealerSubCategoryIdParam.Value = dealerSubCategoryId;

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = sqlCommand.ExecuteNonQuery();

                        DealerSubCategoryDbSet.Refresh();

                        return rows != 0;
                    }

                }
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }

        internal static async Task<UserStats> GetUserStats(long userId)
        {
            string storedProcedure = "UserStats";
            UserStats userStats = new UserStats();
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    await sqlConnection.OpenAsync();

                    using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.Parameters.AddWithValue("userId", userId);
                        sqlCommand.Parameters.Add("cars", SqlDbType.Int).Direction = ParameterDirection.Output;
                        sqlCommand.Parameters.Add("buss", SqlDbType.Int).Direction = ParameterDirection.Output;
                        sqlCommand.Parameters.Add("carParts", SqlDbType.Int).Direction = ParameterDirection.Output;
                        sqlCommand.Parameters.Add("busParts", SqlDbType.Int).Direction = ParameterDirection.Output;
                        sqlCommand.Parameters.Add("tyres", SqlDbType.Int).Direction = ParameterDirection.Output;
                        sqlCommand.Parameters.Add("rims", SqlDbType.Int).Direction = ParameterDirection.Output;
                        sqlCommand.Parameters.Add("rimWithTyres", SqlDbType.Int).Direction = ParameterDirection.Output;

                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        int rows = await sqlCommand.ExecuteNonQueryAsync();
                        userStats.cars = (int)sqlCommand.Parameters["cars"].Value;
                        userStats.bus = (int)sqlCommand.Parameters["bus"].Value;
                        userStats.carParts = (int)sqlCommand.Parameters["carParts"].Value;
                        userStats.busParts = (int)sqlCommand.Parameters["busParts"].Value;
                        userStats.tyres = (int)sqlCommand.Parameters["tyres"].Value;
                        userStats.rims = (int)sqlCommand.Parameters["rims"].Value;
                        userStats.rimWithTyres = (int)sqlCommand.Parameters["rimWithTyres"].Value;

                        return userStats;
                    }

                }
            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
                throw new AppException("User Stats не може да бъде изпълнена");
            }

        }
    }
}
