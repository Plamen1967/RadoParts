using System.Globalization;
using System;
using Utility;

namespace Rado.Exceptions
{
    public class MaxCountPictureException : Exception
    {
        public MaxCountPictureException() : base() { }

        public MaxCountPictureException(string message) : base(message)
        {
            LoggerUtil.LogException(this);
        }

        public MaxCountPictureException(string message, params object[] args) :
            base(String.Format(CultureInfo.CurrentCulture, message, args))
        { }
    }
}
