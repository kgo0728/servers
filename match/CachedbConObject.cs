


using System;
using System.Xml.Linq;
using System.Data;
using System.Threading.Tasks;
using StackExchange.Redis;
using StackExchange.Redis.Extensions.Core;
using StackExchange.Redis.Extensions.Newtonsoft;



namespace CACHEDB_CONNECT_OBJECT
{
   
    public partial class CACHEDB_CONNECT
    {
        public string Get_DB_Error_Str()            { return m_Errorstr; }
        public bool   Get_Is_DB_Con()               { return m_IsConect; }
       
        public string IP { get { return m_IP; } set { m_IP = value; } }
        public string DBname { get { return m_DBname; } set { m_DBname = value; } }
        public string ID { get { return m_ID; } set { m_ID = value; } }
        public string pass { get { return m_pass; } set { m_pass = value; } }
        public int    port { get { return m_port; } set { m_port = value; } }
        public string strAccessConn { get { return m_strAccessConn; } }

        public ConnectionMultiplexer redis { get { return m_redis; } set { m_redis = value; } }
        public StackExchangeRedisCacheClient cacheClient { get { return m_cacheClient; } set { m_cacheClient = value; } }


        public CACHEDB_CONNECT()
        {


        }

        public CACHEDB_CONNECT(string Ip , int Port , int Storage = 0)
        {
            DB_CONNECTION(Ip , Port , Storage);
        }

      
        public bool DB_CONNECTION(string Ip, int Port, int Storage)
        {
            m_IP     =  Ip;
            m_port   = Port;
            m_IsConect = false;
            m_Storage = Storage;

            try
            {
                var config = new ConfigurationOptions
                {
                    AllowAdmin = true,
                    EndPoints = { { m_IP , m_port } },
                    AbortOnConnectFail = false,
                    ConnectTimeout = 5000,
                    KeepAlive = 10,
                    ConnectRetry = 0,
                    Ssl = false
                };

                m_redis = ConnectionMultiplexer.Connect(config);
                /*
                m_redis = ConnectionMultiplexer.Connect(new ConfigurationOptions()
                {
                    EndPoints = { ConnectStr },
                    AbortOnConnectFail = false
                });
                */

                m_redis.ConnectionFailed += (sender, args) =>
                {
                    m_IsConect = m_redis.IsConnected;
                    Console.WriteLine("[ConnectionFailed] CACHEDB:" + m_IsConect +" ConnectionType: " + args.ConnectionType.ToString() + " FailureType: " + args.FailureType.ToString());

                };
                m_redis.ConnectionRestored += (sender, args) =>
                {
                    m_IsConect = m_redis.IsConnected;
                    Console.WriteLine("[ConnectionRestored] CACHEDB:" + m_IsConect + " ConnectionType: " + args.ConnectionType.ToString());
                };

                m_redis.ErrorMessage += (sender, args) =>
                {
                    m_IsConect = m_redis.IsConnected;
                    Console.WriteLine("Connection Error:" + args.Message);
                };

            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
                m_IsConect = false;
            }
            finally
            {
                var serializer = new NewtonsoftSerializer();
                m_cacheClient = new StackExchangeRedisCacheClient(m_redis, new NewtonsoftSerializer(), Storage);
                m_IsConect = m_redis.IsConnected;
                m_strAccessConn = m_redis.Configuration;
            }
            return m_IsConect;
        }
              
        
        public void SQL_CLOSE()
        {
            if (m_redis != null && m_redis.IsConnected )
            {
                m_redis.Close();
            }
        }


        public long Publich(string channel, string value)
        {
            if (this.m_IsConect)
            {
                //return m_redis.GetSubscriber().Publish(channel, value , CommandFlags.FireAndForget);
                return m_redis.GetSubscriber().Publish(channel, value);
            }
            else return -1;
        }

        //Task.Run(async delegate { await g_redis_pubsub.Publish_Async("Account_Connect_Confirm", "testaaaa"); });
        public Task<long> PublishAsync(string channel, string value)
        {
            if (this.m_IsConect)
            {
                return m_redis.GetSubscriber().PublishAsync(channel, value);
            }
            else
                return Task.FromResult(0L);
        }


        public void Subscribe(string subChannel, Action<RedisChannel, RedisValue> handler = null)
        {
            if (handler == null)
                throw new ArgumentNullException(nameof(handler));

            ISubscriber sub = m_redis.GetSubscriber();
            sub.Subscribe(subChannel,
                (channel, message) =>
                {
                    if (handler == null)
                    {
                        Console.WriteLine(subChannel + " ???????" + message);
                    }
                    else
                    {
                        handler(channel, message);
                    }
                });
        }

