"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const common = require("../common/common");
const CommonGlobal = require("../common/globals");
const Server_Global = require("./server_globals");
//import * as Server_Conf from "./server_config";
const Server_Conf = require("./server_config");
const GibberishAES = require("../common/gibberish-aes");
exports.Request_Event_Conf = {
    Request_Match_Arena_Game_Start_Info: "Request_Match_Arena_Game_Start_Info",
    Request_Match_Arena_Game_End_Info: "Request_Match_Arena_Game_End_Info",
    Request_Match_Stage_Game_Start_Info: "Request_Match_Stage_Game_Start_Info",
    Request_Match_Stage_Game_End_Info: "Request_Match_Stage_Game_End_Info",
    Request_Match_Honor_Game_Start_Info: "Request_Match_Honor_Game_Start_Info",
    Request_Match_Honor_Game_End_Info: "Request_Match_Honor_Game_End_Info",
    Request_Match_Friend_Game_Start_Info: "Request_Match_Friend_Game_Start_Info",
    Request_Match_Friend_Game_End_Info: "Request_Match_Friend_Game_End_Info",
    Request_Match_Common_Game_Rally_Info: "Request_Match_Common_Game_Rally_Info",
    Request_Match_Common_Game_Rally_Retry_Info: "Request_Match_Common_Game_Rally_Retry_Info",
    Request_Match_Common_Game_Auto_Mode_Info: "Request_Match_Common_Game_Auto_Mode_Info",
    Request_Match_Common_Game_DisConnect_Info: "Request_Match_Common_Game_DisConnect_Info",
};
exports.Answer_Event_Conf = {
    Answer_Match_Arena_Game_Start_Info: "Answer_Match_Arena_Game_Start_Info",
    Answer_Match_Arena_Game_End_Info: "Answer_Match_Arena_Game_End_Info",
    Answer_Match_Stage_Game_Start_Info: "Answer_Match_Stage_Game_Start_Info",
    Answer_Match_Stage_Game_End_Info: "Answer_Match_Stage_Game_End_Info",
    //지역전
    Answer_Match_Honor_Game_Start_Info: "Answer_Match_Honor_Game_Start_Info",
    Answer_Match_Honor_Game_End_Info: "Answer_Match_Honor_Game_End_Info",
    Answer_Match_Friend_Game_Start_Info: "Answer_Match_Friend_Game_Start_Info",
    Answer_Match_Friend_Game_End_Info: "Answer_Match_Friend_Game_End_Info",
    Answer_Match_Common_Game_Rally_Info: "Answer_Match_Common_Game_Rally_Info",
    Answer_Match_Common_Game_Rally_Retry_Info: "Answer_Match_Common_Game_Rally_Retry_Info",
    Answer_Match_Common_Game_Auto_Mode_Info: "Answer_Match_Common_Game_Auto_Mode_Info",
};
let Match_Conf = {
    _event_Match_Arena_Game_End_Info: "Match_Arena_Game_End_Info",
    _Api_Match_Arena_Game_End_Info: "/servers/Get_Match_Arena_Game_End_Info.php",
    _event_Match_Stage_Game_End_Info: "Match_Stage_Game_End_Info",
    _Api_Match_Stage_Game_End_Info: "/servers/Get_Match_Stage_Game_End_Info.php",
    _event_Match_Honor_Game_End_Info: "Match_Honor_Game_End_Info",
    _Api_Match_Honor_Game_End_Info: "/servers/Get_Match_Honor_Game_End_Info.php",
    _event_Match_Friend_Game_End_Info: "Match_Friend_Game_End_Info",
    _Api_Match_Friend_Game_End_Info: "/servers/Get_Match_Friend_Game_End_Info.php",
};
function Register_Event_Subscriptions() {
    //위   변수는 정적인 초기값 이므로 <특정 타겟의 주소는 동적인 값으로 변경되어야 한다 > (즉 재정의 필요)
    //전송 이벤트 <아레나>
    exports.Request_Event_Conf.Request_Match_Arena_Game_Start_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Arena_Game_Start_Info,
        exports.Request_Event_Conf.Request_Match_Arena_Game_End_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Arena_Game_End_Info,
        //응답 이벤트 <아레나>
        exports.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info;
    exports.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info;
    //전송 이벤트 <스테이지>
    exports.Request_Event_Conf.Request_Match_Stage_Game_Start_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Stage_Game_Start_Info,
        exports.Request_Event_Conf.Request_Match_Stage_Game_End_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Stage_Game_End_Info,
        //응답 이벤트 <스테이지>
        exports.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info;
    exports.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info;
    //전송 이벤트 <지역전>
    exports.Request_Event_Conf.Request_Match_Honor_Game_Start_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Honor_Game_Start_Info,
        exports.Request_Event_Conf.Request_Match_Honor_Game_End_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Honor_Game_End_Info,
        //응답 이벤트 <지역전>
        exports.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info;
    exports.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info;
    //전송 이벤트 <친선전>
    exports.Request_Event_Conf.Request_Match_Friend_Game_Start_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Friend_Game_Start_Info,
        exports.Request_Event_Conf.Request_Match_Friend_Game_End_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Friend_Game_End_Info,
        //응답 이벤트 <친선전>
        exports.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info;
    exports.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info;
    ///////////////////////////공통 이벤트/////////////////////
    //전송 이벤트 <랠리>
    exports.Request_Event_Conf.Request_Match_Common_Game_Rally_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Common_Game_Rally_Info,
        exports.Request_Event_Conf.Request_Match_Common_Game_Rally_Retry_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Common_Game_Rally_Retry_Info,
        exports.Request_Event_Conf.Request_Match_Common_Game_Auto_Mode_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Common_Game_Auto_Mode_Info,
        //응답 이벤트 <랠리>
        exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info;
    exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info;
    exports.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + exports.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info;
    //전송 이벤트 < 유저 접속 종료시 처리>
    exports.Request_Event_Conf.Request_Match_Common_Game_DisConnect_Info = Server_Conf.Server_config._Match_Server + '_' + exports.Request_Event_Conf.Request_Match_Common_Game_DisConnect_Info,
        /////////////////////////////레디스 구독 이벤트 응답 등록 /////////////////
        //아레나
        Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info);
    //스테이지
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info);
    //지역전
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info);
    //친선전
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info);
    //공통 랠리 정보등 //
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info);
    //메세지 리스너 등록 
    Message_Event_Action_Info();
}
exports.Register_Event_Subscriptions = Register_Event_Subscriptions;
function Message_Event_Action_Info() {
    //함수 등록 
    //아레나 
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info, _event_Match_Arena_Game_Start_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info, _event_Match_Arena_Game_End_Info);
    //스테이지 
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info, _event_Match_Stage_Game_Start_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info, _event_Match_Stage_Game_End_Info);
    //지역전
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info, _event_Match_Honor_Game_Start_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info, _event_Match_Honor_Game_End_Info);
    //친선전 
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info, _event_Match_Friend_Game_Start_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info, _event_Match_Friend_Game_End_Info);
    //공통 
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info, _event_Match_Common_Game_Rally_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info, _event_Match_Common_Game_Rally_Retry_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info, _event_Match_Common_Game_Auto_Mode_Info);
}
///////////////////////////////////////////////Arena////////////////////////////////////////////////////////////
//////////////////////// _event_Match_Arena_Game_Start_Info ///////////////////////////////////////////
function _event_Match_Arena_Game_Start_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                RESULT_SIZE: recv_data.SERVER_DATA_INFO.RESULT_SIZE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            if (!recv_data.RETURN_V) {
                //Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT = recv_data.RESULT;
                Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE += Recv_Server_Data.RESULT_SIZE;
            }
            // 결과 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// _event_Match_Arena_Game_End_Info ///////////////////////////////////////////
