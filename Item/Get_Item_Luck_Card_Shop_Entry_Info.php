

<?php


include_once ('../webconfig.php');
include_once ('../app_define.php');
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
$response  = array();   //클라이언트 전달용

switch(GET_ACCOUNT_SESSION_RETURN_VALUE($request['ACC_UKEY'] , $request['SESSION_KEY'] ))
{
    case 0:
    {

        if( isset($request['ACC_UKEY']) )
        {
        
            if(INPUT_CONTENT_LOG_ABLE > 0 )
                log_input("[RECV][ITEM_LUCK_CARD_SHOP_ENTRY_INFO] "  . print_r($request , true) );
    
            //마스터 서버 정보  
            $DB_HOST   = MASTER_DB_HOST;
            $DB_PORT   = MASTER_DB_PORT;
            $DB_ID     = MASTER_DB_ID;
            $DB_PASS   = MASTER_DB_PASS;
            $DB_SCHEMA = MASTER_DB_SCHEMA;
        
    
            $ACC_UKEY       = $request['ACC_UKEY'];
    
            try 
            {
                $DSN = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_SCHEMA;charset=$PDO_CHARSET";
                $Main_Db = new PDO($DSN, $DB_ID, $DB_PASS, $PDO_OPTION);
        
                $query = "CALL GET_RW_ITEM_LUCK_CARD_SHOP_ENTRY_INFO(@RETURN,?)";
                $stmt  = $Main_Db->prepare($query);
                
                $stmt->bindParam(1, $ACC_UKEY   , PDO::PARAM_INT , 8);
                $stmt->execute();
            
                $Result_RW_Item_Luck_Card_Shop_Entry_info = array();
                while ($row = $stmt->fetch())
                {
                    $Result_RW_Item_Luck_Card_Shop_Entry_info["LUCK_CARD_BUY_NUM"]          =  $row[0];
                    $Result_RW_Item_Luck_Card_Shop_Entry_info["LUCK_CARD_GET_MAX"]          =  $row[1];
                    $Result_RW_Item_Luck_Card_Shop_Entry_info["FREE_DAILY_RESET_TIME"]      =  $row[2];
                } 


                $Result_RW_User_Item_Luck_Card_Storage_info = array();
                if($stmt->nextRowset() && $stmt->columnCount())
                {
                    $item_info = [];
                    while ($row = $stmt->fetch())
                    {
                        $item_info["POS_ID"]               =  $row[0];
                        $item_info["ITEM_ID"]              =  $row[1];
                        $item_info["TYPE"]                 =  $row[2];
                        $item_info["MATCH_ACTION"]         =  $row[3];
                        $item_info["PLAY_ACTION_ID"]       =  $row[4];
                        $item_info["PLAY_ACTION_VAL_1"]    =  $row[5];
                        $item_info["PLAY_ACTION_VAL_2"]    =  $row[6];
                        $item_info["REWARD_ACC_EXP"]       =  $row[7];
                        $item_info["REWARD_CARD_EXP"]      =  $row[8];
                        $item_info["REWARD_ITEM_INFO"]     =  $row[9];
                        array_push($Result_RW_User_Item_Luck_Card_Storage_info ,$item_info );
                    } 
                }   


                $Result_RW_Item_Luck_Card_Buy_Cash_info = array();
                if($stmt->nextRowset() && $stmt->columnCount())
                {
                    $item_info = [];
                    while ($row = $stmt->fetch())
                    {

                        $item_info["ID"]             =  $row[0];
                        $item_info["BUY_TYPE"]       =  $row[1];
                        $item_info["BUY_NUM"]        =  $row[2];
                        array_push($Result_RW_Item_Luck_Card_Buy_Cash_info ,$item_info );
                    } 
                }

                switch(GET_QUERY_RETURN_VALUE($Main_Db, $stmt->nextRowset(),$stmt->columnCount() ))
                {
    
                    case 0:
                    {
                        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SUCC;
    
                        $response['ITEM_LUCK_CARD_SHOP_ENTRY_INFO'] = $Result_RW_Item_Luck_Card_Shop_Entry_info; 
                                
                        if(count($Result_RW_User_Item_Luck_Card_Storage_info) > 0)   $response['USER_ITEM_LUCK_CARD_STORAGE_INFO'] = $Result_RW_User_Item_Luck_Card_Storage_info;
                        if(count($Result_RW_Item_Luck_Card_Buy_Cash_info) > 0 )      $response['ITEM_LUCK_CARD_BUY_CASH_INFO']     =  $Result_RW_Item_Luck_Card_Buy_Cash_info;
                   
                      
                    }break;
                    case 10: //유저   계정 정보가 존재하지 않는다  
                    {
                        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
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