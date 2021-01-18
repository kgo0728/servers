"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common/common");
const Server_Global = require("./server_globals");
const Server_Conf = require("./server_config");
const GibberishAES = require("../common/gibberish-aes");
let Event_Conf = {
    _event_User_Send_Chat: "User_Send_Chat",
    //유저 신규 유저 룸 우편 알림 
    _event_User_Room_Post_Arrive: "User_Room_Post_Arrive",
};
function Register_Event_Subscriptions() {
    //유저 쳇팅 정보 
    Server_Global.Redis_sub_subscribe(Event_Conf._event_User_Send_Chat);
    //유저 신규 유저 우편 알림 
    Server_Global.Redis_sub_subscribe(Event_Conf._event_User_Room_Post_Arrive);
    //메세지 리스너 등록 
    Message_Event_Action_Info();
}
exports.Register_Event_Subscriptions = Register_Event_Subscriptions;
function Message_Event_Action_Info() {
    //유저 쳇팅 
    Server_Global.Redis_sub_onMsgListener(Event_Conf._event_User_Send_Chat, _event_User_Send_Chat);
    //유저 신규 유저 우편 알림 
    Server_Global.Redis_sub_onMsgListener(Event_Conf._event_User_Room_Post_Arrive, _event_User_Room_Post_Arrive);
}
////////////////////////////////////// 유저 쳇팅 /////////////////////////////////////////////////////////////////
function _event_User_Send_Chat(channel, message) {
    if (!channel.match(Event_Conf._event_User_Send_Chat)) {
        global.logger_error.error(`[Redis-Sub][message] ${Event_Conf._event_User_Send_Chat} match Error`);
        return;
    }
    //유저 로그인 후 접속 시도(중복 유저 있으면 삭제 해야함 )
    //global.logger_input.debug(`[Redis_Sub][message] ${Redis_Conf._event_User_Send_Chat}`);
    let recv_date;
    recv_date = JSON.parse(message);
    if (!recv_date) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
    }
    else {
        let R_SEND_NICK = recv_date.SEND_NICK;
        let R_TYPE = recv_date.TYPE;
        let R_MSG = recv_date.MSG;
        //유저 결과 전송 
        const Send_data = {
            RETURN_V: 0,
            SEND_CHAT_INFO: {
                TYPE: R_TYPE,
                NICK: R_SEND_NICK,
                MSG: R_MSG
            }
        };
        /*
        if (Server_Conf.Server_Log._Default_log_Able)
            global.logger.debug('LOG DEBUG -------------------- PRINT ');
        if (Server_Conf.Server_Log._Input_log_Able)
            global.logger_input.debug('LOG INPUT  DEBUG -------------------- PRINT ');
        if (Server_Conf.Server_Log._Output_log_Able)
            global.logger_output.debug('LOG OUTPUT DEBUG -------------------- PRINT ');
        */
        //전체 전송
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket_All(Server_Global.g_server, 'Player_Send_Chat_Info', GibberishAES.enc(JSON.stringify(Send_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket_All(Server_Global.g_server, 'Player_Send_Chat_Info', Send_data, Server_Conf.Server_Log._Output_log_Able);
    }
}
////////////////////////////////////// 유저 쳇팅 /////////////////////////////////////////////////////////////////
////////////////////////////////////// 유저 신규 유저 우편 알림 /////////////////////////////////////////////////////////////////
function _event_User_Room_Post_Arrive(channel, message) {
    if (!channel.match(Event_Conf._event_User_Room_Post_Arrive)) {
        global.logger_error.error(`[Redis-Sub][message] ${Event_Conf._event_User_Room_Post_Arrive} match Error`);
        return;
    }
    let recv_date;
    recv_date = JSON.parse(message);
    if (!recv_date) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
    }
    else {
        let R_ACC_UKEY = recv_date.ACC_UKEY; //이 메세지를 전송 받아야 할 유저 
        let R_GAME_NICK = recv_date.GAME_NICK; //쳇팅을 보낸 유저의 닉네임 
        let R_GAME_NICK_KEY = recv_date.GAME_NICK_KEY;
        //타겟 전송 
        if (Server_Global.G_Server_Users.has(R_ACC_UKEY)) {
            //유저 결과 전송 
            const Send_data = {
                RETURN_V: 0,
                USER_ROOM_POST_ARRIVE: {
                    GAME_NICK: R_GAME_NICK,
                    GAME_NICK_KEY: R_GAME_NICK_KEY
                }
            };
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(R_ACC_UKEY)._SOCKET, channel, GibberishAES.enc(JSON.stringify(Send_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(R_ACC_UKEY)._SOCKET, channel, Send_data, Server_Conf.Server_Log._Output_log_Able);
        }
    }
}
////////////////////////////////////// 유저 신규 유저 우편 알림 /////////////////////////////////////////////////////////////////
//# sourceMappingURL=redis_event_user.js.map