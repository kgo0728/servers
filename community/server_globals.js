"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io = require("socket.io");
const express = require("express");
const http = require("http");
const redis = require("redis");
const common_redis = require("../common/common_redis");
const Server_Conf = require("./server_config");
function dateToYYYYMMDD(date) {
    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + '-' + pad(date.getHours());
}
let Log_W_Path_Lobby = './log/' + dateToYYYYMMDD(new Date()) + '_lobby.log';
//���� ���� ���� 
Server_Conf._Set_Service_Type_Init();
//�κ� �۷ι� 
exports.g_app = express(); // AWS�� ALB�� �����Ͽ� ���� healthCheck�� ���������� �ʾƼ� healthCheck�� ���� express�� �߰�.
exports.server = http.createServer(exports.g_app);
exports.g_server_Timeout = 120000;
exports.g_server = socket_io(exports.server, {
    pingTimeout: exports.g_server_Timeout,
    pingInterval: 25000 //default 
});
common_redis.Redis_Client_config.host = Server_Conf.Server_config._Redis_Ip;
common_redis.Redis_Client_config.port = Server_Conf.Server_config._Redis_Port;
common_redis.Redis_Client_config.connect_timeout = Server_Conf.Server_config._Redis_connect_timeout;
common_redis.Redis_Sub_config.host = Server_Conf.Server_config._Redis_Ip;
common_redis.Redis_Sub_config.port = Server_Conf.Server_config._Redis_Port;
common_redis.Redis_Sub_config.connect_timeout = Server_Conf.Server_config._Redis_connect_timeout;
common_redis.Redis_Pub_config.host = Server_Conf.Server_config._Redis_Ip;
common_redis.Redis_Pub_config.port = Server_Conf.Server_config._Redis_Port;
common_redis.Redis_Pub_config.connect_timeout = Server_Conf.Server_config._Redis_connect_timeout;
exports.g_redis_client = redis.createClient(common_redis.Redis_Client_config); //���� Ŭ���̾�Ʈ �� 
exports.g_redis_sub = redis.createClient(common_redis.Redis_Sub_config); //���� ���� ���� �̺�Ʈ�� ������ ���  
exports.g_redis_pub = redis.createClient(common_redis.Redis_Pub_config); //���� ���� �̺�Ʈ�� ���� ��� ���� ����
exports.G_redis_sub_MsgListener = new Map();
exports.G_redis_sub_Call_Param = {
    channel: '0',
    message: '0'
};
//ä�� ��� 
function Redis_sub_subscribe(channel) {
    exports.g_redis_sub.subscribe(channel, function (err, msg) {
        if (err) {
            global.logger_error.error(`[Redis_Sub] ${channel} Error`);
        }
        else {
            global.logger_input.debug(`[Redis_Sub] ${channel} Success`);
        }
    });
}
exports.Redis_sub_subscribe = Redis_sub_subscribe;
//�޼��� ��� 
function Redis_sub_onMsgListener(channel, callback) {
    exports.G_redis_sub_MsgListener.set(channel, callback);
    /*
    g_redis_sub.on("message", function (channel: string, message: string) {
        callback(channel, message);
    });
    */
}
exports.Redis_sub_onMsgListener = Redis_sub_onMsgListener;
exports.g_Server_Local_Ip = { data: '' };
//�۷ι� �ɼ� 
//export let g_Server_Config: { data: string, data2: string } = { data: '', data2: '' };
//����  ���հ��� (key = ACC_UKEY , value = ServerUser )
exports.G_Server_Users = new Map();
exports.G_ITEM_DATE_TIME_ZERO = '1900-01-01 00:00:00';
exports.G_ITEM_DATE_YEAR_NULL = 1900;
exports.G_FEVER_GAUGE_LIMIT = 5;
exports.G_CHAT_DELEY_SEND_TIME = 1000; //1��
exports.G_INAPP_GOOGLE_APPLICATION_ID = "com.YewonGames.RPSShowdown";
exports.G_INAPP_GOOGLE_APPLICATION_RSA_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArCZGI60AueLiDeP6oWpBW8eh5d6BK5AUOfMI5reM3DEtYcOuOVj+IQbSdvU2ktK6VJp84xkFBqI74Gn/TF059DyTH0bOyWDWf0dg3n5tLSWMxX5DjCOuFyGYgV55f8pOIeX5HJ5Tws2W7ycBGkHeM33k+BFDx54tUSFJEtmtai6w/j9lkDcFGRDiCMLnhyWbR1rmvh59JHA1S6zIVC6eZ0AEFEVNzQnyEW5HNiIoaZ58uBWOHX/jScIZjtRQCArybHrdrkzOr7HHDD7WM8ewTf97YAx1fCh38uxyJ1r5l2p3u5rcaKhh9I4s9jTDMqe7l4IRPJAU3Ty4LVlnrukx7wIDAQAB";
exports.G_OMMON_SC_PACKET_SECRET_KEY = "s%kA!oqL";
function Server_logger_input(message, ...args) {
    if (Server_Conf.Server_Log._Input_log_Able > 0)
        global.logger_input.debug(message);
}
exports.Server_logger_input = Server_logger_input;
//# sourceMappingURL=server_globals.js.map