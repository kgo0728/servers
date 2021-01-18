"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common/common");
const Server_Global = require("./server_globals");
const Server_Conf = require("./server_config");
const GibberishAES = require("../common/gibberish-aes");
let Event_Conf = {
    _event_Admin_Notice_system_Info: "Admin_Notice_system_Info",
    _event_Daily_Hero_Condition_Reset: 'Daily_Hero_Condition_Reset',
    _event_Alarm_Event_Update_Info: 'Alarm_Event_Update_Info' //알람 업데이트 정보
};
function Register_Event_Subscriptions() {
    //서버 공지 정보 
    Server_Global.Redis_sub_subscribe(Event_Conf._event_Admin_Notice_system_Info);
    //일일 히어로 컨더션 리셋 정보 
    Server_Global.Redis_sub_subscribe(Event_Conf._event_Daily_Hero_Condition_Reset);
    //알람 업데이트 정보
    Server_Global.Redis_sub_subscribe(Event_Conf._event_Alarm_Event_Update_Info);
    //메세지 리스너 등록 
    Message_Event_Action_Info();
}
exports.Register_Event_Subscriptions = Register_Event_Subscriptions;
function Message_Event_Action_Info() {
    Server_Global.Redis_sub_onMsgListener(Event_Conf._event_Admin_Notice_system_Info, _event_Admin_Notice_system_Info);
    Server_Global.Redis_sub_onMsgListener(Event_Conf._event_Daily_Hero_Condition_Reset, _event_Daily_Hero_Condition_Reset);
    Server_Global.Redis_sub_onMsgListener(Event_Conf._event_Alarm_Event_Update_Info, _event_Alarm_Event_Update_Info);
}
////////////////////////////////////// 서버 공지 /////////////////////////////////////////////////////////////////
function _event_Admin_Notice_system_Info(channel, message) {
    if (!channel.match(Event_Conf._event_Admin_Notice_system_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${Event_Conf._event_Admin_Notice_system_Info} match Error`);
        return;
    }
    let recv_date;
    recv_date = JSON.parse(message);
    if (!recv_date) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
    }
    else {
        let R_TYPE = recv_date.TYPE;
        let R_NOTICE = recv_date.NOTICE;
        let R_ACC_UKEY = recv_date.ACC_UKEY;
        //유저 결과 전송 
        const Send_data = {
            RETURN_V: 0,
            NOTICE_INFO: {
                TYPE: R_TYPE,
                NOTICE: R_NOTICE
            }
        };
        if (!R_ACC_UKEY) {
            //전체 전송
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket_All(Server_Global.g_server, channel, GibberishAES.enc(JSON.stringify(Send_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket_All(Server_Global.g_server, channel, Send_data, Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            //타겟 전송 
            if (Server_Global.G_Server_Users.has(R_ACC_UKEY)) {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(R_ACC_UKEY)._SOCKET, channel, GibberishAES.enc(JSON.stringify(Send_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(R_ACC_UKEY)._SOCKET, channel, Send_data, Server_Conf.Server_Log._Output_log_Able);
            }
        } //end else 
    }
}
////////////////////////////////////// 서버 공지 ////////////////////////////////////////////////////////////////////
////////////////////////////////////// 히어로 아이템 업데이트 전체 전송 /////////////////////////////////////////////
function _event_Daily_Hero_Condition_Reset(channel, message) {
    if (!channel.match(Event_Conf._event_Daily_Hero_Condition_Reset)) {
        global.logger_error.error(`[Redis-Sub][message] ${Event_Conf._event_Daily_Hero_Condition_Reset} match Error`);
        return;
    }
    let recv_date;
    recv_date = JSON.parse(message);
    if (!recv_date) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
    }
    else {
        //유저 결과 전송 
        const Send_data = {
            RETURN_V: 0
        };
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket_All(Server_Global.g_server, channel, GibberishAES.enc(JSON.stringify(Send_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket_All(Server_Global.g_server, channel, Send_data, Server_Conf.Server_Log._Output_log_Able);
    }
}
////////////////////////////////////// 히어로 아이템 업데이트 전체 전송 /////////////////////////////////////////////
////////////////////////////////////// 알람 이벤트 업데이트 전체 전송 /////////////////////////////////////////////
function _event_Alarm_Event_Update_Info(channel, message) {
    if (!channel.match(Event_Conf._event_Alarm_Event_Update_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${Event_Conf._event_Alarm_Event_Update_Info} match Error`);
        return;
    }
    let recv_date;
    recv_date = JSON.parse(message);
    if (!recv_date) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
    }
    else {
        /*
        //유저 결과 전송
        const Send_data: {
            RETURN_V: number
        } =
        {
            RETURN_V: 0
        };
        */
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket_All(Server_Global.g_server, channel, GibberishAES.enc(JSON.stringify(recv_date), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket_All(Server_Global.g_server, channel, recv_date, Server_Conf.Server_Log._Output_log_Able);
    }
}
////////////////////////////////////// 히어로 아이템 업데이트 전체 전송 /////////////////////////////////////////////
//# sourceMappingURL=redis_event_system.js.map