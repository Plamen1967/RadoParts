using Models.Models;
using Rado;
using System.Collections.Generic;

namespace Rado.Abuse
{
    public class Validation
    {
        static List<string> invalidWords = new List<string>()
        {
            "sex","select","delete","dbo.","sys.","porn"
        };

        static List<string> sqlWords = new List<string>()
        {
            "select","delete","dbo.","sys.","user", "drop", "table", ";", "'", "--", "/*", "*/", "xp_", "sp_", "EXECUTE", "EXEC", "sp_executesql", "create", "procedure"
        };

        public static bool BlockPart(Part part)
        {
            foreach (string word in invalidWords)
            {
                if (part.Description != null && part.Description.ToLower().Contains(word.ToLower())) 
                {
                    return true;
                }

                if (part.PartNumber != null && part.PartNumber.ToLower().Contains(word.ToLower()))
                {
                    return true;
                }

                if (part.DealerSubCategoryName.ToLower().Contains(word.ToLower()))
                {
                    return true;
                }
            }
            return false; ;
        }

        static public bool BlockCar(Car car)
        {
            foreach (string word in invalidWords)
            {
                if (car.Vin.ToLower().Contains(word.ToLower()))
                {
                    return true;
                }

                if (car.Description.ToLower().Contains(word.ToLower()))
                {
                    return true;
                }
            }
            return false; ;
        }
        static public Part RemoveInvalidWord(Part part)
        {
            foreach (string word in sqlWords)
            {
                part.Description = removeWord(part.Description, word);
                part.PartNumber = removeWord(part.PartNumber, word);
                part.DealerSubCategoryName = removeWord(part.DealerSubCategoryName, word);
            }

            return part;
        }

        static public Car RemoveInvalidWord(Car car)
        {
            foreach (string word in sqlWords)
            {
                car.Description = removeWord(car.Description, word);
                car.Vin = removeWord(car.Vin, word);
            }

            return car;
        }

        static public string removeWord(string data, string word)
        {
            int startIndex = data.ToLower().IndexOf(word.ToLower());
            while (startIndex > 0)
            {
                data = data.Remove(startIndex, word.Length);
                startIndex = data.ToLower().IndexOf(word.ToLower());
            }

            return data;
        }

        private string SafeSqlLiteral(string inputSQL)
        {
            return inputSQL.Replace("'", "''");
        }
    }
}
