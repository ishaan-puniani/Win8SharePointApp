using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePointDal
{
    public sealed class NewsDto
    {
        public string Title { get; set; }
        public int Id{ get; set; }
        public string Group{ get; set; }
        public string Image { get; set; }
        public string Description{ get; set; }
        public string Details { get; set; }

    }
}
