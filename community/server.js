"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as redis from 'redis';
const dayjs = require("dayjs");
const express = require("express");
const Path = require("path");
const fs = require("fs");
const log4js = require("log4js");
//import GibberishAES = require('../common/gibberish-aes');
const common = require("../common/common");
//import * as common_redis from "../common/common_redis";
const CommonGlobal = require("../common/globals");
const Server_Global = require("./server_globals");
const Server_Conf = require("./server_config");
const Member_process = require("./member_process");
const Community_process = require("./community_process");
const Redis_process = require("./redis_process");
if (process.argv.length > 2) //srever name 
 {
    let _In_Server_name = process.argv[2];
    if (_In_Server_name != '0')
        Server_Conf.Server_config._Server_Name = _In_Server_name;
}
if (process.argv.length > 3) //server port
 {
    let _In_Port = Number(process.argv[3]);
    if (_In_Port > 0)
        Server_Conf.Server_config._port = _In_Port;
}
if (process.argv.length > 4) //server get match name 
 {
    let _In_Match_Server = process.argv[4];
    if (_In_Match_Server != '0')
        Server_Conf.Server_config._Match_Server = _In_Match_Server;
}
process.title = process.title + ' [' + Server_Conf.Server_config._Server_Name + ']';
//�α� ��� 
Server_Conf.Server_Log._Input_log_Path = __dirname + "/log_" + Server_Conf.Server_config._Server_Name + "/log_input/";
Server_Conf.Server_Log._Output_log_Path = __dirname + "/log_" + Server_Conf.Server_config._Server_Name + "/log_output/";
Server_Conf.Server_Log._Error_log_Path = __dirname + "/log_" + Server_Conf.Server_config._Server_Name + "/log_error/";
//�α׸� ��Ʈ ���� ������ �����Ѵ� 
let gLog4js_Lobby = log4js.configure({
    appenders: {
        /*
        file: {
            type: 'file',
            filename: Log_W_Path_Lobby,
            maxLogSize: 5242880,  //�⺻ 5�ް�   //10485760 <�� 10 �ް�>  (��Ȳ���� ����)
            backups: 100,         //�ִ� ��� ���� (��Ȳ���� ����)
            compress: true
        },*/
        file_input: {
            type: "dateFile",
            //filename: __dirname + "/log_input/server",
            //filename: __dirname + "/log_"+Server_Conf.Server_config._port+ "/log_input/server",
            filename: Server_Conf.Server_Log._Input_log_Path + "-",
            pattern: "yyyy-MM-dd-hh.log",
            encoding: "utf-8",
            alwaysIncludePattern: true,
            keepFileExt: true
        },
        file_output: {
            type: "dateFile",
            //filename: __dirname + "/log_output/server",
            //filename: __dirname + "/log_"+Server_Conf.Server_config._port+ "/log_output/server",
            filename: Server_Conf.Server_Log._Output_log_Path + "-",
            pattern: "yyyy-MM-dd-hh.log",
            encoding: "utf-8",
            alwaysIncludePattern: true,
            keepFileExt: true
        },
        file_error: {
            type: "dateFile",
            //filename: __dirname + "/log_error/server",
            //filename: __dirname + "/log_" + Server_Conf.Server_config._port + "/log_error/server",
            filename: Server_Conf.Server_Log._Error_log_Path + "-",
            pattern: "yyyy-MM-dd-hh.log",
            encoding: "utf-8",
            alwaysIncludePattern: true,
            keepFileExt: true
        },
        console: {
            type: 'console'
        },
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'debug'
        },
        input: {
            appenders: ['file_input', 'console'],
            level: 'debug'
        },
        output: {
            appenders: ['file_output', 'console'],
            level: 'debug'
        },
        error: {
            appenders: ['file_error', 'console'],
            level: 'debug'
        }
    }
});
global.logger = gLog4js_Lobby.getLogger('default'); // log4js.getLogger();
global.logger_input = gLog4js_Lobby.getLogger('input'); // log4js.getLogger();
global.logger_output = gLog4js_Lobby.getLogger('output'); // log4js.getLogger();
global.logger_error = gLog4js_Lobby.getLogger('error'); // log4js.getLogger();
//���� ���� �̺�Ʈ ���� 
Server_Global.g_redis_client.on('error', err => Redis_Client_Error(err.stack));
Server_Global.g_redis_sub.on('error', err => Redis_Sub_Error(err.stack));
Server_Global.g_redis_pub.on('error', err => Redis_Pub_Error(err.stack));
//���� ���� �̺�Ʈ ���� 
Server_Global.g_redis_client.on('connect', Redis_Client_Connect);
Server_Global.g_redis_sub.on('connect', Redis_Sub_Connect);
Server_Global.g_redis_pub.on('connect', Redis_Pub_Connect);
//���� ���� 
Server_Global.server.listen(Server_Conf.Server_config._port);
Server_Global.server.maxConnections = Server_Conf.Server_config._max_users;
Server_Global.g_app.use(express.static(Path.join(__dirname, 'log_' + Server_Conf.Server_config._Server_Name))); //�α� ���� ���� �ּ� 
/**************************************************************************************
 * ������
 * ********************************************************************************* */
