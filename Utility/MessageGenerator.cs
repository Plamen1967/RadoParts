using Models.Enums;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility
{
    public class MessageGenerator
    {
        private DisplayPartView displayPartView_ = null;
        private EmailMessage emailMessage_ = new EmailMessage();
        public string Head
        {
            get
            {
                return @"
                  <head>
                    <meta charset='UTF-8' />
                    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
                    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                    <title>Document</title>
                  </head>
                ";
            }
        }

        public string MainImage
        {
            get
            {
                return @"
                    display: flex;
                    border: 1px solid black;
                    background-color: whitesmoke;
                    border-radius: 5px;
                    padding: 2px;
                    align-items: center;
                    justify-content: center;
                    background-color: blueviolet;
                    max-height: 200px;
                ";
            }
        }

        public string Body
        {
            get
            {
                return @"
                    height: 100%;
                ";
            }
        }

        public string Container
        {
            get
            {
                return @"
                    display: flex;
                    border: 1px solid black;
                    border-radius: 5px;
                ";
            }
        }

        public string Img
        {
            get
            {
                return @"
                    justify-content: center;
                    object-fit: contain;
                    max-height: inherit;
                ";
            }
        }

        public string Deatils
        {
            get
            {
                return @"
                    width: 100%;
                    padding: 2px;
                ";
            }
        }

        public string Title
        {
            get
            {
                return @"
                    display: flex;
                    justify-content: center;
                    background-color: rgb(91, 91, 238);
                    color: yellow;
                    font-size: 1.2em;
                    color: bla;
                    padding: 2px 4px;
                ";
            }
        }

        public string Item
        {
            get
            {
                return @"
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    padding: 2px 4px;
                ";
            }
        }
        
        public string Description
        {
            get
            {
                return @"
                    color: black;
                ";
            }
        }

        public string ItemEven
        {
            get
            {
                return @"
                    background-color: azure;
                ";
            }
        }
        public string ItemOdd
        {
            get
            {
                return @"
                    background-color: lightgray;
                ";
            }
        }

        public string Label
        {
            get
            {
                return @"
                    color: blueviolet;
                ";
            }
        } 

        private Tuple<string, string> getHREF()
        {
            return new Tuple<string, string>($@"Program.api/viewPart?id={displayPartView_.id}", 
                                                $@"{displayPartView_.descriptionModel}");
        }
        private string getMainImage()
        {
            string mainImageSrc = displayPartView_.mainPicture.Replace("http://localhost:4005", "http://www.radoparts.com");
             string mainImage = $@"
                                    <img style='{Img}' id='{displayPartView_.id}' 
                                         src='{mainImageSrc}'/>
                                 ";
            return mainImage;
        }
        private string getTitle()
        {
            string title = $@"<a id='title' style='{Title}' href='{getHREF().Item1}'>
                                {getHREF().Item2}
                              </a>";
            return title;
        }
        private string getDetails()
        {
            string details = $@"<div style='{MainImage}'>
                                        {getMainImage()}
                                </div>
                                <div style='{Deatils}'>
                                        {getTitle()}
                                </div>";
            return details;
        }

        private string generateTags(Dictionary<string, string> Tags)
        {
            StringBuilder stringBuilder = new StringBuilder();
            foreach (var tag in Tags)
            {
                string s = $@"
                <div class='tag'>
                    <div>{tag.Key}</div>
                    <div>{tag.Value}</div>
                </div>";

                stringBuilder.Append(s);
            }

            return stringBuilder.ToString();
        }
        private string generateBody()
        {
            using (StreamReader sr = new StreamReader(@"templates\item.html"))
            {
                string s = sr.ReadToEnd();
                return s;
            }


string body = $@"<body style='{Body}'>
                            <div style='{Container}'>
                            {getDetails()}
                            </div>
                            <div>От: {emailMessage_.name} <a href='mailto:{emailMessage_.email}'>Отговори</a></div>
                            <div>Съобщение:{emailMessage_.request}</div>
                            <body>";
            return body;
        }
        public string GenerateMessage(DisplayPartView displayPartView, EmailMessage emailMessage)
        {
            displayPartView_ = displayPartView;
            string message;
            string bodyMessage = generateBody();
            string tags = generateTags(displayPartView.Tags);
            bodyMessage = bodyMessage.Replace("{{API}}", "http:\\localhost:4200");
            bodyMessage = bodyMessage.Replace("{{ViewID}}", displayPartView.id.ToString());
            bodyMessage = bodyMessage.Replace("{{Description}}", displayPartView.descriptionModel);
            bodyMessage = bodyMessage.Replace("{{Image}}", displayPartView.mainPicture);
            bodyMessage = bodyMessage.Replace("{{NumberPhotos}}", displayPartView.numberImages.ToString());
            bodyMessage = bodyMessage.Replace("{{Dealer}}", displayPartView.sellerName);
            bodyMessage = bodyMessage.Replace("{{Tags}}", tags);

            emailMessage_ = emailMessage;
            message = $"{bodyMessage}";
            return message;
        }
    }
}


//<body>
//  <!-- <div class=""container"">
//      <div class=""panelOne""></div>
//      <div class=""panelTwo""></div>
//  </div> -->
//  <div class=""container"">
//    <div class=""mainImage"">
//      <img id=""mainImage"" src="""" />
//    </div>
//    <div id=""details"" class=""details"">
//      <a id=""title"" class=""title"" href=""""></a>
//    </div>
//  </div>
//</body>