function _event_Match_Arena_Game_End_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-SUb][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                SETSCORE: recv_data.SERVER_DATA_INFO.SETSCORE,
                SCORE: recv_data.SERVER_DATA_INFO.SCORE,
                WIN_TYPE: recv_data.SERVER_DATA_INFO.WIN_TYPE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE = Recv_Server_Data.SETSCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE = Recv_Server_Data.SCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN = Recv_Server_Data.WIN_TYPE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_START = false;
            if (!recv_data.RETURN_V) {
                const Api_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ACC_UKEY,
                    ARENA_ID: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_ID,
                    SET_SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE,
                    SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE,
                    WIN_TEAM: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN,
                    RESULT_SIZE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE
                };
                const option = common.GetRequestOptionWithPost(Server_Conf.Server_config._Api_host + Match_Conf._Api_Match_Arena_Game_End_Info, Api_msg);
                Api_Request_Match_Arena_Game_End_Info(Recv_Server_Data.ACC_UKEY, option);
            }
            else {
                //에러 상태 전송함 받은 그대로 전달     
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
            }
            //매치 종료 초기화
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO.Init();
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// Api_Request_Match_Arena_Game_End_Info ///////////////////////////////////////////
function Api_Request_Match_Arena_Game_End_Info(ACC_UKEY, option) {
    const event = Match_Conf._event_Match_Arena_Game_End_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            return;
        }
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, body, Server_Conf.Server_Log._Output_log_Able);
    });
}
///////////////////////////////////////////////Arena////////////////////////////////////////////////////////////
///////////////////////////////////////////////stage////////////////////////////////////////////////////////////
//////////////////////// _event_Match_Stage_Game_Start_Info ///////////////////////////////////////////
function _event_Match_Stage_Game_Start_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                RESULT_SIZE: recv_data.SERVER_DATA_INFO.RESULT_SIZE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            if (!recv_data.RETURN_V) {
                //Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT      = recv_data.RESULT;
                Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE += Recv_Server_Data.RESULT_SIZE;
            }
            // 결과 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// _event_Match_Stage_Game_End_Info ///////////////////////////////////////////
