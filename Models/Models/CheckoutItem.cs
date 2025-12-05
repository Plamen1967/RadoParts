using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class CheckoutItem
    {
        public int id { get; set; }
        public long partId { get; set; }
        public int userId { get; set; }
        public decimal price { get; set; }
        public DateTime captureTime { get; set; }

        public CheckoutItem()
        {

        }
        public CheckoutItem(DataRow dataRow)
        {
            id = dataRow.Field<int>("id");
            partId = dataRow.Field<long>("partId");
            userId = dataRow.Field<int>("userId");
            price = dataRow.Field<decimal>("price");

        }
    }
}
