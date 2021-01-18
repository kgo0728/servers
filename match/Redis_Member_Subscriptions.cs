using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using StackExchange.Redis;

using APP_CONFIGURATION;

using CACHEDB_CONNECT_OBJECT;

namespace REDIS_MEMBER_SUBSCRIPTIONS 
{
  
    static class Member_Channel_Conf
    {
        public static string FILE_TYPE_TXT = "text/plain";
        public static string FILE_TYPE_EXCEL = "application/vnd.ms-excel";
        public static string FILE_TYPE_EXCEL_HAANSOFT = "application/haansoftxls";

    }


    public class Redis_Member_Subscriptions
    {

        private static readonly log4net.ILog logger        = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_DEFAULT"));
        private static readonly log4net.ILog logger_input  = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_INPUT"));
        private static readonly log4net.ILog logger_output = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_OUTPUT"));
        private static readonly log4net.ILog logger_error  = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_ERROR"));

        public Redis_Member_Subscriptions(string Server_Name)
        {


        }

       


        private static void Test()
        {





        }



    }
         

}
