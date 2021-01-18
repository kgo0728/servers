

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


    $response  = array();   //클라이언트 전달용

    if( isset($request['ACC_UKEY']) && isset($request['UU_DB_PATH'])  && isset($request['POINT'])  )
    {
      
        //마스터 서버 정보  
        $DB_HOST        = MASTER_DB_HOST;
        $DB_PORT        = MASTER_DB_PORT;
        $DB_ID          = MASTER_DB_ID;
        $DB_PASS        = MASTER_DB_PASS;
        $DB_SCHEMA      = MASTER_DB_SCHEMA;
        
        $ACC_UKEY       = $request['ACC_UKEY'];
        $USER_DB_PATH   = $request['UU_DB_PATH'];
        $POINT          = $request['POINT']; 
      

        try 
        {


            $DSN = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_SCHEMA;charset=$PDO_CHARSET";
            $Main_Db = new PDO($DSN, $DB_ID, $DB_PASS, $PDO_OPTION);
    
            
            $query = "CALL GET_R_POINT_SET_STRONGBOX_INFO(@RETURN,?)";
            $stmt  = $Main_Db->prepare($query);
    
            $stmt->bindParam(1, $ACC_UKEY  , PDO::PARAM_INT , 8);
            $stmt->execute();
            

            $Result_R_point_set_strongbox_Result_info = '0';
            while ($row = $stmt->fetch())
            {
                $Result_R_point_set_strongbox_Result_info   =  $row[0];
            
            } 
         
            switch(GET_QUERY_RETURN_VALUE($Main_Db, $stmt->nextRowset(),$stmt->columnCount() ))
            {

                case 0:
                {
                    $User_Connect_info = explode(',',$USER_DB_PATH);
                    $DSN = "mysql:host={$User_Connect_info[0]};port={$User_Connect_info[1]};dbname={$User_Connect_info[4]};charset=$PDO_CHARSET";
                    $User_Db = new PDO($DSN, $User_Connect_info[2], $User_Connect_info[3], $PDO_OPTION);
        
        
                    $query = "CALL GET_RW_POINT_SET_STRONGBOX_INFO(@RETURN,?,?,?)";
                    $stmt  = $User_Db->prepare($query);
        
                    $stmt->bindParam(1, $ACC_UKEY  , PDO::PARAM_INT , 8);
                    $stmt->bindParam(2, $POINT     , PDO::PARAM_INT , 4);
                    $stmt->bindParam(3, $Result_R_point_set_strongbox_Result_info , PDO::PARAM_STR , strlen($Result_R_point_set_strongbox_Result_info));
                    $stmt->execute();      
        
                    $Result_User_point_set_strongbox_info = array();
                    while ($row = $stmt->fetch())
                    {
                       $Result_User_point_set_strongbox_info["TICKET"]              =  $row[0]; 
                       $Result_User_point_set_strongbox_info["POINT"]               =  $row[1];
                       $Result_User_point_set_strongbox_info["STRONGBOX_POINT"]     =  $row[2];
                    } 
        
        
                    switch(GET_QUERY_RETURN_VALUE($User_Db, $stmt->nextRowset(),$stmt->columnCount() ))
                    {
        
                        case 0:
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SUCC;
        
                            $response['POINT_SET_STRONGBOX_INFO']['TICKET']          = $Result_User_point_set_strongbox_info["TICKET"] ;
                            $response['POINT_SET_STRONGBOX_INFO']['POINT']           = $Result_User_point_set_strongbox_info["POINT"] ;
                            $response['POINT_SET_STRONGBOX_INFO']['STRONGBOX_POINT'] = $Result_User_point_set_strongbox_info["STRONGBOX_POINT"];
                    
                        }break;
                        case 10:   //유저 정보 존재 하지 않는다 
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
                        }
                        break;
                        case 20:   //유저  포인트 부족 
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::USER_GAME_NOT_ENOUGH_POINT;
                        }
                        break;
                        case 30:   //유저 금고 저장시 티켓이 부족함
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::USRE_GAME_NOT_STRONGBOX_ENOUGH_TICKET;
                        }
                        break;
                        default:
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
                           
                        }break;
                    }
        
                    $stmt->closeCursor();
                    $User_Db = null;  //null  만으로 초기화 삭제 

                }break;
                default:
                {
                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
                    
                }break;
            }
            
            $stmt->closeCursor();
            $Main_Db = null;  //null  만으로 초기화 삭제 


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