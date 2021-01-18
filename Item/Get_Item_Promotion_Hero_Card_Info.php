

<?php


include_once ('../webconfig.php');
include_once ('../app_define.php');
include_once ('../app_Message_define.php');
include_once ('../app_common.php');

# 중간에 연결이 끊어져도 이 php는 진행됨.
ignore_user_abort(true);

# 중간에 Exception 발생시 아래 핸들러로 연결 .
set_exception_handler('EXCEPTION_Handler');

# 입력 처리
$request   = GetInput();  //return array

//$request = array();         //자체 입력 테스트
//$request['ACC_UKEY']     = 118479362130098449;
//$request['UU_DB_PATH'] = '127.0.0.1,3306,yewonmaster,yewongames_awsdeveloper,jgbuserdb';
//$request['GAME_NICK'] = 'test_01_nick';
$response           = array();   //클라이언트 전달용
$response_server    = array();   //서버에서 처리할 데이타 용
  

switch(GET_ACCOUNT_SESSION_RETURN_VALUE($request['ACC_UKEY'] , $request['SESSION_KEY'] ))
{
    case 0:
    {

        if( isset($request['IT_UKEY'])  && isset($request['PROMOTION_INFO']) )
        {
        
            if(INPUT_CONTENT_LOG_ABLE > 0 )
                log_input("[RECV][ITEM_PROMOTION_HERO_CARD_INFO] "  . print_r($request , true) );
    
            //마스터 서버 정보  
            $DB_HOST   = MASTER_DB_HOST;
            $DB_PORT   = MASTER_DB_PORT;
            $DB_ID     = MASTER_DB_ID;
            $DB_PASS   = MASTER_DB_PASS;
            $DB_SCHEMA = MASTER_DB_SCHEMA;
        
    
            $ACC_UKEY         = $request['ACC_UKEY'];
            $IT_UKEY          = $request['IT_UKEY']; 
            $PROMOTION_INFO   = $request['PROMOTION_INFO']; 
            
            try 
            {
                $DSN = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_SCHEMA;charset=$PDO_CHARSET";
                $Main_Db = new PDO($DSN, $DB_ID, $DB_PASS, $PDO_OPTION);
        
                $query = "CALL GET_RW_ITEM_PROMOTION_HERO_CARD_INFO(@RETURN,?,?,?)";
                $stmt  = $Main_Db->prepare($query);
                
                $stmt->bindParam(1, $ACC_UKEY        , PDO::PARAM_INT , 8);
                $stmt->bindParam(2, $IT_UKEY         , PDO::PARAM_INT , 8);
                $stmt->bindParam(3, $PROMOTION_INFO  , PDO::PARAM_STR , strlen($PROMOTION_INFO));
                $stmt->execute();
            
                $Update_Team_Deck = 0;
                $Result_RW_Item_Promotion_Hero_Card_info = array();
                while ($row = $stmt->fetch())
                {
                    $Result_RW_Item_Promotion_Hero_Card_info["IT_UKEY"]       =  (string)$row[0];
                    $Result_RW_Item_Promotion_Hero_Card_info["POSITION"]      =  $row[1];
                    $Result_RW_Item_Promotion_Hero_Card_info["PROMOTION"]     =  $row[2];

                } 
             
                $Result_RW_Item_Update_Hero_Team_Power_info = array();
                if ($stmt->nextRowset() && $stmt->columnCount())
                {
                    $item_info = [];
                    while ($row = $stmt->fetch())
                    {
                        $item_info["TYPE"]         =  $row[0];
                        $item_info["POWER"]        =  $row[1];
                        array_push($Result_RW_Item_Update_Hero_Team_Power_info ,$item_info );
                    } 
                }

                switch(GET_QUERY_RETURN_VALUE($Main_Db, $stmt->nextRowset(),$stmt->columnCount() ))
                {
    
                    case 0:
                    {
                        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SUCC;
    
                        $response['ITEM_PROMOTION_HERO_CARD_INFO'] = $Result_RW_Item_Promotion_Hero_Card_info; 
    
                        if(count($Result_RW_Item_Update_Hero_Team_Power_info) > 0 )  $response['ITEM_UPDATE_HERO_TEAM_POWER_INFO']  =  $Result_RW_Item_Update_Hero_Team_Power_info;
              
                        /*
                        if($response_server["UPDATE_TEAM_DECK"] > 0 &&  $response_server["GET_COMMUNITY_SERVER"] != '0' )
                        {
                            //팀 덱 업데이트 해야함 ( 레디스 처리후 클라이언트 접속 커뮤니티 서버로 연동 하여 클라이언트 이벤트 전송하게 해준다 )
                            $redis = ConnectRedis(REDIS_HOST , REDIS_PORT);  

                            $pub_data = ['ACC_UKEY'       => $request['ACC_UKEY'] ,
                                         'RECV_EVENT'     => $response_server["GET_COMMUNITY_SERVER"] .'_'  .'Answer_Item_Update_Hero_Team_Power_Info' ,  //접속 커뮤니티 서버 레디스 구독 이벤트 정보 
                                         'EVENT_ID'       => 'Item_Update_Hero_Team_Power_Info'];           //클라이언트 전송 
                            $pub_json = json_encode($pub_data, JSON_UNESCAPED_SLASHES);
                
                            if(!$redis->publish($response_server["GET_MATCH_SERVER"] .'_' .MATCH_PUBLISH_MESSAGE_VALUE::Request_Item_Update_Hero_Team_Power_Info, $pub_json))
                                    log_error("SEND REDIS PUBLISH ERROR!:" . $response_server["GET_MATCH_SERVER"] .'_' .MATCH_PUBLISH_MESSAGE_VALUE::Request_Item_Update_Hero_Team_Power_Info);
               
                            $redis->close();
                        }
                        */

                    }break;
                    case 10: //유저   계정 정보가 존재하지 않는다  
                    {
                        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
                    }
                    break;
                    case 20: //게임내 존재 하지 않는 아이템 정보 이다
                    {
                        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::GAME_ITEM_INFO_NOT_EXIST;
                    }
                    break;
                    default:
                    {
                        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
                    }break;
                }
    
                $stmt->closeCursor();
                $Main_Db = null;  //null  만으로 초기화 삭제 
    
            } catch (PDOException $e)
            {
                log_error('[ACC_UKEY:'.$request['ACC_UKEY'].']'.$e->getMessage());
                $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
            }
    
        }
        else 
        {
            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::HTTP_POST_DATA_NULL;    
        }

    }break;
    case 10:
    {
        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
    }break;
    case 20:
    {
        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SESSION_NOT_VAILD_RE_LOGIN;
    }break;
    default:
    {
        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
    }break;
}


Response_W(json_encode($response, JSON_UNESCAPED_SLASHES) , $request['ACC_UKEY']);
//echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);


?>