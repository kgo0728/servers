using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json.Linq;
using StackExchange.Redis;

using COMMON_UTLL_FUNC;
using COMMON_DATA_FUNC;


using APPGLOBALS;

using APP_CONFIGURATION;
using MYSQL_CONNECT_OBJECT;
using CACHEDB_CONNECT_OBJECT;
using MATCH_GAME_API;
using COMMON_MATCH_ARENA_PROC;


using HiQInGamePlayLogic;

namespace REDIS_MATCH_SUBSCRIPTIONS
{
    
    static class Match_Channel_Conf
    {
      
        //아레나 
        public static string Request_Match_Arena_Game_Start_Info = "Request_Match_Arena_Game_Start_Info";
        public static string Request_Match_Arena_Game_End_Info   = "Request_Match_Arena_Game_End_Info";

        //스테이지 
        public static string Request_Match_Stage_Game_Start_Info = "Request_Match_Stage_Game_Start_Info";
        public static string Request_Match_Stage_Game_End_Info   = "Request_Match_Stage_Game_End_Info";


        ////////////////////////// 공통 처리 //////////////////////////
        public static string Request_Match_Common_Game_Rally_Info       = "Request_Match_Common_Game_Rally_Info";
        public static string Request_Match_Common_Game_Rally_Retry_Info = "Request_Match_Common_Game_Rally_Retry_Info";
        public static string Request_Match_Common_Game_Auto_Mode_Info   = "Request_Match_Common_Game_Auto_Mode_Info";
        public static string Request_Match_Common_Game_DisConnect_Info = "Request_Match_Common_Game_DisConnect_Info";
    }

    public class Redis_Match_Subscriptions
    {

        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_DEFAULT"));
        private static readonly log4net.ILog logger_input = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_INPUT"));
        private static readonly log4net.ILog logger_output = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_OUTPUT"));
        private static readonly log4net.ILog logger_error = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_ERROR"));

        public Redis_Match_Subscriptions(string Server_Name)
        {
            /* 테스트 용 현재는 사용하지 않음 
            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Match_Channel_Conf.Request_Match_Game_Start_Info, Request_Match_Game_Start_Info_Info); });
            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Match_Channel_Conf.Request_Match_Game_Rally_Info, Request_Match_Game_Rally_Info_Info); });
            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Match_Channel_Conf.Request_Match_Game_End_Info, Request_Match_Game_End_Info_Info); });
            
            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Match_Channel_Conf.Request_Match_Arena_Game_Start_Info, Request_Match_Arena_Game_Start_Info); });
            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Match_Channel_Conf.Request_Match_Arena_Game_Rally_Info, Request_Match_Arena_Game_Rally_Info); });
            Task.Run(async delegate { await globals.g_redis_pubsub.SubscribeAsync(Server_Name + "_" + Match_Channel_Conf.Request_Match_Arena_Game_End_Info, Request_Match_Arena_Game_End_Info); });
            */

            //아레나 
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Arena_Game_Start_Info, Request_Match_Arena_Game_Start_Info);
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Arena_Game_End_Info, Request_Match_Arena_Game_End_Info);

