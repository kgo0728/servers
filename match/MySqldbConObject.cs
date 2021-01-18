


using System;
using System.Xml.Linq;

using System.Data;

using MySql.Data;
using MySql.Data.MySqlClient;


namespace MYSQL_CONNECT_OBJECT
{

    public partial class MYSQL_CONNECTION
    {
        public MySqlConnection _SqlConnection { get { return m_SqlConnection; } }

        public string Get_DB_Error_Str() { return m_Errorstr; }
        public bool Get_Is_DB_Con() { return m_IsConect; }
        public int Get_Proc_Return() { return Proc_Return; }

        public string IP { get { return m_IP; } set { m_IP = value; } }
        public string DBname { get { return m_DBname; } set { m_DBname = value; } }
        public string ID { get { return m_ID; } set { m_ID = value; } }
        public string pass { get { return m_pass; } set { m_pass = value; } }
        public string port { get { return m_port; } set { m_port = value; } }
        public string strAccessConn { get { return m_strAccessConn; } }

        public MYSQL_CONNECTION(string IP, string Db_Name, string ID, string pass, string port)
        {
            m_IP = IP; m_DBname = Db_Name; m_ID = ID; m_pass = pass;
            m_IsConect = false;
            SQL_OPEN(String.Format("{0}{1};{2}{3};{4}{5};{6}{7};{8}{9};", "Server=", m_IP, "uid=", m_ID, "pwd=", m_pass, "database=", m_DBname, "port=", port));
        }

        public MYSQL_CONNECTION(string ConnectStr)
        {
            m_strAccessConn = ConnectStr;
            m_IsConect = false;

            //m_strAccessConn = String.Format("{0}{1};{2}{3};{4}{5};{6}{7};{8};", "Server=", m_IP, "uid=", m_ID, "pwd=", m_pass, "database=", m_DBname, "port=3316");
            //string strAccessConn = "server=localhost; uid=server; port=3316; pwd=vmfkdlarpdlawm123!@#; convert zero datetime=True; database=test2"; 
            SQL_OPEN(ConnectStr);
        }

        public bool SQL_OPEN(string ConnectStr)
        {
            if (string.IsNullOrEmpty(ConnectStr)) return false;
            m_strAccessConn = ConnectStr;

            m_IP = Get_Connect_String_Paser(ConnectStr.Split(';'), "server");
            m_ID = Get_Connect_String_Paser(ConnectStr.Split(';'), "uid");
            m_port = Get_Connect_String_Paser(ConnectStr.Split(';'), "port");
            m_pass = Get_Connect_String_Paser(ConnectStr.Split(';'), "pwd");
            m_DBname = Get_Connect_String_Paser(ConnectStr.Split(';'), "database");

            try
            {
                m_SqlConnection = new MySqlConnection(m_strAccessConn);
                m_SqlConnection.Open();
                m_IsConect = true;

            }
            catch (Exception ex)
            {
                m_Errorstr = ex.ToString();
                m_IsConect = false;
            }

            return true;

        }
        public void SQL_CLOSE()
        {
            if (m_SqlConnection.State != ConnectionState.Closed)
            {
                if (m_SqlConnection != null) m_SqlConnection.Close();
            }
        }

        private string Get_Connect_String_Paser(string[] SplitStr, string Searchstr)
        {
            string Find = string.Empty;
            foreach (string s in SplitStr)
            {
                if (s.Contains(Searchstr))
                {
                    Find = s.Replace(" ", "");
                    Find = Find.Substring(Searchstr.Length + 1); break;
                }
            }//end foreach 
            return Find;
        }

        private int Proc_Return = 0;

        private MySqlConnection m_SqlConnection = null;

        private string m_IP = string.Empty;
        private string m_DBname = string.Empty;
        private string m_ID = string.Empty;
        private string m_pass = string.Empty;
        private string m_port = string.Empty;
        private string m_Errorstr = string.Empty;
        private string m_strAccessConn = string.Empty;
        private bool m_IsConect = false;
    }//MYSQL_CONNECTION



    /*
    public partial class MYSQL_D_READER  //partial 동일한 클래스 명으로 다른 함수들을 정의해서 사용할수 있다 (단 생성자는 1개만 허용)

    {
        public void MYSQL_D_READER1()
        {
     
        }//MYSQL_D_READE
    }
    */


