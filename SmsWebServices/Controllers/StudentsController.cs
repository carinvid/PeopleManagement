using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SmsWebServices.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class StudentsController : ApiController
    {
        private SmsDBEntities db = new SmsDBEntities();

        [HttpGet]
        public List<Student> GetStudents(string search)
        {
            var query = db.Students.AsQueryable();
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x => x.Name.ToLower().Contains(search.ToLower()));
            }
            var stdList = query.ToList();
            return stdList;
        }

        [HttpPost]
        public HttpResponseMessage SaveStudent()
        {
            try
            {
                var name = HttpContext.Current.Request.Params["name"];
                var address = HttpContext.Current.Request.Params["address"];
                var age = HttpContext.Current.Request.Params["age"];
                var interests = HttpContext.Current.Request.Params["interests"];
                var file = HttpContext.Current.Request.Files["uploadfile"];
                string Pic_Path = "";
                string image = "";
                if (file != null)
                {
                    image = DateTime.Now.ToString("ddmmyyhhmmss") + "_" + file.FileName;
                    Pic_Path = HostingEnvironment.MapPath("~/Images/" + image);
                    file.SaveAs(Pic_Path);
                }
                var obj = new Student()
                {
                    Address = address,
                    Age = age,
                    Interests = interests,
                    Name = name,
                    Picture = image
                };
                db.Students.Add(obj);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "200");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }

        [HttpPost]
        public HttpResponseMessage DeleteStudent()
        {
            try
            {
                var id = Convert.ToInt32(HttpContext.Current.Request.Params["id"]);
                var std = db.Students.Find(id);
                db.Students.Remove(std);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "200");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }
    }
}
