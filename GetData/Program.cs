using GetData.Utility;
using HtmlAgilityPack;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace GetData
{
    class Program
    {
        public static string ServerName = @"MIC12708\SQL2K19";
        public static string DatabaseName = "db876906879";
        public static string UserId = "sa";
        public static string Password = "Plamen1967";

        static public string ConnectionString
        {
            get
            {
                return $"Persist Security Info=False;server={ServerName};Initial Catalog={DatabaseName};" +
                        $"User ID={UserId};Password={Password}";
            }
        }


        static Dictionary<string, Tuple<string, string, string>> ProcessModifications(string fileData, string company, string model, string modificationName)
        {
            //if (!Directory.Exists($@"D:\data\companies\{company}\{model}"))
            //    Directory.CreateDirectory($@"D:\data\companies\{company}\{model}");

            string original = fileData;
            Dictionary<string, Tuple<string, string, string>> generations = new Dictionary<string, Tuple<string, string, string>>();
            string data = "<tbody>";
            string enddata = "/tbody>";
            string linkStart = "<a href=\"";
            string hp = "<td class=\"hidden-xs\">";
            string hpValue = "", yearFrom = "", yearTo = "";
            fileData = fileData.Substring(fileData.IndexOf(data));
            int indexOf = fileData.IndexOf(enddata);
            fileData = fileData.Substring(0, fileData.IndexOf(enddata));
            while (fileData.IndexOf(linkStart) != -1)
            {
                fileData = fileData.Substring(fileData.IndexOf(linkStart) + linkStart.Length);
                string link = fileData.Substring(0, fileData.IndexOf(">"));
                fileData = fileData.Substring(fileData.IndexOf(">")+1);
                string modification = fileData.Substring(0, fileData.IndexOf("</a"));
                fileData = fileData.Substring(fileData.IndexOf("</a") + "</a".Length);
                fileData = fileData.Substring(fileData.IndexOf("<td class=\"hidden-xs\">") + hp.Length + 1);
                hpValue = fileData.Substring(0, fileData.IndexOf("</td"));
                fileData = fileData.Substring(fileData.IndexOf("<td class=\"hidden-xs\">") + hp.Length + 1);
                fileData = fileData.Substring(fileData.IndexOf("<td>")+4);
                yearFrom = fileData.Substring(0, fileData.IndexOf("</td"));
                fileData = fileData.Substring(fileData.IndexOf("<td>") + 4);
                yearTo = fileData.Substring(0, fileData.IndexOf("</td"));
                Tuple<string, string, string> tuple = Tuple.Create(hpValue, yearFrom, yearTo);
                var found = generations.FirstOrDefault(element => element.Key == modification);
                if (found.Value == null)
                    generations.Add(modification, tuple);
            }

            return generations;
        }

        static Dictionary<string, string> ProcessModel(string fileData, string company, string model)
        {
            //if (!Directory.Exists($@"D:\data\companies\{company}\{model}"))
            //    Directory.CreateDirectory($@"D:\data\companies\{company}\{model}");

            string original = fileData;
            Dictionary<string, string> generations = new Dictionary<string, string>();
            string generationBox = "generationbox";
            string linkStart = "<a href=\"";
            string titleStart = "title=\"";
            while (fileData.IndexOf(generationBox) != -1)
            {
                fileData = fileData.Substring(fileData.IndexOf(generationBox) + generationBox.Length);
                fileData = fileData.Substring(fileData.IndexOf(linkStart) + linkStart.Length);
                string link = fileData.Substring(0, fileData.IndexOf("\""));
                fileData = fileData.Substring(fileData.IndexOf("\"") + 1);
                fileData = fileData.Substring(fileData.IndexOf(titleStart) + titleStart.Length);
                string modification = fileData.Substring(0, fileData.IndexOf("\""));
                fileData = fileData.Substring(fileData.IndexOf("\"") + 1);
                generations.Add(modification, link);
            }

            foreach (var generation in generations)
            {
                string modelData = GetHtml(generation.Value, $@"D:\data\companies\{company}\{model}\{generation.Key}.html"); ;
//                ProcessModel(modelData);

            }
            return generations;
        }

        static Dictionary<string, string> ProcessCompany(string company)
        {
            string fileData;
            using (StreamReader reader = new StreamReader($@"D:\data\companies\{company}.html"))
            {
                fileData = reader.ReadToEnd();
            }

            string originalData = fileData;
            if (!Directory.Exists($@"D:\data\companies\{company}"))
                Directory.CreateDirectory($@"D:\data\companies\{company}");

            Dictionary<string, string> models = new Dictionary<string, string>();
            string startData = "brandModels cardContainer\">";
            string endData = "<div class=\"row\">";
            string linkStart = "<a class=\"link\" href=\"";
            string titleStart = "modelName\" >";
            fileData = fileData.Substring(fileData.IndexOf(startData));
            fileData = fileData.Substring(0, fileData.IndexOf(endData));
            while (fileData.IndexOf(linkStart) != -1)
            {
                fileData = fileData.Substring(fileData.IndexOf(linkStart) + linkStart.Length);
                string link = fileData.Substring(0, fileData.IndexOf("\""));
                fileData = fileData.Substring(fileData.IndexOf("\"") + 1);
                fileData = fileData.Substring(fileData.IndexOf(titleStart));
                fileData = fileData.Substring(titleStart.Length);
                string modification = fileData.Substring(0, fileData.IndexOf("</div>"));
                fileData = fileData.Substring(fileData.IndexOf("</div>") + 1);
                if (!models.ContainsKey(modification))
                    models.Add(modification, link);
            }

            return models;

        }

        //List<string, string> ProcessModel(Model model, string company)
        //{
        //    string modelData = GetHtml(model.Value, $@"D:\data\companies\{company}\{model}.html");
        //    if (model.Value.Contains("details"))
        //    {
        //        if (!Directory.Exists($@"D:\data\companies\{company}\{model.Key}"))
        //            Directory.CreateDirectory($@"D:\data\companies\{company}\{model.Key}");
        //        if (!Directory.Exists($@"D:\data\companies\{company}\{model.Key}\{model.Key}"))
        //            Directory.CreateDirectory($@"D:\data\companies\{company}\{model.Key}\{model.Key}");

        //        using (StreamWriter writer = new StreamWriter($@"D:\data\companies\{company}\{model.Key}\{model.Key}.html"))
        //        {
        //            writer.Write(modelData);
        //        }
        //    }
        //    else
        //        ProcessModel(modelData, company, model.Key);
        //}

        static string GetHtml(string url, string filename)
        {
            string result = "";
            try
            {
                string path = $"https://bg.autodata24.com/{url}";
                //string resource = $"/cars/{companyName}/{gropModelName}/{modificationName}";
                HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(path);
                myRequest.Method = "GET";
                WebResponse myResponse = myRequest.GetResponse();
                StreamReader sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
                result = sr.ReadToEnd();
                //using (StreamWriter writer = new StreamWriter(filename))
                //{
                //    writer.Write(result);
                //}
            }
            catch(Exception exception)
            {
                return "";
            }

            return result;
        }

        static void GetData()
        {
            if (!Directory.Exists($@"D:\data"))
                Directory.CreateDirectory($@"D:\data");

            if (!Directory.Exists($@"D:\data\companies"))
                Directory.CreateDirectory($@"D:\data\companies");

            string jsonString;
            using (StreamReader jsonFile = new StreamReader("d:\\temp\\make24_withWebPage.json"))
            {
                jsonString = jsonFile.ReadToEnd();
            }
            List<Make> makes = JsonConvert.DeserializeObject<List<Make>>(jsonString);

            foreach (var make in makes)
            {
                foreach (var model in make.models)
                {
                    if (model.webPage == null)
                        continue;

                    if (model.webPage.Contains("details"))
                    {
                        string modelData = GetHtml(model.webPage, $@"D:\data\companies\{make.name}\{model.name}.html");
                        if (modelData == "") continue;
                        Dictionary<string, Tuple<string, string, string>> generation = ProcessModifications(modelData, make.name, model.name, model.name);
                        var modification = model.modifications[0];
                        foreach (var submodel in modification.submodel)
                        {
                            var item = generation.FirstOrDefault(element => element.Key == submodel.name);
                            if (item.Value == null) continue;
                            int hpValue = 0, yearToValue = 0, yearFromValue = 0;
                            Tuple<string, string, string> tuple = item.Value;
                            if (Int32.TryParse(tuple.Item1, out hpValue))
                                submodel.hp = hpValue;
                            if (Int32.TryParse(tuple.Item2, out yearFromValue))
                                submodel.yearFrom = yearFromValue;
                            if (Int32.TryParse(tuple.Item3, out yearToValue))
                                submodel.yearTo = yearToValue;
                        }
                    }
                    else
                    {
                        continue;
                        string modelData = GetHtml(model.webPage, $@"D:\data\companies\{make.name}\{model.name}.html");
                        if (modelData == "") continue;
                        Dictionary<string, string> generations = ProcessModel(modelData, make.name, model.name);

                        foreach (var generation1 in generations)
                        {
                            var modification = model.modifications.FirstOrDefault(element => element.name == generation1.Key);
                            if (modification == null || modification.name == null) continue;

                            modelData = GetHtml(generation1.Value, $@"D:\data\companies\{make.name}\{model.name}.html");
                            if (modelData == "") continue;
                            Dictionary<string, Tuple<string, string, string>> generation = ProcessModifications(modelData, make.name, model.name, model.name);
                            foreach (var submodel in modification.submodel)
                            {
                                var item = generation.FirstOrDefault(element => element.Key == submodel.name);
                                if (item.Value == null) continue;
                                int hpValue = 0, yearToValue = 0, yearFromValue = 0;
                                Tuple<string, string, string> tuple = item.Value;
                                if (Int32.TryParse(tuple.Item1, out hpValue))
                                    submodel.hp = hpValue;
                                if (Int32.TryParse(tuple.Item2, out yearFromValue))
                                    submodel.yearFrom = yearFromValue;
                                if (Int32.TryParse(tuple.Item3, out yearToValue))
                                    submodel.yearTo = yearToValue;
                            }
                        }
                    }
                }
                make.done = true;
                string json1 = JsonConvert.SerializeObject(makes);
                using (StreamWriter writer = new StreamWriter("d:\\temp\\make24_withWebPage.json"))
                {
                    writer.WriteLine(json1);
                }
            }
            //foreach (var company in companiesList)
            //{
            //    Console.WriteLine($"Processing {company.Value}");
            //    Make make = makes.Find(element => element.name == company.Value);
            //    if (make == null) continue;
            //    Dictionary<string, string> models = ProcessCompany(company.Value);
            //    foreach(var model in models)
            //    {
            //        var modelDB = make.models.FirstOrDefault(element => element.name == model.Key);
            //        if (modelDB != null)
            //        modelDB.webPage = model.Value;
            //    }

            //}

            string json = JsonConvert.SerializeObject(makes);
            using (StreamWriter writer = new StreamWriter("d:\\temp\\make24_withWebPage.json"))
            {
                writer.WriteLine(json);
            }

            //using (StreamReader reader = new StreamReader(@"D:\data\A8.html"))
            //{
            //    string fileData = reader.ReadToEnd();
            //    models = ProcessModel(fileData);
            //}



            //using (StreamReader reader = new StreamReader(@"D:\data\A8.html"))
            //{
            //    string fileData = reader.ReadToEnd();
            //}
            //StoreInDB();

            //foreach(var company in companiesList)
            //{
            //    //myRequest.Headers.Add(HttpRequestHeader.Accept, "application/json, text/javascript, */*; q=0.01");
            //    //myRequest.Headers.Add(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded; charset=UTF-8");
            //    //myRequest.Headers.Add(HttpRequestHeader.Referer, "https://autodata24.com/compare");
            //    //myRequest.Headers.Add(HttpRequestHeader.UserAgent, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36");
            //    //myRequest.Headers.Add("X-Requested-With", "XMLHttpRequest");
            //    //myRequest.Headers.Add("sec-ch-ua", "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"");
            //    //myRequest.Headers.Add("sec-ch-ua-mobile", "?0");
            //    //myRequest.Headers.Add("sec-ch-ua-platform", "\"Windows\"");

            //    myRequest.Method = "GET";
            //    WebResponse myResponse = myRequest.GetResponse();
            //    StreamReader sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
            //    string result = sr.ReadToEnd();
            //    string fileName = $"d:\\data\\companies\\{company.Value}.html";
            //    using (StreamWriter writer = new StreamWriter(fileName))
            //    {
            //        writer.Write(result);
            //    }
            //}
        }

        static async Task Main(string[] args)
        {
            StoreInDB();
        }

        static void StoreInDB()
        {
            string jsonString;
            using (StreamReader jsonFile = new StreamReader("d:\\temp\\make24_withWebPage.json"))
            {
                jsonString = jsonFile.ReadToEnd();
            }
            List<Make> make = JsonConvert.DeserializeObject<List<Make>>(jsonString);

            for (int i = 0; i < make.Count; i++)
            {
                int companyId = make[i].id;
                string companyName = make[i].name;
                StoreCompany(companyId, companyName);
                for (int m = 0; m < make[i].models.Count(); m++)
                {
                    int groupModelId = make[i].models[m].id;
                    string gropModelName = make[i].models[m].name;
                    StoreGroupModel(groupModelId, companyId, gropModelName);
                    for (int d = 0; d < make[i].models[m].modifications.Count(); d++)
                    {
                        //List<RowData> rowData = LoadPage(companyName, gropModelName, make[i].models[m].modifications[d].name);
                        int modelId = make[i].models[m].modifications[d].id;
                        int yearFrom = 0, yearTo = 0;
                        int powerPH = 0;
                        //foreach (var submodel in make[i].models[m].modifications[d].submodel)
                        //{
                        //    if (submodel.yearFrom != 0 && submodel.yearFrom < yearFrom)
                        //        yearFrom = submodel.yearFrom;
                        //    if (yearTo != 0)
                        //    {
                        //        if (submodel.yearTo == 0) yearTo = 0;
                        //        else if (submodel.yearTo > yearTo) yearTo = submodel.yearTo;
                        //    }
                        //}

                        //make[i].models[m].modifications[d].yearFrom = yearFrom;
                        //make[i].models[m].modifications[d].yearTo = yearTo;

                        StoreModel(modelId, groupModelId, companyId, make[i].models[m].modifications[d].name, make[i].models[m].name, yearFrom, yearTo);

                        for (int s = 0; s < make[i].models[m].modifications[d].submodel.Count(); s++)
                        {

                            yearFrom = make[i].models[m].modifications[d].submodel[s].yearFrom;
                            yearTo = make[i].models[m].modifications[d].submodel[s].yearTo;
                            powerPH = make[i].models[m].modifications[d].submodel[s].hp;
                            //var row = rowData.Where(element => element.modification == make[i].models[m].modifications[d].submodel[s].name);
                            //if (row.Count() > 0)
                            //{
                            //    RowData element = row.ElementAt(0);
                            //    yearFrom = element.yearFrom;
                            //    yearTo = element.yearTo;
                            //    make[i].models[m].modifications[d].submodel[s].yearFrom = yearFrom;
                            //    make[i].models[m].modifications[d].submodel[s].yearTo = yearTo;
                            //}
                            StoreModification(make[i].models[m].modifications[d].submodel[s].id, modelId, make[i].models[m].modifications[d].submodel[s].name, powerPH, yearFrom, yearTo);
                        }
                    }
                }
            }


        }

        // RS4 Avant - missing

        //A3 Sportback(8P) 
        //sportback-8p
        public static List<RowData> LoadPage(string companyName, string gropModelName, string modificationName)
        {
            // Suzuki Wagon missing
            companyName = companyName.Replace(' ', '-');
            gropModelName = gropModelName.Replace(' ', '-');
            if (modificationName == "A6(4B, C5))")
                modificationName = "a6-4b-c5";
            else if (modificationName == "A6 Avant(4F, C6))")
                modificationName = "avant-4f-c6";
            else if (modificationName == "A6 Avant(4B,C5)")
                modificationName = "a6-avant-4b-c5";
            else if (modificationName == "A8(D4, 4H)")
                modificationName = "a8-d4-4h";
            else if (modificationName == "A8 Long(D4, 4H)")
                modificationName = "a8-long-d4-4h";
            else if (modificationName == "A8 (D3,4E)")
                modificationName = "a8-d3-4e";
            else if (modificationName == "A8 (D3,4E)")
                modificationName = "a8-long-4e";
            else if (modificationName == "A8 (D2,4D)")
                modificationName = "a8-d2-4d";
            else if (modificationName == "Quattro (4F,C6)")
                modificationName = "quattro-4f-c6";
            else if (modificationName == "(4B,C5)")
                modificationName = "4b-c5";
            else if (modificationName == "(4B,C5)")
                modificationName = "4b-c5";
            else if (modificationName == "Avant (4B,C5)")
                modificationName = "avant-4b-c5";
            else if (modificationName == "(4F,C6)")
                modificationName = "4f-c6";
            else if (modificationName == "Avant(4F, C6)")
                modificationName = "avant-4f-c6";
            else if (modificationName == "(4B,C5)")
                modificationName = "4b-c5";
            else if (modificationName == "IV (9N3)")
                modificationName = "iv-9n3";
            else if (modificationName == "V")
                modificationName = "v";
            else if (modificationName == "Sport Coupe (203)")
                modificationName = "sport-coupe-203";
            else if (modificationName == "Coupe (C124)")
                modificationName = "coupe-c124";
            else if (modificationName == "(ET,TA)")
                modificationName = "et-ta";
            else if (modificationName == "IV Hatchback")
                modificationName = "iv-hatchback";
            else if (modificationName == "Coupe I (GFC)")
                modificationName = "coupe-i-gfc";
            else if (modificationName == "(N1 W, N2 W)")
                modificationName = "n1-w-n2-w";
            else if (modificationName == "(N3 W, N4 W)")
                modificationName = "n3-w-n4-w";
            else if (modificationName == "IV (9N3)")
                modificationName = "iv-9n3";


            else if (modificationName == "-Единствена-")
                modificationName = "-";
            else
            {
                int index = modificationName.IndexOf(')');
                if (index != -1)
                    modificationName = modificationName.Remove(index, 1);
                index = modificationName.IndexOf('(');
                if (index != -1)
                    modificationName = modificationName.Remove(index, 1);
                modificationName = modificationName.Replace('/', '-');
                modificationName = modificationName.Replace(',', '-');
                modificationName = modificationName.TrimStart();
                modificationName = modificationName.Replace(' ', '-');
            }

            string uri = $"https://www.autodata.bg";
            string resource = $"/cars/{companyName}/{gropModelName}/{modificationName}";
            string path = "https://www.autodata.bg" + resource;

            {
                HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(path);
                myRequest.Method = "GET";
                WebResponse myResponse = myRequest.GetResponse();
                StreamReader sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
                string result = sr.ReadToEnd();
                //HtmlDocument doc = new HtmlDocument();
                //doc.Load(result);
                //foreach (HtmlNode link in doc.DocumentElement.SelectNodes("//a[@href"])
                //{
                //    HtmlAttribute att = link["href"];
                //    att.Value = FixLink(att);
                //}
                //doc.Save("file.htm");
                int index2 = result.IndexOf("<table");
                if (index2 != -1)
                {
                    result = result.Substring(index2);
                    int index3 = result.IndexOf("</table>");
                    result = result.Substring(0, index3 + "</table>".Length);
                }

                int indexStart = result.IndexOf("<tr class=");
                List<string> rows = new List<string>();
                List<RowData> dataRow = new List<RowData>();
                while (indexStart != -1)
                {
                    indexStart = result.IndexOf("<tr class=");
                    result = result.Substring(indexStart);
                    string row = result.Substring(0, result.IndexOf("</tr>") + "</tr>".Length);
                    RowData data = GetRowData(row);
                    dataRow.Add(data);
                    rows.Add(row);
                    result = result.Substring(result.IndexOf("</tr>") + "</tr>".Length);
                    indexStart = result.IndexOf("<tr class=");
                }

                sr.Close();
                myResponse.Close();

                return dataRow;
            }


            //var client = new RestClient("https://www.autodata.bg");
            //var request = new RestRequest(resource, Method.Get);
            ////var request = new RestRequest("https://www.autodata.bg/public/listmodels", Method.Post);
            //request.AddHeader("Cookie", "PHPSESSID=mo1n9i68cvlhq25hhl0hnqac91");
            //request.AlwaysMultipartFormData = true;
            //// https://www.autodata.bg/cars/audi/a1/-
            //RestResponse response = client.Execute(request);
            //string html = response.Content;

            //{
            //    var client2 = new RestClient("https://www.autodata.bg");
            //    var request2 = new RestRequest(resource, Method.Get);
            //    request.AddHeader("Cookie", "PHPSESSID=kh5u6i0lpqlskrn0obko2a0kv6");
            //    RestResponse response2 = client.Execute(request);
            //    Console.WriteLine(response2.Content);

            //}
            //Console.WriteLine(html);

        }
        public static RowData GetRowData(string row)
        {
            string a = row.Substring(row.IndexOf("<a"));
            a = a.Substring(0, a.IndexOf("</a>"));
            a = a.Substring(a.LastIndexOf(">") + 1);
            RowData data = new RowData();
            row = row.Substring(row.IndexOf("<td") + 3);
            row = row.Substring(row.IndexOf("<td") + 3);
            row = row.Substring(row.IndexOf("<td") + 3);
            string yearFrom = row.Substring(row.IndexOf("<td"));
            yearFrom = yearFrom.Substring(yearFrom.IndexOf(">") + 1);
            yearFrom = yearFrom.Substring(0, yearFrom.IndexOf("</th"));
            yearFrom = yearFrom.Trim();
            int yF;
            Int32.TryParse(yearFrom, out yF);
            data.yearFrom = yF;
            row = row.Substring(row.IndexOf("<td") + 3);
            row = row.Substring(row.IndexOf("<td"));
            string yearTo = row.Substring(row.IndexOf(">") + 1);
            yearTo = yearTo.Substring(0, yearTo.IndexOf("</th"));
            yearTo = yearTo.Trim();
            yF = 0;
            if (yearTo != "-")
            {
                Int32.TryParse(yearTo, out yF);
                data.yearTo = yF;
            }
            row = row.Substring(row.IndexOf("<td") + 3);
            data.modification = a;
            return data;
        }
        static void StoreCompany(int companyId, string companyName)
        {
            try
            {
                string statement = "CompanyIns";
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
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
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
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
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
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

        static void StoreModification(int modificationId, int modelId, string modificationName, int powepHP, int yearFrom, int yearTo)
        {
            try
            {
                string statement = "ModificationData";
                using (SqlConnection sqlConnection = new SqlConnection(Program.ConnectionString))
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
                        sqlCommand.Parameters.Add("@powerHP", System.Data.SqlDbType.Int).Value = powepHP;
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

        static IdName[] saveData(string dataModel)
        {
            dataModel = dataModel.Replace('"', '\'');
            // <option value='427' >Ace</option>
            List<IdName> values = new List<IdName>();
            int index = dataModel.IndexOf("value=");
            while (index != -1)
            {
                index = dataModel.IndexOf("value=");
                if (index == -1) break;
                dataModel = dataModel.Substring(index);
                index = dataModel.IndexOf("'");
                dataModel = dataModel.Substring(index + 1);
                int index2 = dataModel.IndexOf("'");
                string id = dataModel.Substring(0, index2);
                if (id != "")
                {

                    index = dataModel.IndexOf(">");
                    string name = dataModel.Substring(index + 1);
                    index = name.IndexOf("<");
                    name = name.Substring(0, index);
                    Console.WriteLine(name);
                    Console.WriteLine(id);
                    values.Add(new IdName() { id = id, name = name });

                }
            }

            return values.ToArray();

        }

        static public IdName[] GetData(string requestURI, string id)
        {
            var client = new RestClient("https://www.autodata.bg");
            var request = new RestRequest($"/public/{requestURI}", Method.Post);
            //var request = new RestRequest("https://www.autodata.bg/public/listmodels", Method.Post);
            request.AddHeader("Cookie", "PHPSESSID=mo1n9i68cvlhq25hhl0hnqac91");
            request.AlwaysMultipartFormData = true;
            request.AddParameter("id", id);
            RestResponse response = client.Execute(request);

            IdName[] values = saveData(response.Content);
            return values;
        }

        void DownLoadData()
        {
            string newLine = "\r\n";
            string element(string name, string id)
            {
                return String.Format("{0}'name':'{1}', {2} 'id':{3}", newLine, name, newLine, id);
            }

            //string dataStr = @"<option value=''>-----</option><option value='427' >Ace</option><option value='428' >Aceca</option><option value='429' >Cobra</option>";
            //IdName[] data = saveData(dataStr);
            string json = "{" + newLine;
            json += "'make':";
            json += newLine;
            json += "[";
            List<string> makes = new List<string>();
            foreach (var make in data)
            {
                string elementMake = "{";
                elementMake += element(make.make, make.id.ToString());
                elementMake += "," + newLine;
                elementMake += "'models':";
                elementMake += newLine;
                elementMake += "[";
                IdName[] models = GetData("listmodels", make.id.ToString());
                List<string> listmodels = new List<string>();
                foreach (var model in models)
                {
                    string elementModel = "{" + newLine;
                    elementModel += element(model.name, model.id);
                    elementModel += "," + newLine;
                    elementModel += "'modifications':";
                    elementModel += newLine;
                    elementModel += "[" + newLine;
                    IdName[] modifications = GetData("listsubmodels", model.id.ToString());
                    List<string> mods = new List<string>();
                    foreach (var modification in modifications)
                    {
                        string elementMod = "{" + newLine;
                        elementMod += element(modification.name, modification.id);
                        elementMod += "," + newLine;
                        elementMod += "'submodel':";
                        elementMod += newLine;
                        elementMod += "[" + newLine;
                        IdName[] motors = GetData("listmods", modification.id.ToString());
                        List<string> subModel = new List<string>();
                        foreach (var motor in motors)
                        {
                            string elementMotor = "{" + newLine;
                            elementMotor += element(motor.name, motor.id);
                            elementMotor += "}";
                            subModel.Add(elementMotor);
                        }
                        elementMod += String.Join(",\r\n", subModel);
                        elementMod += newLine + "]";
                        elementMod += newLine + "}";
                        mods.Add(elementMod);
                    }
                    elementModel += String.Join(",\r\n", mods);
                    elementModel += newLine + "]";
                    elementModel += newLine + "}";
                    listmodels.Add(elementModel);
                }
                elementMake += String.Join(",\r\n", listmodels);
                elementMake += newLine + "]";
                elementMake += newLine + "}";
                makes.Add(elementMake);
            }

            json += String.Join(",\r\n", makes);
            json += newLine + "]";
            json += newLine + "}"; json = json.Replace("'", "\"");
            using (StreamWriter writer = new StreamWriter("d:\\temp\\data.json"))
            {
                writer.WriteLine(json);
            }


        }
        static MakeModel[] data = new MakeModel[] {
        new MakeModel() {
            make="AC",
            id=113
        },
        new MakeModel() {
            make="Acura",
            id=114
        },
        new MakeModel() {
    make="Alfa Romeo",
            id=28
        },
        new MakeModel() {
    make="Alpine",
            id=115
        },
        new MakeModel() {
    make="Ariel",
            id=117
        },
        new MakeModel() {
    make="Aro",
            id=116
        },
        new MakeModel() {
    make="Asia",
            id=119
        },
        new MakeModel() {
    make="Aston Martin",
            id=118
        },
        new MakeModel() {
    make="Audi",
            id=7
        },
        new MakeModel() {
    make="Austin",
            id=120
        },
        new MakeModel() {
    make="Autobianchi",
            id=121
        },
        new MakeModel() {
    make="Bentley",
            id=69
        },
        new MakeModel() {
    make="BMW",
            id=6
        },
        new MakeModel() {
    make="Bugatti",
            id=70
        },
        new MakeModel() {
    make="Citroen",
            id=71
        },
        new MakeModel() {
    make="Dacia",
            id=72
        },
        new MakeModel() {
    make="Daewoo",
            id=73
        },
        new MakeModel() {
    make="Daihatsu",
            id=74
        },
        new MakeModel() {
    make="Ferrari",
            id=75
        },
        new MakeModel() {
    make="Fiat",
            id=76
        },
        new MakeModel() {
    make="Ford",
            id=35
        },
        new MakeModel() {
    make="Honda",
            id=77
        },
        new MakeModel() {
    make="Hummer",
            id=78
        },
        new MakeModel() {
    make="Hyundai",
            id=79
        },
        new MakeModel() {
    make="Infinity",
            id=68
        },
        new MakeModel() {
    make="Isuzu",
            id=80
        },
        new MakeModel() {
    make="Jaguar",
            id=81
        },
        new MakeModel() {
    make="Jeep",
            id=82
        },
        new MakeModel() {
    make="Kia",
            id=83
        },
        new MakeModel() {
    make="Koenigsegg",
            id=84
        },
        new MakeModel() {
    make="Lamborghini",
            id=85
        },
        new MakeModel() {
    make="Lancia",
            id=86
        },
        new MakeModel() {
    make="Land Rover",
            id=87
        },
        new MakeModel() {
    make="Lexus",
            id=88
        },
        new MakeModel() {
    make="Lotus",
            id=89
        },
        new MakeModel() {
    make="Marussia",
            id=110
        },
        new MakeModel() {
    make="Maserati",
            id=90
        },
        new MakeModel() {
    make="Maybach",
            id=91
        },
        new MakeModel() {
    make="Mazda",
            id=92
        },
        new MakeModel() {
    make="Mercedes-Benz",
            id=93
        },
        new MakeModel() {
    make="Mini",
            id=94
        },
        new MakeModel() {
    make="Mitsubishi",
            id=95
        },
        new MakeModel() {
    make="Nissan",
            id=96
        },
        new MakeModel() {
    make="Opel",
            id=63
        },
        new MakeModel() {
    make="Peugeot",
            id=44
        },
        new MakeModel() {
    make="Pontiac",
            id=109
        },
        new MakeModel() {
    make="Porsche",
            id=61
        },
        new MakeModel() {
    make="Renault",
            id=51
        },
        new MakeModel() {
    make="Rolls Royce",
            id=97
        },
        new MakeModel() {
    make="Rover",
            id=98
        },
        new MakeModel() {
    make="Saab",
            id=99
        },
        new MakeModel() {
    make="Scion",
            id=100
        },
        new MakeModel() {
    make="Seat",
            id=31
        },
        new MakeModel() {
    make="Skoda",
            id=101
        },
        new MakeModel() {
    make="Smart",
            id=102
        },
        new MakeModel() {
    make="SsangYong",
            id=103
        },
        new MakeModel() {
    make="Subaru",
            id=104
        },
        new MakeModel() {
    make="Suzuki",
            id=105
        },
        new MakeModel() {
    make="Tesla",
            id=122
        },
        new MakeModel() {
    make="Toyota",
            id=107
        },
        new MakeModel() {
    make="Volkswagen",
            id=18
        },
        new MakeModel() {
    make="Volvo",
            id=108
        }
    };
        static Dictionary<string, string> companiesList = new Dictionary<string, string> {
         {"/acura/list" ,"Acura"},
        {"/alfa-romeo/list" ,"Alfa Romeo"},
        {"/alpina/list" ,"Alpina"},
        {"/alpine/list" ,"Alpine"},
        {"/aro/list" ,"Aro"},
        {"/asia/list" ,"Asia"},
        {"/aston-martin/list" ,"Aston Martin"},
        {"/audi/list" ,"Audi"},
        {"/austin/list" ,"Austin"},
        {"/autobianchi/list" ,"Autobianchi"},
        {"/baltijas-dzips/list" ,"Baltijas Dzips"},
        {"/beijing/list" ,"Beijing"},
        {"/bentley/list" ,"Bentley"},
        {"/bertone/list" ,"Bertone"},
        {"/bitter/list" ,"Bitter"},
        {"/blonell/list" ,"Blonell"},
        {"/bmw/list" ,"BMW"},
        {"/brilliance/list" ,"Brilliance"},
        {"/bristol/list" ,"Bristol"},
        {"/bufori/list" ,"Bufori"},
        {"/bugatti/list" ,"Bugatti"},
        {"/buick/list" ,"Buick"},
        {"/byd/list" ,"BYD"},
        {"/cadillac/list" ,"Cadillac"},
        {"/callaway/list" ,"Callaway"},
        {"/carbodies/list" ,"Carbodies"},
        {"/caterham/list" ,"Caterham"},
        {"/changan/list" ,"ChangAn"},
        {"/changfeng/list" ,"ChangFeng"},
        {"/chery/list" ,"Chery"},
        {"/chevrolet/list" ,"Chevrolet"},
        {"/chrysler/list" ,"Chrysler"},
        {"/citroen/list" ,"Citroen"},
        {"/cizeta/list" ,"Cizeta"},
        {"/coggiola/list" ,"Coggiola"},
        {"/dacia/list" ,"Dacia"},
        {"/dadi/list" ,"Dadi"},
        {"/daewoo/list" ,"Daewoo"},
        {"/daf/list" ,"DAF"},
        {"/daihatsu/list" ,"Daihatsu"},
        {"/daimler/list" ,"Daimler"},
        {"/dallas/list" ,"Dallas"},
        {"/de-lorean/list" ,"De Lorean"},
        {"/de-tomaso/list" ,"De Tomaso"},
        {"/derways/list" ,"Derways"},
        {"/dodge/list" ,"Dodge"},
        {"/dongfeng/list" ,"DongFeng"},
        {"/doninvest/list" ,"Doninvest"},
        {"/donkervoort/list" ,"Donkervoort"},
        {"/eagle/list" ,"Eagle"},
        {"/faw/list" ,"FAW"},
        {"/ferrari/list" ,"Ferrari"},
        {"/fiat/list" ,"Fiat"},
        {"/ford/list" ,"Ford"},
        {"/fso/list" ,"FSO"},
        {"/fuqi/list" ,"Fuqi"},
        {"/gaz/list" ,"GAZ"},
        {"/geely/list" ,"Geely"},
        {"/geo/list" ,"Geo"},
        {"/gmc/list" ,"GMC"},
        {"/gonow/list" ,"Gonow"},
        {"/great-wall/list" ,"Great Wall"},
        {"/hafei/list" ,"Hafei"},
        {"/hindustan/list" ,"Hindustan"},
        {"/holden/list" ,"Holden"},
        {"/honda/list" ,"Honda"},
        {"/huanghai/list" ,"HuangHai"},
        {"/hummer/list" ,"Hummer"},
        {"/hurtan/list" ,"Hurtan"},
        {"/hyundai/list" ,"Hyundai"},
        {"/infiniti/list" ,"Infiniti"},
        {"/innocenti/list" ,"Innocenti"},
        {"/invicta/list" ,"Invicta"},
        {"/iran-khodro/list" ,"Iran Khodro"},
        {"/irmscher/list" ,"Irmscher"},
        {"/isdera/list" ,"Isdera"},
        {"/isuzu/list" ,"Isuzu"},
        {"/iveco/list" ,"Iveco"},
        {"/izh/list" ,"Izh"},
        {"/jac/list" ,"JAC"},
        {"/jaguar/list" ,"Jaguar"},
        {"/jeep/list" ,"Jeep"},
        {"/jensen/list" ,"Jensen"},
        {"/jiangling/list" ,"Jiangling"},
        {"/kamaz/list" ,"Kamaz"},
        {"/kia/list" ,"Kia"},
        {"/koenigsegg/list" ,"Koenigsegg"},
        {"/ktm/list" ,"KTM"},
        {"/lamborghini/list" ,"Lamborghini"},
        {"/lancia/list" ,"Lancia"},
        {"/land-rover/list" ,"Land Rover"},
        {"/landwind/list" ,"Landwind"},
        {"/lexus/list" ,"Lexus"},
        {"/liebao-motor/list" ,"Liebao Motor"},
        {"/lifan/list" ,"Lifan"},
        {"/lincoln/list" ,"Lincoln"},
        {"/lotus/list" ,"Lotus"},
        {"/lti/list" ,"LTI"},
        {"/luaz/list" ,"LUAZ"},
        {"/mahindra/list" ,"Mahindra"},
        {"/marcos/list" ,"Marcos"},
        {"/marlin/list" ,"Marlin"},
        {"/maruti/list" ,"Maruti"},
        {"/maserati/list" ,"Maserati"},
        {"/maybach/list" ,"Maybach"},
        {"/mazda/list" ,"Mazda"},
        {"/mc-laren/list" ,"Mc Laren"},
        {"/mcc/list" ,"MCC"},
        {"/mega/list" ,"Mega"},
        {"/mercedes-benz/list" ,"Mercedes-Benz"},
        {"/mercury/list" ,"Mercury"},
        {"/metrocab/list" ,"Metrocab"},
        {"/mg/list" ,"MG"},
        {"/microcar/list" ,"Microcar"},
        {"/minelli/list" ,"Minelli"},
        {"/mini/list" ,"Mini"},
        {"/mitsubishi/list" ,"Mitsubishi"},
        {"/mitsuoka/list" ,"Mitsuoka"},
        {"/monte-carlo/list" ,"Monte Carlo"},
        {"/morgan/list" ,"Morgan"},
        {"/morris/list" ,"Morris"},
        {"/moskvich/list" ,"Moskvich"},
        {"/nissan/list" ,"Nissan"},
        {"/noble/list" ,"Noble"},
        {"/oldsmobile/list" ,"Oldsmobile"},
        {"/opel/list" ,"Opel"},
        {"/osca/list" ,"Osca"},
        {"/pagani/list" ,"Pagani"},
        {"/panoz/list" ,"Panoz"},
        {"/paykan/list" ,"Paykan"},
        {"/perodua/list" ,"Perodua"},
        {"/peugeot/list" ,"Peugeot"},
        {"/plymouth/list" ,"Plymouth"},
        {"/pontiac/list" ,"Pontiac"},
        {"/porsche/list" ,"Porsche"},
        {"/premier/list" ,"Premier"},
        {"/proton/list" ,"Proton"},
        {"/puch/list" ,"PUCH"},
        {"/puma/list" ,"Puma"},
        {"/qvale/list" ,"Qvale"},
        {"/reliant/list" ,"Reliant"},
        {"/renault/list" ,"Renault"},
        {"/renault-samsung/list" ,"Renault Samsung"},
        {"/rolls-royce/list" ,"Rolls-Royce"},
        {"/ronart/list" ,"Ronart"},
        {"/rover/list" ,"Rover"},
        {"/saab/list" ,"Saab"},
        {"/saleen/list" ,"Saleen"},
        {"/saturn/list" ,"Saturn"},
        {"/scion/list" ,"Scion"},
        {"/seat/list" ,"Seat"},
        {"/seaz/list" ,"SeAZ"},
        {"/shuanghuan/list" ,"ShuangHuan"},
        {"/skoda/list" ,"Skoda"},
        {"/sma/list" ,"SMA"},
        {"/smart/list" ,"Smart"},
        {"/smz/list" ,"SMZ"},
        {"/soueast/list" ,"Soueast"},
        {"/spectre/list" ,"Spectre"},
        {"/spyker/list" ,"Spyker"},
        {"/ssangyong/list" ,"SsangYong"},
        {"/subaru/list" ,"Subaru"},
        {"/suzuki/list" ,"Suzuki"},
        {"/tagaz/list" ,"TagAz"},
        {"/talbot/list" ,"Talbot"},
        {"/tata/list" ,"Tata"},
        {"/tatra/list" ,"Tatra"},
        {"/tesla/list" ,"Tesla"},
        {"/tianma/list" ,"Tianma"},
        {"/tianye/list" ,"Tianye"},
        {"/tofas/list" ,"Tofas"},
        {"/toyota/list" ,"Toyota"},
        {"/trabant/list" ,"Trabant"},
        {"/triumph/list" ,"Triumph"},
        {"/tvr/list" ,"TVR"},
        {"/uaz/list" ,"UAZ"},
        {"/vauxhall/list" ,"Vauxhall"},
        {"/vaz/list" ,"VAZ (Lada)"},
        {"/vector/list" ,"Vector"},
        {"/venturi/list" ,"Venturi"},
        {"/vespa/list" ,"Vespa"},
        {"/volkswagen/list" ,"Volkswagen"},
        {"/volvo/list" ,"Volvo"},
        {"/vw-porsche/list" ,"VW-Porsche"},
        {"/wartburg/list" ,"Wartburg"},
        {"/westfield/list" ,"Westfield"},
        {"/wiesmann/list" ,"Wiesmann"},
        {"/xin-kai/list" ,"Xin Kai"},
        {"/yuejin/list" ,"YueJin"},
        {"/zastava/list" ,"Zastava"},
        {"/zaz/list" ,"ZAZ"},
        {"/zil/list" ,"ZIL"},
        {"/zx/list" ,"ZX"}
        };

    };
};

        // https://www.autodata.bg/public/listsubmodels
        // https://www.autodata.bg/public/listmods


// 
//saveData(dataStr);
//foreach(var make in data)
//{
//    string path = $"d:\\temp\\data\\{make.id}.txt";
//    using (StreamWriter writer = new StreamWriter(path))
//    {
//        string dataModel = response.Content;
//        writer.WriteLine(response.Content);
//    }

//}

//    var client = new HttpClient();

//    client.Timeout = TimeSpan.FromSeconds(300);
//    client.DefaultRequestHeaders.Accept.Add(
//new MediaTypeWithQualityHeaderValue("*/*"));

//    var request = new HttpRequestMessage();
//    request.Method = HttpMethod.Post;
//    request.RequestUri = new Uri();

//    var content = new MultipartFormDataContent();

//    content.Add(new StringContent("id"), "113");
//    content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");


//    request.Content = content;
//    request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded"); ;

//    var response = await client.PostAsync(request.RequestUri.ToString(), request.Content);
//    var result = response.Content.ReadAsStringAsync().Result;
