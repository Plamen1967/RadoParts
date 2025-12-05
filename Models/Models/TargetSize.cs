using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    // Class definition for the class used in the method above
    public class TargetSize
    {
        /// <summary>
        /// The _width
        /// </summary>
        private readonly int _width;

        /// <summary>
        /// The _height
        /// </summary>
        private readonly int _height;

        /// <summary>
        /// Initializes a new instance of the <see cref="TargetSize"/> class.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        public TargetSize(int width, int height)
        {
            _height = height;
            _width = width;
        }

        /// <summary>
        /// Calculates the scale factor.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        /// <returns></returns>
        public decimal CalculateScaleFactor(int width, int height)
        {
            // Scale proportinately
            var heightScaleFactor = decimal.Divide(height, _height);
            var widthScaleFactor = decimal.Divide(width, _width);

            // Use the smaller of the two as the final scale factor so the image is never undersized.
            return widthScaleFactor > heightScaleFactor ? heightScaleFactor : widthScaleFactor;
        }
    }
}
