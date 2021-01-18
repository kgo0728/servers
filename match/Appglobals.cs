using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using APP_CONFIGURATION;
using CACHEDB_CONNECT_OBJECT;


namespace APPGLOBALS
{
    public class globals
    {
        private static CACHEDB_CONNECT _g_redis_pubsub = null;
        public static CACHEDB_CONNECT g_redis_pubsub
        {
            get { return _g_redis_pubsub;   }
            set {_g_redis_pubsub = value;   }
        }

    }
}