function _event_Match_Stage_Game_End_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-SUb][message] ${channel} Parse Error`);
        }
        else {
            //global.logger_input.debug(`[Redis-Sub][message]${channel}  [message]${message} `);
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                SETSCORE: recv_data.SERVER_DATA_INFO.SETSCORE,
                SCORE: recv_data.SERVER_DATA_INFO.SCORE,
                WIN_TYPE: recv_data.SERVER_DATA_INFO.WIN_TYPE,
                TEAM_A_SKILL_USE_NUM: recv_data.SERVER_DATA_INFO.TEAM_A_SKILL_USE_NUM,
                TEAM_A_STRAIGHT_SCORE: recv_data.SERVER_DATA_INFO.TEAM_A_STRAIGHT_SCORE,
                TEAM_A_BLOCK_SPIKE_NUM: recv_data.SERVER_DATA_INFO.TEAM_A_BLOCK_SPIKE_NUM,
                TEAM_A_SERVICE_ACE_SCORE: recv_data.SERVER_DATA_INFO.TEAM_A_SERVICE_ACE_SCORE,
                TEAM_A_GET_BLOCK_SCORE: recv_data.SERVER_DATA_INFO.TEAM_A_GET_BLOCK_SCORE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE = Recv_Server_Data.SETSCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE = Recv_Server_Data.SCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN = Recv_Server_Data.WIN_TYPE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_START = false;
            if (!recv_data.RETURN_V) {
                //정상 처리 저장함
                const Api_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ACC_UKEY,
                    ARENA_ID: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_ID,
                    SET_SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE,
                    SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE,
                    WIN_TEAM: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN,
                    RESULT_SIZE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE,
                    TEAM_A_SKILL_USE_NUM: Recv_Server_Data.TEAM_A_SKILL_USE_NUM,
                    TEAM_A_STRAIGHT_SCORE: Recv_Server_Data.TEAM_A_STRAIGHT_SCORE,
                    TEAM_A_BLOCK_SPIKE_NUM: Recv_Server_Data.TEAM_A_BLOCK_SPIKE_NUM,
                    TEAM_A_SERVICE_ACE_SCORE: Recv_Server_Data.TEAM_A_SERVICE_ACE_SCORE,
                    TEAM_A_GET_BLOCK_SCORE: Recv_Server_Data.TEAM_A_GET_BLOCK_SCORE
                };
                //global.logger_input.debug(`[Api_event]${channel}  [Api_msg]${JSON.stringify(Api_msg)} `);
                const option = common.GetRequestOptionWithPost(Server_Conf.Server_config._Api_host + Match_Conf._Api_Match_Stage_Game_End_Info, Api_msg);
                Api_Request_Match_Stage_Game_End_Info(Recv_Server_Data.ACC_UKEY, option);
            }
            else {
                //에러 상태 전송함 받은 그대로 전달     
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
            }
            //매치 종료 초기화
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO.Init();
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// Api_Request_Match_Stage_Game_End_Info ///////////////////////////////////////////
function Api_Request_Match_Stage_Game_End_Info(ACC_UKEY, option) {
    const event = Match_Conf._event_Match_Stage_Game_End_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            return;
        }
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, body, Server_Conf.Server_Log._Output_log_Able);
    });
}
///////////////////////////////////////////////stage//////////////////////////////////////////////////
///////////////////////////////////////////////Honor//////////////////////////////////////////////////
function _event_Match_Honor_Game_Start_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                RESULT_SIZE: recv_data.SERVER_DATA_INFO.RESULT_SIZE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            if (!recv_data.RETURN_V) {
                Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE += Recv_Server_Data.RESULT_SIZE;
            }
            // 결과 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
function _event_Match_Honor_Game_End_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error}`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                SETSCORE: recv_data.SERVER_DATA_INFO.SETSCORE,
                SCORE: recv_data.SERVER_DATA_INFO.SCORE,
                WIN_TYPE: recv_data.SERVER_DATA_INFO.WIN_TYPE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE = Recv_Server_Data.SETSCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE = Recv_Server_Data.SCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN = Recv_Server_Data.WIN_TYPE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_START = false;
            if (!recv_data.RETURN_V) {
                const Api_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ACC_UKEY,
                    ARENA_ID: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_ID,
                    SET_SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE,
                    SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE,
                    WIN_TEAM: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN,
                    RESULT_SIZE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE
                };
                const option = common.GetRequestOptionWithPost(Server_Conf.Server_config._Api_host + Match_Conf._Api_Match_Honor_Game_End_Info, Api_msg);
                Api_Request_Match_Honor_Game_End_Info(Recv_Server_Data.ACC_UKEY, option);
            }
            else {
                //에러 상태 전송함 받은 그대로 전달     
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
            }
            //매치 종료 초기화
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO.Init();
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// Request_Match_Honor_Game_End_Info ///////////////////////////////////////////
function Api_Request_Match_Honor_Game_End_Info(ACC_UKEY, option) {
    const event = Match_Conf._event_Match_Honor_Game_End_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            return;
        }
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, body, Server_Conf.Server_Log._Output_log_Able);
    });
}
///////////////////////////////////////////////Honor//////////////////////////////////////////////////
///////////////////////////////////////////////Friend//////////////////////////////////////////////////
function _event_Match_Friend_Game_Start_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                RESULT_SIZE: recv_data.SERVER_DATA_INFO.RESULT_SIZE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            if (!recv_data.RETURN_V) {
                Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE += Recv_Server_Data.RESULT_SIZE;
            }
            // 결과 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
