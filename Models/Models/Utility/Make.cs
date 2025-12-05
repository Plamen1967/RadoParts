using System;
using System.Collections.Generic;
using Utility;

public class Make
{
    public string name { get; set; }
    public int id { get; set; }
    public IEnumerable<ModelWithModification> models { get; set; }
}
