using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class CheckoutItemView : CheckoutItem
    {
        public PartView part { get; set; }
        public CheckoutItemView() : base()
        {
        }


    }
}
