using BaseCore.Core.AAA;
using DataLayer.Data;
using KaUI.Core.AAA;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using pdf.Configuration;
using Rotativa.AspNetCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddControllersWithViews();

#region SqlServer Dependencies

//// use in-memory database
//services.AddDbContext<OrderContext>(c =>
//    c.UseInMemoryDatabase("OrderConnection"));

// use real database
builder.Services.AddDbContext<BaseContext>(c =>
    c.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));

#endregion

#region Project Dependencies

// Add Infrastructure Layer

builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
var accessor = builder.Services.BuildServiceProvider().GetService<IHttpContextAccessor>();

#region Mapper
var myAssembly = Assembly.LoadFrom(Path.Combine(AppContext.BaseDirectory, "BaseCore.dll"));
var myAssembly1 = Assembly.LoadFrom(Path.Combine(AppContext.BaseDirectory, "pdf.dll"));

builder.Services.InitializeAutoMapper(myAssembly1);
#endregion
builder.Services.AddAutoMapper(typeof(Program));

#endregion

#region SinglanR
builder.Services.AddSignalR();

#endregion



var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}



//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

RotativaConfiguration.Setup(app.Environment.WebRootPath);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{guid?}");

app.Run();

