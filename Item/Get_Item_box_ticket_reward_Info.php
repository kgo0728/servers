
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
    //$request['ACC_UKEY']     = 112960883631671315;
    //$request['UU_DB_PATH'] = '127.0.0.1,3306,yewonmaster,yewongames_awsdeveloper,jgbuserdb';

    $response  = array();   //클라이언트 전달용


    if( isset($request['ACC_UKEY']) && isset($request['UU_DB_PATH'])  )
    {
      
        //마스터 서버 정보  
        $DB_HOST        = MASTER_DB_HOST;
        $DB_PORT        = MASTER_DB_PORT;
        $DB_ID          = MASTER_DB_ID;
        $DB_PASS        = MASTER_DB_PASS;
        $DB_SCHEMA      = MASTER_DB_SCHEMA;
      
        $ACC_UKEY       = $request['ACC_UKEY'];
        $USER_DB_PATH   = $request['UU_DB_PATH'];
       

        try 
        {
          
            $DSN = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_SCHEMA;charset=$PDO_CHARSET";
            $Main_Db = new PDO($DSN, $DB_ID, $DB_PASS, $PDO_OPTION);
    
            
            $query = "CALL GET_R_ITEM_BOX_TICKET_REWARD_INFO(@RETURN,?)";
            $stmt  = $Main_Db->prepare($query);
    
            $stmt->bindParam(1, $ACC_UKEY  , PDO::PARAM_INT , 8);
            $stmt->execute();
            

            $Result_R_Item_box_ticket_Result_info = '0';
            while ($row = $stmt->fetch())
            {
                $Result_R_Item_box_ticket_Result_info   =  $row[0];
            
            } 
         
            switch(GET_QUERY_RETURN_VALUE($Main_Db, $stmt->nextRowset(),$stmt->columnCount() ))
            {

                case 0:
                {

                    $User_Connect_info = explode(',',$USER_DB_PATH);
                    $DSN = "mysql:host={$User_Connect_info[0]};port={$User_Connect_info[1]};dbname={$User_Connect_info[4]};charset=$PDO_CHARSET";
                    $User_Db = new PDO($DSN, $User_Connect_info[2], $User_Connect_info[3], $PDO_OPTION);
                    
                    $query = "CALL GET_RW_ITEM_BOX_TICKET_REWARD_INFO(@RETURN,?,?)";
                    $stmt  = $User_Db->prepare($query);
        
                    $stmt->bindParam(1, $ACC_UKEY  , PDO::PARAM_INT , 8);
                    $stmt->bindParam(2, $Result_R_Item_box_ticket_Result_info , PDO::PARAM_STR , strlen($Result_R_Item_box_ticket_Result_info));
                    $stmt->execute();      


                    $Result_User_Item_box_ticket_Reward_info = array();
                    while ($row = $stmt->fetch())
                    {
                          $Result_User_Item_box_ticket_Reward_info["TICKET"]      =  $row[0];
                          $Result_User_Item_box_ticket_Reward_info["BOX_TICKET"]  =  $row[1];
                            
                    } 

            
                    switch(GET_QUERY_RETURN_VALUE($User_Db, $stmt->nextRowset(),$stmt->columnCount() ))
                    {
        
                        case 0:
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::SUCC;
        
                        
                            $response['BOX_TICKET_REWARD_INFO']["TICKET"]     = $Result_User_Item_box_ticket_Reward_info["TICKET"] ;
                            $response['BOX_TICKET_REWARD_INFO']["BOX_TICKET"] = $Result_User_Item_box_ticket_Reward_info["BOX_TICKET"] ;
        
                        }break;
                        case 10:   //유저 정보 존재 하지 않는다 
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::ACCOUNT_INFO_NOT_EXIST;
                        }
                        break;
                        case 20:   //유저 박스 티켓 부족
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::USER_GAME_NOT_ENOUGH_BOX_TICKET;
                        }break;
                        case 30:   //게임내 아이템 더이상 소지 불가
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::GAME_ITEM_INFO_OVER_GET_NOW;
                        }break;
                        
                        default:
                        {
                            $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;
                           
                        }break;
                    }
        
                    $User_Db = null;  //null  만으로 초기화 삭제 


                }break;
                default:
                {
                    $response[$ENUM_RETURN_STRING] = ENUM_RETURN_VALUE::DB_PROC_ERROR;

                    
                }break;
            }
            
            $stmt->closeCursor();
            $Main_Db = null;  //null  만으로 초기화 삭제 


        }catch (PDOException $e)
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