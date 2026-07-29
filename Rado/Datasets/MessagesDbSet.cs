using Microsoft.AspNetCore.Http;
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

    public static async Task<bool> MarkReadAsync(long originalMsgId, bool read, int userId)
    {
        try
        {
            string storedProcedure = "MarkReadUpd";

            SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
            await sqlConnection.OpenAsync();
            SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection);

            sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
            sqlCommand.Parameters.Add("@receiveUserId", System.Data.SqlDbType.Int).Value = userId;
            sqlCommand.Parameters.Add("@originalMsgId", System.Data.SqlDbType.BigInt).Value = originalMsgId;
            sqlCommand.Parameters.Add("@read", System.Data.SqlDbType.Bit).Value = read;

            await sqlCommand.ExecuteNonQueryAsync();
            await sqlConnection.CloseAsync();
        }
        catch (Exception exception)
        {
            LoggerUtil.LogFunctionInfo("MarkRead");
            LoggerUtil.LogException(exception.Message);
            throw new BadHttpRequestException("Съобщението не може да се маркира!");
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
            if (emailMessage.ItemType == Rado.Enums.ItemType.OnlyCar ||
                emailMessage.ItemType == Rado.Enums.ItemType.OnlyBus)
            {
                CarView carView = await CarsDbSet.GetCarByIdAsync(emailMessage.Id);
                userId = carView.UserId;
            }
            else if (emailMessage.ItemType == Rado.Enums.ItemType.BusPart || emailMessage.ItemType == Rado.Enums.ItemType.CarPart)
            {
                PartView part = await PartDbSet.GetPartAsync(emailMessage.Id);
                userId = part.UserId;
            } 
            else if (emailMessage.ItemType == Rado.Enums.ItemType.Tyre ||
                emailMessage.ItemType == Rado.Enums.ItemType.Rim ||
                emailMessage.ItemType == Rado.Enums.ItemType.RimWithTyre)
            {
                RimWithTyreView rimWithTyreView = await RimWithTyreDbSet.GetRimWithTyreByIdAsync(emailMessage.Id);
                userId = rimWithTyreView.UserId;
            } else
            {
                return false;
            }


            DisplayPartView displayPartView = await SearchDbSet.GetItemAsync(emailMessage.Id);
            User user = UserDbSet.GetUserById(userId);
            ImageDataClass image = await ImageManager.GetMainImageAsync(emailMessage.Id);
            string link = $"<a href='{Program.api}/part?id={emailMessage.Id}' target= '_blank'>Виж обявата</a>";
            string message = $"<div>Имате запитване за обявата: {link} от {emailMessage.Name}";

            message += $"<p> <span style='font-weight: bold;'>Съобщение: </span> {emailMessage.Request} </p>";
            message += $"<a href='mailto:{emailMessage.Email}'>Отговори</a>";

            Message messageNew = new Message();
            messageNew.message = message;
            messageNew.ReceiveUserId = userId;
            messageNew.SenderName = emailMessage.Name;
            messageNew.Email = emailMessage.Email;
            messageNew.Request = emailMessage.Request;
            messageNew.MsgDate = DateTime.Now.Ticks;

            MessagesDbSet.AddMessage(messageNew);

            MessageGenerator messageGenerator = new MessageGenerator();

            message = messageGenerator.GenerateMessage(displayPartView, emailMessage);

            MailManager.SendEmail(user.Email, "Запитване за обява", message);

            if (emailMessage.SendCopy)
                MailManager.SendEmail(emailMessage.Email, "Запитване за обява", message);
        }
        catch (Exception exception)
        {
            LoggerUtil.LogFunctionInfo("SendMessage");
            LoggerUtil.LogException(exception.Message);
            return false;
        }

        return true;
    }

    public static async Task<bool> DeleteMessageAsync(long id, int userId)
    {
        try
        {
            try
            {
                string storedProcedure = "MarkRead";

                SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString);
                await sqlConnection.OpenAsync();

                SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection);
                sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                sqlCommand.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
                sqlCommand.Parameters.Add("@originalMsgId", System.Data.SqlDbType.BigInt).Value = id;

                await sqlCommand.ExecuteNonQueryAsync();

                await sqlConnection.CloseAsync();
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
        catch (Exception exception)
        {
            LoggerUtil.LogException(exception);
            throw new BadHttpRequestException("Съобщението не може да бъде изтрито!");
        }
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

                    sqlCommand.Parameters.Add("@previousMsgId", System.Data.SqlDbType.BigInt).Value = message.PreviousMsgId;
                    sqlCommand.Parameters.Add("@msgDate", System.Data.SqlDbType.BigInt).Value = message.MsgDate;
                    sqlCommand.Parameters.Add("@sendUserId", System.Data.SqlDbType.Int).Value = message.SendUserId;
                    sqlCommand.Parameters.Add("@receiveUserId", System.Data.SqlDbType.Int).Value = message.ReceiveUserId;
                    sqlCommand.Parameters.Add("@originalMsgId", System.Data.SqlDbType.BigInt).Value = message.OriginalMsgId;
                    sqlCommand.Parameters.Add("@message", System.Data.SqlDbType.NVarChar).Value = message.message;
                    sqlCommand.Parameters.Add("@partId", System.Data.SqlDbType.BigInt).Value = message.PartId;
                    sqlCommand.Parameters.Add("@isCar", System.Data.SqlDbType.Int).Value = message.IsCar;
                    sqlCommand.Parameters.Add("@request", System.Data.SqlDbType.NVarChar).Value = message.Request;
                    sqlCommand.Parameters.Add("@senderName", System.Data.SqlDbType.NVarChar).Value = message.SenderName;
                    sqlCommand.Parameters.Add("@email", System.Data.SqlDbType.NVarChar).Value = message.Email;

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
