using System;
using System.Collections.Generic;
using System.Text;

using HiQInGamePlayLogic;
using APP_CONFIGURATION;

namespace MATCH_GAME_API
{
    public class Match_Game_API
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_DEFAULT"));
        private static readonly log4net.ILog logger_input = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_INPUT"));
        private static readonly log4net.ILog logger_output = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_OUTPUT"));
        private static readonly log4net.ILog logger_error = log4net.LogManager.GetLogger(AppConfiguration.GetAppConfig("LOG4_LOG_ERROR"));
        
        /*
        public class Match_Game_Info
        {
            public string MatchID;                                            // 게임 생성 고유키
            public string UserKey;                                            // 게임 생성 유저키
            public string ATeamInfo;                                        // A Team Info
            public string BTeamInfo;                                        // B Team Info
            public string serveTeam;                                        // 서브팀
            public string pinchserveTeam;                                   // 예약된 팀 스킬
            public string Game_Result;
        }
        public class Match_Game_End_Info
        {
            public string MatchID;
            public string UserKey;
            public int Result_Size;
        }
        
        public static Dictionary<string, Match_Game_End_Info> resultInfo = new Dictionary<string, Match_Game_End_Info>();
        
        public class Match_Arena_Game_Info
        {
            public Int64 arenaID;                                   // 게임 생성 고유키
            public Int64 UserKey;                                   // 게임 생성 유저키
            public string ATeamInfo;                                // A Team Info
            public string BTeamInfo;                                // B Team Info
            public List<byte> serveTeam;                            // 서브팀
            public List<string> ATeamSkillInfo;                     // A Team Skill Info
            public List<string> BTeamSkillInfo;                     // B Team Skill Info
            public List<byte> pinchserveTeam;                       // 핀치서브팀
            public List<string> game_Result;                        // 결과값
            public int result_Size;                                 // 결과값 사이즈

            public Match_Arena_Game_Info()
            {
                arenaID = 0;
                UserKey = 0;
                ATeamInfo = string.Empty;
                BTeamInfo = string.Empty;
                serveTeam = new List<byte>();
                ATeamSkillInfo = new List<string>();
                BTeamSkillInfo = new List<string>();
                pinchserveTeam = new List<byte>();
                game_Result = new List<string>();
                result_Size = 0;
            }
        }

        public static Dictionary<Int64, Match_Arena_Game_Info> Arena_Result_Info = new Dictionary<Int64, Match_Arena_Game_Info>();

        public static void Match_Arena_Game_Info_Save(Int64 arenaID, Int64 uKey, string aTeam, string bTeam, byte serveTeam, string aTeamSkill, string bTeamSkill, byte pinchserveTeam, string game_Result)
        {
            if (Arena_Result_Info.ContainsKey(arenaID))
            {
                Arena_Result_Info[arenaID].serveTeam.Add(serveTeam);

                if (!string.IsNullOrEmpty(aTeamSkill))
                {
                    Arena_Result_Info[arenaID].ATeamSkillInfo.Add(aTeamSkill);
                }
                else
                {
                    Arena_Result_Info[arenaID].ATeamSkillInfo.Add("{\"ReadyActiveSkills\":[]}");
                }

                if (!string.IsNullOrEmpty(bTeamSkill))
                {
                    Arena_Result_Info[arenaID].BTeamSkillInfo.Add(bTeamSkill);
                }
                else
                {
                    Arena_Result_Info[arenaID].BTeamSkillInfo.Add("{\"ReadyActiveSkills\":[]}");
                }
                Arena_Result_Info[arenaID].pinchserveTeam.Add(pinchserveTeam);
                Arena_Result_Info[arenaID].game_Result.Add(game_Result.Trim());
                Arena_Result_Info[arenaID].result_Size += Encoding.Default.GetBytes(game_Result.Trim()).Length;
            }
            else
            {
                Match_Arena_Game_Info Info = new Match_Arena_Game_Info();
                Info.arenaID = arenaID;
                Info.UserKey = uKey;
                Info.ATeamInfo = aTeam;
                Info.BTeamInfo = bTeam;
                
                if (serveTeam >= 0)
                    Info.serveTeam.Add(serveTeam);
                
                if (pinchserveTeam >= 0)
                    Info.pinchserveTeam.Add(pinchserveTeam);

                if (!string.IsNullOrEmpty(aTeamSkill))
                {
                    Info.ATeamSkillInfo.Add(aTeamSkill);
                }
                else
                {
                    Info.ATeamSkillInfo.Add("{\"ReadyActiveSkills\":[]}");
                }

                if (!string.IsNullOrEmpty(bTeamSkill))
                {
                    Info.BTeamSkillInfo.Add(bTeamSkill);
                }
                else
                {
                    Info.BTeamSkillInfo.Add("{\"ReadyActiveSkills\":[]}");
                }

                if (!string.IsNullOrEmpty(game_Result) )
                    Info.game_Result.Add(game_Result);

                Info.result_Size = Encoding.Default.GetBytes(game_Result.Trim()).Length;
                Arena_Result_Info.Add(arenaID, Info);
            }
        }
        public static void Match_Arena_Game_Info_Log(Int64 arenaID)
        {
            Match_Arena_Game_Info ret = null;

            if (Arena_Result_Info.TryGetValue(arenaID, out ret))
            {
                int i = 0;
                string serveTeam_log = "";
                string pinchserveTeam_log = "";
                string ateamskill_log = "";
                string bteamskill_log = "";
                string result_log = "";

                if (ret.serveTeam.Count > 0)
                {


                    for (i = 0; i < ret.serveTeam.Count; ++i)
                    {
                        serveTeam_log += ret.serveTeam[i].ToString() + (i < ret.serveTeam.Count - 1 ? "," : "");
                    }
                    logger_output.Info($"serveTeam = <{serveTeam_log}>");
                }
                if (ret.pinchserveTeam.Count > 0)
                {
                    for (i = 0; i < ret.pinchserveTeam.Count; ++i)
                    {
                        pinchserveTeam_log += ret.serveTeam[i].ToString() + (i < ret.pinchserveTeam.Count - 1 ? "," : "");
                    }
                }
                if (ret.ATeamSkillInfo.Count > 0)
                {
                    for (i = 0; i < ret.ATeamSkillInfo.Count; ++i)
                    {
                        ateamskill_log += ret.ATeamSkillInfo[i] + (i < ret.ATeamSkillInfo.Count - 1 ? "," : "");
                    }
                }
                if (ret.BTeamSkillInfo.Count > 0)
                {
                    for (i = 0; i < ret.BTeamSkillInfo.Count; ++i)
                    {
                        bteamskill_log += ret.BTeamSkillInfo[i] + (i < ret.BTeamSkillInfo.Count - 1 ? "," : "");
                    }
                }
                if (ret.game_Result.Count > 0)
                {
                    for (i = 0; i < ret.game_Result.Count; ++i)
                    {
                        result_log += ret.game_Result[i] + (i < ret.game_Result.Count - 1 ? "," : "");
                    }
                }
                if (AppConfiguration.LOG4_ABLE_OUTPUT)
                {
                    logger_output.Info($"serveTeam_log = <{serveTeam_log}>, pinchserveTeam_log = <{pinchserveTeam_log}>, ateamskill_log = <{ateamskill_log}>, bteamskill_log = <{bteamskill_log}>, result_log = <{result_log}>");
                    logger_output.Info($"arena = <{ret.arenaID}>, userKey = <{ret.UserKey}>, aTeam = <{ret.ATeamInfo}>, bTeam = <{ret.BTeamInfo}>, result_size = <{ret.result_Size}>");
                }
            }
        }
        public static bool Match_Arena_Game_Info_Del(Int64 arenaID)
        {
            bool ret = Arena_Result_Info.Remove(arenaID);
            //Arena_Result_Info.Remove(arenaID);
            if (AppConfiguration.LOG4_ABLE_OUTPUT)
                logger_output.Info($"ret = <{ret}>");

            return ret;
        }
        public static int Match_Arena_Game_End_Info_Load(Int64 arenaID)
        {
            int size = 0;
            Match_Arena_Game_Info ret = null;
            Arena_Result_Info.TryGetValue(arenaID, out ret);
            if (ret != null)
            {
                //logger_output.Info($"match] = <{ret.MatchID}>, UserKey = <{ret.UserKey}>, Result_Size = <{ret.Result_Size}>");
                size = ret.result_Size;
            }

            return size;
        }
        /*
        public static void Match_Game_End_Info_Save(string matchID, string userKey,string Result)
        {
            if (resultInfo.ContainsKey(matchID))
            {
                resultInfo[matchID].Result_Size += Encoding.Default.GetBytes(Result.Trim()).Length;
                //logger_output.Info($"Result_Size] = <{resultInfo[matchID].Result_Size}>");
            }
            else
            {
                Match_Game_End_Info info = new Match_Game_End_Info();
                info.MatchID = matchID;
                info.UserKey = userKey;
                info.Result_Size = Encoding.Default.GetBytes(Result.Trim()).Length;
                //logger_output.Info($"Result_Size] = <{info.Result_Size}>");

                resultInfo.Add(matchID, info);
            }
        }
        public static int Match_Game_End_Info_Load(string matchID)
        {
            int size = 0;
            Match_Game_End_Info ret = null;
            resultInfo.TryGetValue(matchID, out ret);
            if (ret != null)
            {
                //logger_output.Info($"match] = <{ret.MatchID}>, UserKey = <{ret.UserKey}>, Result_Size = <{ret.Result_Size}>");
                size = ret.Result_Size;
            }

            return size;
        }
        
        public static Dictionary<string, List<Match_Game_Info>> resultDics = new Dictionary<string, List<Match_Game_Info>>();
        public static void Match_Game_Info_Save(string matchID, string userKey, string aTeam, string bTeam, string serveTeam, string pinchserveTeam, string Result)
        {
            Match_Game_Info Game_Info_Result = new Match_Game_Info();

            Game_Info_Result.MatchID = matchID;
            Game_Info_Result.UserKey = userKey;
            if (aTeam != null)
                Game_Info_Result.ATeamInfo = aTeam;

            if (bTeam != null)
                Game_Info_Result.BTeamInfo = bTeam;

            if (serveTeam != null)
                Game_Info_Result.serveTeam = serveTeam;

            if (pinchserveTeam != null)
                Game_Info_Result.pinchserveTeam = pinchserveTeam;

            Game_Info_Result.Game_Result = Result;

            if (resultDics.ContainsKey(matchID) == false)
                resultDics.Add(matchID, new List<Match_Game_Info>());

            resultDics[matchID].Add(Game_Info_Result);
        }
        public static List<Match_Game_Info> Match_Game_Info_Load(string matchID)
        {
            List<Match_Game_Info> ret = null;
            resultDics.TryGetValue(matchID, out ret);
            //logger_input.Info($"info = <{ret}>");
            return ret;
        }

        public static bool Match_Game_Info_Del(string matchID)
        {
            bool ret = resultDics.Remove(matchID);
            resultInfo.Remove(matchID);

            return ret;
        }

        public static void Match_Game_Info_Log(string matchID)
        {
            List<Match_Game_Info> ret = null;

            if (resultDics.TryGetValue(matchID, out ret))
            {
                for(var i = 0; i < ret.Count; i++)
                {
                    logger_output.Info($"match[{i}] = <{ret[i].MatchID}>, serveTeam = <{ret[i].serveTeam}>, aTeam = <{ret[i].ATeamInfo}>, bTeam = <{ret[i].BTeamInfo}>, pinchserveTeam = <{ret[i].pinchserveTeam}>, result = <{ret[i].Game_Result}>");
                }
            }
        }
        */

