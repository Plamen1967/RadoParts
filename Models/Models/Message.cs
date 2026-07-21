public class Message
{
	public Message() { }

	public long Id { get; set; }
	public long SendUserId { get; set; }
	public long ReceiveUserId { get; set; }
	public long MsgDate { get; set; }
	public string message { get; set; }
	public long PreviousMsgId { get; set; }
    public long OriginalMsgId { get; set; }
    public long PartId { get; set; }
    public int IsCar { get; set; }
    public int IsRead { get; set; }
    public string PartDescription { get; set; }
    public string ModificationName { get; set; }
    public decimal Price { get; set; }
    public string SenderName { get; set; }
    public string Email { get; set; }
    public string Request { get; set; }

    public string MessageDateString
    {
        get
        {
            DateTime date = new DateTime(MsgDate);
            return $"{date.ToLongDateString()}  {date.ToLongTimeString()}";
        }
    }

}
