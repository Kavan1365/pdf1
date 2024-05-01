using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;

namespace pdf.Views.Shared.Components.CustomeForm
{
    public class CustomeForm : ViewComponent
    {
        public ViewViewComponentResult Invoke(object model)
        {
            return View("CustomeForm", model);
        }
    }

    public class Model<T>
    {
        public T GetModel { get; set; }
    }
}