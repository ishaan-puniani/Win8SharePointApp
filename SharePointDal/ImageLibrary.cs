using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SharePointDal
{
    public sealed class ImageLibrary
    {
        public List<NewsDto> GetNews()
        {
            List<NewsDto> newsDtos = null;
            using (ClientContext clientContext = new ClientContext("http://172.16.1.229/"))
            {
                clientContext.AuthenticationMode = ClientAuthenticationMode.FormsAuthentication;
                clientContext.FormsAuthenticationLoginInfo = new FormsAuthenticationLoginInfo("testuser900", "password");
                Web web = clientContext.Web;
                clientContext.Load(web);

                clientContext.ExecuteQuery();
                var title = web.Title;

                List oList = clientContext.Web.Lists.GetByTitle("BrandNews");
                clientContext.Load(oList);
                                
                CamlQuery query = CamlQuery.CreateAllItemsQuery(100);
                ListItemCollection items = oList.GetItems(query);
                clientContext.Load(items);
                clientContext.ExecuteQuery();

                if (items.Count > 0)
                {
                    newsDtos = new List<NewsDto>();
                    foreach (ListItem listItem in items)
                    {
                        var newsDto = new NewsDto();

                        newsDto.Title = Convert.ToString(listItem["Title"]);
                        newsDto.Id = listItem.Id;
                        newsDto.Description = Convert.ToString(listItem["Description"]);
                        newsDto.Details = Convert.ToString(listItem["Details"]);
                        newsDto.Group = Convert.ToString(listItem["Group"]);
                        newsDto.Image = ((FieldUrlValue)listItem["Image"]).Url;
                        newsDtos.Add(newsDto);
                    }
                }
            }
            return newsDtos;
        }
    }
}