Main();
/**************************************************************************************
 * ���� �Լ���
 * ********************************************************************************* */
function Main() {
    //IP ���ϱ�
    Server_Global.g_Server_Local_Ip.data = common.Get_LocalIP();
    //���� �� + ���� IP �� ������ �̺�Ʈ ��� ���� 
    //let _Local_IP_UK: string = common.replaceAll(Server_Global.g_Server_Local_Ip.data[0], ".", "");
    let _Local_IP_UK = Server_Global.g_Server_Local_Ip.data[0].split(".")[3];
    //���� ���� ������ ���Ѵ� 
    Server_Conf.Server_config._Server_Name_Unique = Server_Conf.Server_config._Server_Name + '_' + _Local_IP_UK;
    /*
    let Data_string: string = 'U2FsdGVkX18qi/aH/g8YsTF7BlO5nh++LlfFJ68dkimQYTcuyl+qq6sGb9uB0Q3ZAL+tr7/AVte2B/UMdlO9sbNHq2/kIdeN3ig0CMMNN72eLCeJnKqcOdotEW4qF9c0xLj6avIFXorb+u7tRj8I/lxb70K96MoGu03rsMKq59JOx6SDuCLveDuESc+47oD4';
    let Eny_key: string = "e!oq%kAL";
    //let Encrypted: string = GibberishAES.enc(Data_string, Eny_key);
    let Decrypted: string = GibberishAES.dec(Data_string, Eny_key);
    //console.log('encrypted to: ' + Encrypted);
    console.log('decrypted to: ' + Decrypted);
    */
    /*
    let text1 = "Welcome";
    let text2 = "to";
    let text3 = "my";
    let text4 = "world";
    let result = text1.concat(" ", text2, " ", text3, " ", text4);
    */
    //���� ù ������ ���� ���ӵ� ������ �� �����Ѵ� 
    Member_process.Registert_Account_Connect_Users_All_Delete_Info(Server_Conf.Server_config._Api_host);
    RegisterProcessEvents();
    RegisterServerEvents();
    Redis_process.Register_Subscriptions();
    //RegisterRedisSubscriptions();
    //setInterval(RefreshToken, 1200000);
    //setInterval(RefreshRefund, 600000);
    //setInterval(monitor.PrintMonitor.bind(monitor), 1000);
}
/**************************************************************************************
 * Process �̺�Ʈ ���
 * ********************************************************************************* */
function RegisterProcessEvents() {
    // Prevents the program from closing instantly
    //process.stdin.resume();
    // do app specific cleaning before exiting
    /*
    process.on('exit', function (code) {
       // process.emit('cleanup');
        global.logger_error.error(`---------------- Process Exit ----Code[${code}]`);
    });
    */
    /*
    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {

        global.logger_error.error(`---------------- [Ctrl-C] Process Exit ----------------`);
        //console.log('Ctrl-C...');
        process.exit(2);
    });
    */
    /*
     // catches "kill pid" (for example: nodemon restart)
     process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
     process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
    */
    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function (e) {
        global.logger_error.error(`UncaughtException [${e}] `);
        //process.exit(99);
    });
}
/**************************************************************************************
 * socket.io ���� �̺�Ʈ ���
 * ********************************************************************************* */
