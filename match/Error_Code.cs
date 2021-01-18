using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIQMATCH
{
    class ERROR_CODE
    {
        static public readonly int SUCC = 0;
        static public readonly int SERVER_SYSTEM_ERROR = 101;
        static public readonly int DB_PROC_ERROR = 105;


        // 계정 상태 에러 
        static public readonly int ACCOUNT_INFO_NOT_EXIST = 1002;

        // 아레나 상태 에러 
        static public readonly int MATCH_ARENA_GAME_NOT_EXIST = 9002;
    }
}
