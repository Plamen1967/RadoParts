using GetData.Utility;
using System;
using System.Collections.Generic;

namespace Utility
{
    public class ModelWithModification
    {
        public string name { get; set; }
        public int id { get; set; }
        public IEnumerable<ModificationWIthSubModel> modifications { get; set; }
    }

}
