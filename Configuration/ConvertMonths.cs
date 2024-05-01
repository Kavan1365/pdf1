using BaseCore.Helper;
using BaseCore.Exceptions;
using System;
using System.Collections.Generic;

namespace pdf.Configuration
{
    public static class ConvertMonths
    {
        public static IList<string> GetMonths()
        {
            var obj = new List<string>();
            var date = DateTime.Now.AddYears(-1).AddMonths(1).ToPersianDate();



            int month = int.Parse(date.Split('/')[1]);
            int year = int.Parse(date.Split('/')[0]);

            for (int i = 0; i < 12; i++)
            {
                var getmonthname = GetMonthName(month);
                var getyead = year;
                obj.Add($"{getyead} {getmonthname}");

                if (month == 12)
                {
                    month = 1;
                    year++;
                }
                else
                {
                    month++;
                }

            }
            return obj;
        }

        public static string GetMonthName(int id)
        {
            string name = "";

            switch (id)
            {
                case 1:
                    name = "فروردین";
                    break;
                case 2:
                    name = "اردیبهشت";
                    break;
                case 3:
                    name = "خرداد";
                    break;
                case 4:
                    name = "تیر";
                    break;
                case 5:
                    name = "مرداد";
                    break;
                case 6:
                    name = "شهریور";
                    break;
                case 7:
                    name = "مهر";
                    break;
                case 8:
                    name = "آبان";
                    break;
                case 9:
                    name = "آذر";
                    break;
                case 10:
                    name = "دی";
                    break;
                case 11:
                    name = "بهمن";
                    break;
                case 12:
                    name = "اسفند";
                    break;
            }
            return name;
        }
        public static IList<string> GetDays()
        {
            var obj = new List<string>();
            var day = DateTime.Now.DayOfWeek.GetHashCode();

            var j = 0;
            switch (day)
            {
                case 0:
                    j = 1;
                    break;
                case 1:
                    j = 2;
                    break;
                case 2:
                    j = 3;
                    break;
                case 3:
                    j = 4;
                    break;
                case 4:
                    j = 5;
                    break;
                case 5:
                    j = 6;
                    break;
                case 6:
                    j = 0;
                    break;
            }

            for (int i = 0; i < 7; i++)
            {
                var getmonthname = GetdayName(j);
                obj.Add($"{getmonthname}");
                if (j == 6)
                {
                    j = 0;
                }
                else
                {
                    j++;

                }
            }
            return obj;
        }
        public static string GetdayName(int id)
        {
            string name = "";

            switch (id)
            {
                case 0:
                    name = "یک شنبه";
                    break;
                case 1:
                    name = "دوشنبه";
                    break;
                case 2:
                    name = "سه شنبه";
                    break;
                case 3:
                    name = "چهارشنبه";
                    break;
                case 4:
                    name = "پنج شنبه";
                    break;
                case 5:
                    name = "جمعه";
                    break;
                case 6:
                    name = "شنبه";
                    break;

            }
            return name;
        }

    }
}