function RegisterServerEvents() {
    Server_Global.g_app.get('/log_35555', function (req, res) {
        //res.sendFile('/log_input/server.-2019-09-27-16.log');
        //res.sendFile(Server_Conf.Server_Log._Error_log_Path + 'server.-2019-09-30-11.log');
        //res.sendFile("D:\WORK\HiQServer\HIQCOMMUNITY\community/log_35555/log_input/server.-2019-09-30-11.log");
        //let file_name = Server_Conf.Server_Log._Error_log_Path + 'server.-2019-09-30-11.log';
        //common.Transfer_File(Server_Conf.Server_Log._Error_log_Path, 'server.-2019-09-30-11.log', res);
    });
    Server_Global.g_app.get('/healthCheck', function (req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("Health Check Page");
        res.end();
    });
    /*
    Server_Global.g_app.post('/notice', function (req: request.Request, res: any) {

        let request_data: { data: any } = { data: '' };

        req.on('data', chunk => {
            //global.logger.debug('A chunk of data has arrived: ', chunk);
            request_data.data += chunk;
        });
        req.on('end', () => {
            //global.logger.debug('No more data', request_data.data);
            //��ü ����
            common.SendPacket_All(Server_Global.g_server, 'Admin_Notice_system_Info', request_data.data, Server_Conf.Server_Log._Output_log_Able);

            //��������
            common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SUCC);
        })
        req.on('error', err => {
            //global.logger.debug('error', err);
            common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
        })
    });
    */
    Server_Global.g_app.post('/notice_user', function (req, res) {
        let request_data = { data: '' };
        req.on('data', chunk => {
            request_data.data += chunk;
        });
        req.on('end', () => {
            let recv_date;
            recv_date = JSON.parse(request_data.data);
            if (!recv_date) {
                common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
            }
            else {
                if (Server_Global.G_Server_Users.has(recv_date.ACC_UKEY)) {
                    const Response_Data = {
                        TYPE: recv_date.TYPE,
                        NOTICE: recv_date.NOTICE,
                    };
                    //��ü ����    
                    //common.SendPacket_All(LobbyGlobal.g_server, 'Admin_Notice_system_Info', request_data.data);
                    common.SendPacket(Server_Global.G_Server_Users.get(recv_date.ACC_UKEY)._SOCKET, 'Admin_Notice_system_Info', Response_Data, Server_Conf.Server_Log._Output_log_Able);
                    //��������
                    common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SUCC);
                }
                else
                    common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.ACCOUNT_INFO_NOT_EXIST);
            }
        });
        req.on('error', err => {
            common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
        });
    });
    Server_Global.g_app.post('/command', function (req, res) {
        let request_data = { data: '' };
        req.on('data', chunk => {
            request_data.data += chunk;
        });
        req.on('end', () => {
            let recv_date;
            try {
                recv_date = JSON.parse(request_data.data);
                if (!request_data.data) {
                    common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
                }
                else {
                    //global.logger.debug('command TYPE:%d COMMAND:%s', recv_date.TYPE, recv_date.COMMAND);
                    switch (recv_date.TYPE) {
                        case 1: //kick 
                            {
                                if (recv_date.COMMAND == "0") { //all user kick 
                                    /*
                                    LobbyGlobal.G_Lobby_Users.forEach(function (value , key) {
                                        value._SOCKET.disconnect(true);
                                    });
                                    */
                                    //���Ḹ �Ǿ��ִ� ���ϵ鵵 ���� (LobbyGlobal.G_Lobby_Users) �� �ʱ� connect ������ ���� �׷��� �Ʒ�ó�� ��ü�� �����ؾ���
                                    let sockets = Server_Global.g_server.sockets.sockets;
                                    for (let socketId in sockets)
                                        sockets[socketId].disconnect(true);
                                }
                                else { //target user kick 
                                    if (Server_Global.G_Server_Users.has(recv_date.COMMAND))
                                        Server_Global.G_Server_Users.get(recv_date.COMMAND)._SOCKET.disconnect(true);
                                }
                                common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SUCC);
                            }
                            break;
                        case 100: //server moniter status (���� üũ)
                            {
                                common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SUCC);
                                // LobbyGlobal.g_server.sockets.clients.length
                                //global.logger.debug("call [server moniter status]-----------------------------------------------");
                                /*
                                const Response_Data: { RETURN_V: number, NOW_USERS: number, MAX_USERS: number, MATCH_PLAY_USERS: number } =
                                {
                                    RETURN_V: 0,
                                    NOW_USERS: monitor._total_connect,
                                    MAX_USERS: (lobby_conf._max_users - 1),
                                    MATCH_PLAY_USERS: LobbyGlobal.G_User_Match_Stay_Num

                                };
                                Web_Request_Send_Object(res, Response_Data);
                                */
                            }
                            break;
                        case 101: //�α� ����Ʈ ���� 
                            {
                                let Array_File_Item_list = new Array();
                                switch (recv_date.COMMAND) {
                                    case 'error':
                                        {
                                            common.Files_Get_Walk_Sync(Server_Conf.Server_Log._Error_log_Path, function (filePath, stat) {
                                                Array_File_Item_list.push(filePath);
                                            });
                                        }
                                        break;
                                    case 'input':
                                        {
                                            common.Files_Get_Walk_Sync(Server_Conf.Server_Log._Input_log_Path, function (filePath, stat) {
                                                Array_File_Item_list.push(filePath);
                                            });
                                        }
                                        break;
                                    case 'output': //error log
                                        {
                                            common.Files_Get_Walk_Sync(Server_Conf.Server_Log._Output_log_Path, function (filePath, stat) {
                                                Array_File_Item_list.push(filePath);
                                            });
                                        }
                                        break;
                                }
                                let File_Info_list = { RETURN_V: 0, LOG_LIST_INFO: '' };
                                File_Info_list.LOG_LIST_INFO = Array_File_Item_list.reverse(); //�ڿ��� ���� 
                                common.Web_Request_Send_Object(res, File_Info_list);
                            }
                            break;
                        case 102: //�α� ����  ���� 
                            {
                                //console.log(`File_name=${Filename}  Day_Num:${Day_NUm}`);
                                common.Files_Get_Walk_Sync(Server_Conf.Server_Log._Error_log_Path, function (filePath, stat) {
                                    let Filename = Path.basename(filePath, '.log');
                                    let File_Array = Filename.substring(2).split('-');
                                    let File_date = dayjs(File_Array[0] + '-' + File_Array[1] + '-' + File_Array[2]);
                                    if (dayjs().diff(File_date, "day") > Server_Conf.Server_Log._LOG_DEL_DAY_TIME) {
                                        //�α� ���� 
                                        fs.unlink(filePath, function (err) {
                                            if (err) {
                                                global.logger_error.error(`File_name=${Filename}  file deleted`);
                                                throw err;
                                            }
                                        });
                                    }
                                });
                                common.Files_Get_Walk_Sync(Server_Conf.Server_Log._Input_log_Path, function (filePath, stat) {
                                    let Filename = Path.basename(filePath, '.log');
                                    let File_Array = Filename.substring(2).split('-');
                                    let File_date = dayjs(File_Array[0] + '-' + File_Array[1] + '-' + File_Array[2]);
                                    if (dayjs().diff(File_date, "day") > Server_Conf.Server_Log._LOG_DEL_DAY_TIME) {
                                        //�α� ���� 
                                        fs.unlink(filePath, function (err) {
                                            if (err) {
                                                global.logger_error.error(`File_name=${Filename}  file deleted`);
                                                throw err;
                                            }
                                        });
                                    }
                                });
                                common.Files_Get_Walk_Sync(Server_Conf.Server_Log._Output_log_Path, function (filePath, stat) {
                                    let Filename = Path.basename(filePath, '.log');
                                    let File_Array = Filename.substring(2).split('-');
                                    let File_date = dayjs(File_Array[0] + '-' + File_Array[1] + '-' + File_Array[2]);
                                    if (dayjs().diff(File_date, "day") > Server_Conf.Server_Log._LOG_DEL_DAY_TIME) {
                                        //�α� ���� 
                                        fs.unlink(filePath, function (err) {
                                            if (err) {
                                                global.logger_error.error(`File_name=${Filename}  file deleted`);
                                                throw err;
                                            }
                                        });
                                    }
                                });
                                common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SUCC);
                                /*
                                switch (recv_date.COMMAND) {

                                    case 'error':
                                        {
                                            res.sendFile(Server_Conf.Server_Log._Error_log_Path + recv_date.FILE_NAME);
                                        } break;
                                    case 'input':
                                        {
                                            res.sendFile(Server_Conf.Server_Log._Input_log_Path +  recv_date.FILE_NAME);
                                        } break;
                                    case 'output': //error log
                                        {
                                            res.sendFile(Server_Conf.Server_Log._Output_log_Path + recv_date.FILE_NAME);
                                        } break;
                                }
                                */
                            }
                            break;
                        case 200: //server moniter status users info
                            {
                                let Array_User_Item_Info_list = new Array();
                                let User_Info_list = { RETURN_V: 0, USERS_INFO: '' };
                                Server_Global.G_Server_Users.forEach(function (value, key) {
                                    let item = {
                                        ACC_ID: value._ACC_ID,
                                        GAME_ID: value._GAME_ID,
                                        GAME_NICK: '0',
                                        IP_ADDRESS: value._SOCKET['remoteAddress']
                                    };
                                    Array_User_Item_Info_list.push(item);
                                });
                                User_Info_list.USERS_INFO = Array_User_Item_Info_list;
                                common.Web_Request_Send_Object(res, User_Info_list);
                            }
                            break;
                        case 300: //server log setting 
                            {
                                switch (recv_date.COMMAND) {
                                    case 10: //���� debug log off 
                                        {
                                            if (Server_Conf.Server_Log._Default_log_Able)
                                                Server_Conf.Server_Log._Default_log_Able = 0;
                                        }
                                        break;
                                    case 11: //���� Input log off 
                                        {
                                            if (Server_Conf.Server_Log._Input_log_Able)
                                                Server_Conf.Server_Log._Input_log_Able = 0;
                                        }
                                        break;
                                    case 12: //���� Output log off 
                                        {
                                            if (Server_Conf.Server_Log._Output_log_Able)
                                                Server_Conf.Server_Log._Output_log_Able = 0;
                                        }
                                        break;
                                    case 13: //���� All log off 
                                        {
                                            if (Server_Conf.Server_Log._Default_log_Able)
                                                Server_Conf.Server_Log._Default_log_Able = 0;
                                            if (Server_Conf.Server_Log._Input_log_Able)
                                                Server_Conf.Server_Log._Input_log_Able = 0;
                                            if (Server_Conf.Server_Log._Output_log_Able)
                                                Server_Conf.Server_Log._Output_log_Able = 0;
                                        }
                                        break;
                                    case 14: //���� debug log on 
                                        {
                                            if (!Server_Conf.Server_Log._Default_log_Able)
                                                Server_Conf.Server_Log._Default_log_Able = 1;
                                        }
                                        break;
                                    case 15: //���� Input log on 
                                        {
                                            if (!Server_Conf.Server_Log._Input_log_Able)
                                                Server_Conf.Server_Log._Input_log_Able = 1;
                                        }
                                        break;
                                    case 16: //���� Output log on 
                                        {
                                            if (!Server_Conf.Server_Log._Output_log_Able)
                                                Server_Conf.Server_Log._Output_log_Able = 1;
                                        }
                                        break;
                                    case 17: //���� All log on
                                        {
                                            if (!Server_Conf.Server_Log._Default_log_Able)
                                                Server_Conf.Server_Log._Default_log_Able = 1;
                                            if (!Server_Conf.Server_Log._Input_log_Able)
                                                Server_Conf.Server_Log._Input_log_Able = 1;
                                            if (!Server_Conf.Server_Log._Output_log_Able)
                                                Server_Conf.Server_Log._Output_log_Able = 1;
                                        }
                                        break;
                                    default:
                                        {
                                            //logger_input.Debug($"<{Channel}><{GameRequest_Info_Data.EVENT_ID}>");
                                        }
                                        break;
                                }
                                common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SUCC);
                            }
                            break;
                    }
                }
            }
            catch (error) {
                common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
            }
        });
        req.on('error', err => {
            common.Web_Request_Send_Return(res, CommonGlobal.GlOBAL_ERROR.SERVER_SYSTEM_ERROR);
        });
    });
    //add error handler
    Server_Global.server.on("error", onError);
    //start listening on port
    Server_Global.server.on("listening", onListening);
    Server_Global.g_server.on('connection', function (socket) {
        /*
        monitor._total_connect++;
        analysis_ccu._Now_Connect_Num = monitor._total_connect;

        if (analysis_ccu._Now_Connect_Num > analysis_ccu._Max_Connect_Num)
            analysis_ccu._Max_Connect_Num = analysis_ccu._Now_Connect_Num;
          
       */
        let remote_Address = '0';
        let remote_port = '0';
        var sHeaders = socket.handshake.headers;
        if (sHeaders.hasOwnProperty('x-forwarded-for')) {
            remote_Address = sHeaders['x-forwarded-for']; //  �� ip 
        }
        else {
            remote_Address = socket.request.connection._peername.address;
        }
        if (sHeaders.hasOwnProperty('x-forwarded-port')) {
            remote_port = sHeaders['x-forwarded-port']; //  �� ip 
        }
        else {
            remote_port = socket.request.connection._peername.port;
        }
        //socket['remoteAddress'] = socket.request.connection._peername.address;
        //socket['remotePort'] = socket.request.connection._peername.port;
        socket['remoteAddress'] = remote_Address;
        socket['remotePort'] = remote_port;
        //global.logger.debug("[connection] socket.id : " + socket.id);
        //global.logger.debug('[remoteAddress] : ', socket['remoteAddress']);
        //global.logger.debug('[remotePort] : ', socket['remotePort']);
        Server_Global.server.getConnections(function (err, count) {
            //http server �� http �� ������ �ϰ� �ִ� ���ǵ����Ե� (�� ���� ������ �ȴ�)
            //global.logger.debug('Connections:%d ', count);
            if (count < Server_Conf.Server_config._max_users) {
                if (Server_Conf.Server_Log._Default_log_Able)
                    global.logger.debug('Connections:%d socket.id:%s remoteAddress :%s remotePort :%d ', count, socket.id, socket['remoteAddress'], socket['remotePort']);
                //Member_process.Register_Account_ping_info(socket);
                //Member_process.Register_Account_pong_info(socket);
                Member_process.Register_Event(socket, Server_Conf.Server_config._Api_host); //��� ���� �̺�Ʈ ���� 
                Community_process.Register_Event(socket, Server_Conf.Server_config._Api_host); //Ŀ�´�Ƽ ���� �̺�Ʈ ���� 
                //Item_process.Register_Event(socket, Server_Conf.Server_config._Api_host);             //������ ���� �̺�Ʈ ���� (������)
                //Match_process.Register_Event(socket, Server_Conf.Server_config._Api_host);            //��ġ ���� �̺�Ʈ ���� (������ - ������ �񵿱�� �� ��ȯ <Ŭ���ݰ��ó��> )
                //League_process.Register_Event(socket, Server_Conf.Server_config._Api_host);           //���� ���� �̺�Ʈ ���� (������)
                RegisterDisconnect(socket); //�� ������ �̺�Ʈ ���� 
            }
            else {
                socket.disconnect(true); //���� ���ѿ� ���� ���� ����
            }
        });
    });
}
/**************************************************************************************
 *  PROCESS EVENT
 * ********************************************************************************* */
