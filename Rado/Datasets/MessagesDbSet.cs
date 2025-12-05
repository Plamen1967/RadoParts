using Microsoft.Data.SqlClient;
using Models.Enums;
using Models.Models;
using Models.Models.Authentication;
using Rado;
using Rado.Datasets;
using Rado.Enrich;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Utility;

public class MessagesDbSet
{
    public MessagesDbSet()
    {
    }

    public static async Task<Message[]> GetUserMessagesAsync(int userId)
    {
        string storedProcedure = "UserMessagesAll";
        List<Message> messages = new List<Message>();
        try
        {
            using (SqlConnection connection = new SqlConnection(Program.ConnectionString))
            {
                using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                {
                    await connection.OpenAsync();
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add("@userId", SqlDbType.Int).Value = userId;

                    using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync())
                    {
                        while (await sqlDataReader.ReadAsync())
                        {
                            Message message = EnrichManager.EnrichMessage(sqlDataReader);
                            messages.Add(message);
                        }
                    }
                }
            }
        }
        catch (Exception e)
        {
            System.Console.WriteLine(e.ToString());
        }

        return messages.ToArray();
    }

    static public bool MarkRead(long originalMsgId, int userId)
    {
        try
        {
            string storedProcedure = "MarkRead";

            using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                {
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@receiveUserId", System.Data.SqlDbType.Int).Value = userId;
                    sqlCommand.Parameters.Add("@originalMsgId", System.Data.SqlDbType.BigInt).Value = originalMsgId;

                    sqlCommand.ExecuteNonQuery();
                }

                sqlConnection.CloseAsync();
            }
        }
        catch (Exception exception)
        {
            LoggerUtil.LogFunctionInfo("MarkRead");
            LoggerUtil.LogException(exception.Message);
        }
        finally
        {
        }

        return true;
    }

    internal static async Task<bool> SendMessageAsync(EmailMessage emailMessage)
    {
        try 
        {
            int userId;
            if (emailMessage.itemType == Rado.Enums.ItemType.OnlyCar ||
                emailMessage.itemType == Rado.Enums.ItemType.OnlyBus)
            {
                CarView carView = await CarsDbSet.GetCarByIdAsync(emailMessage.id);
                userId = carView.userId;
            }
            else if (emailMessage.itemType == Rado.Enums.ItemType.BusPart || emailMessage.itemType == Rado.Enums.ItemType.CarPart)
            {
                PartView part = await PartDbSet.GetPartAsync(emailMessage.id);
                userId = part.userId;
            } 
            else if (emailMessage.itemType == Rado.Enums.ItemType.Tyre ||
                emailMessage.itemType == Rado.Enums.ItemType.Rim ||
                emailMessage.itemType == Rado.Enums.ItemType.RimWithTyre)
            {
                RimWithTyreView rimWithTyreView = await RimWithTyreDbSet.GetRimWithTyreByIdAsync(emailMessage.id);
                userId = rimWithTyreView.userId;
            } else
            {
                return false;
            }


            DisplayPartView displayPartView = await SearchDbSet.GetItemAsync(emailMessage.id);
            User user = UserDbSet.GetUserById(userId);
            ImageData image = await ImageManager.GetMainImageAsync(emailMessage.id);
            string link = $"<a href='{Program.api}/part?id={emailMessage.id}' target= '_blank'>Виж обявата</a>";
            string message = $"<div>Имате запитване за обявата: {link} от {emailMessage.name}";

            message += $"<p> <span style='font-weight: bold;'>Съобщение: </span> {emailMessage.request} </p>";
            message += $"<a href='mailto:{emailMessage.email}'>Отговори</a>";

            MessageGenerator messageGenerator = new MessageGenerator();

            message = messageGenerator.GenerateMessage(displayPartView, emailMessage);

            MailManager.SendEmail(user.email, "Запитване за обява", message);

            if (emailMessage.sendCopy)
                MailManager.SendEmail(emailMessage.email, "Запитване за обява", message);
        }
        catch (Exception exception)
        {
            LoggerUtil.LogFunctionInfo("SendMessage");
            LoggerUtil.LogException(exception.Message);
            return false;
        }

        return true;
    }

    static public bool DeleteMessage(long id, int userId)
    {
        try
        {
            string storedProcedure = "MarkRead";

            using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                {
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
                    sqlCommand.Parameters.Add("@originalMsgId", System.Data.SqlDbType.BigInt).Value = id;

                    sqlCommand.ExecuteNonQuery();
                }

                sqlConnection.CloseAsync();
            }
        }
        catch (Exception exception)
        {
            LoggerUtil.LogFunctionInfo("DeleteMessage");
            LoggerUtil.LogException(exception.Message);
            return false;
        }
        finally
        {
        }
        return true;
    }

    static public bool AddMessage(Message message)
    {
        string storedProcedure = "MessageIns";

        List<Message> messages = new List<Message>();
        try
        {
            using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                {
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    SqlParameter previousMsgIdParam = sqlCommand.Parameters.Add("@previousMsgId", System.Data.SqlDbType.BigInt);
                    SqlParameter msgDateParam = sqlCommand.Parameters.Add("@msgDate", System.Data.SqlDbType.BigInt);
                    SqlParameter sendUserIdParam = sqlCommand.Parameters.Add("@sendUserId", System.Data.SqlDbType.Int);
                    SqlParameter receiveUserIdParam = sqlCommand.Parameters.Add("@receiveUserId", System.Data.SqlDbType.Int);
                    SqlParameter originalMsgIdParam = sqlCommand.Parameters.Add("@originalMsgId", System.Data.SqlDbType.BigInt);
                    SqlParameter messageParam = sqlCommand.Parameters.Add("@message", System.Data.SqlDbType.NVarChar);
                    SqlParameter partIdParam = sqlCommand.Parameters.Add("@partId", System.Data.SqlDbType.BigInt);
                    SqlParameter isCarIdParam = sqlCommand.Parameters.Add("@isCar", System.Data.SqlDbType.Int);

                    previousMsgIdParam.Value = message.previousMsgId;
                    sendUserIdParam.Value = message.sendUserId;
                    receiveUserIdParam.Value = message.receiveUserId;
                    originalMsgIdParam.Value = message.originalMsgId;
                    msgDateParam.Value = message.msgDate;
                    messageParam.Value = message.message;
                    partIdParam.Value = message.partId;
                    isCarIdParam.Value = message.isCar;

                    sqlCommand.ExecuteNonQuery();

                }
                sqlConnection.CloseAsync();
            }
        }
        catch(Exception exception) 
        {
            LoggerUtil.LogFunctionInfo("AddMessage");
            LoggerUtil.LogException(exception.Message);
        }

        return true;
    }

    static public Message[] GetMessages(long userId)
    {
        string storedProcedure = "UserMessages";

        List<Message> messages = new List<Message>();
        try
        {
            using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@userId", SqlDbType.BigInt).Value = userId;

                    sqlConnection.Open();

                    using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                    {
                        while (sqlDataReader.Read())
                        {
                            Message message = EnrichManager.EnrichMessage(sqlDataReader);
                            messages.Add(message);
                        }
                    }
                    sqlConnection.Close();
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

        return messages.ToArray();

    }
}
