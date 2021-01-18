using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace COMMON_DATA_FUNC
{
    class Common_Item
    {

        public class REQUEST_TEAM_DECK_POWER_DATA
        {
            public Int64 ACC_UKEY = 0;
            //public int DECK_TYPE = 0;
            public string TEAM_DECK_INFO = "0";
        }//REQUEST_TEAM_DECK_POWER_DATA


        public class REQUEST_EQUIP_HERO_CARD_DECK_INFO
        {
            public Int64 ACC_UKEY = 0;
            public string RECV_EVENT = "0";
            public string EVENT_ID = "0";
            public byte TYPE = 0;
            public byte ID = 0;
            public Int64 IT_UKEY = 0;
        }//REQUEST_EQUIP_HERO_CARD_DECK_INFO


        public class REQUEST_UPDATE_HERO_TEAM_POWER_INFO
        {
            public Int64 ACC_UKEY = 0;
            public string RECV_EVENT = "0";
            public string EVENT_ID = "0";
        }//REQUEST_UPDATE_HERO_TEAM_POWER_INFO

    }


    class Common_Member
    {




    }




    class Common_Match
    {
        public class REQUEST_MATCH_GAME_TEST_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string DATA;
            public string EVENT_ID;

            public REQUEST_MATCH_GAME_TEST_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                DATA = string.Empty; ;
                EVENT_ID = string.Empty;
            }
        }
        public class REQUEST_MATCH_GAME_RALLY_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string DATA;
            public string EVENT_ID;
            public string SERVE_TEAM;
            public string A_TEAM;
            public string B_TEAM;
            public string PINCHSERVE_TEAM;
            public string MATCH_ID;

            public REQUEST_MATCH_GAME_RALLY_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                DATA = string.Empty;
                EVENT_ID = string.Empty;
                SERVE_TEAM = string.Empty;
                A_TEAM = string.Empty;
                B_TEAM = string.Empty;
                PINCHSERVE_TEAM = string.Empty;
                MATCH_ID = string.Empty;
            }
        }
        public class REQUEST_MATCH_GAME_START_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string DATA;
            public string MATCH_ID;
            public string EVENT_ID;
            
            public REQUEST_MATCH_GAME_START_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                DATA = string.Empty;
                MATCH_ID = string.Empty;
                EVENT_ID = string.Empty;
            }
        }
        public class REQUEST_MATCH_GAME_END_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string DATA;
            public string EVENT_ID;
            public string WINNER_TEAM;

            public REQUEST_MATCH_GAME_END_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                DATA = string.Empty;
                EVENT_ID = string.Empty;
                WINNER_TEAM = string.Empty;
            }
        }
        public class REQUEST_MATCH_ARENA_GAME_START_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string ATEAM;
            public string BTEAM;
            public string MATCH_ID;
            public string EVENT_ID;
            public short  SET_SCORE;
            public short  SCORE;

            public REQUEST_MATCH_ARENA_GAME_START_INFO()
            {
                ACC_UKEY    = string.Empty;
                RECV_EVENT  = string.Empty;
                ATEAM       = string.Empty;
                BTEAM       = string.Empty;
                MATCH_ID    = string.Empty;
                EVENT_ID    = string.Empty;
                SET_SCORE   = 0;
                SCORE       = 0;

            }
        }

                          
        public class REQUEST_MATCH_ARENA_GAME_END_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string MATCH_ID;
            public string EVENT_ID;
            public byte   WINNER_TEAM;
            public byte   RESULT_TYPE;

            public REQUEST_MATCH_ARENA_GAME_END_INFO()
            {
                ACC_UKEY    = string.Empty;
                RECV_EVENT  = string.Empty;
                MATCH_ID    = string.Empty;
                EVENT_ID    = string.Empty;
                WINNER_TEAM = 0;
                RESULT_TYPE = 0;
            }
        }


        public class REQUEST_MATCH_STAGE_GAME_START_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string ATEAM;
            public string BTEAM;
            public string EVENT_ID;
            public string MATCH_ID;
            public int    SKILL_GAUGE_ADD_SPEED;
            public string HERO_ABILITY_ADD_INFO;
            public short  SET_SCORE;
            public short  SCORE;


            public REQUEST_MATCH_STAGE_GAME_START_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                ATEAM = string.Empty;
                BTEAM = string.Empty;
                EVENT_ID = string.Empty;
                MATCH_ID = string.Empty;
                SKILL_GAUGE_ADD_SPEED = 0;
                HERO_ABILITY_ADD_INFO = string.Empty;
                SET_SCORE = 0;
                SCORE = 0;

            }
        }

        public class REQUEST_MATCH_STAGE_GAME_END_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string MATCH_ID;
            public string EVENT_ID;
            public byte WINNER_TEAM;
            public byte RESULT_TYPE;

            public REQUEST_MATCH_STAGE_GAME_END_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                MATCH_ID = string.Empty;
                EVENT_ID = string.Empty;
                WINNER_TEAM = 0;
                RESULT_TYPE = 0;
            }
        }



        public class REQUEST_MATCH_COMMON_GAME_RALLY_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
         //   public string DATA;
            public string EVENT_ID;
            public byte SERVE_TEAM;
            public string A_TEAM_SKILL;
            public string B_TEAM_SKILL;
            public byte PINCHSERVE_TEAM;
            public string MATCH_ID;

            public REQUEST_MATCH_COMMON_GAME_RALLY_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
          //      DATA = string.Empty;
                EVENT_ID = string.Empty;
                SERVE_TEAM = 0;
                A_TEAM_SKILL = string.Empty;
                B_TEAM_SKILL = string.Empty;
                PINCHSERVE_TEAM = 0;
                MATCH_ID = string.Empty;
            }
        }


        public class REQUEST_MATCH_COMMON_GAME_RALLY_RETRY_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string MATCH_ID;
            public int REMAKEINDEX;
            public string A_TEAM_SKILL;
            public string B_TEAM_SKILL;
            public byte PINCHSERVE_TEAM;
            public string EVENT_ID;

            public REQUEST_MATCH_COMMON_GAME_RALLY_RETRY_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                EVENT_ID = string.Empty;
                REMAKEINDEX = 0;
                A_TEAM_SKILL = string.Empty;
                B_TEAM_SKILL = string.Empty;
                PINCHSERVE_TEAM = 0;
                MATCH_ID = string.Empty;
            }
        }

        public class REQUEST_MATCH_COMMON_GAME_AUTO_MODE_INFO
        {
            public string ACC_UKEY;
            public string RECV_EVENT;
            public string MATCH_ID;
            public bool  IS_MODE;
            public string EVENT_ID;

            public REQUEST_MATCH_COMMON_GAME_AUTO_MODE_INFO()
            {
                ACC_UKEY = string.Empty;
                RECV_EVENT = string.Empty;
                EVENT_ID = string.Empty;
                IS_MODE = false;
                MATCH_ID = string.Empty;
            }
        }


        public class REQUEST_MATCH_COMMMON_GAME_DISCONNECT_INFO
        {
            public string ACC_UKEY;
            public string ARENA_ID;

            public REQUEST_MATCH_COMMMON_GAME_DISCONNECT_INFO()
            {
                ACC_UKEY = string.Empty;
                ARENA_ID = string.Empty;
            }
        }
    }//

    class Common_Deck_Info
    {
        
        public class MATCH_DECK_INFO
        {
            public Byte PT = 0;
            public string D_BASE = "0";
            public string D_PROMO = "0";
        }

        public class DECK_INFO_DATA 
        {
            public string   GAME_NICK       = "0";
            public string   SCHOOL_NAME     = "0";
            public int      LEVEL           = 0;
            public string   TEAM_DECK_INFO  = "0";
        }
        
        public class ARENA_DECK_INFO_DATA
        {
            public string TEAM_DECK_INFO = "0";
        }
    }//





    class Common_System
    {
        public class REQUEST_SERVER_CONTROL_INFO
        {
            public int EVENT_ID = 0;

        }
               
    }


}