function _event_Match_Friend_Game_End_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error}`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                SETSCORE: recv_data.SERVER_DATA_INFO.SETSCORE,
                SCORE: recv_data.SERVER_DATA_INFO.SCORE,
                WIN_TYPE: recv_data.SERVER_DATA_INFO.WIN_TYPE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE = Recv_Server_Data.SETSCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE = Recv_Server_Data.SCORE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN = Recv_Server_Data.WIN_TYPE;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_START = false;
            if (!recv_data.RETURN_V) {
                const Api_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ACC_UKEY,
                    ARENA_ID: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_ID,
                    SET_SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE,
                    SCORE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_SCORE,
                    WIN_TEAM: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_WIN,
                    RESULT_SIZE: Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE
                };
                const option = common.GetRequestOptionWithPost(Server_Conf.Server_config._Api_host + Match_Conf._Api_Match_Friend_Game_End_Info, Api_msg);
                Api_Request_Match_Friend_Game_End_Info(Recv_Server_Data.ACC_UKEY, option);
            }
            else {
                //에러 상태 전송함 받은 그대로 전달     
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
            }
            //매치 종료 초기화
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO.Init();
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// Request_Match_Friend_Game_End_Info ///////////////////////////////////////////
function Api_Request_Match_Friend_Game_End_Info(ACC_UKEY, option) {
    const event = Match_Conf._event_Match_Friend_Game_End_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            return;
        }
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket(Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET, event, body, Server_Conf.Server_Log._Output_log_Able);
    });
}
///////////////////////////////////////////////Friend//////////////////////////////////////////////////
////////////////////////////////////////////// common ////////////////////////////////////////////////////////
function _event_Match_Common_Game_Rally_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                RESULT_SIZE: recv_data.SERVER_DATA_INFO.RESULT_SIZE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            //Server_Global.G_Server_Users.get(recv_data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE      = Recv_Server_Data.SETSCORE;
            //Server_Global.G_Server_Users.get(recv_data.ACC_UKEY)._ARENAINFO._ARENA_SCORE         = recv_data.SCORE;
            //Server_Global.G_Server_Users.get(recv_data.ACC_UKEY)._ARENAINFO._ARENA_RESULT        = recv_data.RESULT;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE += Recv_Server_Data.RESULT_SIZE;
            // 유저 결과 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
function _event_Match_Common_Game_Rally_Retry_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID,
                RESULT_SIZE: recv_data.SERVER_DATA_INFO.RESULT_SIZE
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            //Server_Global.G_Server_Users.get(recv_data.ACC_UKEY)._ARENAINFO._ARENA_SETSCORE      = Recv_Server_Data.SETSCORE;
            //Server_Global.G_Server_Users.get(recv_data.ACC_UKEY)._ARENAINFO._ARENA_SCORE         = recv_data.SCORE;
            //Server_Global.G_Server_Users.get(recv_data.ACC_UKEY)._ARENAINFO._ARENA_RESULT        = recv_data.RESULT;
            Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._ARENAINFO._ARENA_RESULT_SIZE += Recv_Server_Data.RESULT_SIZE;
            // 유저 결과 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
function _event_Match_Common_Game_Auto_Mode_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info} match Error`);
        return;
    }
    try {
        let recv_data;
        recv_data = JSON.parse(message);
        if (!recv_data) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            const Recv_Server_Data = {
                ACC_UKEY: recv_data.SERVER_DATA_INFO.ACC_UKEY,
                EVENT_ID: recv_data.SERVER_DATA_INFO.EVENT_ID
            };
            //서버 데이터 삭제 
            delete recv_data.SERVER_DATA_INFO;
            //상태 전송함 받은 그대로 전달     
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
////////////////////////////////////////////// common ////////////////////////////////////////////////////////
//# sourceMappingURL=redis_event_match.js.map