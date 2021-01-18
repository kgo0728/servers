using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;

//using Newtonsoft.Json.Linq;
//using log4net.Config;
using log4net.Appender;
using log4net.Layout;
using log4net.Repository.Hierarchy;
using log4net.Core;

using APP_CONFIGURATION;
using MYSQL_CONNECT_OBJECT;
using CACHEDB_CONNECT_OBJECT;

using REDIS_MATCH_SUBSCRIPTIONS;
using REDIS_MEMBER_SUBSCRIPTIONS;
using REDIS_ITEM_SUBSCRIPTIONS;
using REDIS_SYSTEM_SUBSCRIPTIONS;

using APPGLOBALS;
// 게임 로직 dll 참조 추가
using HiQInGamePlayLogic;

namespace HIQMATCH
{
    
    public class TestLogger : HiQInGamePlayLogic.ILogger
    {
        public void Log(string Msg)
        {
            System.Console.WriteLine(Msg);
        }
        public void LogError(string Msg)
        {
            System.Console.WriteLine(Msg);
        }
    }

   /*
    public class CServerLogicManagerEx : CServerPlayerAccess.CServerLogicManager
    {
        private static CServerLogicManagerEx instance = null;
        public new static CServerLogicManagerEx Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new CServerLogicManagerEx();
                    instance.Init();
                }
                return instance;
            }
        }
        
        public override void Init()
        {
            base.Init();

            HiQInGamePlayLogic.Logger.CurrentLogger = new TestLogger();

            ////CGamePlayControlManagerS.Instance
            ////CTableManagerS.Instance
            ////CGamePlayFullAutoJudgeManagerS.Instance   // 사용 불필요

            ////// 서버 코딩 필요
            ////// 테이블 생성................................ 
            //foreach (CActionTable_BlockTable.Row row in CGameManager.Instance.Tablemanager.ActionBlockTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ActionBlockTable.AddRow(row);
            //}
            //CTableManagerS.Instance.ActionBlockTable.Build();
            //foreach (CActionTable_ReceiveTable.Row row in CGameManager.Instance.TableManager.ActionReceiveTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ActionReceiveTable.AddRow(row);
            //}
            //CTableManagerS.Instance.ActionReceiveTable.Build();
            //foreach (CActionTable_ServeTable.Row row in CGameManager.Instance.TableManager.ActionServeTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ActionServeTable.AddRow(row);
            //}
            //CTableManagerS.Instance.ActionServeTable.Build();
            //foreach (CActionTable_SpikeTable.Row row in CGameManager.Instance.TableManager.ActionSpikeTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ActionSpikeTable.AddRow(row);
            //}
            //CTableManagerS.Instance.ActionSpikeTable.Build();
            //foreach (CActionTable_TossTable.Row row in CGameManager.Instance.TableManager.ActionTossTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ActionTossTable.AddRow(row);
            //}
            //CTableManagerS.Instance.ActionTossTable.Build();
            //foreach (CSkillTable_ActiveTable.Row row in CGameManager.Instance.TableManager.ActiveSkillTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ActiveSkillTable.AddRow(row);
            //}
            ////foreach (CAnimationNameTable.Row row in CGameManager.Instance.TableManager.AnimationNameTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.AnimationNameTable.AddRow(row);
            ////}
            ////foreach (CArea_Table_FieldTable.Row row in CGameManager.Instance.TableManager.AreaFieldTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.AreaFieldTable.AddRow(row);
            ////}
            //foreach (CArea_Table_SituationTable.Row row in CGameManager.Instance.TableManager.AreaSituationTable.GetRowList())
            //{
            //    CTableManagerS.Instance.AreaSituationTable.AddRow(row);
            //}
            //foreach (CBalanceTable_PlayValueTable.Row row in CGameManager.Instance.TableManager.BalancePlayValueTable.GetRowList())
            //{
            //    CTableManagerS.Instance.BalancePlayValueTable.AddRow(row);
            //}
            ////foreach (CBodyTable_HeadTable.Row row in CGameManager.Instance.TableManager.BodyHeadTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.BodyHeadTable.AddRow(row);
            ////}
            ////foreach (CBodyTable_PlayTable.Row row in CGameManager.Instance.TableManager.BodyPlayTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.BodyPlayTable.AddRow(row);
            ////}
            ////foreach (CBodyTable_UniformTable.Row row in CGameManager.Instance.TableManager.BodyUniformTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.BodyUniformTable.AddRow(row);
            ////}
            //foreach (CCharacter_CardTable.Row row in CGameManager.Instance.TableManager.CharacterCardTable.GetRowList())
            //{
            //    CTableManagerS.Instance.CharacterCardTable.AddRow(row);
            //}
            //foreach (CCharacter_GroupTable.Row row in CGameManager.Instance.TableManager.CharacterGroupTable.GetRowList())
            //{
            //    CTableManagerS.Instance.CharacterGroupTable.AddRow(row);
            //}
            //foreach (CCharacter_uniqueTable.Row row in CGameManager.Instance.TableManager.CharacterUniqueTable.GetRowList())
            //{
            //    CTableManagerS.Instance.CharacterUniqueTable.AddRow(row);
            //}
            //foreach (CBalanceLevelupTable.Row row in CGameManager.Instance.TableManager.BalanceLevelupTable.GetRowList())
            //{
            //    CTableManagerS.Instance.BalanceLevelupTable.AddRow(row);
            //}
            //CTableManagerS.Instance.BalanceLevelupTable.Build();
            ////foreach (CFurnitureTableTable.Row row in CGameManager.Instance.TableManager.FurnitureTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.FurnitureTable.AddRow(row);
            ////}
            //foreach (CFurnitureTableTableEx.Row row in CGameManager.Instance.TableManager.FurnitureTableEx.GetRowList())
            //{
            //    CTableManagerS.Instance.FurnitureTableEx.AddRow(row);
            //}
            //foreach (CSchoolTableTable.Row row in CGameManager.Instance.TableManager.SchoolTable.GetRowList())
            //{
            //    CTableManagerS.Instance.SchoolTable.AddRow(row);
            //}
            //foreach (CSkillTable_GroupBuffTable.Row row in CGameManager.Instance.TableManager.SkillGroupBuffTable.GetRowList())
            //{
            //    CTableManagerS.Instance.SkillGroupBuffTable.AddRow(row);
            //}
            ////foreach (CSourceTable_SoundTable.Row row in CGameManager.Instance.TableManager.SoundTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.SoundTable.AddRow(row);
            ////}
            ////foreach (CSourceTable_IllustrationTable.Row row in CGameManager.Instance.TableManager.IllustrationTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.IllustrationTable.AddRow(row);
            ////}
            //foreach (CTeamTableTable.Row row in CGameManager.Instance.TableManager.TeamTable.GetRowList())
            //{
            //    CTableManagerS.Instance.TeamTable.AddRow(row);
            //}
            ////foreach (CTextTable_UITable.Row row in CGameManager.Instance.TableManager.TextTable.GetRowList())
            ////{
            ////    CTableManagerS.Instance.TextTable.AddRow(row);
            ////}
            ////foreach (CTextTable_UITableEX.Row row in CGameManager.Instance.TableManager.TextTableEx.GetRowList())
            ////{
            ////    CTableManagerS.Instance.TextTableEx.AddRow(row);
            ////}
            //foreach (CValueTableTable.Row row in CGameManager.Instance.TableManager.ValueTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ValueTable.AddRow(row);
            //}
            //foreach (CItemtable_FocustrainTable.Row row in CGameManager.Instance.TableManager.ItemtableFocustrainTable.GetRowList())
            //{
            //    CTableManagerS.Instance.ItemtableFocustrainTable.AddRow(row);
            //}
        }

        // 
        public bool MakeFullAutoGame(string accSessionKey, CGamePlayDefine.ETeamID serveTeam, List<CGamePlayerInfo.PlayerParam> teamAPlayers, List<CGamePlayerInfo.PlayerParam> teamBPlayers, CMakeGameResult outRes) // 초기 세팅으로 게임 완료....
        {
            CGamePlayFullAutoJudge autoGame = new CGamePlayFullAutoJudge(accSessionKey);
            bool ret = autoGame.MakeFullAutoGame(accSessionKey, serveTeam, teamAPlayers, teamBPlayers, outRes);
            if (false == ret)
                CServerPlayerAccess.LogError("CServerLogicTester: MakeFullAutoGame - Failed........");

            return ret;
        }
        
    }
    */

