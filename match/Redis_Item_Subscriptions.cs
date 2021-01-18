using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

using Newtonsoft.Json.Linq;
using StackExchange.Redis;

using COMMON_UTLL_FUNC;
using COMMON_DATA_FUNC;

using APPGLOBALS;

using APP_CONFIGURATION;
using MYSQL_CONNECT_OBJECT;
using CACHEDB_CONNECT_OBJECT;

using MATCH_GAME_API;

using COMMON_MATCH_ITEM_PROC;

namespace REDIS_ITEM_SUBSCRIPTIONS 
{
    /*

         //var subscriber = Redis_Sub.redis.GetSubscriber();
         //var subscriber = Redis_Sub.cacheClient.Subscribe();
         subscriber.Subscribe(channelName, (channel, message) =>
         {
            Console.WriteLine($"{DateTime.Now.ToString("yyyyMMdd HH:mm:ss")}<Normal - {channel}><{message}>.");

         });
            
         // Synchronous handler
         sub.Subscribe("messages").OnMessage(channelMessage => {
                 Console.WriteLine((string) channelMessage.Message);
         });

        public void Subscribe(string channel, Action<RedisChannel, RedisValue> handler)
        {
            if (this.multiplexer.IsConnected)
            {
                var subscriber = this.multiplexer.GetSubscriber();
                subscriber.Subscribe(channel, handler);
            }
        }
    */


    static class Member_Item_Conf
    {
        public static string Request_Account_Create_Team_Deck_Power_Info = "Request_Account_Create_Team_Deck_Power_Info";      //계정 생성 초기 팀 파워 요청 
        public static string Request_Item_Equip_Hero_Card_Deck_Info      = "Request_Item_Equip_Hero_Card_Deck_Info";           //아이템 카드 덱 교체 설정 정보 

        public static string Request_Item_Update_Hero_Team_Power_Info    = "Request_Item_Update_Hero_Team_Power_Info";         //아이템 카드 히어로 팀 파워 재설정 정보   

        public static string Request_User_Info_Test_Info  = "Request_User_Info_Test_Info";      //테스트
               

    }

   


    public class Redis_Item_Subscriptions
    {

        protected Stopwatch _swh_1 = null;
        protected Stopwatch _swh_2 = null;

        private static readonly log4net.ILog logger      = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_DEFAULT"));
        private static readonly log4net.ILog logger_input = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_INPUT"));
        private static readonly log4net.ILog logger_output = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_OUTPUT"));
        private static readonly log4net.ILog logger_error = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_ERROR"));