            //스테이지 
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Stage_Game_Start_Info, Request_Match_Stage_Game_Start_Info);
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Stage_Game_End_Info, Request_Match_Stage_Game_End_Info);


            //////////공통 /////////////////////
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Common_Game_Rally_Info, Request_Match_Common_Game_Rally_Info);
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Common_Game_Rally_Retry_Info, Request_Match_Common_Game_Rally_Retry_Info);
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Common_Game_Auto_Mode_Info, Request_Match_Common_Game_Auto_Mode_Info);
            globals.g_redis_pubsub.Subscribe(Server_Name + "_" + Match_Channel_Conf.Request_Match_Common_Game_DisConnect_Info, Request_Match_Common_Game_DisConnect_Info);


            /*
            string Test_Json_Deck = "{\"PT\": 1, \"D_BASE\": \"1,110036,1,1,2,0,0,5|2,110037,1,1,1,0,0,5|3,110038,1,1,1,0,0,4|4,110039,1,1,3,0,0,4|5,110040,1,1,1,0,0,3|6,110041,1,1,2,0,0,4|7,110042,1,1,4,0,0,4|8,110043,1,1,1,0,0,1\", \"D_PROMO\": \"1,110036,0,-1,-1,-1,-1|2,110037,0,-1,-1,-1,-1|3,110038,0,-1,-1,-1,-1|4,110039,0,-1,-1,-1,-1|5,110040,0,-1,-1,-1,-1|6,110041,0,-1,-1,-1,-1|7,110042,0,-1,-1,-1,-1|8,110043,0,-1,-1,-1,-1\"}";
            JObject j_obj = JObject.Parse(Test_Json_Deck);
            if (j_obj != null)
            {
               Common_Deck_Info.MATCH_DECK_INFO Deck_Info = (j_obj).ToObject<Common_Deck_Info.MATCH_DECK_INFO>();
            }  
            */
        }//Redis_Match_Subscriptions

        protected void Request_Match_Game_Auto_Test_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    logger_input.Debug($"<{Channel}><{message}>");

                    // 비동기 처리 
                    new Task(() =>
                    {
                        Common_Match.REQUEST_MATCH_GAME_START_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_GAME_START_INFO>();

                        if ( GameRequest_Info_Data != null )
                        {
                            string matchID = DateTime.Now.ToString("yyyyMMddhhmmssfff");

                            string[] data = GameRequest_Info_Data.DATA.Split(' ');

                            JObject my_obj = JObject.Parse(data[0]);
                            JObject enemy_obj = JObject.Parse(data[1]);

                            Common_Deck_Info.DECK_INFO_DATA My_Deck_Info = (my_obj).ToObject<Common_Deck_Info.DECK_INFO_DATA>();
                            Common_Deck_Info.DECK_INFO_DATA Enemy_Deck_Info = (enemy_obj).ToObject<Common_Deck_Info.DECK_INFO_DATA>();

                            string accSessionKey = GameRequest_Info_Data.ACC_UKEY;
                            List<CGamePlayerInfo.PlayerParam> BuffTeamAPlayers = new List<CGamePlayerInfo.PlayerParam>();
                            List<CGamePlayerInfo.PlayerParam> BuffTeamBPlayers = new List<CGamePlayerInfo.PlayerParam>();

                            CMakeGameResult Result = new CMakeGameResult();

                            BuffTeamAPlayers = Match_Game_API.Play_Info(My_Deck_Info.TEAM_DECK_INFO);      // 내 팀 정보 
                            BuffTeamBPlayers = Match_Game_API.Play_Info(Enemy_Deck_Info.TEAM_DECK_INFO);   // 상대팀 정보

                            if (Match_Game_API.MakeFullAutoGame(accSessionKey, CGamePlayDefine.ETeamID.A, BuffTeamAPlayers, BuffTeamBPlayers, Result))
                            {
                                if (Result != null)
                                {
                                    logger_input.Debug($"Winner : <{Result.WinnerTeam.ToString()}>");

                                    int turnCount = 0;
                                    int count = Result.MakeTurnResultList.Count;

                                    for (int i = 0; i < count; i++)
                                    {
                                        CMakeTurnResult turns = Result.MakeTurnResultList[i];

                                        logger_output.Debug($"Turn End ....");
                                        switch (turns.TurnEndType)
                                        {
                                            case CMakeTurnResult.ETurnEndType.Scored:
                                                logger_output.Debug($"< Score Team : {turns.HostTeam.ToString()}>");
                                                break;
                                            case CMakeTurnResult.ETurnEndType.SetEnd:
                                                logger_output.Debug($"< Set Win Team : {turns.HostTeam.ToString()}>");
                                                break;
                                            case CMakeTurnResult.ETurnEndType.GameEnd:
                                                logger_output.Debug($"< Game Win Team : {turns.HostTeam.ToString()}>");
                                                break;
                                        }

                                        logger_output.Debug($"< Turn Skill Ready ............ {turns.HostTeam.ToString()}>");
                                        foreach (CActiveSkillBase.ESkillType ready in turns.ATeamReadyActiveSkills)
                                        {
                                            logger_output.Debug($"< Turn A_Team Read Skill : {ready.ToString()}>");
                                        }
                                        foreach (CActiveSkillBase.ESkillType ready in turns.BTeamReadyActiveSkills)
                                        {
                                            logger_output.Debug($"< Turn B_Team Read Skill : {ready.ToString()}>");
                                        }

                                        logger_output.Debug($" Turn Rally ......... ");
                                        foreach (CGamePlayDefine.MakeTurnSeed seed in turns.MakeTurnSeeds)
                                        {
                                            turnCount++;
                                            logger_output.Debug($"< Turn Seed : result-{seed.ActionResult}, action_id-{seed.SelectedActionId}, use_skill-{seed.UseActiveSkill.ToString()}, use_skill_team-{seed.UseActiveSkillTeam.ToString()}");
                                        }
                                    }
                                    int rallyCount = count;

                                    logger_output.Debug($" Total rally : {rallyCount}, turn: {turnCount}");
                                }
                            }
                            logger_output.Debug($" Test Complete ");
                            // 랠리 처리 end
                            //Match_Game_API.Match_Game_Info_Save(matchID, accSessionKey, data[0], data[1], HiQInGamePlayLogic.CGamePlayDefine.ETeamID.A.ToString(), null, Result.ToString());
                        }

                    }).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }
        }



        ///////////////////////////// Request_Match_Arena_Game_Start_Info ////////////////////////////////////
        protected void Request_Match_Arena_Game_Start_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    //비동기 처리
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_ARENA_GAME_START_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_ARENA_GAME_START_INFO>();
                    if (GameRequest_Info_Data != null)
                    {

                        int RETURN_V = HIQMATCH.ERROR_CODE.SUCC;
                        int outVersion = 0;
                        int result_size = 0;

                        //인스턴스 초기화 때문에 그냥 넣어준다 
                        var t = CTableManagerS.Instance.ActionBlockTable;
                        List<CGamePlayerInfo.PlayerParam> BuffTeamAPlayers = new List<CGamePlayerInfo.PlayerParam>();
                        List<CGamePlayerInfo.PlayerParam> BuffTeamBPlayers = new List<CGamePlayerInfo.PlayerParam>();

                        CMakeTurnResult Result = new CMakeTurnResult();
                        BuffTeamAPlayers.Clear();
                        BuffTeamBPlayers.Clear();

                        
                        BuffTeamAPlayers = Match_Game_API.Play_Info(GameRequest_Info_Data.ATEAM);   // 내 팀 정보
                        BuffTeamBPlayers = Match_Game_API.Play_Info(GameRequest_Info_Data.BTEAM);   // 상대방 정보
                        //GamePlayControlInitParam initParam = new GamePlayControlInitParam(BuffTeamAPlayers, BuffTeamBPlayers, GameRequest_Info_Data.SET_SCORE,  GameRequest_Info_Data.SCORE);
                        GamePlayControlInitParam initParam = new GamePlayControlInitParam();
                        initParam.TeamAPlayers    = BuffTeamAPlayers;
                        initParam.TeamBPlayers    = BuffTeamBPlayers;
                        initParam.SetScoreWinGame = GameRequest_Info_Data.SET_SCORE;
                        initParam.ScoreWinSet     = GameRequest_Info_Data.SCORE;
                        initParam.SkillPointIncMultiplyPercentage = 0;
                        initParam.AbilityAddition = "0";
                        if (Match_Game_API.Init(GameRequest_Info_Data.MATCH_ID, CGamePlayDefine.ETeamID.A, ref initParam, Result, ref outVersion))
                        {
                            if (Result == null)
                            {
                                RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;
                                logger_error.Error($"Result = <{Result.Parsing()}>");
                            }
                            else
                                result_size = Encoding.Default.GetBytes(Result.Parsing().Trim()).Length;
                        }
                                        
                        //string Scores = Match_Game_API.GetTotal_Score(GameRequest_Info_Data.MATCH_ID);
                        //string setScore = Match_Game_API.GetTotal_SetScore(GameRequest_Info_Data.MATCH_ID);
              
                        // 커뮤니티 서버로 응답
                        JObject SEND_DATA = new JObject();
                        SEND_DATA.Add("RETURN_V", RETURN_V);
                        SEND_DATA.Add("SET_SCORE", GameRequest_Info_Data.SET_SCORE);
                        SEND_DATA.Add("SCORE", GameRequest_Info_Data.SCORE);
                        SEND_DATA.Add("RESULT", Result.Parsing());
                        SEND_DATA.Add("VERSION", outVersion);


                        // 서버 데이타    
                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY.ToString());
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        SERVER_DATA_INFO.Add("RESULT_SIZE", result_size);
                        SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);


                        // Log 출력용
                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                        {
                            // 정상 전송
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg] : {ex.Message}");
            }
        }


        ///////////////////////////// Request_Match_Arena_Game_End_Info ////////////////////////////////////
        protected void Request_Match_Arena_Game_End_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    // 비동기 처리
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_ARENA_GAME_END_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_ARENA_GAME_END_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        int RETURN_V = HIQMATCH.ERROR_CODE.SUCC;
                        string accSessionKey = GameRequest_Info_Data.ACC_UKEY;
                        bool end = false;
                        string Scores = Match_Game_API.GetTotal_Score(GameRequest_Info_Data.MATCH_ID);
                        string setScore = Match_Game_API.GetTotal_SetScore(GameRequest_Info_Data.MATCH_ID);

                        if (GameRequest_Info_Data.RESULT_TYPE == 1)
                        {
                            CGamePlayDefine.ETeamID winner_team = (CGamePlayDefine.ETeamID)GameRequest_Info_Data.WINNER_TEAM;
                            end = Match_Game_API.EndGame(GameRequest_Info_Data.MATCH_ID, winner_team);
                            if (end == false)  //반드시 TRUE 가 나와야 한다 
                                RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;
                        }
                        else
                            GameRequest_Info_Data.WINNER_TEAM = 3;    //중도 포기


                        //커뮤니티 서버로 응답 
                        JObject SEND_DATA = new JObject();
                        SEND_DATA.Add("RETURN_V", RETURN_V);
                        //SEND_DATA.Add("RESULT", end);


                        // 서버 데이타    
                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY);
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        SERVER_DATA_INFO.Add("SETSCORE", setScore);
                        SERVER_DATA_INFO.Add("SCORE", Scores);
                        SERVER_DATA_INFO.Add("WIN_TYPE", GameRequest_Info_Data.WINNER_TEAM);
                        SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);

                      
                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                        {
                            //정상 전송 
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg] : {ex.Message}");
            }
        }//Request_Match_Arena_Game_End_Info




        ///////////////////////////// Request_Match_Stage_Game_Start_Info ////////////////////////////////////
        protected void Request_Match_Stage_Game_Start_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    //비동기 처리
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_STAGE_GAME_START_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_STAGE_GAME_START_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        int RETURN_V    = HIQMATCH.ERROR_CODE.SUCC;
                        int outVersion  = 0;
                        int result_size = 0;

                        //인스턴스 초기화 때문에 그냥 넣어준다 
                        var t = CTableManagerS.Instance.ActionBlockTable;
                        List<CGamePlayerInfo.PlayerParam> BuffTeamAPlayers = new List<CGamePlayerInfo.PlayerParam>();
                        List<CGamePlayerInfo.PlayerParam> BuffTeamBPlayers = new List<CGamePlayerInfo.PlayerParam>();

                        CMakeTurnResult Result = new CMakeTurnResult();
                        BuffTeamAPlayers.Clear();
                        BuffTeamBPlayers.Clear();
                       
                        BuffTeamAPlayers = Match_Game_API.Play_Info(GameRequest_Info_Data.ATEAM);  // 내 팀 정보
                        BuffTeamBPlayers = Match_Game_API.Play_Info(GameRequest_Info_Data.BTEAM);  // 상대방 정보
                        //GamePlayControlInitParam initParam = new GamePlayControlInitParam(BuffTeamAPlayers, BuffTeamBPlayers, GameRequest_Info_Data.SET_SCORE , GameRequest_Info_Data.SCORE );
                        GamePlayControlInitParam initParam = new GamePlayControlInitParam();
                        initParam.TeamAPlayers    = BuffTeamAPlayers;
                        initParam.TeamBPlayers    = BuffTeamBPlayers;
                        initParam.SetScoreWinGame = GameRequest_Info_Data.SET_SCORE;
                        initParam.ScoreWinSet     = GameRequest_Info_Data.SCORE;
                        initParam.SkillPointIncMultiplyPercentage = GameRequest_Info_Data.SKILL_GAUGE_ADD_SPEED;
                        initParam.AbilityAddition = GameRequest_Info_Data.HERO_ABILITY_ADD_INFO;
                        if (Match_Game_API.Init(GameRequest_Info_Data.MATCH_ID, CGamePlayDefine.ETeamID.A, ref initParam, Result, ref outVersion))
                        {
                            if (Result == null)
                            {
                                RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;
                                logger_error.Error($"Result = <{Result.Parsing()}>");
                            }
                            else
                                result_size = Encoding.Default.GetBytes(Result.Parsing().Trim()).Length;

                        }
                  
                        // 커뮤니티 서버로 응답
                        JObject SEND_DATA = new JObject();
                        SEND_DATA.Add("RETURN_V", RETURN_V);
                        SEND_DATA.Add("SET_SCORE", GameRequest_Info_Data.SET_SCORE);
                        SEND_DATA.Add("SCORE", GameRequest_Info_Data.SCORE);
                        SEND_DATA.Add("SKILL_GAUGE_ADD_SPEED", GameRequest_Info_Data.SKILL_GAUGE_ADD_SPEED);
                        SEND_DATA.Add("HERO_ABILITY_ADD_INFO", GameRequest_Info_Data.HERO_ABILITY_ADD_INFO);
                        SEND_DATA.Add("RESULT", Result.Parsing());
                        SEND_DATA.Add("VERSION", outVersion);

                        // 서버 데이타    
                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY.ToString());
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        SERVER_DATA_INFO.Add("RESULT_SIZE", result_size);
                        SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);

                       
                        // Log 출력용
                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                        {
                            // 정상 전송
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg] : {ex.Message}");
            }

        }

        ///////////////////////////// Request_Match_Stage_Game_End_Info ////////////////////////////////////
        protected void Request_Match_Stage_Game_End_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    // 비동기 처리
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_STAGE_GAME_END_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_STAGE_GAME_END_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        int RETURN_V    = HIQMATCH.ERROR_CODE.SUCC;
                        bool end = false;
                        string Scores   = Match_Game_API.GetTotal_Score(GameRequest_Info_Data.MATCH_ID);
                        string setScore = Match_Game_API.GetTotal_SetScore(GameRequest_Info_Data.MATCH_ID);

                        if (GameRequest_Info_Data.RESULT_TYPE == 1) //정상 진행 
                        {
                            CGamePlayDefine.ETeamID winner_team = (CGamePlayDefine.ETeamID)GameRequest_Info_Data.WINNER_TEAM;
                            end = Match_Game_API.EndGame(GameRequest_Info_Data.MATCH_ID, winner_team);
                            if(end == false)  //반드시 TRUE 가 나와야 한다 
                                RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;
                        }
                        else
                            GameRequest_Info_Data.WINNER_TEAM = 3;    //중도 포기


                        int Team_A_Skill_Use_Num     = 0;   //스킬 사용 횟수 
                        int Team_A_Straight_Score    = 0;   //연속 득점 누적 점수 
                        int Team_A_Block_Spike_Num   = 0;   //상대의 스파이크를 차단 횟수  
                        int Team_A_Service_Ace_Score = 0;   //서비스 에이스로 얻은 주적 점수 
                        int Team_A_Get_Block_Score   = 0;   //블록으로 얻은 누적 점수 

                        //게임 통계 관련 정보 
                        IGameStatisticsAccess End_control = CGamePlayControlManagerS.Instance.FindControl(GameRequest_Info_Data.MATCH_ID);
                        if(End_control != null)
                        {
                            Team_A_Skill_Use_Num  = End_control.GetSkillUseCount(CGamePlayDefine.ETeamID.A);                //스킬 사용 횟수
                            Team_A_Straight_Score = End_control.GetMaxStraightScores(CGamePlayDefine.ETeamID.A);            //연속 득점 횟수 
                            Team_A_Block_Spike_Num = End_control.GetSpike_BlockOrReceiveSuccess(CGamePlayDefine.ETeamID.A); //상대의 스파이크를 막기 횟수 
                            Team_A_Service_Ace_Score = End_control.GetServeScores(CGamePlayDefine.ETeamID.A);               //서비스 에이스로 누적 득점 횟수     
                            Team_A_Get_Block_Score = End_control.GetBlockScores(CGamePlayDefine.ETeamID.A);                 //블록으로 얻은 누적 점수         
                        }

                        

                        //커뮤니티 서버로 응답 
                        JObject SEND_DATA = new JObject();
                        SEND_DATA.Add("RETURN_V", RETURN_V);
                        //SEND_DATA.Add("RESULT", end);


                        // 서버 데이타    
                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY);
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        SERVER_DATA_INFO.Add("SETSCORE", setScore);
                        SERVER_DATA_INFO.Add("SCORE", Scores);
                        SERVER_DATA_INFO.Add("WIN_TYPE", GameRequest_Info_Data.WINNER_TEAM);
                        SERVER_DATA_INFO.Add("TEAM_A_SKILL_USE_NUM", Team_A_Skill_Use_Num);
                        SERVER_DATA_INFO.Add("TEAM_A_STRAIGHT_SCORE", Team_A_Straight_Score);
                        SERVER_DATA_INFO.Add("TEAM_A_BLOCK_SPIKE_NUM", Team_A_Block_Spike_Num);
                        SERVER_DATA_INFO.Add("TEAM_A_SERVICE_ACE_SCORE", Team_A_Service_Ace_Score);
                        SERVER_DATA_INFO.Add("TEAM_A_GET_BLOCK_SCORE", Team_A_Get_Block_Score);
                        SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);


                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                        {
                            //정상 전송 
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg] : {ex.Message}");
            }



        }//Request_Match_Stage_Game_End_Info




        //////////////////////////////////////////// COMMON ///////////////////////////////////////////////////////////

        ///////////////////////////// Request_Match_Common_Game_Rally_Info ////////////////////////////////////
        protected void Request_Match_Common_Game_Rally_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    // 비동기 처리 
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_COMMON_GAME_RALLY_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_COMMON_GAME_RALLY_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        int RETURN_V = HIQMATCH.ERROR_CODE.SUCC;

                        // 내 팀 정보, 상대방 팀정보, 서브팀, 스킬 사용 정보
                        //string Scores       = "0";
                        //string setScore     = "0";
                        int    result_size  =  0;

                        if (GameRequest_Info_Data.SERVE_TEAM > 0)
                        {
                            CGamePlayDefine.ETeamID serve_team = (CGamePlayDefine.ETeamID)GameRequest_Info_Data.SERVE_TEAM;
                            CGamePlayDefine.ETeamID pinchserve_team = (CGamePlayDefine.ETeamID)GameRequest_Info_Data.PINCHSERVE_TEAM;

                            CMakeTurnResult Result = new CMakeTurnResult();

                            CMakeTurnTeamParam MakeTurnTeamAParam = new CMakeTurnTeamParam();
                            CMakeTurnTeamParam MakeTurnTeamBParam = new CMakeTurnTeamParam();

                            // 클라에서 받은 데이터로 MakeTurnTeamAParam, MakeTurnTeamBParam 세팅
                            if (GameRequest_Info_Data.A_TEAM_SKILL != null && GameRequest_Info_Data.A_TEAM_SKILL != "")
                            {
                                JObject a_team = JObject.Parse(GameRequest_Info_Data.A_TEAM_SKILL);
                                MakeTurnTeamAParam = (a_team).ToObject<CMakeTurnTeamParam>();
                            }
                            if (GameRequest_Info_Data.B_TEAM_SKILL != null && GameRequest_Info_Data.B_TEAM_SKILL != "")
                            {
                                JObject b_team = JObject.Parse(GameRequest_Info_Data.B_TEAM_SKILL);
                                MakeTurnTeamBParam = (b_team).ToObject<CMakeTurnTeamParam>();
                            }


                            if (Match_Game_API.MakeAllTurns(GameRequest_Info_Data.MATCH_ID, serve_team, MakeTurnTeamAParam, MakeTurnTeamBParam, pinchserve_team, Result))
                            {
                                //Scores      = Match_Game_API.GetTotal_Score(GameRequest_Info_Data.MATCH_ID);
                                //setScore    = Match_Game_API.GetTotal_SetScore(GameRequest_Info_Data.MATCH_ID);
                                result_size = Encoding.Default.GetBytes(Result.Parsing().Trim()).Length;      

                                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                    logger_output.Debug($"Relly : <{Newtonsoft.Json.JsonConvert.SerializeObject(Result)}>");
                            }
                            else
                                RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;
                          
                            //커뮤니티 서버로 응답 
                            JObject SEND_DATA = new JObject();
                            SEND_DATA.Add("RETURN_V", RETURN_V);
                            SEND_DATA.Add("RESULT", Result.Parsing());

                            //커뮤니티 서버로 응답 
                            JObject SERVER_DATA_INFO = new JObject();
                            SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY);
                            SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                            //SERVER_DATA_INFO.Add("MATCH_ID", GameRequest_Info_Data.MATCH_ID);
                            //SERVER_DATA_INFO.Add("SETSCORE", setScore);
                            //SERVER_DATA_INFO.Add("SCORE", Scores);
                            SERVER_DATA_INFO.Add("RESULT_SIZE", result_size);
                            SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);


                            if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                            {
                                //정상 전송 
                                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                    logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                            }
                            else
                            {
                                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                    logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                            }
                        }
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }
        }


        ///////////////////////////// Request_Match_Common_Game_Rally_Retry_Info ////////////////////////////////////
        protected void Request_Match_Common_Game_Rally_Retry_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    // 비동기 처리 
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_COMMON_GAME_RALLY_RETRY_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_COMMON_GAME_RALLY_RETRY_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        int RETURN_V = HIQMATCH.ERROR_CODE.SUCC;
                        // 내 팀 정보, 상대방 팀정보, 서브팀, 스킬 사용 정보
                        int result_size = 0;


                        if (GameRequest_Info_Data.REMAKEINDEX >= 0)
                        {
                            //HiQInGamePlayLogic.CGamePlayDefine.ETeamID serve_team = (HiQInGamePlayLogic.CGamePlayDefine.ETeamID)GameRequest_Info_Data.SERVE_TEAM;
                            CGamePlayDefine.ETeamID pinchserve_team = (CGamePlayDefine.ETeamID)GameRequest_Info_Data.PINCHSERVE_TEAM;

                            CMakeTurnResult Result = new CMakeTurnResult();
                            CMakeTurnTeamParam MakeTurnTeamAParam = new CMakeTurnTeamParam();
                            CMakeTurnTeamParam MakeTurnTeamBParam = new CMakeTurnTeamParam();

                            // 클라에서 받은 데이터로 MakeTurnTeamAParam, MakeTurnTeamBParam 세팅
                            if (GameRequest_Info_Data.A_TEAM_SKILL != null && GameRequest_Info_Data.A_TEAM_SKILL != "")
                            {
                                JObject a_team = JObject.Parse(GameRequest_Info_Data.A_TEAM_SKILL);
                                MakeTurnTeamAParam = (a_team).ToObject<CMakeTurnTeamParam>();
                            }

                            if (GameRequest_Info_Data.B_TEAM_SKILL != null && GameRequest_Info_Data.B_TEAM_SKILL != "")
                            {
                                JObject b_team = JObject.Parse(GameRequest_Info_Data.B_TEAM_SKILL);
                                MakeTurnTeamBParam = (b_team).ToObject<CMakeTurnTeamParam>();
                            }

                            if (Match_Game_API.Re_MakeAllTurns(GameRequest_Info_Data.MATCH_ID, GameRequest_Info_Data.REMAKEINDEX, MakeTurnTeamAParam, MakeTurnTeamBParam, pinchserve_team, Result))
                            {
                                //string Scores = Match_Game_API.GetTotal_Score(GameRequest_Info_Data.MATCH_ID);
                                //string setScore = Match_Game_API.GetTotal_SetScore(GameRequest_Info_Data.MATCH_ID);
                                result_size = Encoding.Default.GetBytes(Result.Parsing().Trim()).Length;


                                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                    logger_output.Debug($"Relly : <{Newtonsoft.Json.JsonConvert.SerializeObject(Result)}>");
                            }
                            else
                                RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;
                  

                            //커뮤니티 서버로 응답 
                            JObject SEND_DATA = new JObject();
                            SEND_DATA.Add("RETURN_V", RETURN_V);
                            SEND_DATA.Add("RESULT", Result.Parsing());


                            //커뮤니티 서버로 응답 
                            JObject SERVER_DATA_INFO = new JObject();
                            SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY);
                            SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                            //SERVER_DATA_INFO.Add("MATCH_ID", GameRequest_Info_Data.MATCH_ID);
                            //SEND_DATA.Add("SETSCORE", setScore);
                            //SEND_DATA.Add("SCORE", Scores);
                            SERVER_DATA_INFO.Add("RESULT_SIZE", result_size);
                            SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);

                            if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                            {
                                //정상 전송 
                                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                    logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                            }
                            else
                            {
                                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                    logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                            }
                        }
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }
        }



        ///////////////////////////// Request_Match_Common_Game_Auto_Mode_Info ////////////////////////////////////
        protected void Request_Match_Common_Game_Auto_Mode_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    // 비동기 처리 
                    //new Task(() =>
                    //{
                    Common_Match.REQUEST_MATCH_COMMON_GAME_AUTO_MODE_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_COMMON_GAME_AUTO_MODE_INFO>();
                    if (GameRequest_Info_Data != null)
                    {

                        int RETURN_V = HIQMATCH.ERROR_CODE.SUCC;
                        IGamePlayControlExposureAPI control = CGamePlayControlManagerS.Instance.FindControl(GameRequest_Info_Data.MATCH_ID);
                        if (control != null)
                            control.ActiveAutoMode(GameRequest_Info_Data.IS_MODE);
                        else
                            RETURN_V = HIQMATCH.ERROR_CODE.SERVER_SYSTEM_ERROR;


                        //커뮤니티 서버로 응답 
                        JObject SEND_DATA = new JObject();
                        SEND_DATA.Add("RETURN_V", RETURN_V);
                        SEND_DATA.Add("IS_MODE", GameRequest_Info_Data.IS_MODE);


                        // 서버 데이타    
                        JObject SERVER_DATA_INFO = new JObject();
                        SERVER_DATA_INFO.Add("ACC_UKEY", GameRequest_Info_Data.ACC_UKEY);
                        SERVER_DATA_INFO.Add("EVENT_ID", GameRequest_Info_Data.EVENT_ID);
                        SEND_DATA.Add("SERVER_DATA_INFO", SERVER_DATA_INFO);

                        if (globals.g_redis_pubsub.Publich(GameRequest_Info_Data.RECV_EVENT, SEND_DATA.ToString().Trim()) > 0)
                        {
                            //정상 전송 
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }
                        else
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_error.Error($"<{GameRequest_Info_Data.RECV_EVENT}><{SEND_DATA.ToString().Trim()}>");
                        }

                       
                    }
                    //}).Start();
                }
            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg]: {ex.Message}");
            }
        }


        ///////////////////////////// Request_Match_Common_Game_DisConnect_Info //////////////////////////////////// - 경기 내용 저장을 커뮤니티 서버로 이동해서 매치서버에선 삭제 안해도 됨
        protected void Request_Match_Common_Game_DisConnect_Info(RedisChannel Channel, RedisValue message)
        {
            try
            {
                JObject j_obj = JObject.Parse(message);
                if (j_obj != null)
                {
                    if (AppConfiguration.LOG4_ABLE_INPUT)
                        logger_input.Debug($"<{Channel}><{message}>");

                    Common_Match.REQUEST_MATCH_COMMMON_GAME_DISCONNECT_INFO GameRequest_Info_Data = (j_obj).ToObject<Common_Match.REQUEST_MATCH_COMMMON_GAME_DISCONNECT_INFO>();
                    if (GameRequest_Info_Data != null)
                    {
                        //if (!string.IsNullOrEmpty(GameRequest_Info_Data.ARENA_ID))
                        // {
                        if (Match_Game_API.DeleteGame(GameRequest_Info_Data.ARENA_ID))
                        {
                            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                                logger_output.Debug($"<----- DELETE MATCH GAME COMPLETE -----><{GameRequest_Info_Data.ACC_UKEY}><{GameRequest_Info_Data.ARENA_ID}>");
                        }
                       //}
                    }
                }

            }
            catch (Exception ex)
            {
                logger_error.Error($"[Exception msg] : {ex.Message}");
            }
        }
    }
}