    public partial class MYSQL_D_READER_ADAPTER
    {
        public MySqlCommand _SqlCommand { get { return mSqlCommand; } }
        public MySqlDataAdapter _DataAdapter { get { return mDataAdapter; } }
        public DataSet _DataSet { get { return mDataSet; } }
        public string _Errorstr { get { return mErrorstr; } }

        public MYSQL_D_READER_ADAPTER(MySqlConnection Con, string Exestr)
        {
            try
            {
                mErrorstr = string.Empty;

                mSqlCommand = new MySqlCommand();
                //mSqlCommand = Con.CreateCommand();
                mSqlCommand.Connection = Con;

               
                mSqlCommand.CommandType = CommandType.Text;
                mSqlCommand.CommandText = Exestr;

                mDataAdapter = new MySqlDataAdapter(mSqlCommand);
                mDataSet = new DataSet();
                mDataAdapter.Fill(mDataSet);
            }
            catch (Exception ex)
            {
                mErrorstr = ex.Message;
            }

        }//MYSQL_D_READER_ADAPTER

        public void COMMAND_CLOSE()
        {
            if (mSqlCommand != null) mSqlCommand.Dispose();     //모든 리소스 해제
        }//CLOSE


        private MySqlCommand     mSqlCommand;
        private MySqlDataAdapter mDataAdapter;
        private DataSet          mDataSet;
        private string           mErrorstr; 

    }


    public partial class MYSQL_D_READER_PROC
    {
        public MySqlCommand SqlCommand { get { return mSqlCommand; } set { mSqlCommand = value; } }
        public MySqlDataReader SqlDataReader { get { return mSqlDataReader; } set { mSqlDataReader = value; } }

        public MYSQL_D_READER_PROC()
        {
            SqlCommand = null;
            SqlDataReader = null;

        }//MYSQL_D_READER
               
        protected void COMMAND_CLOSE()
        {
            if (mSqlCommand != null) mSqlCommand.Dispose();     //모든 리소스 해제
        }//CLOSE
        protected void CLOSE_READER()
        {
            mSqlDataReader.Close();                             //리더 닫기                 
        }//READER_CLOSE


        private MySqlCommand mSqlCommand;
        private MySqlDataReader mSqlDataReader;


    }//MYSLQ_D_READER_PROC


    public partial class MYSQL_D_READER
    {
        public MySqlCommand SqlCommand { get { return mSqlCommand; } set { mSqlCommand = value; } }
        public MySqlDataReader SqlDataReader { get { return mSqlDataReader; } set { mSqlDataReader = value; } }
        public string _Errorstr { get { return mErrorstr; } }

        public MYSQL_D_READER(MySqlConnection Con, string Exestr)
        {
            SqlCommand = null;
            SqlDataReader = null;
            mErrorstr = string.Empty;
            try
            {
                SqlCommand = new MySqlCommand();
                SqlCommand.Connection = Con;

                SqlCommand.CommandType = CommandType.Text;
                SqlCommand.CommandText = Exestr;

                SqlDataReader = SqlCommand.ExecuteReader(CommandBehavior.CloseConnection);
      
            }
            catch (Exception ex)
            {
                mErrorstr = ex.ToString();
            }

        }//MYSQL_D_READER
     

        public MYSQL_D_READER()
        {
            SqlCommand = null;
            SqlDataReader = null;

        }//MYSQL_D_READER

        public void COMMAND_CLOSE()
        {
            if (mSqlCommand != null) mSqlCommand.Dispose();     //모든 리소스 해제
        }//CLOSE
        public void CLOSE_READER()
        {
            mSqlDataReader.Close();                             //리더 닫기                 
        }//READER_CLOSE

        /*
        private async void myButton_Click()
        {
            MySqlConnection myConn = new MySqlConnection("MyConnectionString");
            MySqlCommand proc = new MySqlCommand("MyAsyncSpTest", myConn);

            proc.CommandType = CommandType.StoredProcedure;

            var result = await proc.ExecuteReaderAsync(CommandBehavior.CloseConnection);
        } 
        */

        private MySqlCommand mSqlCommand;
        private MySqlDataReader mSqlDataReader;
        private string mErrorstr;
        public int mOut_Return_V;
    }//MYSQL_D_READER

}//MYSQL_CONNECT_OBJECT

