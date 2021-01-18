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
const Server_Struct = require("./server_struct");
let Member_Conf = {
    _event_Account_Connect_Info: "Account_Connect_Info",
    /*
    _event_Account_User_Info: "Account_User_Info",
    _event_Account_Nick_Create_Info: "Account_Nick_Create_Info",
    _event_Account_Change_Personal_Info: "Account_Change_Personal_Info",
    _event_Player_Send_Chat_Info: "Player_Send_Chat_Info",
    */
    _Api_Account_Connect_Users_All_Delete_Info: "/servers/Get_Account_Connect_Users_All_Delete_Info.php",
    _Api_Account_Connect_Info: "/servers/Get_Account_Connect_Info.php",
    _Api_Account_DisConnect_Info: "/servers/Get_Account_DisConnect_Info.php",
};
function Register_Event(socket, Host) {
    Register_Account_Connect_Info(socket, Host);
}
exports.Register_Event = Register_Event;
function Register_Account_Connect_Info(socket, Host) {
    const event = Member_Conf._event_Account_Connect_Info;
    socket.on(event, function (recv_packet) {
        let msg = new common.PacketData;
        if (Server_Conf.Server_config._Packet_Encrypt) {
            try {
                recv_packet = GibberishAES.dec(recv_packet, Server_Global.G_OMMON_SC_PACKET_SECRET_KEY);
            }
            catch (e) {
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.DATA_ENCRYPT_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                return;
            }
        }
        if (common.RecvPacket(msg, socket, event, recv_packet, Server_Conf.Server_Log._Input_log_Able) === false) {
            return;
        }
        if (socket['ACC_UKEY'] != undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            //socket['remoteAddress']
            msg._data.SERVER_NAME = Server_Conf.Server_config._Server_Name_Unique;
            msg._data.SERVER_ADDR = Server_Global.g_Server_Local_Ip.data[0].concat(":", Server_Global.server.address().port);
            msg._data.CLIENT_ADDR = socket['remoteAddress'];
            /*
            let Lobby_config = require('./lobby_config');
            global.logger.info('[G_CHAT_DELAY_WARRING_STR] : ', Lobby_config.G_CHAT_DELAY_WARRING_STR);
            global.logger.info('[G_INPUT_LOG_SAVE] : ', Lobby_config.G_INPUT_LOG_SAVE);
            */
            //API ������ ���� - ���� ������ ��  msg  �߰� �����ʹ� OBJECT ���� �� ����
            //const Api_data: { SESSION: string, SERVER_ADDR: string, CLIENT_ADDR: string } = { SESSION: msg._data.SESSION, SERVER_ADDR: msg._data.SERVER_ADDR, CLIENT_ADDR: msg._data.CLIENT_ADDR };
            const option = common.GetRequestOptionWithPost(Host + Member_Conf._Api_Account_Connect_Info, msg._data);
            Api_Request_Account_Connect_Info(socket, option);
        }
    });
}
function Api_Request_Account_Connect_Info(socket, option) {
    const event = Member_Conf._event_Account_Connect_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            return;
        }
        if (socket.disconnected) {
            return;
        }
        if (!body.RETURN_V) //�����ΰ�츸 
         {
            socket['ACC_UKEY'] = body.SERVER_DATA_INFO.ACC_UKEY;
            socket['ACC_ID'] = body.SERVER_DATA_INFO.ACC_ID;
            const User = new Server_Struct.ServerUser(body.SERVER_DATA_INFO.ACC_ID, body.SERVER_DATA_INFO.GAME_ID, body.SERVER_DATA_INFO.ACC_UKEY, socket);
            User._GAME_NICK = body.SERVER_DATA_INFO.GAME_NICK;
            socket['ENCRYPT_KEY'] = (body.SERVER_DATA_INFO.ACC_ENCRYPT_KEY == undefined) ? '0' : body.SERVER_DATA_INFO.ACC_ENCRYPT_KEY;
            Server_Global.G_Server_Users.set(body.SERVER_DATA_INFO.ACC_UKEY, User);
            if (Server_Conf.Server_Log._Default_log_Able)
                global.logger.debug(`Account_Connect UK=${socket['ACC_UKEY']}  NOW_USES:${Server_Global.G_Server_Users.size}`);
            //���� ������ ���� 
            delete body.SERVER_DATA_INFO;
        }
        if (Server_Conf.Server_config._Packet_Encrypt)
            common.SendPacket(socket, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
        else
            common.SendPacket(socket, event, body, Server_Conf.Server_Log._Output_log_Able);
    });
}
//close �� ��� ó�� 
function Registert_Account_DisConnect_Info(UKEY, Host) {
    const Api_data = { ACC_UKEY: UKEY };
    const option = common.GetRequestOptionWithPost(Host + Member_Conf._Api_Account_DisConnect_Info, Api_data);
    Request_Account_DisConnect_Info(option);
}
exports.Registert_Account_DisConnect_Info = Registert_Account_DisConnect_Info;
function Request_Account_DisConnect_Info(option) {
    const event = Member_Conf._Api_Account_DisConnect_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            return;
        }
        //global.logger.debug('Account_Disconnet_Save[RETURN_V] :%d', body.RETURN_V);
    });
}
//�ش� ������ ������ ��� ���� (���� ���۽ÿ� ó�� )
function Registert_Account_Connect_Users_All_Delete_Info(Host) {
    const Api_data = { SERVER_NAME: Server_Conf.Server_config._Server_Name_Unique };
    const option = common.GetRequestOptionWithPost(Host + Member_Conf._Api_Account_Connect_Users_All_Delete_Info, Api_data);
    Request_Account_Connect_Users_All_Delete_Info(option);
}
exports.Registert_Account_Connect_Users_All_Delete_Info = Registert_Account_Connect_Users_All_Delete_Info;
function Request_Account_Connect_Users_All_Delete_Info(option) {
    const event = Member_Conf._Api_Account_Connect_Users_All_Delete_Info;
    request(option, function (err, res, body) {
        if (common.RecvRequest(event, err, res, body) === false) {
            return;
        }
        //global.logger.debug('Account_Disconnet_Save[RETURN_V] :%d', body.RETURN_V);
    });
}
//////////////////////// Account_Confirm_Info //////////////////////////////////////////
//# sourceMappingURL=member_process.js.map