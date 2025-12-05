using Microsoft.Data.SqlClient;
using Rado.Helper;
using Newtonsoft.Json;
using NuGet.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Utility;
using Settings;

public class ModelUpdate
{
    public static void StoreInDB()
    {
        //try
        //{
        //    string jsonString;
        //    using (StreamReader jsonFile = new StreamReader("make24.json"))
        //    {
        //        jsonString = jsonFile.ReadToEnd();
        //    }
        //    List<MakeHelper> make = JsonConvert.DeserializeObject<List<MakeHelper>>(jsonString);

        //    for (int i = 0; i < make.Count; i++)
        //    {
        //        int companyId = make[i].id;
        //        string companyName = make[i].name;
        //        StoreCompany(companyId, companyName);
        //        for (int m = 0; m < make[i].models.Length; m++)
        //        {
        //            int groupModelId = make[i].models[m].id;
        //            string gropModelName = make[i].models[m].name;
        //            StoreGroupModel(groupModelId, companyId, gropModelName);
        //            for (int d = 0; d < make[i].models[m].modifications.Length; d++)
        //            {
        //                int modelId = make[i].models[m].modifications[d].id;
        //                int yearFrom = 9999, yearTo = -1;
        //                StoreModel(modelId, groupModelId, companyId, make[i].models[m].modifications[d].name, make[i].models[m].name, yearFrom, yearTo);

        //                for (int s = 0; s < make[i].models[m].modifications[d].submodel.Length; s++)
        //                {

        //                    yearFrom = make[i].models[m].modifications[d].submodel[s].yearFrom;
        //                    yearTo = make[i].models[m].modifications[d].submodel[s].yearTo;
        //                    StoreModification(make[i].models[m].modifications[d].submodel[s].id, modelId, make[i].models[m].modifications[d].submodel[s].name, yearFrom, yearTo);
        //                }
        //            }
        //        }
        //    }
        //    _ = Task.Run(async () =>
        //    {
        //        await LoggerUtil.Log("Update Done");
        //    });

        //}
        //catch(Exception exception)
        //{
        //    LoggerUtil.LogFunctionInfo("StoreInDB");
        //    LoggerUtil.LogException(exception.Message);
        //}

    }
    static void StoreCompany(int companyId, string companyName)
    {
        try
        {
            string statement = "CompanyIns";
            using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                {
                    sqlConnection.Open();
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add("@companyId", System.Data.SqlDbType.Int).Value = companyId;
                    sqlCommand.Parameters.Add("@companyName", System.Data.SqlDbType.NVarChar, 50).Value = companyName;
                    sqlCommand.Parameters.Add("@important", System.Data.SqlDbType.Int).Value = 0;

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
    static void StoreGroupModel(int groupModelId, int companyId, string groupModelName)
    {
        try
        {
            string statement = "GroupModelIns";
            using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                {
                    sqlConnection.Open();
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add("@groupModelId", System.Data.SqlDbType.Int).Value = groupModelId;
                    sqlCommand.Parameters.Add("@groupModelName", System.Data.SqlDbType.NVarChar, 50).Value = groupModelName;
                    sqlCommand.Parameters.Add("@companyId", System.Data.SqlDbType.Int).Value = companyId;

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

    static void StoreModel(int modelId, int groupModelId, int companyId, string modelName, string groupName, int yearFrom, int yearTo)
    {
        try
        {
            string statement = "ModelIns";
            using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                {
                    sqlConnection.Open();
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    if (modelName == "-Единствена-")
                        modelName = "";

                    sqlCommand.Parameters.Add("@modelId", System.Data.SqlDbType.Int).Value = modelId;
                    sqlCommand.Parameters.Add("@groupModelId", System.Data.SqlDbType.Int).Value = groupModelId;
                    sqlCommand.Parameters.Add("@modelName", System.Data.SqlDbType.NVarChar, 50).Value = modelName;
                    sqlCommand.Parameters.Add("@companyId", System.Data.SqlDbType.Int).Value = companyId;
                    sqlCommand.Parameters.Add("@yearFrom", System.Data.SqlDbType.Int).Value = yearFrom;
                    sqlCommand.Parameters.Add("@yearTo", System.Data.SqlDbType.Int).Value = yearTo;

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

    static void StoreModification(int modificationId, int modelId, string modificationName, int yearFrom, int yearTo)
    {
        try
        {
            string statement = "ModificationIns";
            using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(statement, sqlConnection))
                {
                    sqlConnection.Open();
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add("@modificationId", System.Data.SqlDbType.Int).Value = modificationId;
                    sqlCommand.Parameters.Add("@modificationName", System.Data.SqlDbType.NVarChar, 50).Value = modificationName;
                    sqlCommand.Parameters.Add("@modelId", System.Data.SqlDbType.Int).Value = modelId;
                    sqlCommand.Parameters.Add("@yearFrom", System.Data.SqlDbType.Int).Value = yearFrom;
                    sqlCommand.Parameters.Add("@yearTo", System.Data.SqlDbType.Int).Value = yearTo;
                    sqlCommand.Parameters.Add("@powerHP", System.Data.SqlDbType.Int).Value = 0;
                    sqlCommand.Parameters.Add("@engine", System.Data.SqlDbType.Int).Value = 0;
                    sqlCommand.Parameters.Add("@doors", System.Data.SqlDbType.Int).Value = 0;
                    sqlCommand.Parameters.Add("@kupe", System.Data.SqlDbType.Int).Value = 0;

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


}

