using Settings;
using System.ComponentModel;
using System.Net;
using System.Net.Mail;
using Utility;

namespace EMail
{
    static public class MailManager
    {
        static public string host = "smtp.ionos.co.uk";
        static public string hostEmail = "info@parts365.bg";
        static public MailAddress addressFrom = new MailAddress(hostEmail, "Message from radoparts.com", System.Text.Encoding.UTF8);
        static public string emailPassword = "Email_2020";
        static private int Port = 587;
        static public bool SendEmails = false;

        public static void NewUserEmail(string email, string subject, string body)
        {
            SendEmail(email, subject, body);
        }

        public static void SendRequestForInfo(string email, string subject, string requestForInfo)
        {
            SendEmail(email, subject, requestForInfo);
        }

        public static void SendEmail(string addressTo, string subject, string bodyText)
        {
            if (!SendEmails) return;
            try
            {
                using (SmtpClient client = new SmtpClient(host, Port))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(hostEmail, emailPassword);
                    client.SendCompleted += new SendCompletedEventHandler(SendCompletedCallback);
                    if (ProgramSettings.DevelopmentMode)
                        addressTo = "plamen1967@gmail.com";

                    MailAddress to = new MailAddress(addressTo);

                    using (MailMessage message = new MailMessage(addressFrom, to))
                    {
                        bodyText = bodyText + "\r\n";
                        bodyText += DateTime.Now.ToString();
                        message.IsBodyHtml = true;
                        message.Body = bodyText;
                        message.BodyEncoding = System.Text.Encoding.UTF8;
                        message.Subject = subject;
                        message.SubjectEncoding = System.Text.Encoding.UTF8;

                        LoggerUtil.LogInfo(DateTime.Now.ToString());
                        LoggerUtil.LogFunctionInfo("ToBeSendMessage");
                        LoggerUtil.LogInfo(host);
                        LoggerUtil.LogInfo(hostEmail);
                        LoggerUtil.LogInfo(emailPassword);
                        LoggerUtil.LogInfo(addressTo);
                        LoggerUtil.LogInfo(subject);
                        LoggerUtil.LogInfo(bodyText);

                        client.Send(message);
                    }
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("SendEmail");
                LoggerUtil.LogException(exception.Message);

            }
        }

        private static void SendCompletedCallback(object sender, AsyncCompletedEventArgs e)
        {
            // Get the unique identifier for this asynchronous operation.
            string token = (string)e.UserState;

            if (e.Cancelled)
            {
                Console.WriteLine("[{0}] Send canceled.", token);
            }

            if (e.Error != null)
            {
                Console.WriteLine("[{0}] {1}", token, e.Error.ToString());
                LoggerUtil.LogInfo(DateTime.Now.ToString());
                LoggerUtil.LogFunctionInfo("Message Sent");
                LoggerUtil.LogInfo(string.Format("[{0}] {1}", token, e.Error.ToString()));
            }
            else
            {
                LoggerUtil.LogInfo(DateTime.Now.ToString());
                LoggerUtil.LogFunctionInfo("Message Sent");
            }
        }
        public static void SendRecoveryEmail(string api, string activationCode, string userName, string userEmail)
        {
            string action = "Възстановяване на потребител";
            string action2 = "възстановите";
            string html = $@"<!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Document</title>
                </head>
                <body>
                    <p style='margin-left=10px'>Уважаеми клиент {userName},</p> 
                    <p>моля натиснете бутона по-долу за да {action2} акаунта си</p>
                    <a href='{api}/recovery?id={activationCode}'  style ='padding: 10px; width: 300px; display: block; text-decoration:none; border: 1px solid;text-align:center;font-weight:700;font-size:14px;color:#fff;background:blue;border-radius:5px;line-height:17px;margin:0 auto' target= '_blank' data-saferedirecturl=>{action}<a>
    
                    <p>Ако имате нужда от помощ свържете се на е-майла<a href='mailto:{hostEmail}' style='margin-left:5px;color:ligthblue;text-decoration:underline;font-weight:700' target='_blank'>{hostEmail}</a></p> 
                    <p>С уважение от фирмата Parts365.bg</p>    

                </body>";
            NewUserEmail(userEmail, action, html);
        }

        public static void SendActivationEmail(string api, string activationCode, string userName, string userEmail)
        {
            string action = "Активиране на потребител";
            string action2 = "активирате";
            string html = $@"<!DOCTYPE html>
                    <html lang='en'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                        <title>Document</title>
                    </head>
                    <body>
                        <p style='margin-left=10px'>Уважаеми клиент {userName},</p> 
                        <p>моля натиснете бутона по-долу за да {action2} акаунта си</p>
                        <a href='{api}/activateUser?id={activationCode}'  style ='padding: 10px; width: 300px; display: block; text-decoration:none; border: 1px solid;text-align:center;font-weight:700;font-size:14px;color:#fff;background:blue;border-radius:5px;line-height:17px;margin:0 auto' target= '_blank' data-saferedirecturl=>{action}<a>
    
                        <p>Ако имате нужда от помощ свържете се на е-майла<a href='mailto:{hostEmail}' style='margin-left:5px;color:ligthblue;text-decoration:underline;font-weight:700' target='_blank'>{hostEmail}</a></p> 
                        <p>С уважение от фирмата Parts365.bg</p>    

                    </body>
                    </html>";

            NewUserEmail(userEmail, action, html);
        }
    }
}
