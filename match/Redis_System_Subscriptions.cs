using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json.Linq;
using StackExchange.Redis;
using System.IO;
using System.Diagnostics;

using COMMON_UTLL_FUNC;
using COMMON_DATA_FUNC;

using APPGLOBALS;

using APP_CONFIGURATION;
using MYSQL_CONNECT_OBJECT;
using CACHEDB_CONNECT_OBJECT;

using COMMON_MATCH_ARENA_PROC;

namespace REDIS_SYSTEM_SUBSCRIPTIONS
{
    static class System_Item_Conf
    {
        public static string Request_Server_Control_Info = "Request_Server_Control_Info";      //서버 제어 요청 

    }

    public class Redis_System_Subscriptions
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_DEFAULT"));
        private static readonly log4net.ILog logger_input = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_INPUT"));
        private static readonly log4net.ILog logger_output = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_OUTPUT"));
        private static readonly log4net.ILog logger_error = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_ERROR"));

        private string _Server_Name = "0";

        public Redis_System_Subscriptions(string Server_Name)
        {
            _Server_Name = Server_Name;

            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + System_Item_Conf.Request_Server_Control_Info, Request_Server_Control_Info); });

        }



        #region 서버 제어 요청 
        //////////////////////////////  Request_Server_Control_Info Func////////////////////////////////////

        protected void Request_Server_Control_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT) logger_input.Debug($"<{Channel}><{message}>");

                    Common_System.REQUEST_SERVER_CONTROL_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_System.REQUEST_SERVER_CONTROL_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        switch( GameRequest_Info_Data.EVENT_ID)
                        {

                            case 1:  //서버 패치 후 재시작 
                            {
                                    Process.Start(new ProcessStartInfo
                                    {
                                        UseShellExecute = true,
                                        WorkingDirectory = Environment.CurrentDirectory,
                                        FileName  = AppConfiguration.GetAppConfig("SERVER_RESTART_BATCH"),
                                        //Arguments = "192.168.0.90 admin_match_patch 123456789!"
                                    });
                                    
                            }break;
                            case 2:  //서버 재시작 
                            {
                                    //자신 재 시작 
                                    //string Self_Path = Path.GetFullPath(Environment.CurrentDirectory + "/HIQMATCH.exe");
                                    Process.Start(new ProcessStartInfo
                                    {
                                        UseShellExecute = true,
                                        WorkingDirectory = Environment.CurrentDirectory,
                                        FileName = "HIQMATCH.exe",
                                        Arguments = _Server_Name
                                    });
                                        
                                    //자신 종료
                                    Environment.Exit(0);
                                    
                                    /*
                                    if(AppConfiguration.LOG4_ABLE_DEFAULT)
                                        logger.Debug(" Call logger Debug  ");

                                    if (AppConfiguration.LOG4_ABLE_INPUT)
                                        logger_input.Debug(" Call logger logger_input ");

                                    if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                        logger_output.Debug(" Call logger logger_output ");
                                    */
                                }
                                break;
                            case 10:  //서버 debug log off 
                            {
                                    if(AppConfiguration.LOG4_ABLE_DEFAULT)
                                        AppConfiguration.LOG4_ABLE_DEFAULT = false;
                            }
                            break;
                            case 11:  //서버 Input log off 
                            {
                                    if (AppConfiguration.LOG4_ABLE_INPUT)
                                        AppConfiguration.LOG4_ABLE_INPUT = false;
                            }break;
                            case 12:  //서버 Output log off 
                            {
                                    if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                        AppConfiguration.LOG4_ABLE_OUTPUT = false;
                            }break;
                            case 13:  //서버 All log off 
                            {
                                    if (AppConfiguration.LOG4_ABLE_DEFAULT)
                                        AppConfiguration.LOG4_ABLE_DEFAULT = false;
                                    if (AppConfiguration.LOG4_ABLE_INPUT)
                                        AppConfiguration.LOG4_ABLE_INPUT  = false;
                                    if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                        AppConfiguration.LOG4_ABLE_OUTPUT = false;
                            }break;
                            case 14:  //서버 debug log on 
                            {
                                    if (!AppConfiguration.LOG4_ABLE_DEFAULT)
                                        AppConfiguration.LOG4_ABLE_DEFAULT = true;
                            }break;
                            case 15:  //서버 Input log on 
                            {
                                    if (!AppConfiguration.LOG4_ABLE_INPUT)
                                        AppConfiguration.LOG4_ABLE_INPUT = true;

                            }break;
                            case 16:  //서버 Output log on 
                            {
                                    if (!AppConfiguration.LOG4_ABLE_OUTPUT)
                                        AppConfiguration.LOG4_ABLE_OUTPUT = true;
                            }break;
                            case 17:  //서버 All log on
                            {
                                    if (!AppConfiguration.LOG4_ABLE_DEFAULT)
                                        AppConfiguration.LOG4_ABLE_DEFAULT = true;
                                    if (!AppConfiguration.LOG4_ABLE_INPUT)
                                        AppConfiguration.LOG4_ABLE_INPUT   = true;
                                    if (!AppConfiguration.LOG4_ABLE_OUTPUT)
                                        AppConfiguration.LOG4_ABLE_OUTPUT  = true;
                            }break;
                            default:
                            {
                                   //logger_input.Debug($"<{Channel}><{GameRequest_Info_Data.EVENT_ID}>");
                            }break;
                       
                        }
                    }

                }
            
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }

            //Console.WriteLine($"{DateTime.Now.ToString("yyyyMMdd HH:mm:ss")}<Normal - {Channel}><{message}>.");

        }//Request_Server_Control_Info



        //////////////////////////////  Request_Server_Control_Info Func////////////////////////////////////
        #endregion




    }

}