    class Program
    {

        private static bool _quitRequested = false;
        private static object _syncLock = new object();
        private static AutoResetEvent _waitHandle = new AutoResetEvent(false);

        private static readonly log4net.ILog logger        = log4net.LogManager.GetLogger("default");
        private static readonly log4net.ILog logger_input  = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_INPUT"));
        private static readonly log4net.ILog logger_output = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_OUTPUT"));
        private static readonly log4net.ILog logger_error  = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_ERROR"));

        private static string[] Server_Name_List = { "Match1", "Match2", "Match3", "Match4", "Match5", "Match6", "Match7", "Match8", "Match9", "Match10" };

        private static string Server_Name = "0";


        static void Main(string[] args)
        {
            //비정상 종료 이벤트 핸들러 
            AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(OnUnhandledException);


            //로그 설정값 셋팅 (초기값으로 설정) -- 초기는 무조건 로그 true 이다 
            AppConfiguration.LOG4_ABLE_DEFAULT = AppConfiguration.LOG_DEFAULT_ABLE();
            AppConfiguration.LOG4_ABLE_INPUT   = AppConfiguration.LOG_INPUT_ABLE();
            AppConfiguration.LOG4_ABLE_OUTPUT  = AppConfiguration.LOG_OUTPUT_ABLE();



            // CSV READER
            var Instance = HiQInGamePlayLogic.CServerPlayerAccess.CServerLogicManager.Instance;
            COMMON_UTLL_FUNC.Common.CsvData();


             /*
             JObject TDATA = new JObject();
             JObject COINMONM_SERVER_LOG_LIST_INFO = new JObject();
             COINMONM_SERVER_LOG_LIST_INFO.Add("LOG_ID", 1);
             TDATA.Add("COINMONM_SERVER_LOG_LIST_INFO", COINMONM_SERVER_LOG_LIST_INFO);
             Console.WriteLine(AppConfiguration.GetAppConfig("REDIS_DB_CON"));
             */
            //g_redis_pubsub.Publich_Sync("Account_Connect_Confirm" , "testaaaa");
            //Task<long> TaskWait = g_redis_pubsub.PublishAsync("Account_Connect_Confirm", "testaaaa");
            //g_redis_pubsub.redis.Wait(TaskWait);
            //Task.Run(async delegate { await g_redis_pubsub.PublishAsync("Account_Connect_Confirm", "testaaaa"); });

            if (args.Length > 0 )
            {
                Server_Name = args[0];
                bool contain = Server_Name_List.Any(Server_Name.Contains);
                if(!contain)
                {
                    Console.WriteLine($"CREATE SERVER FAILD:[{Server_Name}]");
                    Thread.Sleep(1000);
                    return;
                }
            }
            else
                Server_Name = Server_Name_List[0];


            //타이틀 설정    
            Console.Title = Console.Title + " [" + Server_Name + "]";



            Create_Log4Net_Config(Server_Name);
            //XmlConfigurator.Configure(new FileInfo("log4net.xml")); /////////////////// 소스로 생성함<사용하지말것> /////////////////////////
            logger.Warn($"START-[{Server_Name}]- SERVER ");


            AppDomain.CurrentDomain.ProcessExit += new EventHandler(CurrentDomain_ProcessExit);
            //CACHEDB_CONNECT             g_redis_pubsub = new CACHEDB_CONNECT(AppConfiguration.GetAppConfig("REDIS_DB_IP"), int.Parse(AppConfiguration.GetAppConfig("REDIS_DB_PORT")));
            globals.g_redis_pubsub                     = new CACHEDB_CONNECT(AppConfiguration.GetAppConfig("REDIS_DB_IP"), int.Parse(AppConfiguration.GetAppConfig("REDIS_DB_PORT")));
            Redis_Member_Subscriptions  Member_Sub     = new Redis_Member_Subscriptions(Server_Name );
            Redis_Item_Subscriptions    Item_Sub       = new Redis_Item_Subscriptions(Server_Name );
            Redis_Match_Subscriptions   Match_Sub      = new Redis_Match_Subscriptions(Server_Name);
            Redis_System_Subscriptions  System_Sub     = new Redis_System_Subscriptions(Server_Name);


            //////////////////// 예외 처리 코드 ///////////////////////
            //throw new Exception("Your exception here!");
            //////////////////// 예외 처리 코드 ///////////////////////
         

            ThreadPool.SetMinThreads(50, 100);  //최소 스레드 설정 
            Get_ThreadPool_Status();

            Thread msgThread = new Thread(MessagePump);
            msgThread.Start();

            // read input to detect "quit" command
            string command = string.Empty;
            do
            {

               command = Console.ReadLine();
            

            } while (!command.Equals("quit", StringComparison.InvariantCultureIgnoreCase));

            // signal that we want to quit
            SetQuitRequested();
            // wait until the message pump says it's done
            _waitHandle.WaitOne();
            // perform any additional cleanup, logging or whatever
        }//main