        //public static Stopwatch _swh { get; set; }
        public Redis_Item_Subscriptions(string Server_Name)
        {

            _swh_1 = new Stopwatch();
            _swh_2 = new Stopwatch();


            //Redis_Sub.Subscribe(Server_Name +"_"+Member_Item_Conf.Request_Team_Deck_Power_Info , Request_Team_Deck_Power_Info);
            //Redis_Sub.Subscribe(Server_Name +"_"+Member_Item_Conf.Request_User_Info_Test_Info, Request_User_Info_Test_Info);
            Task.Run(async delegate  { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" +Member_Item_Conf.Request_Account_Create_Team_Deck_Power_Info, Request_Account_Create_Team_Deck_Power_Info); });
            Task.Run(async delegate  { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" +Member_Item_Conf.Request_Item_Equip_Hero_Card_Deck_Info, Request_Item_Equip_Hero_Card_Deck_Info); });
            Task.Run(async delegate  { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Member_Item_Conf.Request_Item_Update_Hero_Team_Power_Info, Request_Item_Update_Hero_Team_Power_Info); });



            Task.Run(async delegate  { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" +Member_Item_Conf.Request_User_Info_Test_Info, Request_User_Info_Test_Info);  });



        }


        #region 덱 팀 파워 요청 
        //////////////////////////////  Request_Account_Create_Team_Deck_Power_Info Func////////////////////////////////////
        protected void Request_Account_Create_Team_Deck_Power_Info(RedisChannel Channel , RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    /*
                    int _Count = (int)j_obj["COUNT"];
                    if (_Count == 1)
                    {
                        _swh_2 = new Stopwatch();
                        _swh_2.Start();
                    }
                    else
                    {
                        if (_Count == -1)
                        {
                            _swh_2.Stop();
                            logger.Debug(_swh_2.ElapsedMilliseconds.ToString() + " " + Common.GetCaller());
                            _swh_2.Reset();

                        }
                    }
                    */

                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>.");

                    Common_Item.REQUEST_TEAM_DECK_POWER_DATA GameRequest_Info_Data = (j_obj).ToObject<Common_Item.REQUEST_TEAM_DECK_POWER_DATA>();
                    if (GameRequest_Info_Data != null)
                    {

                        //유저 팀 파워 정보는 바로 DB 로 저장한다..
                        MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                        PROC_GET_RW_ITEM_TEAM_HERO_DECK_INFO_PARAM RW_Item_Team_Deck_Power_Info = new PROC_GET_RW_ITEM_TEAM_HERO_DECK_INFO_PARAM(DBCon._SqlConnection, "GET_RW_ITEM_TEAM_HERO_DECK_POWER_INFO");
                        RW_Item_Team_Deck_Power_Info.mAcc_UKEY = GameRequest_Info_Data.ACC_UKEY;
                        RW_Item_Team_Deck_Power_Info.mDeck_Type = 0;
                        RW_Item_Team_Deck_Power_Info.mTeam_Power = Match_Game_API.GetTeamPower(GameRequest_Info_Data.TEAM_DECK_INFO);
                        RW_Item_Team_Deck_Power_Info.OPEN_SET_PARAM();
                        switch (RW_Item_Team_Deck_Power_Info.GET_RETURN_PARAM(RW_Item_Team_Deck_Power_Info.SqlDataReader.NextResult()))
                        {
                            case 0:
                            {
                            }break;
                            default:
                            {
                                logger_error.Error($"[DB ERROR]: {"CALL GET_RW_ITEM_TEAM_HERO_DECK_POWER_INFO"}");
                            }break;
                        }
                        RW_Item_Team_Deck_Power_Info.CLOSE();
                        DBCon.SQL_CLOSE();
                    }//end if 

                                       

                    /*
                    //비동기 task 사용 
                    new Task(() =>
                    {
                        Common_Item.REQUEST_TEAM_DECK_POWER_DATA GameRequest_Info_Data = (j_obj).ToObject<Common_Item.REQUEST_TEAM_DECK_POWER_DATA>();
                        if (GameRequest_Info_Data != null)
                        {
                            int Deck_power = GameRequest_Info_Data.COUNT;

                            MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                            StringBuilder queryString = new StringBuilder();

                            queryString.Append("UPDATE  uu_user_item_hero_team_ref_info  SET");
                            queryString.Append(" T_POWER =  ");
                            queryString.Append(Deck_power + " , ");
                            queryString.Append(" UPDATE_TIME = NOW() ");
                            queryString.Append(" WHERE ACC_UKEY = ");
                            queryString.Append(GameRequest_Info_Data.ACC_UKEY);
                            queryString.Append(" AND D_TYPE = ");
                            queryString.Append(GameRequest_Info_Data.DECK_TYPE);

                            MYSQL_D_READER Table_Data_Info = new MYSQL_D_READER(DBCon._SqlConnection, queryString.ToString());
                            if (Table_Data_Info._Errorstr.Length > 0)
                            {
                                logger_error.Error($"[DB ERROR]: {Table_Data_Info._Errorstr}");
                            }


                            Table_Data_Info.CLOSE_READER();
                            Table_Data_Info.COMMAND_CLOSE();
                            DBCon.SQL_CLOSE();
                        }

                    }).Start();
                    //Db_task.Start();
                    */

                    //동기
                    /*
                    Common_Item.REQUEST_TEAM_DECK_POWER_DATA GameRequest_Info_Data = (j_obj).ToObject<Common_Item.REQUEST_TEAM_DECK_POWER_DATA>();
                    if (GameRequest_Info_Data != null)
                    {
                        int Deck_power = GameRequest_Info_Data.COUNT;

                        MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                        StringBuilder queryString = new StringBuilder();

                        queryString.Append("UPDATE  uu_user_item_hero_team_ref_info  SET");
                        queryString.Append(" T_POWER =  ");
                        queryString.Append(Deck_power + " , ");
                        queryString.Append(" UPDATE_TIME = NOW() ");
                        queryString.Append(" WHERE ACC_UKEY = ");
                        queryString.Append(GameRequest_Info_Data.ACC_UKEY);
                        queryString.Append(" AND D_TYPE = ");
                        queryString.Append(GameRequest_Info_Data.DECK_TYPE);

                        MYSQL_D_READER Table_Data_Info = new MYSQL_D_READER(DBCon._SqlConnection, queryString.ToString());
                        if (Table_Data_Info._Errorstr.Length > 0)
                        {
                            logger_error.Error($"[DB ERROR]: {Table_Data_Info._Errorstr}");
                        }
                     

                        Table_Data_Info.CLOSE_READER();
                        Table_Data_Info.COMMAND_CLOSE();
                        DBCon.SQL_CLOSE();
                    }
                    */



                    /*
                    MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                    PROC_GET_R_ACCOUNT_CONFRIM_INFO_PARAM Test_R_Info = new PROC_GET_R_ACCOUNT_CONFRIM_INFO_PARAM(DBCon._SqlConnection, "GET_R_FRIEND_LIST_INFO");
                    Test_R_Info.mAcc_Ukey = 130602592247842391;
                    Test_R_Info.OPEN_SET_PARAM();


                    DB_UU_PROC_GET_BLOCK_SKILL_UPGRADE_INFO Result_Param_User_Block_Skill_Upgrade_Info = new DB_UU_PROC_GET_BLOCK_SKILL_UPGRADE_INFO();
                    while (Test_R_Info.SqlDataReader.Read())
                    {
                        Result_Param_User_Block_Skill_Upgrade_Info.GEM = Test_R_Info.SqlDataReader.GetUInt64(0);
                        Result_Param_User_Block_Skill_Upgrade_Info.LEVEL_NOW = Test_R_Info.SqlDataReader.GetInt32(1);

                    }
                    List<DB_UU_PROC_GET_BLOCK_SKILL_UPGRADE_INFO> Service_Url_Result_Param_Info = new List<DB_UU_PROC_GET_BLOCK_SKILL_UPGRADE_INFO>();
                    if (Test_R_Info.SqlDataReader.NextResult())
                    {
                        while (Test_R_Info.SqlDataReader.Read())
                        {
                            DB_UU_PROC_GET_BLOCK_SKILL_UPGRADE_INFO Item;
                            Item.GEM = 0;
                            Item.LEVEL_NOW = Test_R_Info.SqlDataReader.GetInt32(0);
                            Item.STR_DATA  = Test_R_Info.SqlDataReader.GetString(1);
                            Item.STR_DATA  = Test_R_Info.SqlDataReader.GetString(2);
                            Service_Url_Result_Param_Info.Add(Item);
                        }//end while
                    }//end if 
                                                                       
                    switch (Test_R_Info.GET_RETURN_PARAM(Test_R_Info.SqlDataReader.NextResult()))
                    {
                        case 0:
                        {
                                //성공 
                        }break;
                        case 10:
                        {
                                //기타 에러 
                        }break;
                        default:
                        {
                                //기타 에러 

                        }break;
                    }
                    Test_R_Info.CLOSE();
                    DBCon.SQL_CLOSE();
                     */


                }


                //logger.Debug($"<{Channel}><{message}>.");
                //Console.WriteLine($"<{Channel}><{message}>.");

            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }

            //Console.WriteLine($"{DateTime.Now.ToString("yyyyMMdd HH:mm:ss")}<Normal - {Channel}><{message}>.");

        }//Request_Team_Deck_Power_Info

        //////////////////////////////  Request_Team_Deck_Power_Info Func////////////////////////////////////
        #endregion





        #region 아이템 카드 덱 설정 정보 
        //////////////////////////////  Request_Item_Equip_Hero_Card_Deck_Info Func////////////////////////////////////
        protected void Request_Item_Equip_Hero_Card_Deck_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                  
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>.");


                    Common_Item.REQUEST_EQUIP_HERO_CARD_DECK_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Item.REQUEST_EQUIP_HERO_CARD_DECK_INFO>();
                    if (GameRequest_Info_Data != null)
                    {

                        MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                        PROC_GET_RW_ITEM_EQUIP_HERO_CARD_DECK_INFO_PARAM RW_Item_Equip_Hero_Card_Deck_Info = new PROC_GET_RW_ITEM_EQUIP_HERO_CARD_DECK_INFO_PARAM(DBCon._SqlConnection, "GET_RW_ITEM_EQUIP_HERO_CARD_DECK_INFO");
                        RW_Item_Equip_Hero_Card_Deck_Info.mAcc_UKEY   = GameRequest_Info_Data.ACC_UKEY;
                        RW_Item_Equip_Hero_Card_Deck_Info.mDeck_Type  = GameRequest_Info_Data.TYPE; ;
                        RW_Item_Equip_Hero_Card_Deck_Info.mSlot_ID    = GameRequest_Info_Data.ID;
                        RW_Item_Equip_Hero_Card_Deck_Info.mItem_UKEY  = GameRequest_Info_Data.IT_UKEY;
                        RW_Item_Equip_Hero_Card_Deck_Info.OPEN_SET_PARAM();


                        JObject ANSWER_SEND_DATA = new JObject();
                        JObject ITEM_EQUIP_HERO_CARD_DECK_INFO = new JObject();
                        

                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY.ToString());
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        ANSWER_SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);



                        DB_RESULT_RW_USER_ITEM_EQUIP_HERO_CARD_DECK_INFO Result_RW_User_Item_Equip_Hero_Card_Deck_Info = new DB_RESULT_RW_USER_ITEM_EQUIP_HERO_CARD_DECK_INFO();
                        while (RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.Read())
                        {
                            Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TYPE           = RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.GetByte(0);
                            Result_RW_User_Item_Equip_Hero_Card_Deck_Info.NOW_POWER      = RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.GetInt32(1);
                            Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TEAM_DECK_INFO = RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.GetString(2);
                        }


                        List<DB_RESULT_ITEM_UPDATE_HERO_DECK_INFO> Result_Item_Update_Hero_Deck_Info = new List<DB_RESULT_ITEM_UPDATE_HERO_DECK_INFO>();
                        if (RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.NextResult())
                        {
                            while (RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.Read())
                            {
                                DB_RESULT_ITEM_UPDATE_HERO_DECK_INFO Item;
                                Item.TYPE = RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.GetByte(0);
                                Item.ID = RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.GetByte(1);
                                Item.IT_UKEY = RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.GetString(2);
                                Result_Item_Update_Hero_Deck_Info.Add(Item);
                            }//end while
                        }//end if 


                        switch (RW_Item_Equip_Hero_Card_Deck_Info.GET_RETURN_PARAM(RW_Item_Equip_Hero_Card_Deck_Info.SqlDataReader.NextResult()))
                        {
                            case 0:
                                {

                                    if(!string.IsNullOrEmpty(Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TEAM_DECK_INFO)  &&  Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TEAM_DECK_INFO != "0" )
                                    {
                                        //팀 덱이 변경 사항 생김 
                                        //성공시 팀 파워 저장후 유저 전송  
                                        int New_Team_Power = Match_Game_API.GetTeamPower(Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TEAM_DECK_INFO);


                                        //다시 또 저장해야함...
                                        DBCon._SqlConnection.Open(); //재 오픈
                                        PROC_GET_RW_ITEM_TEAM_HERO_DECK_INFO_PARAM RW_Item_Team_Deck_Power_Info = new PROC_GET_RW_ITEM_TEAM_HERO_DECK_INFO_PARAM(DBCon._SqlConnection, "GET_RW_ITEM_TEAM_HERO_DECK_POWER_INFO");
                                        RW_Item_Team_Deck_Power_Info.mAcc_UKEY = GameRequest_Info_Data.ACC_UKEY;
                                        RW_Item_Team_Deck_Power_Info.mDeck_Type = GameRequest_Info_Data.TYPE;
                                        RW_Item_Team_Deck_Power_Info.mTeam_Power = New_Team_Power;
                                        RW_Item_Team_Deck_Power_Info.OPEN_SET_PARAM();
                                        switch (RW_Item_Team_Deck_Power_Info.GET_RETURN_PARAM(RW_Item_Team_Deck_Power_Info.SqlDataReader.NextResult()))
                                        {
                                            case 0:
                                                {
                                                    //유저 응답 전송 
                                                    ANSWER_SEND_DATA.Add("RETURN_V", RW_Item_Team_Deck_Power_Info.mOut_Return_V);


                                                    ITEM_EQUIP_HERO_CARD_DECK_INFO.Add("TYPE", Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TYPE);
                                                    ITEM_EQUIP_HERO_CARD_DECK_INFO.Add("POWER", New_Team_Power);
                                                    ANSWER_SEND_DATA.Add("ITEM_EQUIP_HERO_CARD_DECK_INFO", ITEM_EQUIP_HERO_CARD_DECK_INFO);

                                                }
                                                break;
                                            default:
                                                {
                                                    ANSWER_SEND_DATA.Add("RETURN_V", RW_Item_Team_Deck_Power_Info.mOut_Return_V);
                                                    logger_error.Error($"[DB ERROR]: {"CALL GET_RW_ITEM_TEAM_HERO_DECK_POWER_INFO"}");
                                                }
                                                break;
                                        }

                                        RW_Item_Team_Deck_Power_Info.CLOSE();

                                    }
                                    else
                                    {
                                        //현재 값 그냥 전송 
                                        ANSWER_SEND_DATA.Add("RETURN_V", 0);
                                        ITEM_EQUIP_HERO_CARD_DECK_INFO.Add("TYPE", Result_RW_User_Item_Equip_Hero_Card_Deck_Info.TYPE);
                                        ITEM_EQUIP_HERO_CARD_DECK_INFO.Add("POWER", Result_RW_User_Item_Equip_Hero_Card_Deck_Info.NOW_POWER);
                                        ANSWER_SEND_DATA.Add("ITEM_EQUIP_HERO_CARD_DECK_INFO", ITEM_EQUIP_HERO_CARD_DECK_INFO);

                                    }


                                    if (Result_Item_Update_Hero_Deck_Info.Count > 0)
                                    {
                                         
                                        ANSWER_SEND_DATA.Add("ITEM_UPDATE_HERO_DECK_INFO", JArray.FromObject(Result_Item_Update_Hero_Deck_Info));
                                    }//end if


                                }
                                break;
                            default:
                                {
                                    ANSWER_SEND_DATA.Add("RETURN_V", RW_Item_Equip_Hero_Card_Deck_Info.mOut_Return_V);
                                    logger_error.Error($"[DB ERROR]: {"CALL GET_RW_ITEM_EQUIP_HERO_CARD_DECK_INFO"}");
                                }
                                break;
                        }

                        RW_Item_Equip_Hero_Card_Deck_Info.CLOSE();
                        DBCon.SQL_CLOSE();



                        //응답 전송 
                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, ANSWER_SEND_DATA.ToString().Trim()) > 0)
                        {
                            //정상 전송 
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{ANSWER_SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{ANSWER_SEND_DATA.ToString().Trim()}>");
                        }


                    }//end if 

                }


            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }

        
        }//Request_Item_Equip_Hero_Card_Deck_Info
         //////////////////////////////  Request_Item_Equip_Hero_Card_Deck_Info Func////////////////////////////////////
        #endregion



        #region 아이템 카드 덱 팀파워 재설정 정보 
        //////////////////////////////  Request_Item_Update_Hero_Team_Power_Info Func////////////////////////////////////
        protected void Request_Item_Update_Hero_Team_Power_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {

                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>.");


                    Common_Item.REQUEST_UPDATE_HERO_TEAM_POWER_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Item.REQUEST_UPDATE_HERO_TEAM_POWER_INFO>();
                    if (GameRequest_Info_Data != null)
                    {

                        MYSQL_CONNECTION DBCon = new MYSQL_CONNECTION(AppConfiguration.GetAppConfig("MASTER_DB_CON"));
                        PROC_GET_RW_ITEM_TEAM_HERO_TEAM_DECK_REFRESH_INFO_PARAM RW_Item_Team_Hero_Team_Deck_Refresh_Info = new PROC_GET_RW_ITEM_TEAM_HERO_TEAM_DECK_REFRESH_INFO_PARAM(DBCon._SqlConnection, "GET_RW_ITEM_TEAM_HERO_TEAM_DECK_REFRESH_INFO");
                        RW_Item_Team_Hero_Team_Deck_Refresh_Info.mAcc_UKEY = GameRequest_Info_Data.ACC_UKEY;
                        RW_Item_Team_Hero_Team_Deck_Refresh_Info.OPEN_SET_PARAM();


                        JObject ANSWER_SEND_DATA = new JObject();
                
                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY.ToString());
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        ANSWER_SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);


                        List<DB_RESULT_RW_USER_ITEM_EQUIP_HERO_CARD_DECK_INFO> Result_Item_Update_Hero_Deck_Info = new List<DB_RESULT_RW_USER_ITEM_EQUIP_HERO_CARD_DECK_INFO>();
                        while (RW_Item_Team_Hero_Team_Deck_Refresh_Info.SqlDataReader.Read())
                        {
                            DB_RESULT_RW_USER_ITEM_EQUIP_HERO_CARD_DECK_INFO Item;
                            Item.TYPE            = RW_Item_Team_Hero_Team_Deck_Refresh_Info.SqlDataReader.GetByte(0);
                            Item.TEAM_DECK_INFO  = RW_Item_Team_Hero_Team_Deck_Refresh_Info.SqlDataReader.GetString(1);
                            Item.NOW_POWER       = 0;
                            Result_Item_Update_Hero_Deck_Info.Add(Item);

                        }
                     

                        switch (RW_Item_Team_Hero_Team_Deck_Refresh_Info.GET_RETURN_PARAM(RW_Item_Team_Hero_Team_Deck_Refresh_Info.SqlDataReader.NextResult()))
                        {
                            case 0:
                                {

                                    StringBuilder TeamPower_Refresh_Info = new StringBuilder();
                                    for (int i = 0; i < Result_Item_Update_Hero_Deck_Info.Count;  i++)
                                    {
                                        DB_RESULT_RW_USER_ITEM_EQUIP_HERO_CARD_DECK_INFO Item_Info = Result_Item_Update_Hero_Deck_Info[i];
                                        Item_Info.NOW_POWER = Match_Game_API.GetTeamPower(Result_Item_Update_Hero_Deck_Info[i].TEAM_DECK_INFO);
                                        Result_Item_Update_Hero_Deck_Info[i] = Item_Info;

                                        if (TeamPower_Refresh_Info.Length > 0)
                                            TeamPower_Refresh_Info.Append("|");

                                        TeamPower_Refresh_Info.Append(Result_Item_Update_Hero_Deck_Info[i].TYPE + "," + Result_Item_Update_Hero_Deck_Info[i].NOW_POWER);
                                    }
                                                                                                                                           
                                    DBCon._SqlConnection.Open(); //재 오픈
                                    PROC_GET_RW_ITEM_TEAM_HERO_TEAM_DECK_POWER_REFRESH_INFO_PARAM RW_Item_Team_Deck_Power_Refresh_Info = new PROC_GET_RW_ITEM_TEAM_HERO_TEAM_DECK_POWER_REFRESH_INFO_PARAM(DBCon._SqlConnection, "GET_RW_ITEM_TEAM_HERO_TEAM_DECK_POWER_REFRESH_INFO");
                                    RW_Item_Team_Deck_Power_Refresh_Info.mAcc_UKEY = GameRequest_Info_Data.ACC_UKEY;
                                    RW_Item_Team_Deck_Power_Refresh_Info.mTeamPower_Refresh_Info = TeamPower_Refresh_Info.ToString();
                                    RW_Item_Team_Deck_Power_Refresh_Info.OPEN_SET_PARAM();


                                    List<DB_RESULT_RW_USER_ITEM_UPDATE_HERO_TEAM_POWER_INFO> Result_Item_Update_Hero_Team_Power_Info = new List<DB_RESULT_RW_USER_ITEM_UPDATE_HERO_TEAM_POWER_INFO>();
                                    while (RW_Item_Team_Deck_Power_Refresh_Info.SqlDataReader.Read())
                                    {
                                        DB_RESULT_RW_USER_ITEM_UPDATE_HERO_TEAM_POWER_INFO Item;
                                        Item.TYPE       = RW_Item_Team_Deck_Power_Refresh_Info.SqlDataReader.GetByte(0);
                                        Item.POWER      = RW_Item_Team_Deck_Power_Refresh_Info.SqlDataReader.GetInt32(1);
                                        Result_Item_Update_Hero_Team_Power_Info.Add(Item);

                                    }

                                    switch (RW_Item_Team_Deck_Power_Refresh_Info.GET_RETURN_PARAM(RW_Item_Team_Deck_Power_Refresh_Info.SqlDataReader.NextResult()))
                                    {
                                        case 0:
                                            {
                                                //유저 응답 전송 
                                                ANSWER_SEND_DATA.Add("RETURN_V", RW_Item_Team_Deck_Power_Refresh_Info.mOut_Return_V);
                                                ANSWER_SEND_DATA.Add("ITEM_UPDATE_HERO_TEAM_POWER_INFO", JArray.FromObject(Result_Item_Update_Hero_Team_Power_Info));
                                            }
                                            break;
                                        default:
                                            {
                                                ANSWER_SEND_DATA.Add("RETURN_V", RW_Item_Team_Deck_Power_Refresh_Info.mOut_Return_V);
                                                logger_error.Error($"[DB ERROR]: {"CALL GET_RW_ITEM_TEAM_HERO_TEAM_DECK_POWER_REFRESH_INFO"}");
                                            }
                                            break;
                                    }

                                    RW_Item_Team_Deck_Power_Refresh_Info.CLOSE();

                                }
                                break;
                            default:
                                {
                                    ANSWER_SEND_DATA.Add("RETURN_V", RW_Item_Team_Hero_Team_Deck_Refresh_Info.mOut_Return_V);
                                    logger_error.Error($"[DB ERROR]: {"CALL GET_RW_ITEM_TEAM_HERO_TEAM_DECK_REFRESH_INFO"}");
                                }
                                break;
                        }

                        RW_Item_Team_Hero_Team_Deck_Refresh_Info.CLOSE();
                        DBCon.SQL_CLOSE();



                        //응답 전송 
                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, ANSWER_SEND_DATA.ToString().Trim()) > 0)
                        {
                            //정상 전송 
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{ANSWER_SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{ANSWER_SEND_DATA.ToString().Trim()}>");
                        }


                    }//end if 

                }


            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }


        }//Request_Item_Update_Hero_Team_Power_Info
        //////////////////////////////  Request_Item_Update_Hero_Team_Power_Info Func////////////////////////////////////
        #endregion





        #region 테스트 요청 
        //////////////////////////////  Request_User_Info_Test_Info Func////////////////////////////////////
        protected void Request_User_Info_Test_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {

                    int _Count = (int)j_obj["COUNT"];
                    if (_Count == 1)
                    {
                        _swh_1 = new Stopwatch();
                        _swh_1.Start();
                    }
                    else
                    {
                        if (_Count == -1)
                        {
                            _swh_1.Stop();
                            logger.Debug(_swh_1.ElapsedMilliseconds.ToString() + " " + Common.GetCaller());
                            _swh_1.Reset();

                        }
                    }

                }

            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }
                       
            //Console.WriteLine($"Value: {message} Thread Count: {Process.GetCurrentProcess().Threads.Count}");
            //Console.WriteLine($"{DateTime.Now.ToString("yyyyMMdd HH:mm:ss")}<Normal - {Channel}><{message}>.");

        }//Request_User_Info_Test_Info
        //////////////////////////////  Request_User_Info_Test_Info Func////////////////////////////////////
        #endregion



    }


}
