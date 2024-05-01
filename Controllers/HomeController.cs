using AutoMapper;
using AutoMapper.QueryableExtensions;
using BaseCore.Configuration;
using BaseCore.Helper;
using BaseCore.ViewModel;
using DataLayer.Data;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using DomainLayer.Entities;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using pdf.Models;
using Rotativa;
using Rotativa.AspNetCore;
using Rotativa.AspNetCore.Options;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Threading;
namespace pdf.Controllers
{

    public class DataTypeViewModel : BaseDto<DataTypeViewModel, DomainLayer.Entities.DataType>
    {
        [Display(Name = "آی دی")]
        public int ID { get; set; }
        [Display(Name = "نام فارسی")]
        public string FAName { get; set; }
        [Display(Name = "نام")]
        public string Name { get; set; }

      
    }
    public class DataTypeViewModelPdf : BaseDto<DataTypeViewModelPdf, DomainLayer.Entities.DataType>
    {
      
        [Display(Name = "نام فارسی")]
        public string FAName { get; set; }
        [Display(Name = "نام")]
        public string Name { get; set; }
        [Display(Name = "سایز")]
        public Size Size { get; set; } = Size.A4;
        [Display(Name = "عمودی / افقی")]
        public Orientation Orientation { get; set; } = Orientation.Portrait;
    }
    public class HomeController : Controller
    {
        private readonly BaseContext _baseContext;
        private readonly IMapper _mapper;
        public HomeController(BaseContext baseContext, IMapper mapper)
        {
            _baseContext = baseContext;
            _mapper = mapper;
        }
        #region form
        public IActionResult Index()
        {

            return View(new DataTypeViewModelPdf() { });
        }

        public virtual async Task<IActionResult> List(CancellationToken cancellationToken)
        {

            var queryString = (System.Uri.UnescapeDataString(Request.QueryString.Value)).Replace("\\", "").Replace("?", "");
            var qurestringCount = queryString.Length;
            var indexFirst = queryString.IndexOf("{");
            if (indexFirst > 0)
                queryString = queryString.Substring(indexFirst, qurestringCount - indexFirst);
            var index = queryString.IndexOf("&_=");
            if (index > 0)
                queryString = queryString.Substring(0, index);
            var request = JsonConvert.DeserializeObject<DataSourceRequest>(queryString);
            var query = _baseContext.DataType.AsNoTracking().OrderByDescending(x => x.ID);

            return new DataSourceResult<DataTypeViewModel>(
                               query.ProjectTo<DataTypeViewModel>(_mapper.ConfigurationProvider),
                               request);
        }


        public async Task<ActionResult> Create(string callback)
        {
            var model = new DataTypeViewModel();
            ViewBag.CallBackAddCustomer = callback;
            return View(model);
        }

        [HttpPost]
        public async Task<ActionResult> Create(DataTypeViewModel dto, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var model = dto.ToEntity(_mapper);
                    _baseContext.DataType.Add(model);
                    _baseContext.SaveChanges();
                    return new BaseActionResult();
                }
                return new BaseActionResult();
            }
            catch (Exception)
            {
                return new BaseActionResult(false, "سیستم دچار خطا شده است لطفا دوباره امتحان کنید");
            }
        }

        public async Task<ActionResult> Edit(int guid, CancellationToken cancellationToken)
        {
            var dto = await _baseContext.DataType.AsNoTracking().ProjectTo<DataTypeViewModel>(_mapper.ConfigurationProvider)
              .SingleOrDefaultAsync(p => p.ID.Equals(guid), cancellationToken);
            if (dto == null)
                return NotFound();

            return View("Create", dto);
        }

        [HttpPost]
        public async Task<ActionResult> Edit(DataTypeViewModel dto, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {

                    var obj = _baseContext.DataType.Find(dto.ID);
                    var model = dto.ToEntity(_mapper, obj);

                    _baseContext.DataType.Update(model);
                    _baseContext.SaveChanges();


                }
                return new BaseActionResult();
            }
            catch (Exception)
            {
                return new BaseActionResult(false, "سیستم دچار خطا شده است لطفا دوباره امتحان کنید");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Delete(int guid, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var model = _baseContext.DataType.Find(guid);
                    _baseContext.DataType.Remove(model);
                    _baseContext.SaveChanges();

                }
                return new BaseActionResult();
            }
            catch (Exception)
            {
                return new BaseActionResult(false, "به دلیل آیتم های وابسته قادر به حذف نیست");
            }
        }

        #endregion
        #region pdf
        [AllowAnonymous]
        public async Task<IActionResult> PdfFilter(DataTypeViewModelPdf model, CancellationToken cancellationToken)
        {

            var list = new List<object>();

            var obj = _baseContext.DataType.AsNoTracking();
            if (!string.IsNullOrEmpty(model.FAName))
            {
                obj = obj.Where(z => z.FAName == model.FAName);
            }
            if (!string.IsNullOrEmpty(model.Name))
            {
                obj = obj.Where(z => z.FAName == model.Name);
            }


            var result = await obj.ProjectTo<DataTypeViewModel>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
            foreach (var item in result)
            {
                list.Add(item);

            }
            var headerHtml = "https://localhost:7288" + Url.Action("HeaderPdf", "home");
            var footerHtml = "https://localhost:7288" + Url.Action("FooterPdf", "home");


            return new ViewAsPdf("_PdfListView", list)
            {
                FileName = "file.pdf",
                CustomSwitches = $"--header-html \"{headerHtml}\" --footer-html \"{footerHtml}\" --header-spacing 5 --footer-spacing 5",
                PageSize = model.Size,
                PageMargins = new Rotativa.AspNetCore.Options.Margins { Left = 5, Right = 5, Top = 20, Bottom = 20 },
                PageOrientation = model.Orientation,
            };




        }




        [AllowAnonymous]
        public async Task<IActionResult> Pdf(CancellationToken cancellationToken)
        {

            var list = new List<object>();

            var obj = await _baseContext.DataType.AsNoTracking().ProjectTo<DataTypeViewModel>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
            for (int i = 0; i < 500; i++)
            {
                foreach (var item in obj)
                {
                    list.Add(item);

                }
            }
            foreach (var item in obj)
            {
                list.Add(item);

            }
            var headerHtml = "https://localhost:7288" + Url.Action("HeaderPdf", "home");
            var footerHtml = "https://localhost:7288" + Url.Action("FooterPdf", "home");


            return new ViewAsPdf("_PdfListView", list)
            {
                FileName = "file.pdf",
                CustomSwitches = $"--header-html \"{headerHtml}\" --footer-html \"{footerHtml}\" --header-spacing 5 --footer-spacing 5",
                PageSize = Rotativa.AspNetCore.Options.Size.A4,
                PageMargins = new Rotativa.AspNetCore.Options.Margins { Left = 5, Right = 5, Top = 20, Bottom = 20 },
                PageOrientation = Rotativa.AspNetCore.Options.Orientation.Portrait,
            };




        }



       [AllowAnonymous]
        public async Task<IActionResult> HeaderPdf()
        {
            //var obj = await _httpService.Get<UserViewModelPdf>(_urlHelper.UrlBase + "User/" + guid);
            return View("_Headpdf");

        }
        [AllowAnonymous]
        public async Task<IActionResult> FooterPdf()
        {
            //var obj = await _httpService.Get<UserViewModelPdf>(_urlHelper.UrlBase + "User/" + guid);
            return View("_FooterPdf");

        }
        #endregion
    }
}
