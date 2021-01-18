"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_Global = require("./server_globals");
let Event_Conf = {
    _event_Account_Connect_Confirm: "Account_Connect_Confirm",
};
function Register_Event_Subscriptions() {
    //유저 접속 처리 (중복접속 유저 삭제 처리)
    Server_Global.Redis_sub_subscribe(Event_Conf._event_Account_Connect_Confirm);
    //메세지 리스너 등록 
    Message_Event_Action_Info();
}
exports.Register_Event_Subscriptions = Register_Event_Subscriptions;
function Message_Event_Action_Info() {
    Server_Global.Redis_sub_onMsgListener(Event_Conf._event_Account_Connect_Confirm, _event_Account_Connect_Confirm);
}
///////////////////////////////////////// 유저 인증 /////////////////////////////////////////////////////////////////
function _event_Account_Connect_Confirm(channel, message) {
    if (!channel.match(Event_Conf._event_Account_Connect_Confirm)) {
        global.logger_error.error(`[Redis-Sub][message] ${Event_Conf._event_Account_Connect_Confirm} match Error`);
        return;
    }
    //유저 로그인 후 접속 시도(중복 유저 있으면 삭제 해야함 )
    //global.logger_input.debug(`[Redis_Sub][message] ${Redis_Conf._event_Account_Connect_Confirm}`);
    let recv_date;
    try {
        recv_date = JSON.parse(message);
        if (!recv_date) {
            global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        }
        else {
            global.logger_input.debug(`[Redis-Sub][event]${channel}  [message]${message} `);
            let ACC_UKEY = recv_date.ACC_UKEY;
            //중복 유저가 존재시 삭제 해야함 
            if (Server_Global.G_Server_Users.has(ACC_UKEY))
                Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET.disconnect(true);
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
    /*
    if (!recv_date) {
        global.logger_error.error(`[Redis-Sub][message] ${Redis_Conf._event_Account_Connect_Confirm} Parse Error`);
    }
    else {
        let ACC_UKEY: string = recv_date.ACC_UKEY;

        //중복 유저가 존재시 삭제 해야함
        if (Server_Global.G_Server_Users.has(ACC_UKEY))
            Server_Global.G_Server_Users.get(ACC_UKEY)._SOCKET.disconnect(true);
    }
    */
}
///////////////////////////////////////// 유저 인증 /////////////////////////////////////////////////////////////////
//# sourceMappingURL=redis_event_account.js.map