        public static bool MakeFullAutoGame(string accSessionKey, CGamePlayDefine.ETeamID serveTeam, List<CGamePlayerInfo.PlayerParam> teamAPlayers, List<CGamePlayerInfo.PlayerParam> teamBPlayers, CMakeGameResult outRes)
        {
            CGamePlayFullAutoJudge autoGame = new CGamePlayFullAutoJudge(accSessionKey);
            bool ret = autoGame.MakeFullAutoGame(accSessionKey, serveTeam, teamAPlayers, teamBPlayers, outRes);
            if (ret == false)
                logger_error.Info(" MakeFullAutoGame - Failed........... ");

            return ret;
        }

        public static bool Init(string gameId, CGamePlayDefine.ETeamID serveTeam, ref GamePlayControlInitParam InitParam ,  CMakeTurnResult outRes, ref int outVersion)
        {

            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.AddControl(gameId);
            if (!control.Init(serveTeam, ref InitParam, ref outVersion))
                return false;

            return control.MakeAllTurns(serveTeam, new CMakeTurnTeamParam(), new CMakeTurnTeamParam(), CGamePlayDefine.ETeamID.None, outRes);
        }

        public static bool MakeAllTurns(string gameId, CGamePlayDefine.ETeamID serveTeam, CMakeTurnTeamParam teamAParam, CMakeTurnTeamParam teamBParam, CGamePlayDefine.ETeamID pinchServeAvailableTeam, CMakeTurnResult outRes) // 핀치서브 요청, 다중 ActiveSkill ready 요청
        {
            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control == null)
            {
                logger_error.Error("CServerLogicTester: MakeAllTurns - Not found Control........");
                return false;
            }
            return control.MakeAllTurns(serveTeam, teamAParam, teamBParam, pinchServeAvailableTeam, outRes);
        }

        public static bool Re_MakeAllTurns(string gameId, int RemakeStratIndex , CMakeTurnTeamParam teamAParam, CMakeTurnTeamParam teamBParam, CGamePlayDefine.ETeamID pinchServeAvailableTeam, CMakeTurnResult outRes) // 핀치서브 요청, 다중 ActiveSkill ready 요청
        {
            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control == null)
            {
                logger_error.Error("CServerLogicTester: Re_MakeAllTurns - Not found Control........");
                return false;
            }
            return control.RemakeAllTurns(RemakeStratIndex, teamAParam, teamBParam, pinchServeAvailableTeam, outRes);
        }



        public static bool EndGame(string gameId, CGamePlayDefine.ETeamID winnerTeam)
        {
            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control == null)
            {
                logger_error.Error("CServerLogicTester: EndGame - Not found Control........");
                return false;
            }

            bool ret = control.EndGame(winnerTeam);
            CGamePlayControlManagerS.Instance.RemoveControl(gameId);

            return ret;
        }
        public static bool DeleteGame(string gameId)
        {
            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control == null)
            {
                logger_error.Error("CServerLogicTester: DeleteGame - Not found Control........");
                return false;
            }
            else
                CGamePlayControlManagerS.Instance.RemoveControl(gameId);

            return true;
        }
        public static int GetScore(string gameId, CGamePlayDefine.ETeamID team)
        {
            int teamScore = 0;
            HiQInGamePlayLogic.CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control != null)
                teamScore = control.GetScore(team);
           
            return teamScore;
        }

        public static int GetSetScore(string gameId, CGamePlayDefine.ETeamID team)
        {
            int teamSetScore = 0;
            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control != null)
            {
                teamSetScore = control.GetSetScore(team);
            }
            return teamSetScore;
        }
        public static List<CGamePlayerInfo.PlayerParam> Play_Info(string playlist)
        {
            List<CGamePlayerInfo.PlayerParam> BuffTeamPlayers = new List<CGamePlayerInfo.PlayerParam>();

            CGamePlayerInfo.PlayerParam Info = new CGamePlayerInfo.PlayerParam();

            Info.Key = 0;
            string[] My_PlayerList = playlist.Split('|');
            for(int i = 0; i < My_PlayerList.Length; i++)
            {
                string[] playInfo = My_PlayerList[i].Split(',');
                Info.SlotIndex = int.Parse(playInfo[0]);         //슬롯 인덱스 
                Info.CharacterId = int.Parse(playInfo[1]);       //캐릭터 카드 ID 
                Info.Level = int.Parse(playInfo[2]);             //캐릭터 레벨 ID 
                Info.ItemFocustrainId = int.Parse(playInfo[3]);  //캐릭터 포커스 트레인 ID 
                Info.Condition = int.Parse(playInfo[5]);         //캐릭터 컨디션 개수 값 

                Info.PromotionId0 = int.Parse(playInfo[8]);      //프로모션 첫번째 
                Info.PromotionId1 = int.Parse(playInfo[9]);       
                Info.PromotionId2 = int.Parse(playInfo[10]);
                Info.PromotionId3 = int.Parse(playInfo[11]);
                Info.PromotionId4 = int.Parse(playInfo[12]);
                BuffTeamPlayers.Add(Info);
            }
            /*
            foreach (string player in My_PlayerList)
            {
                string[] playInfo = player.Split(',');
                Info.SlotIndex = int.Parse(playInfo[0]);         //슬롯 인덱스 
                Info.CharacterId = int.Parse(playInfo[1]);       //캐릭터 카드 ID 
                Info.Level = int.Parse(playInfo[2]);             //캐릭터 레벨 ID 
                Info.ItemFocustrainId = int.Parse(playInfo[3]);  //캐릭터 포커스 트레인 ID 
                Info.Condition = int.Parse(playInfo[5]);         //캐릭터 컨디션 개수 값 
                BuffTeamPlayers.Add(Info);
            }*/

            return BuffTeamPlayers;
        }
        public static int GetTeamPower(string TeamInfo)
        {
            int teamPower = 0;
            CServerPlayerAccess.CServerLogicManager.Instance.TeamPowerCalculator.BuildDeck(TeamInfo);
            teamPower = CServerPlayerAccess.CServerLogicManager.Instance.TeamPowerCalculator.GetTeamPower();
            return teamPower;
        }
        public static int GetTeamPower(List<CGamePlayerInfo.PlayerParam> playerParam)
        {
            int teamPower = 0;
            List<CPlayerBasicInfo> playerList = new List<CPlayerBasicInfo>();
            foreach(var player in playerParam)
            {
                int[] promotions = { player.PromotionId0, player.PromotionId1, player.PromotionId2, player.PromotionId3, player.PromotionId4 };
                CPlayerBasicInfo playerInfo = new CPlayerBasicInfo(player.CharacterId, player.Level, player.ItemFocustrainId, player.SelfWill, player.SelfControl, (CGamePlayDefine.EConditionState)player.Condition , promotions);
                playerList.Add(playerInfo);
            }
            CServerPlayerAccess.CServerLogicManager.Instance.TeamPowerCalculator.BuildDeck(playerList);
            teamPower = CServerPlayerAccess.CServerLogicManager.Instance.TeamPowerCalculator.GetTeamPower();
            playerList.Clear();
            
            return teamPower;

        }
        public static int GetScore(string gameId, CGamePlayDefine.ETeamID team, int set)
        {
            int teamScore = 0;
            CGamePlayControlBase control = CGamePlayControlManagerS.Instance.FindControl(gameId);
            if (control != null)
            {
                teamScore = control.GetScore(team, set);
            }
            return teamScore;
        }

        /*
        public static int GetArenaPoint(CGamePlayDefine.ETeamID team, int aTeam_Point, int bTeam_Point)
        {
            int GetPoint = 0;
            int basic_point = (int)CTableManagerS.Instance.ValueTable.Find_ID(50057).Value; // 아레나 기본 점수
            
            if (team == CGamePlayDefine.ETeamID.A)
            {
                float win_rate = (float)CTableManagerS.Instance.ValueTable.Find_ID(50058).Value;     // 아레나 승리 계수
                // 승리시 포인트 
                GetPoint = (int)Math.Round((((bTeam_Point - aTeam_Point) / aTeam_Point) * win_rate) + basic_point, 1);          // 승리 점수
            }
            else
            {
                float lose_penalty = (float)CTableManagerS.Instance.ValueTable.Find_ID(50059).Value;        // 아레나 패배 패널티
                float lose_rate = (float)CTableManagerS.Instance.ValueTable.Find_ID(50060).Value;            // 아레나 패배 계수
                // 패배시 포인트
                GetPoint = (int)Math.Round(((aTeam_Point / bTeam_Point) * lose_penalty) + (basic_point * lose_rate), 1);        //패배 점수
            }

            return GetPoint;
        }
        */
        public static string GetTotal_SetScore(string accSessionKey)
        {
            int Ateam_setScore = 0;
            int Bteam_setScore = 0; 

            Ateam_setScore = GetSetScore(accSessionKey, CGamePlayDefine.ETeamID.A);
            Bteam_setScore = GetSetScore(accSessionKey, CGamePlayDefine.ETeamID.B);
            return Ateam_setScore.ToString() + "-" + Bteam_setScore.ToString();
        }
        public static string GetTotal_Score(string accSessionKey)
        {
            int Ateam_setScore = 0;
            int Bteam_setScore = 0;
            int Ateam_score_1 = 0;
            int Bteam_score_1 = 0;
            int Ateam_score_2 = 0;
            int Bteam_score_2 = 0;
            int Ateam_score_3 = 0;
            int Bteam_score_3 = 0;

            Ateam_setScore = GetSetScore(accSessionKey, CGamePlayDefine.ETeamID.A);
            Bteam_setScore = GetSetScore(accSessionKey, CGamePlayDefine.ETeamID.B);

            Ateam_score_1 = GetScore(accSessionKey, CGamePlayDefine.ETeamID.A, 1);
            Bteam_score_1 = GetScore(accSessionKey, CGamePlayDefine.ETeamID.B, 1);
            if ((Ateam_setScore + Bteam_setScore) > 0)
            {
                Ateam_score_2 = GetScore(accSessionKey, CGamePlayDefine.ETeamID.A, 2);
                Bteam_score_2 = GetScore(accSessionKey, CGamePlayDefine.ETeamID.B, 2);
            }

            if ((Ateam_setScore + Bteam_setScore) > 1)
            {
                Ateam_score_3 = GetScore(accSessionKey, CGamePlayDefine.ETeamID.A, 3);
                Bteam_score_3 = GetScore(accSessionKey, CGamePlayDefine.ETeamID.B, 3);
            }
            return Ateam_score_1.ToString() + "-" + Bteam_score_1.ToString() + "|" + Ateam_score_2.ToString() + "-" + Bteam_score_2.ToString() + "|" + Ateam_score_3.ToString() + "-" + Bteam_score_3.ToString();
        }
        //public static void Game_Result_DB_Save(string matchId, string gameId, )
    }
}