"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
//import * as redis from 'redis';
//import { setTimeout, setInterval } from "timers";
const common = require("../common/common");
const CommonGlobal = require("../common/globals");
const GibberishAES = require("../common/gibberish-aes");
const Server_Global = require("./server_globals");
const Server_Conf = require("./server_config");
let Community_Conf = {
    _event_Player_Send_Chat_Info: "Player_Send_Chat_Info",
    _Api_Player_Send_Chat_Info: "/community/Get_Player_Send_Chat_Info.php",
};
function Register_Event(socket, Host) {
    Register_Player_Send_Chat_Info(socket, Host);
}
exports.Register_Event = Register_Event;
//////////////////////// Get_Player_Send_Chat_Info //////////////////////////////////////////
function Register_Player_Send_Chat_Info(socket, Host) {
    const event = Community_Conf._event_Player_Send_Chat_Info;
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
            const pub_msg = { SEND_NICK: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._GAME_NICK, TYPE: msg._data.TYPE, MSG: msg._data.MSG };
            Server_Global.g_redis_pub.publish("User_Send_Chat", JSON.stringify(pub_msg));
            /*
            if (LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY'])._CHAT_SEND_TIME > 0) {

                if (Date.now() <= LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY'])._CHAT_SEND_TIME) {

                    let Send_Chet: string = Chat_Warring;

                    //���� ���� ����޼��� ����
                    const Response_Data: { TYPE: number, NOTICE: string } =
                    {
                        TYPE: 1,
                        NOTICE: Send_Chet
                    };

                    common.SendPacket(socket, 'Admin_Notice_system_Info', Response_Data);
                    return;
                }
            }


            const Api_data: { ACC_UKEY: string, UU_DB_PATH: string, TYPE: number, NICK: string, MSG: string }
                = { ACC_UKEY: socket['ACC_UKEY'], UU_DB_PATH: socket['UU_DB_PATH'], TYPE: msg._data.TYPE, NICK: LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY'])._GAME_NICK, MSG: msg._data.MSG };

            const option: request.OptionsWithUri = common.GetRequestOptionWithPost(Host + Community_Conf._Api_Player_Send_Chat_Info, Api_data);
            Request_Player_Send_Chat_Info(socket, option);

            //���� ������ ������ �ð�
            LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY'])._CHAT_SEND_TIME = Date.now() + LobbyGlobal.G_CHAT_DELEY_SEND_TIME;
            */
        }
    });
}
exports.Register_Player_Send_Chat_Info = Register_Player_Send_Chat_Info;
function Request_Player_Send_Chat_Info(socket, option) {
    const event = Community_Conf._event_Player_Send_Chat_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            //common.Send_Error_Packet(socket, event, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
            return;
        }
        /*
        if (socket.disconnected) {
            return;
        }
        */
        //��ü���� �����ؾ���
        //common.SendPacket_All(LobbyGlobal.g_server, event, body);
    });
}
//////////////////////// Get_Player_Send_Chat_Info //////////////////////////////////////////
//# sourceMappingURL=community_process.js.map