/**************************************************************************************
 *  I0 EVENT
 * ********************************************************************************* */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            //console.error(bind + " requires elevated privileges");
            global.logger_error.error("requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            //console.error(bind + " is already in use");
            global.logger_error.error("is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    //global.logger.debug('[COMMUNITY-START SERVER] Server_Name:%s Match_Server:%s ', Server_Conf.Server_config._Server_Name, Server_Conf.Server_config._Match_Server);
    global.logger_input.debug('[COMMUNITY-START SERVER]  Server_Name:%s Get_Match:%s  address:%s port:%d family:%s ', Server_Conf.Server_config._Server_Name, Server_Conf.Server_config._Match_Server, Server_Global.server.address().address, Server_Global.server.address().port, Server_Global.server.address().family);
    global.logger_output.debug('[COMMUNITY-START SERVER] Server_Name:%s Get_Match:%s address:%s port:%d family:%s ', Server_Conf.Server_config._Server_Name, Server_Conf.Server_config._Match_Server, Server_Global.server.address().address, Server_Global.server.address().port, Server_Global.server.address().family);
    global.logger_error.debug('[COMMUNITY-START SERVER]  Server_Name:%s Get_Match:%s  address:%s port:%d family:%s ', Server_Conf.Server_config._Server_Name, Server_Conf.Server_config._Match_Server, Server_Global.server.address().address, Server_Global.server.address().port, Server_Global.server.address().family);
}
function RegisterDisconnect(socket) {
    socket.on('disconnect', function () {
        //monitor._total_connect--;
        //analysis_ccu._Now_Connect_Num = monitor._total_connect;
        if (socket['ACC_UKEY'] != undefined) {
            /*
            if (LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY'])._USER_STATE == LobbyGlobal.eUserState.match_stay)
            {
                //���� ��ġ ���� Ȯ��
                let U_MATCH_ID: string = LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY'])._MATCH_ID;

                //��ġ ���� ���� ���� ó��
                LobbyGlobal.G_Lobby_Matchs.get(U_MATCH_ID).User_Match_Leave(LobbyGlobal.G_Lobby_Users.get(socket['ACC_UKEY']));

                global.logger.debug('[JOINING MATCH LEAVE] U_MATCH_ID:%s  ', U_MATCH_ID);

                if (!LobbyGlobal.G_Lobby_Matchs.get(U_MATCH_ID).Get_Match_Real_User_num()) {

                    global.logger.debug('[JOINING MATCH DELETE] U_MATCH_ID:%s  ', U_MATCH_ID);

                    //������ ���� ���� ��ġ ���� �ؾ���
                    LobbyGlobal.G_Lobby_Matchs.get(U_MATCH_ID).Clear_Match();
                    LobbyGlobal.G_Lobby_Matchs.delete(U_MATCH_ID);

                    //��ġ ����Ÿ �ʱ�ȭ
                    if (LobbyGlobal.G_Entry_Match_ID.Entry_Match_ID == U_MATCH_ID)
                        LobbyGlobal.G_Entry_Match_ID.Entry_Match_ID = '0';
                }

            }//END
            */
            //������ ����Ǵ� ��쿡 ���� ���� ���� 
            Member_process.Registert_Account_DisConnect_Info(socket['ACC_UKEY'], Server_Conf.Server_config._Api_host);
            // ��ġ ������ ���� ���� ���� ( ��ġ ���� ��� ���� )
            //Match_process.Registert_Match_Common_Game_DisConnect_Info(socket['ACC_UKEY']);
            Server_Global.G_Server_Users.delete(socket['ACC_UKEY']);
            if (Server_Conf.Server_Log._Default_log_Able)
                global.logger.debug(`Disconnect SecketID=${socket.id} UK=${socket['ACC_UKEY']} ACC_ID:${socket['ACC_ID']} NOW_USES:${Server_Global.G_Server_Users.size}`);
        }
        else {
            if (Server_Conf.Server_Log._Default_log_Able)
                global.logger.debug(`Disconnect SecketID=${socket.id}`);
        }
        //monitor._disconnect++;
        //�� ��Ĺ�� �� �ʿ�
        /*
        g_users.delete(socket.id);
        monitor._disconnect++;
        global.logger.debug("Disconnect");
        */
    });
}
/**************************************************************************************
 * ���� sub, pub
 * ********************************************************************************* */
function Redis_Client_Connect() {
    global.logger_input.debug('Redis_Client_Connect');
}
function Redis_Sub_Connect() {
    global.logger_input.debug('Redis_Sub_Connect');
}
function Redis_Pub_Connect() {
    global.logger_input.debug('Redis_Pub_Connect');
}
function Redis_Client_Error(error) {
    global.logger_error.error('Redis_Client Error', error);
}
function Redis_Sub_Error(error) {
    global.logger_error.error('Redis_Sub Error', error);
}
function Redis_Pub_Error(error) {
    global.logger_error.error('Redis_Pub Error', error);
}
/**************************************************************************************
 * ���� sub, pub
 * ********************************************************************************* */
//# sourceMappingURL=server.js.map