        public async Task SubscribeAsync(string subChannel, Action<RedisChannel, RedisValue> handler = null)
        {
            if (handler == null)
                throw new ArgumentNullException(nameof(handler));

            ISubscriber sub = m_redis.GetSubscriber();
            await sub.SubscribeAsync(subChannel,
                (channel, message) =>
                {
                    if (handler == null)
                    {
                        Console.WriteLine(subChannel + " ???????" + message);
                    }
                    else
                    {
                        handler(channel, message);
                    }
                });
        }



        public void Unsubscribe(RedisChannel channel)
        {
            var sub = m_redis.GetSubscriber();
            sub.Unsubscribe(channel);
        }


        private ConnectionMultiplexer         m_redis = null;
        private StackExchangeRedisCacheClient m_cacheClient = null; 
        private string m_IP       = string.Empty;
        private string m_DBname   = string.Empty;
        private string m_ID       = string.Empty;
        private string m_pass     = string.Empty;
        private int    m_port     = 0;
        private string m_Errorstr = string.Empty;
        private int    m_Storage  = 0;
        private string m_strAccessConn = string.Empty;
        private bool m_IsConect = false; 
    }

    
    /*
    public class CACHE_MEM_DB_OBJECT_WRITE_INFO<T> : CACHEDB_CONNECT
    {
        public bool mReturn_V = false;
        public string m_Errorstr = string.Empty;
        public CACHE_MEM_DB_OBJECT_WRITE_INFO(String Con, string Key, T Value, int Storage)
        {
            try
            {
                if (DB_CONNECTION(Con , Storage))
                {
                    mReturn_V = cacheClient.Add<T>(Key, Value);   
                    SQL_CLOSE();
                }//end if
            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
            }
        }//CACHE_MEM_DB_OBJECT_WRITE_INFO

        public CACHE_MEM_DB_OBJECT_WRITE_INFO(String Con, string Key, T Value, int Storage , DateTimeOffset Time)
        {
            try
            {   //DateTimeOffset.Now.AddMinutes(5) -- 5분뒤 삭제 
                if (DB_CONNECTION(Con, Storage))
                {
                    mReturn_V = cacheClient.Add<T>(Key, Value, Time);   //특정 시간 동안만 세션이 유효 (재접속시 6시간씩) 
                    SQL_CLOSE();
                }//end if
            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
            }
        }//CACHE_MEM_DB_OBJECT_WRITE_INFO

    }

    public class  CACHE_MEM_DB_OBJECT_READ_INFO<T> : CACHEDB_CONNECT
    {
        public string m_Errorstr = string.Empty;
        private T m_Value = default(T);
        public  T T_Value  { get { return m_Value; }  }
        public  CACHE_MEM_DB_OBJECT_READ_INFO(String Con, string Key, int Storage)
        {
            try
            { 
                if (DB_CONNECTION(Con, Storage) )
                {
                    m_Value = cacheClient.Get<T>(Key);
                    SQL_CLOSE();
                }//end if
            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
            }

        }//CACHE_MEM_DB_OBJECT_READ_INFO
    }


    public class CACHE_MEM_DB_OBJECT_DEL_INFO : CACHEDB_CONNECT
    {
        public string m_Errorstr = string.Empty;
        public CACHE_MEM_DB_OBJECT_DEL_INFO(String Con, string Key, int Storage)
        {
            try
            {
                if (DB_CONNECTION(Con, Storage))
                {
                    if (cacheClient.Exists(Key))
                    {
                        cacheClient.Remove(Key);
                    }

                    SQL_CLOSE();
                }//end if
            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
            }

        }//CACHE_MEM_DB_OBJECT_DEL_INFO
    }

    public class CACHE_MEM_DB_OBJECT_DEL_ALL_INFO : CACHEDB_CONNECT
    {
        public string m_Errorstr = string.Empty;
        public CACHE_MEM_DB_OBJECT_DEL_ALL_INFO(String Con, int Storage)
        {
            try
            {
                if (DB_CONNECTION(Con, Storage))
                {
                    cacheClient.FlushDb();
                    SQL_CLOSE();
                }//end if
            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
            }

        }//CACHE_MEM_DB_OBJECT_DEL_ALL_INFO
    }
        
    */
}