        public static void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            //Exception exception = (Exception)e.ExceptionObject;
            //logger_error.Error("-----------OnUnhandledException Start-------------- ");
            //logger_error.Error("UNHANDLED EXCEPTION : " + e.ExceptionObject.ToString());
            //logger_error.Error("-----------OnUnhandledException End-------------- ");

            //디렉토리 생성 
            string Dir_Path = $"./log_{Server_Name}//log_Exception//";
            if (!Directory.Exists(Dir_Path))  {
                Directory.CreateDirectory(Dir_Path);
            }

            StringBuilder ReadString = new StringBuilder();
            DateTime NowDate = DateTime.Now;
            string FileTime = NowDate.ToString("yyyy-MM-dd HHmmss") + "-" + NowDate.Millisecond.ToString("000") + ".txt";
            string FileName = Dir_Path + FileTime;
        
            try
            {
                ReadString.Append("-----------OnUnhandledException Start-------------- \n");
                ReadString.Append("UNHANDLED EXCEPTION : " + e.ExceptionObject.ToString() + "\n");
                ReadString.Append("-----------OnUnhandledException End-------------- ");


                // 1> 데이타 베이스로도 쓰고
                MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                StringBuilder queryString = new StringBuilder();
                queryString.Append(@"INSERT INTO uu_log_server_system_exception_ref_info(UPDATE_TIME,ERROR_DESC)");
                queryString.Append("VALUES( ");
                queryString.Append("NOW(6)" + ", ");
                queryString.Append("'" + ReadString.ToString() + "'");
                queryString.Append(" )");

                MYSQL_D_READER Table_Data_Info = new MYSQL_D_READER(DBCon._SqlConnection, queryString.ToString());
                if (Table_Data_Info._Errorstr.Length > 0)
                {
                    logger_error.Error($"[DB ERROR]: {Table_Data_Info._Errorstr}");
                }

                Table_Data_Info.CLOSE_READER();
                Table_Data_Info.COMMAND_CLOSE();
                DBCon.SQL_CLOSE();
                

                // 2 > 파일로도 쓰고 
                using (StreamWriter sw = new StreamWriter(FileName, true )) 
                {
                    sw.Write(ReadString.ToString());
                    sw.Close();
                }

            }
            catch (Exception ex)
            {
            }
            finally
            {
                
                //자기자신 재시작 
                Process.Start(new ProcessStartInfo
                {
                    UseShellExecute = true,
                    WorkingDirectory = Environment.CurrentDirectory,
                    FileName = "HIQMATCH.exe",
                    Arguments = Server_Name
                });
                
            }
        
