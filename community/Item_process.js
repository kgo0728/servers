"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as redis from 'redis';
//import { setTimeout, setInterval } from "timers";
const common = require("../common/common");
const CommonGlobal = require("../common/globals");
const GibberishAES = require("../common/gibberish-aes");
const Server_Global = require("./server_globals");
const Server_Conf = require("./server_config");
const Redis_evnet_Item = require("./redis_event_Item");
let Item_Conf = {
    _event_Item_Equip_Hero_Card_Deck_Info: "Item_Equip_Hero_Card_Deck_Info",
    _event_Item_Update_Hero_Team_Power_Info: "Item_Update_Hero_Team_Power_Info" //Ŭ���̾�Ʈ �̺�Ʈ ���޿� ( ���� �̺�Ʈ ��� ó�� ����)
};
function Register_Event(socket, Host) {
    Register_Item_Equip_Hero_Card_Deck_Info(socket, Host);
}
exports.Register_Event = Register_Event;
//////////////////////// Get_Item_Equip_Hero_Card_Deck_Info //////////////////////////////////////////
function Register_Item_Equip_Hero_Card_Deck_Info(socket, Host) {
    const event = Item_Conf._event_Item_Equip_Hero_Card_Deck_Info;
    socket.on(event, function (recv_packet) {
        let msg = new common.PacketData;
        if (Server_Conf.Server_config._Packet_Encrypt) {
            try {
                recv_packet = GibberishAES.dec(recv_packet, socket['ENCRYPT_KEY']);
            }
            catch (e) {
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.DATA_ENCRYPT_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                return;
            }
        }
        if (common.RecvPacket(msg, socket, event, recv_packet, Server_Conf.Server_Log._Input_log_Able) === false) {
            return;
        }
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.ACCOUNT_INFO_NOT_EXIST), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.ACCOUNT_INFO_NOT_EXIST), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            const pub_msg = {
                ACC_UKEY: socket['ACC_UKEY'],
                RECV_EVENT: Redis_evnet_Item.Answer_Event_Conf.Answer_Item_Equip_Hero_Card_Deck_Info,
                EVENT_ID: event,
                TYPE: msg._data.TYPE,
                ID: msg._data.ID,
                IT_UKEY: msg._data.IT_UKEY
            };
            // ���� ���� ���� 
            if (!Server_Global.g_redis_pub.publish(Redis_evnet_Item.Request_Event_Conf.Request_Item_Equip_Hero_Card_Deck_Info, JSON.stringify(pub_msg))) {
                //���� ���� 
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
exports.Register_Item_Equip_Hero_Card_Deck_Info = Register_Item_Equip_Hero_Card_Deck_Info;
//////////////////////// Get_Item_Equip_Hero_Card_Deck_Info //////////////////////////////////////////
//# sourceMappingURL=Item_process.js.map