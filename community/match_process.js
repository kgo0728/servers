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
const Redis_evnet_Match = require("./redis_event_match");
let Match_Conf = {
    _event_Match_Arena_Game_Start_Info: "Match_Arena_Game_Start_Info",
    _event_Match_Arena_Game_End_Info: "Match_Arena_Game_End_Info",
    _event_Match_Arena_Game_Remath_Start_Info: "Match_Arena_Game_Rematch_Start_Info",
    _event_Match_Stage_Game_Start_Info: "Match_Stage_Game_Start_Info",
    _event_Match_Stage_Game_End_Info: "Match_Stage_Game_End_Info",
    _event_Match_Honor_Game_Start_Info: "Match_Honor_Game_Start_Info",
    _event_Match_Honor_Game_End_Info: "Match_Honor_Game_End_Info",
    _event_Match_Friend_Game_Start_Info: "Match_Friend_Game_Start_Info",
    _event_Match_Friend_Game_End_Info: "Match_Friend_Game_End_Info",
    //��ġ Common//////////   
    _event_Match_Common_Game_Rally_Info: "Match_Common_Game_Rally_Info",
    _event_Match_Common_Game_Rally_Retry_Info: "Match_Common_Game_Rally_Retry_Info",
    _event_Match_Common_Game_Auto_Mode_Info: "Match_Common_Game_Auto_Mode_Info",
    _Api_Match_Arena_Game_Start_Info: "/servers/Get_Match_Arena_Game_Start_Info.php",
    _Api_Match_Arena_Game_End_Info: "/servers/Get_Match_Arena_Game_End_Info.php",
    _Api_Match_Arena_Game_Rematch_Start_Info: "/servers/Get_Match_Arena_Game_Rematch_Start_Info.php",
    _Api_Match_Stage_Game_Start_Info: "/servers/Get_Match_Stage_Game_Start_Info.php",
    _Api_Match_Stage_Game_End_Info: "/servers/Get_Match_Stage_Game_End_Info.php",
    _Api_Match_Honor_Game_Start_Info: "/servers/Get_Match_Honor_Game_Start_Info.php",
    _Api_Match_Honor_Game_End_Info: "/servers/Get_Match_Honor_Game_End_Info.php",
    _Api_Match_Friend_Game_Start_Info: "/servers/Get_Match_Friend_Game_Start_Info.php",
    _Api_Match_Friend_Game_End_Info: "/servers/Get_Match_Friend_Game_End_Info.php",
};
function Register_Event(socket, Host) {
    Register_Match_Arena_Game_Start_Info(socket, Host);
    Register_Match_Arena_Game_End_Info(socket, Host);
    Register_Match_Arena_Game_Rematch_Start_Info(socket, Host);
    Register_Match_Stage_Game_Start_Info(socket, Host);
    Register_Match_Stage_Game_End_Info(socket, Host);
    Register_Match_Honor_Game_Start_Info(socket, Host);
    Register_Match_Honor_Game_End_Info(socket, Host);
    Register_Match_Friend_Game_Start_Info(socket, Host);
    Register_Match_Friend_Game_End_Info(socket, Host);
    Register_Match_Common_Game_Rally_Info(socket, Host);
    Register_Match_Common_Game_Rally_Retry_Info(socket, Host);
    Register_Match_Common_Game_Auto_Mode_Info(socket, Host);
}
exports.Register_Event = Register_Event;
//////////////////////// Register_Match_Arena_Game_Start_Info //////////////////////////////////////////
function Register_Match_Arena_Game_Start_Info(socket, Host) {
    const event = Match_Conf._event_Match_Arena_Game_Start_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == false) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO.Init();
                const Api_data = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    ARENA_USER: msg._data.ARENA_USER
                };
                const option = common.GetRequestOptionWithPost(Host + Match_Conf._Api_Match_Arena_Game_Start_Info, Api_data);
                Api_Request_Match_Arena_Game_Start_Info(socket, option);
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Register_Match_Arena_Game_Rematch_Start_Info ///////////////////////////////////////////
function Register_Match_Arena_Game_Rematch_Start_Info(socket, Host) {
    const event = Match_Conf._event_Match_Arena_Game_Remath_Start_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == false) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO.Init();
                const Api_data = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    ARENA_ID: msg._data.ARENA_ID
                };
                const option = common.GetRequestOptionWithPost(Host + Match_Conf._Api_Match_Arena_Game_Rematch_Start_Info, Api_data);
                Api_Request_Match_Arena_Game_Start_Info(socket, option);
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Request_Match_Arena_Game_Start_Info ///////////////////////////////////////////
function Api_Request_Match_Arena_Game_Start_Info(socket, option) {
    const event = Match_Conf._event_Match_Arena_Game_Start_Info;
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
            //ó��
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START = true;
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID = body.MATCH_ARENA_GAME_START_INFO.ARENA_ID;
            // �� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info = body.MATCH_ARENA_GAME_START_INFO.MY_TEAM_DECK_INFO;
            // ���� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info = body.MATCH_ARENA_GAME_START_INFO.ENEMY_TEAM_DECK_INFO;
            const pub_msg = {
                ACC_UKEY: socket['ACC_UKEY'],
                RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Arena_Game_Start_Info,
                ATEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info,
                BTEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info,
                EVENT_ID: event,
                MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                SET_SCORE: body.MATCH_ARENA_GAME_START_INFO.SET_SCORE,
                SCORE: body.MATCH_ARENA_GAME_START_INFO.SCORE
            };
            // ��ġ ������ ����
            if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Arena_Game_Start_Info, JSON.stringify(pub_msg))) {
                //���� ���� 
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            }
            // ���� ������ ����
            delete body.RETURN_V;
            delete body.MATCH_ARENA_GAME_START_INFO;
        }
        else {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(socket, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(socket, event, body, Server_Conf.Server_Log._Output_log_Able);
        }
    });
}
//////////////////////// Request_Match_Arena_Game_End_Info /////////////////////////////////////////////
function Register_Match_Arena_Game_End_Info(socket, Host) {
    const event = Match_Conf._event_Match_Arena_Game_End_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                const pub_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ACC_UKEY,
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Arena_Game_End_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    EVENT_ID: event,
                    WINNER_TEAM: msg._data.WINNERTEAM,
                    RESULT_TYPE: msg._data.RESULT_TYPE,
                };
                //��ġ ������ ����  �̺�Ʈ ó��
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Arena_Game_End_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Register_Match_Stage_Game_Start_Info //////////////////////////////////////////
function Register_Match_Stage_Game_Start_Info(socket, Host) {
    const event = Match_Conf._event_Match_Stage_Game_Start_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == false) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO.Init();
                const Api_data = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    CARD_POS: msg._data.CARD_POS
                    //(msg._data.USE_LUCK_CARD == undefined) ? '0' : msg._data.USE_LUCK_CARD;
                };
                const option = common.GetRequestOptionWithPost(Host + Match_Conf._Api_Match_Stage_Game_Start_Info, Api_data);
                Api_Request_Match_Stage_Game_Start_Info(socket, option);
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Request_Match_Stage_Game_Start_Info ///////////////////////////////////////////
function Api_Request_Match_Stage_Game_Start_Info(socket, option) {
    const event = Match_Conf._event_Match_Stage_Game_Start_Info;
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
            //ó��
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START = true;
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID = body.MATCH_STAGE_GAME_START_INFO.ARENA_ID;
            // �� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info = body.MATCH_STAGE_GAME_START_INFO.MY_TEAM_DECK_INFO;
            // ���� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info = body.MATCH_STAGE_GAME_START_INFO.ENEMY_TEAM_DECK_INFO;
            const pub_msg = {
                ACC_UKEY: socket['ACC_UKEY'],
                RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Stage_Game_Start_Info,
                ATEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info,
                BTEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info,
                EVENT_ID: event,
                MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                SKILL_GAUGE_ADD_SPEED: body.MATCH_STAGE_GAME_START_INFO.SKILL_GAUGE_ADD_SPEED,
                HERO_ABILITY_ADD_INFO: body.MATCH_STAGE_GAME_START_INFO.HERO_ABILITY_ADD_INFO,
                SET_SCORE: body.MATCH_STAGE_GAME_START_INFO.SET_SCORE,
                SCORE: body.MATCH_STAGE_GAME_START_INFO.SCORE
            };
            // ��ġ ������ ����
            if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Stage_Game_Start_Info, JSON.stringify(pub_msg))) {
                //���� ���� 
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            }
            // ���� ������ ����
            delete body.RETURN_V;
            delete body.MATCH_STAGE_GAME_START_INFO;
        }
        else {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(socket, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(socket, event, body, Server_Conf.Server_Log._Output_log_Able);
        }
    });
}
//////////////////////// Request_Match_Stage_Game_End_Info /////////////////////////////////////////////
function Register_Match_Stage_Game_End_Info(socket, Host) {
    const event = Match_Conf._event_Match_Stage_Game_End_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                const pub_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ACC_UKEY,
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Stage_Game_End_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    EVENT_ID: event,
                    WINNER_TEAM: msg._data.WINNERTEAM,
                    RESULT_TYPE: msg._data.RESULT_TYPE,
                };
                //��ġ ������ ����  �̺�Ʈ ó��
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Stage_Game_End_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Register_Match_Honor_Game_Start_Info ////////////////////////////////////////////////////
function Register_Match_Honor_Game_Start_Info(socket, Host) {
    const event = Match_Conf._event_Match_Honor_Game_Start_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == false) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO.Init();
                const Api_data = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    LOCATION_ID: msg._data.LOCATION_ID
                };
                const option = common.GetRequestOptionWithPost(Host + Match_Conf._Api_Match_Honor_Game_Start_Info, Api_data);
                Api_Request_Match_Honor_Game_Start_Info(socket, option);
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Api_Request_Match_Honor_Game_Start_Info ////////////////////////////////////////////////////
function Api_Request_Match_Honor_Game_Start_Info(socket, option) {
    const event = Match_Conf._event_Match_Honor_Game_Start_Info;
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
            //ó��
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START = true;
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID = body.MATCH_HONOR_GAME_START_INFO.ARENA_ID;
            // �� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info = body.MATCH_HONOR_GAME_START_INFO.MY_TEAM_DECK_INFO;
            // ���� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info = body.MATCH_HONOR_GAME_START_INFO.ENEMY_TEAM_DECK_INFO;
            const pub_msg = {
                ACC_UKEY: socket['ACC_UKEY'],
                RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Honor_Game_Start_Info,
                ATEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info,
                BTEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info,
                EVENT_ID: event,
                MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                SET_SCORE: body.MATCH_HONOR_GAME_START_INFO.SET_SCORE,
                SCORE: body.MATCH_HONOR_GAME_START_INFO.SCORE
            };
            // ��ġ ������ ����
            //if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Honor_Game_Start_Info, JSON.stringify(pub_msg)))
            if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Arena_Game_Start_Info, JSON.stringify(pub_msg))) {
                //���� ���� 
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            }
            // ���� ������ ����
            delete body.RETURN_V;
            delete body.MATCH_HONOR_GAME_START_INFO;
        }
        else {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(socket, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(socket, event, body, Server_Conf.Server_Log._Output_log_Able);
        }
    });
}
//////////////////////// Register_Match_Honor_Game_End_Info  ////////////////////////////////////////////////////
function Register_Match_Honor_Game_End_Info(socket, Host) {
    const event = Match_Conf._event_Match_Honor_Game_End_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                const pub_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ACC_UKEY,
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Honor_Game_End_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    EVENT_ID: event,
                    WINNER_TEAM: msg._data.WINNERTEAM,
                    RESULT_TYPE: msg._data.RESULT_TYPE,
                };
                //if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Honor_Game_End_Info, JSON.stringify(pub_msg)))
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Arena_Game_End_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Register_Match_Friend_Game_Start_Info ////////////////////////////////////////////////////
function Register_Match_Friend_Game_Start_Info(socket, Host) {
    const event = Match_Conf._event_Match_Friend_Game_Start_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == false) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO.Init();
                const Api_data = {
                    ACC_UKEY: socket['ACC_UKEY']
                };
                const option = common.GetRequestOptionWithPost(Host + Match_Conf._Api_Match_Friend_Game_Start_Info, Api_data);
                Api_Request_Match_Friend_Game_Start_Info(socket, option);
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Api_Request_Match_Friend_Game_Start_Info ////////////////////////////////////////////////////
function Api_Request_Match_Friend_Game_Start_Info(socket, option) {
    const event = Match_Conf._event_Match_Friend_Game_Start_Info;
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
            //ó��
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START = true;
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID = body.MATCH_FRIEND_GAME_START_INFO.ARENA_ID;
            // �� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info = body.MATCH_FRIEND_GAME_START_INFO.MY_TEAM_DECK_INFO;
            // ���� �� ���� ����
            Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info = body.MATCH_FRIEND_GAME_START_INFO.ENEMY_TEAM_DECK_INFO;
            const pub_msg = {
                ACC_UKEY: socket['ACC_UKEY'],
                RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Friend_Game_Start_Info,
                ATEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._My_Deck_Info,
                BTEAM: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._Enemy_Deck_Info,
                EVENT_ID: event,
                MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                SET_SCORE: body.MATCH_FRIEND_GAME_START_INFO.SET_SCORE,
                SCORE: body.MATCH_FRIEND_GAME_START_INFO.SCORE
            };
            // ��ġ ������ ����
            if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Arena_Game_Start_Info, JSON.stringify(pub_msg))) {
                //���� ���� 
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
            }
            // ���� ������ ����
            delete body.RETURN_V;
            delete body.MATCH_FRIEND_GAME_START_INFO;
        }
        else {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.SendPacket(socket, event, GibberishAES.enc(JSON.stringify(body), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.SendPacket(socket, event, body, Server_Conf.Server_Log._Output_log_Able);
        }
    });
}
//////////////////////// Register_Match_Friend_Game_End_Info  ////////////////////////////////////////////////////
function Register_Match_Friend_Game_End_Info(socket, Host) {
    const event = Match_Conf._event_Match_Friend_Game_End_Info;
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
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                const pub_msg = {
                    ACC_UKEY: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ACC_UKEY,
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Friend_Game_End_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    EVENT_ID: event,
                    WINNER_TEAM: msg._data.WINNERTEAM,
                    RESULT_TYPE: msg._data.RESULT_TYPE,
                };
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Arena_Game_End_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
/////////////////////////////////////// common ///////////////////////////////////////////
//////////////////////// Request_Match_Arena_Game_Rally_Info ///////////////////////////////////////////
function Register_Match_Common_Game_Rally_Info(socket, Host) {
    const event = Match_Conf._event_Match_Common_Game_Rally_Info;
    socket.on(event, function (recv_packet) {
        let msg = new common.PacketData;
        if (Server_Conf.Server_config._Packet_Encrypt) {
            try {
                recv_packet = GibberishAES.dec(recv_packet, Server_Global.G_OMMON_SC_PACKET_SECRET_KEY);
            }
            catch (e) {
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.DATA_ENCRYPT_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            }
        }
        if (common.RecvPacket(msg, socket, event, recv_packet, Server_Conf.Server_Log._Input_log_Able) === false) {
            return;
        }
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._MY_TEAM_SKILL = msg._data.ATEAM;
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ENEMY_TEAM_SKILL = msg._data.BTEAM;
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._SERVE_TEAM = msg._data.SERVETEAM;
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._PINCHSERVE_TEAM = msg._data.PINCHSERVETEAM;
                const pub_msg = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    A_TEAM_SKILL: msg._data.ATEAM,
                    B_TEAM_SKILL: msg._data.BTEAM,
                    SERVE_TEAM: msg._data.SERVETEAM,
                    PINCHSERVE_TEAM: msg._data.PINCHSERVETEAM,
                    EVENT_ID: event
                };
                // ����
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Common_Game_Rally_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Request_Match_Common_Game_Rally_Retry_Info ///////////////////////////////////////////
function Register_Match_Common_Game_Rally_Retry_Info(socket, Host) {
    const event = Match_Conf._event_Match_Common_Game_Rally_Retry_Info;
    socket.on(event, function (recv_packet) {
        let msg = new common.PacketData;
        if (Server_Conf.Server_config._Packet_Encrypt) {
            try {
                recv_packet = GibberishAES.dec(recv_packet, Server_Global.G_OMMON_SC_PACKET_SECRET_KEY);
            }
            catch (e) {
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.DATA_ENCRYPT_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            }
        }
        if (common.RecvPacket(msg, socket, event, recv_packet, Server_Conf.Server_Log._Input_log_Able) === false) {
            return;
        }
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._REMAKEINDEX = msg._data.REMAKEINDEX;
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._MY_TEAM_SKILL = msg._data.ATEAM;
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ENEMY_TEAM_SKILL = msg._data.BTEAM;
                Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._PINCHSERVE_TEAM = msg._data.PINCHSERVETEAM;
                const pub_msg = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Common_Game_Rally_Retry_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    REMAKEINDEX: msg._data.REMAKEINDEX,
                    A_TEAM_SKILL: msg._data.ATEAM,
                    B_TEAM_SKILL: msg._data.BTEAM,
                    PINCHSERVE_TEAM: msg._data.PINCHSERVETEAM,
                    EVENT_ID: event
                };
                // ����
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Common_Game_Rally_Retry_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Request_Match_Common_Game_Auto_Mode_Info ///////////////////////////////////////////
function Register_Match_Common_Game_Auto_Mode_Info(socket, Host) {
    const event = Match_Conf._event_Match_Common_Game_Auto_Mode_Info;
    socket.on(event, function (recv_packet) {
        let msg = new common.PacketData;
        if (Server_Conf.Server_config._Packet_Encrypt) {
            try {
                recv_packet = GibberishAES.dec(recv_packet, Server_Global.G_OMMON_SC_PACKET_SECRET_KEY);
            }
            catch (e) {
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.DATA_ENCRYPT_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            }
        }
        if (common.RecvPacket(msg, socket, event, recv_packet, Server_Conf.Server_Log._Input_log_Able) === false) {
            return;
        }
        if (socket['ACC_UKEY'] == undefined) {
            if (Server_Conf.Server_config._Packet_Encrypt)
                common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
            else
                common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
        }
        else {
            if (Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_START == true) {
                const pub_msg = {
                    ACC_UKEY: socket['ACC_UKEY'],
                    RECV_EVENT: Redis_evnet_Match.Answer_Event_Conf.Answer_Match_Common_Game_Auto_Mode_Info,
                    MATCH_ID: Server_Global.G_Server_Users.get(socket['ACC_UKEY'])._ARENAINFO._ARENA_ID,
                    IS_MODE: msg._data.IS_MODE,
                    EVENT_ID: event
                };
                // ����
                if (!Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Common_Game_Auto_Mode_Info, JSON.stringify(pub_msg))) {
                    //���� ���� 
                    if (Server_Conf.Server_config._Packet_Encrypt)
                        common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                    else
                        common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR), Server_Conf.Server_Log._Output_log_Able);
                }
            }
            else {
                if (Server_Conf.Server_config._Packet_Encrypt)
                    common.Send_Error_Packet(socket, event, GibberishAES.enc(common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Global.G_OMMON_SC_PACKET_SECRET_KEY), Server_Conf.Server_Log._Output_log_Able);
                else
                    common.Send_Error_Packet(socket, event, common.Create_Error_Packet(CommonGlobal.GlOBAL_ERROR.PLAY_MATCH_ALREAD_STATE_JOIN), Server_Conf.Server_Log._Output_log_Able);
            }
        }
    });
}
//////////////////////// Registert_Match_Common_Game_DisConnect_Info //////////////////////////////////////////
//close �� ��� ó�� 
function Registert_Match_Common_Game_DisConnect_Info(UKEY) {
    if (Server_Global.G_Server_Users.get(UKEY)._ARENAINFO._ARENA_ID != "0") {
        const pub_msg = {
            ACC_UKEY: UKEY,
            ARENA_ID: Server_Global.G_Server_Users.get(UKEY)._ARENAINFO._ARENA_ID
        };
        Server_Global.g_redis_pub.publish(Redis_evnet_Match.Request_Event_Conf.Request_Match_Common_Game_DisConnect_Info, JSON.stringify(pub_msg));
    }
}
exports.Registert_Match_Common_Game_DisConnect_Info = Registert_Match_Common_Game_DisConnect_Info;
//# sourceMappingURL=match_process.js.map