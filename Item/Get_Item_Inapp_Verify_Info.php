

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

    //$request['ACC_UKEY']   = 112960881134081286;
    //$request['UU_DB_PATH'] = '127.0.0.1,3306,yewonmaster,yewongames_awsdeveloper,jgbuserdb';

    $response  = array();   //클라이언트 전달용


    if( isset($request['ACC_UKEY'])   && isset($request['UU_DB_PATH']) && isset($request['TRADE_UKEY']) &&
        isset($request['MARKETTID'])  && isset($request['PRODUCTID'])  && isset($request['DEV_PAYLOAD_KEY']))
    {
    
    
        //마스터 서버 정보  
        $DB_HOST   = MASTER_DB_HOST;
        $DB_PORT   = MASTER_DB_PORT;
        $DB_ID     = MASTER_DB_ID;
        $DB_PASS   = MASTER_DB_PASS;
        $DB_SCHEMA = MASTER_DB_SCHEMA;


        $ACC_UKEY          = $request['ACC_UKEY'];
        $USER_DB_PATH      = $request['UU_DB_PATH'];
        $TRADE_UKEY        = $request['TRADE_UKEY'];
        $MARKETTID         = $request['MARKETTID'];
        $PRODUCTID         = $request['PRODUCTID'];
        $DEV_PAYLOAD_KEY   = $request['DEV_PAYLOAD_KEY'];
    
        try 
        {
            $User_Connect_info = explode(',',$USER_DB_PATH);

            $DSN = "mysql:host={$User_Connect_info[0]};port={$User_Connect_info[1]};dbname={$User_Connect_info[4]};charset=$PDO_CHARSET";
            $User_Db = new PDO($DSN, $User_Connect_info[2], $User_Connect_info[3], $PDO_OPTION);


            $query = "CALL GET_R_ITEM_INAPP_VERIFY_INFO(@RETURN,?,?,?,?)";
            $stmt  = $User_Db->prepare($query);

            $stmt->bindParam(1, $ACC_UKEY    , PDO::PARAM_INT , 8);
            $stmt->bindParam(2, $TRADE_UKEY  , PDO::PARAM_INT , 8);
            $stmt->bindParam(3, $PRODUCTID   , PDO::PARAM_STR , strlen($PRODUCTID));
            $stmt->bindParam(4, $DEV_PAYLOAD_KEY   , PDO::PARAM_STR , strlen($DEV_PAYLOAD_KEY));
            $stmt->execute();      


            $Result_R_User_Item_Inapp_Verify_Info = array();
            while ($row = $stmt->fetch())
            {
                $Result_R_User_Item_Inapp_Verify_Info["TRADE_TYPE"]    =  (int)$row[0];
                $Result_R_User_Item_Inapp_Verify_Info["STORE_TYPE"]    =  (int)$row[1];
                $Result_R_User_Item_Inapp_Verify_Info["ORDER_ID"]      =  $row[2];
                $Result_R_User_Item_Inapp_Verify_Info["PRODUCT_ID"]    =  $row[3];
            } 

            switch(GET_QUERY_RETURN_VALUE($User_Db, $stmt->nextRowset(),$stmt->columnCount() ))
            {

                case 0:
                {
                
                    switch($Result_R_User_Item_Inapp_Verify_Info["TRADE_TYPE"])
                    {

                        case 1: // 아이템 정상 지급 처리
                        {

                            $DSN = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_SCHEMA;charset=$PDO_CHARSET";
                            $Main_Db = new PDO($DSN, $DB_ID, $DB_PASS, $PDO_OPTION);
                    
                        
                            $query = "CALL GET_R_ITEM_INAPP_VERIFY_INFO(@RETURN,?,?,?)";
                            $stmt  = $Main_Db->prepare($query);
                    
                            $stmt->bindParam(1, $ACC_UKEY  , PDO::PARAM_INT , 8);
                            $stmt->bindParam(2, $Result_R_User_Item_Inapp_Verify_Info["STORE_TYPE"]      , PDO::PARAM_STR , strlen($Result_R_User_Item_Inapp_Verify_Info["STORE_TYPE"]));
                            $stmt->bindParam(3, $Result_R_User_Item_Inapp_Verify_Info["ORDER_ID"] , PDO::PARAM_STR , strlen($Result_R_User_Item_Inapp_Verify_Info["ORDER_ID"]));
                            $stmt->execute();
                        
            
                            $Result_R_Param_Item_Inapp_Verify_Info = array();
                            while ($row = $stmt->fetch())
                            {
                                $Result_R_Param_Item_Inapp_Verify_Info["VERVIFY_RESULT_INFO"]      =  $row[0];
                                $Result_R_Param_Item_Inapp_Verify_Info["POST_STATUS_INFO"]         =  $row[1];
                            } 
                            
                            log_input("VERVIFY_RESULT_INFO:" . $Result_R_Param_Item_Inapp_Verify_Info["VERVIFY_RESULT_INFO"]);
                            log_input("POST_STATUS_INFO:" . $Result_R_Param_Item_Inapp_Verify_Info["POST_STATUS_INFO"]);
                            
                            switch(GET_QUERY_RETURN_VALUE($Main_Db, $stmt->nextRowset(),$stmt->columnCount() ))
                            {
                
                                case 0:
                                {
            
                                    $DSN = "mysql:host={$User_Connect_info[0]};port={$User_Connect_info[1]};dbname={$User_Connect_info[4]};charset=$PDO_CHARSET";
                                    $User_Db = new PDO($DSN, $User_Connect_info[2], $User_Connect_info[3], $PDO_OPTION);
                        
            
                                    $query = "CALL GET_RW_ITEM_INAPP_VERIFY_INFO(@RETURN,?,?,?,?,?,?)";
                                    $stmt  = $User_Db->prepare($query);
                        
                                    $stmt->bindParam(1, $ACC_UKEY  , PDO::PARAM_INT , 8);
                                    $stmt->bindParam(2, $TRADE_UKEY  , PDO::PARAM_INT , 8);
                                    $stmt->bindParam(3, $MARKETTID     , PDO::PARAM_STR , strlen($MARKETTID));
                                    $stmt->bindParam(4, $DEV_PAYLOAD_KEY   , PDO::PARAM_STR , strlen($DEV_PAYLOAD_KEY));
                                    $stmt->bindParam(5, $Result_R_Param_Item_Inapp_Verify_Info["VERVIFY_RESULT_INFO"]   , PDO::PARAM_STR , strlen($Result_R_Param_Item_Inapp_Verify_Info["VERVIFY_RESULT_INFO"]));
                                    $stmt->bindParam(6, $Result_R_Param_Item_Inapp_Verify_Info["POST_STATUS_INFO"]      , PDO::PARAM_STR , strlen($Result_R_Param_Item_Inapp_Verify_Info["POST_STATUS_INFO"]));
                                    $stmt->execute();      
                        
                                    $Result_RW_User_Item_Inapp_Verify_info = array();
                                    while ($row = $stmt->fetch())
                                    {
                                        $Result_RW_User_Item_Inapp_Verify_info["TICKET"]                     =  $row[0];
                                        $Result_RW_User_Item_Inapp_Verify_info["ITEM_BOOSTER"]               =  $row[1];
                                        $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_REWARD_TICKET"]  =  $row[2];
                                        $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_START_TIME"]     =  $row[3];
                                        $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_END_TIME"]       =  $row[4];
                                        $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_ABLE_DAY"]       =  $row[5];
                            
                                    
                                    } 
                                        
            
                                    switch(GET_QUERY_RETURN_VALUE($User_Db, $stmt->nextRowset(),$stmt->columnCount() ))
                                    {
                        
                                        case 0:
                                        {
                                        
                                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SUCC;
                                                    
                                            $response['ITEM_INAPP_VERIFY_INFO']["PAYMENT_STATE"]              =  1;
                                            $response['ITEM_INAPP_VERIFY_INFO']["TRADE_UKEY"]                 =  $TRADE_UKEY;
                                            $response['ITEM_INAPP_VERIFY_INFO']["PRODUCT_ID"]                 =  $Result_R_User_Item_Inapp_Verify_Info["PRODUCT_ID"];
                    
                                            $response['ITEM_INAPP_VERIFY_INFO']["TICKET"]                     =  $Result_RW_User_Item_Inapp_Verify_info["TICKET"];
                                            $response['ITEM_INAPP_VERIFY_INFO']["ITEM_BOOSTER"]               =  $Result_RW_User_Item_Inapp_Verify_info["ITEM_BOOSTER"];
                                            $response['ITEM_INAPP_VERIFY_INFO']["INAPP_MONTH_REWARD_TICKET"]  =  $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_REWARD_TICKET"];
                                            $response['ITEM_INAPP_VERIFY_INFO']["INAPP_MONTH_START_TIME"]     =  $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_START_TIME"];   
                                            $response['ITEM_INAPP_VERIFY_INFO']["INAPP_MONTH_END_TIME"]       =  $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_END_TIME"];   
                                            $response['ITEM_INAPP_VERIFY_INFO']["INAPP_MONTH_ABLE_DAY"]       =  $Result_RW_User_Item_Inapp_Verify_info["INAPP_MONTH_ABLE_DAY"];   
        

                                        }break;
                                        case 10:   //유저   계정 정보가 존재하지 않는다
                                        {
                                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
                                        }
                                        break;
                                        case 20:   //유저 빌링 처리오류 (빌링 서버 처리 오류)
                                        {
                                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::USER_GAME_BILLING_PROCESS_ERROR;
                                        }
                                        default:
                                        {
                                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
                
                                    
                                        }break;
                                    }
                                        
                        
                                }break;
                                case 10:   //존재하지 않는 아이템 정보
                                {
                                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::GAME_ITEM_INFO_NOT_EXIST;
                                }
                                break;
                                default:
                                {
                                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
            
                            
                                }break;
                            }
            
                            $Main_Db = null;  //null  만으로 초기화 삭제 


                        }break;
                        case 2:
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SUCC;

                            $response['ITEM_INAPP_VERIFY_INFO']["PAYMENT_STATE"]   =  2;
                            $response['ITEM_INAPP_VERIFY_INFO']["TRADE_UKEY"]      =  $TRADE_UKEY;
                            $response['ITEM_INAPP_VERIFY_INFO']["PRODUCT_ID"]      =  $Result_R_User_Item_Inapp_Verify_Info["PRODUCT_ID"];

                        }break;
                        default:
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::USER_GAME_BILLING_PROCESS_ERROR;

                        }break;              


                    }


                }break;
                case 10:   //유저 정보 존재 하지 않는다 
                {
                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
                }
                break;
                case 20:   //유저 빌링 처리오류 (해당 계정으로 결제 진행건이 없습니다) 
                {
                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::USER_GAME_BILLING_ID_NOT_TRY_PAYMENT;
                }
                break;
                default:
                {
                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;

                    
                }break;
            }
            
            $stmt->closeCursor();
            $User_Db = null;  //null  만으로 초기화 삭제 
            
        } catch (PDOException $e)
        {
    
            log_error("[DB_ERROR] " . $e->getMessage());
            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
        }


    }
    else 
    {
        $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::HTTP_POST_DATA_NULL;    
    }


    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);


?>