"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common/common");
const Server_Global = require("./server_globals");
const Server_Conf = require("./server_config");
const GibberishAES = require("../common/gibberish-aes");
exports.Request_Event_Conf = {
    Request_Item_Equip_Hero_Card_Deck_Info: "Request_Item_Equip_Hero_Card_Deck_Info",
};
exports.Answer_Event_Conf = {
    Answer_Item_Equip_Hero_Card_Deck_Info: "Answer_Item_Equip_Hero_Card_Deck_Info",
    Answer_Item_Update_Hero_Team_Power_Info: "Answer_Item_Update_Hero_Team_Power_Info",
};
let Item_Conf = {};
function Register_Event_Subscriptions() {
    //전송 이벤트 
    exports.Request_Event_Conf.Request_Item_Equip_Hero_Card_Deck_Info = Server_Conf.Server_config._Match_Server + '_' + "Request_Item_Equip_Hero_Card_Deck_Info",
        //응답 이벤트
        exports.Answer_Event_Conf.Answer_Item_Equip_Hero_Card_Deck_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + "Answer_Item_Equip_Hero_Card_Deck_Info";
    exports.Answer_Event_Conf.Answer_Item_Update_Hero_Team_Power_Info = Server_Conf.Server_config._Server_Name_Unique + '_' + "Answer_Item_Update_Hero_Team_Power_Info";
    //Redis 구독 리스너 등록 
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Item_Equip_Hero_Card_Deck_Info);
    Server_Global.Redis_sub_subscribe(exports.Answer_Event_Conf.Answer_Item_Update_Hero_Team_Power_Info);
    //메세지 리스너 등록 
    Message_Event_Action_Info();
}
exports.Register_Event_Subscriptions = Register_Event_Subscriptions;
function Message_Event_Action_Info() {
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Item_Equip_Hero_Card_Deck_Info, _event_Item_Equip_Hero_Card_Deck_Info);
    Server_Global.Redis_sub_onMsgListener(exports.Answer_Event_Conf.Answer_Item_Update_Hero_Team_Power_Info, _event_Item_Update_Hero_Team_Power_Info);
}
//////////////////////// _event_Item_Equip_Hero_Card_Deck_Info //////////////////////////////////////////
function _event_Item_Equip_Hero_Card_Deck_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Item_Equip_Hero_Card_Deck_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Item_Equip_Hero_Card_Deck_Info} match Error`);
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
            //받은 그대로 전달     
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);
            /*
            if (!recv_data.RETURN_V) {

                const Send_data: {
                    RETURN_V: number, ITEM_EQUIP_HERO_CARD_DECK_INFO: { TYPE: number, POWER: number }
                } =
                {
                    RETURN_V: recv_data.RETURN_V,
                    ITEM_EQUIP_HERO_CARD_DECK_INFO:
                    {
                        TYPE: recv_data.TYPE,
                        POWER: recv_data.POWER
                    }
                };
          
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);

            }
            else
            {
        
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, GibberishAES.enc(JSON.stringify(recv_data), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.SendPacket(Server_Global.G_Server_Users.get(Recv_Server_Data.ACC_UKEY)._SOCKET, Recv_Server_Data.EVENT_ID, recv_data, Server_Conf.Server_Log._Output_log_Able);


            }
            */
        }
    }
    catch (e) {
        global.logger_error.error(`[Redis-Sub][message] ${channel} Parse Error`);
        return;
    }
}
//////////////////////// _event_Item_Equip_Hero_Card_Deck_Info //////////////////////////////////////////
//////////////////////// _event_Item_Update_Hero_Team_Power_Info //////////////////////////////////////////
function _event_Item_Update_Hero_Team_Power_Info(channel, message) {
    if (!channel.match(exports.Answer_Event_Conf.Answer_Item_Update_Hero_Team_Power_Info)) {
        global.logger_error.error(`[Redis-Sub][message] ${exports.Answer_Event_Conf.Answer_Item_Update_Hero_Team_Power_Info} match Error`);
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
            //받은 그대로 전달     
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
//////////////////////// _event_Item_Update_Hero_Team_Power_Info //////////////////////////////////////////
//# sourceMappingURL=redis_event_Item.js.map