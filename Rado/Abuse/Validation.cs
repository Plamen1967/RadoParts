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

        static public bool BlockPart(Part part)
        {
            foreach (string word in invalidWords)
            {
                if (part.description.ToLower().Contains(word.ToLower())) 
                {
                    return true;
                }

                if (part.partNumber.ToLower().Contains(word.ToLower()))
                {
                    return true;
                }

                if (part.dealerSubCategoryName.ToLower().Contains(word.ToLower()))
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
                if (car.vin.ToLower().Contains(word.ToLower()))
                {
                    return true;
                }

                if (car.description.ToLower().Contains(word.ToLower()))
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
                part.description = removeWord(part.description, word);
                part.partNumber = removeWord(part.partNumber, word);
                part.dealerSubCategoryName = removeWord(part.dealerSubCategoryName, word);
            }

            return part;
        }

        static public Car RemoveInvalidWord(Car car)
        {
            foreach (string word in sqlWords)
            {
                car.description = removeWord(car.description, word);
                car.vin = removeWord(car.vin, word);
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