            //Thread.Sleep(100);
            //System.Diagnostics.Process.Start(Application.ExecutablePath);
            //Logger.Log("UNHANDLED EXCEPTION : " + e.ExceptionObject.ToString());
            //Process.Start(@"C:\xxxx\bin\x86\Release\MySelf.exe");
        }

        private static void Create_Log4Net_Config(string Log_DirPath)
        {

            Hierarchy repository = (Hierarchy)log4net.LogManager.GetRepository();
            repository.Configured = true;

            // 콘솔 로그 패턴 설정
            /*
            ConsoleAppender console = new ConsoleAppender();
            console.Name = "default";
            console.Layout = new PatternLayout("%d [%t] %-5p %c - %m%n");
           */
            
            ColoredConsoleAppender console = new ColoredConsoleAppender();
            console.Name = "default";
            console.AddMapping(new ColoredConsoleAppender.LevelColors
            {
                Level = Level.Error,
                ForeColor = ColoredConsoleAppender.Colors.Red 
            });
            console.AddMapping(new ColoredConsoleAppender.LevelColors
            {
                Level = Level.Warn,
                ForeColor = ColoredConsoleAppender.Colors.Yellow
            });
            /*
            console.AddMapping(new ColoredConsoleAppender.LevelColors
            {
                Level = Level.Debug,
                ForeColor = ColoredConsoleAppender.Colors.White
            });
            */
            console.Layout = new PatternLayout("%date [%thread] %level %logger: %message%n");
            console.ActivateOptions();


            RollingFileAppender input = new RollingFileAppender();
            input.Name = "input";
            //input.File = @"..//..//log//log_input//";
            input.File = $"./log_{Log_DirPath}//log_input//";
            //input.LockingModel = new FileAppender.MinimalLock();    //락을 거니 속도가 더 느리다(사용금지)
            input.AppendToFile = true;
            input.DatePattern = "-yyyy-MM-dd-HH'.log'";
            input.StaticLogFileName = false;
            input.RollingStyle = RollingFileAppender.RollingMode.Composite;
            input.MaximumFileSize = "10MB";
            input.MaxSizeRollBackups = 100;
            input.Layout = new PatternLayout("[%-23d] %-5p %c %M: %m %n");
            /*
            log4net.Filter.LevelRangeFilter filter = new log4net.Filter.LevelRangeFilter();
            filter.LevelMax = Level.Debug;
            filter.LevelMin = Level.Fatal;
            input.AddFilter(filter);
            */
            input.ActivateOptions();


            RollingFileAppender output = new RollingFileAppender();
            output.Name = "output";
            //output.File = @"..//..//log//log_output//";
            output.File = $"./log_{Log_DirPath}//log_output//";
            //output.LockingModel = new FileAppender.MinimalLock();  //락을 거니 속도가 더 느리다(사용금지)
            output.AppendToFile = true;
            output.DatePattern = "-yyyy-MM-dd-HH'.log'";
            output.StaticLogFileName = false;
            output.RollingStyle = RollingFileAppender.RollingMode.Composite;
            output.MaximumFileSize = "10MB";
            output.MaxSizeRollBackups = 100;
            output.Layout = new PatternLayout("[%-23d] %-5p %c %M: %m %n");
            output.ActivateOptions();


            RollingFileAppender error = new RollingFileAppender();
            error.Name = "error";
            //error.File = @"..//..//log//log_error//";
            error.File = $"./log_{Log_DirPath}//log_error//";
            //error.LockingModel = new FileAppender.MinimalLock();  //락을 거니 속도가 더 느리다(사용금지)
            error.AppendToFile = true;
            error.DatePattern = "-yyyy-MM-dd-HH'.log'";
            error.StaticLogFileName = false;
            error.RollingStyle = RollingFileAppender.RollingMode.Composite;
            error.MaximumFileSize = "10MB";
            error.MaxSizeRollBackups = 100;
            error.Layout = new PatternLayout("[%-23d] %-5p %c %M: %m %n");
            error.ActivateOptions();

            /*
            repository.Root.AddAppender(console);
            repository.Root.AddAppender(input);
            repository.Root.AddAppender(output);
            repository.Root.AddAppender(error);
            */
            
            log4net.ILog log_default = log4net.LogManager.GetLogger("default");
            log4net.Repository.Hierarchy.Logger logger_default = (log4net.Repository.Hierarchy.Logger)log_default.Logger;
            logger_default.Additivity = false;
            logger_default.AddAppender(console);
                                   

            log4net.ILog log_Input = log4net.LogManager.GetLogger("input");
            log4net.Repository.Hierarchy.Logger logger_Input = (log4net.Repository.Hierarchy.Logger)log_Input.Logger;
            logger_Input.Additivity = false;
            logger_Input.AddAppender(console);
            logger_Input.AddAppender(input);


            log4net.ILog log_output = log4net.LogManager.GetLogger("output");
            log4net.Repository.Hierarchy.Logger logger_output = (log4net.Repository.Hierarchy.Logger)log_output.Logger;
            logger_output.Additivity = false;
            logger_output.AddAppender(console);
            logger_output.AddAppender(output);

            log4net.ILog log_error = log4net.LogManager.GetLogger("error");
            log4net.Repository.Hierarchy.Logger logger_error = (log4net.Repository.Hierarchy.Logger)log_error.Logger;
            logger_error.Additivity = false;
            logger_error.AddAppender(console);
            logger_error.AddAppender(error);
            
            /*
           var hierarchy = (Hierarchy)repository;
           hierarchy.Root.AddAppender(consoleAppender);
           hierarchy.Root.AddAppender(rollingAppender);
           */

        }



        private static void SetQuitRequested()
        {
            lock (_syncLock)
            {
                _quitRequested = true;
            }
        }
        private static void MessagePump()
        {
            do
            {
                Thread.Sleep(100);

                // act on messages
            } while (!_quitRequested);
            _waitHandle.Set();
        }
        static void CurrentDomain_ProcessExit(object sender, EventArgs e)
        {
            Console.WriteLine("---------BUY BUY MATCH SERVER---------");
            Thread.Sleep(1000);
        }

        private static void Get_ThreadPool_Status()
        {

            int minWorkerThreads = 0;
            int minCompletionPortThreads = 0;
            ThreadPool.GetMinThreads(out minWorkerThreads, out minCompletionPortThreads);

            int maxWorkerThreads = 0;
            int maxCompletionPortThreads = 0;
            ThreadPool.GetMaxThreads(out maxWorkerThreads, out maxCompletionPortThreads);

            logger.DebugFormat("Min Worker Threads : {0}, max Worker Threads : {1}", minWorkerThreads, maxWorkerThreads);
            logger.DebugFormat("Min CompletionPort Threads : {0}, max CompletionPort Threads : {1}", minCompletionPortThreads, maxCompletionPortThreads);

        }

    }
}
