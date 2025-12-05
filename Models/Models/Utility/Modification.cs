using System;
using System.Collections.Generic;

public class ModificationWIthSubModel
{
    public string name { get; set; }
    public int id { get; set; }
    public IEnumerable<SubModel> submodel { get; set; }
}
