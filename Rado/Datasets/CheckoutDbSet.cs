using Microsoft.Data.SqlClient;
using Models.Enums;
using Rado.Enrich;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rado.Datasets
{
    public class CheckoutDbSet
    {
        static public IEnumerable<CheckoutItemView> ListItems(int userId)
        {
            List<CheckoutItemView> checkoutItems = new List<CheckoutItemView>();
            string connetionString = Program.ConnectionString;
           
            try { 
                using(SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand($"SELECT * FROM Checkout WHERE userId = {userId}", connection))
                    {
                        using(SqlDataReader sqlDataReader = command.ExecuteReader())
                        {
                            while(sqlDataReader.Read())
                            {
                                CheckoutItemView item = new CheckoutItemView()
                                {
                                    id = Convert.ToInt32(sqlDataReader["id"]),
                                    price = Convert.ToDecimal(sqlDataReader["price"]),
                                    partId = Convert.ToInt64(sqlDataReader["partId"]),
                                };

                                item.part = PartDbSet.GetPart(item.partId);
                                checkoutItems.Add(item);
                            }
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"Error occures during checkout {exception.Message}");
            }
            return checkoutItems;
        }
        static public int AddItem(PartView item)
        {
            int numberItems = 0;
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand("CheckoutIns", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        SqlParameter partIdParam = command.Parameters.Add("@partId", System.Data.SqlDbType.BigInt);
                        SqlParameter userIdParam = command.Parameters.Add("@userId", System.Data.SqlDbType.Int);
                        SqlParameter priceParam = command.Parameters.Add("@price", System.Data.SqlDbType.Decimal);
                        SqlParameter captureTimeParam = command.Parameters.Add("@captureTime", System.Data.SqlDbType.DateTime);

                        partIdParam.Value = item.partId;
                        userIdParam.Value = item.userId;
                        priceParam.Value = item.price;
                        captureTimeParam.Value = dateTime;

                        command.ExecuteNonQuery();
                    }
                    using (SqlCommand command = new SqlCommand($"SELECT COUNT(*) FROM checkout where userId = {item.userId}", connection))
                    {
                        numberItems = (Int32)command.ExecuteScalar();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"Error occures during checkout {exception.Message}");
            }

            return numberItems;
        }
        static public DisplayPartView[] ChecoutItems(long[] ids)
        {
            List<PartView> parts = new List<PartView>();
            List<DisplayPartView> result = new List<DisplayPartView>();
            using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
            {
                sqlConnection.Open();
                for(int i = 0; i < ids.Length;)
                {
                    using (SqlCommand sqlCommand = new SqlCommand("PartsByIds", sqlConnection))
                    {
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
    
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id1", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id2", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id3", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id4", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id5", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id6", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id7", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id8", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id9", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id10", System.Data.SqlDbType.BigInt).Value = ids[i++];

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {

                            while (sqlDataReader.Read())
                            {
                                PartView partView = EnrichManager.EnrichPartView(sqlDataReader);
                                parts.Add(partView);
                            }
                        }
                    }
                }

                for(int i = 0; i < ids.Length;)
                {
                    using (SqlCommand sqlCommand = new SqlCommand("[CarsByIds]", sqlConnection))
                    {
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id1", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id2", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id3", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id4", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id5", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id6", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id7", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id8", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id9", System.Data.SqlDbType.BigInt).Value = ids[i++];
                        if (i < ids.Length)
                            sqlCommand.Parameters.Add("@id10", System.Data.SqlDbType.BigInt).Value = ids[i++];

                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {

                            while (sqlDataReader.Read())
                            {
                                CarView carView = EnrichManager.EnrichCarView(sqlDataReader);
                                PartView partView = new PartView();
                                EnrichManager.InitPartViewFromCar(carView, partView);

                                parts.Add(partView);
                            }
                        }
                    }
                }
                sqlConnection.Close();
            }

            foreach(var part in parts)
            {
                DisplayPartView displayPart = EnrichManager.EnrichDisplayPartView(part);
                displayPart.Normalize();

                result.Add(displayPart);
            }

            foreach(long id in ids)
            {
                RimWithTyreView rimWithtyre =  RimWithTyreDbSet.GetRimWithTyreById(id);

                if (rimWithtyre.rimWithTyreId != 0)
                {
                    DisplayPartView displayPart = EnrichManager.EnrichDisplayPartView(rimWithtyre);
                    displayPart.Normalize();
                    result.Add(displayPart);
                }
            }
            return result.ToArray();
        }

        static public int ChecoutItem(int userId)
        {
            int numberItems = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand($"SELECT COUNT(*) FROM checkout where userId = {userId}", connection))
                    {
                        numberItems = (Int32)command.ExecuteScalar();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in ChecoutItem : {exception.Message}");
            }

            return numberItems;
        }

        static public int DeleteItem(int id, int userId)
        {
            int numberItems = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand("CheckoutDel", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        SqlParameter idParam = command.Parameters.Add("@id", System.Data.SqlDbType.BigInt);
                        SqlParameter userIdParam = command.Parameters.Add("@userId", System.Data.SqlDbType.Int);

                        idParam.Value = id;
                        userIdParam.Value = userId;

                        command.ExecuteNonQuery();
                    }
                    using (SqlCommand command = new SqlCommand($"SELECT COUNT(*) FROM checkout where userId = {userId}", connection))
                    {
                        numberItems = (Int32)command.ExecuteScalar();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($" Error in CheckoutDel : {exception.Message}");
            }

            return numberItems;
        }

        static public PartView[] GetCheckoutItems(int[] ids)
        {
            List<PartView> parts = new List<PartView>();
            string names = string.Join(',', ids);

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand("CheckoutItemsParts", sqlConnection))
                    {
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                        SqlParameter partIdParam = sqlCommand.Parameters.Add("@items", System.Data.SqlDbType.VarChar);
                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {

                            while (sqlDataReader.Read())
                            {
                                PartView partView = EnrichManager.EnrichPartView(sqlDataReader);
                                parts.Add(partView);
                            }
                        }
                        sqlConnection.Close();
                    }

                    using (SqlCommand sqlCommand = new SqlCommand("CheckoutItemsCars", sqlConnection))
                    {
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                        SqlParameter partIdParam = sqlCommand.Parameters.Add("@items", System.Data.SqlDbType.VarChar);
                        using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                        {

                            while (sqlDataReader.Read())
                            {
                                CarView carView = new CarView();
                                EnrichManager.EnrichCarView(sqlDataReader);
                                PartView partView = new PartView();
                                EnrichManager.InitPartViewFromCar(carView, partView);

                                parts.Add(partView);
                            }
                        }
                    }
                    sqlConnection.Close();
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"Error occures during checkout {exception.Message}");
            }

            return parts.ToArray();
        }
        static public int DeleteItem(long partId, int userId)
        {
            int numberItems = 0;
            try
            {
                using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
                {
                    connection.Open();

                    DateTime dateTime = DateTime.Now;
                    using (SqlCommand command = new SqlCommand("CheckoutDel", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        SqlParameter partIdParam = command.Parameters.Add("@partId", System.Data.SqlDbType.BigInt);
                        SqlParameter userIdParam = command.Parameters.Add("@userId", System.Data.SqlDbType.Int);

                        partIdParam.Value = partId;
                        userIdParam.Value = userId;

                        command.ExecuteNonQuery();
                    }

                    using (SqlCommand command = new SqlCommand($"SELECT COUNT(*) FROM checkou where userId = {userId}", connection))
                    {
                        numberItems = (Int32)command.ExecuteScalar();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new AppException($"Error occures during checkout {exception.Message}");
            }

            return numberItems;
        }

    }
}
