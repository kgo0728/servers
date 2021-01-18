"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eServiceType;
(function (eServiceType) {
    eServiceType[eServiceType["Develop"] = 0] = "Develop";
    eServiceType[eServiceType["Test"] = 1] = "Test";
    eServiceType[eServiceType["Service"] = 2] = "Service";
})(eServiceType = exports.eServiceType || (exports.eServiceType = {}));
let g_service_type = eServiceType.Develop;
exports.Server_Log = {
    _Default_log_Able: 1,
    _Input_log_Able: 1,
    _Output_log_Able: 1,
    _Error_log_Able: 1,
    _Input_log_Path: '0',
    _Output_log_Path: '0',
    _Error_log_Path: '0',
    _LOG_DEL_DAY_TIME: 7
};
//�۷ι� �޸� ���� 
/*
export let Server_config:
    {
        _Server_Name: string,
        _Server_Name_Unique: string,
        _port: number,
        _Match_Server: string,
        _max_users: number,
        _Packet_Encrypt: number,    //��ȣȭ

        _Api_host: string,
        _Redis_Ip: string,
        _Redis_Port: number,
        _Redis_connect_timeout: number,
    } =
    {
        _Server_Name: 'Community1',     //�⺻ ����Ʈ
        _Server_Name_Unique: '' ,
        _port: 35555,
        _Match_Server: 'Match1',        //�⺻ ����Ʈ
        _max_users: 5001,
        _Packet_Encrypt: 0,    //��ȣȭ
        _Api_host: 'http://127.0.0.1:33333',
        _Redis_Ip: '127.0.0.1',
        _Redis_Port: 6379,
        _Redis_connect_timeout: 0,

    };
*/
//���� �޸� ����
exports.Server_config = {
    _Server_Name: 'Community1',
    _Server_Name_Unique: '0',
    _port: 35555,
    _Match_Server: 'Match1',
    _max_users: 5001,
    _Packet_Encrypt: 0,
    _Api_host: 'http://127.0.0.1:33333',
    _Redis_Ip: '127.0.0.1',
    _Redis_Port: 6379,
    _Redis_connect_timeout: 0,
};
function _Set_Service_Type_Init() {
    if (g_service_type == eServiceType.Develop) {
        exports.Server_config._Api_host = 'http://127.0.0.1:33333';
        exports.Server_config._Redis_Ip = '127.0.0.1';
    }
    else if (g_service_type == eServiceType.Test) {
        exports.Server_config._Api_host = 'http://127.0.0.2:33333';
        exports.Server_config._Redis_Ip = '127.0.0.2';
    }
    else if (g_service_type == eServiceType.Service) {
        exports.Server_config._Api_host = 'http://127.0.0.3:33333';
        exports.Server_config._Redis_Ip = '127.0.0.3';
    }
}
exports._Set_Service_Type_Init = _Set_Service_Type_Init;
;
/*
if (g_service_type == eServiceType.Develop)
{
    Server_config._Api_host = 'http://127.0.0.1:33333';
    Server_config._Redis_Ip = '127.0.0.1';
}
else if (g_service_type == eServiceType.Test)
{
    Server_config._Api_host = 'http://127.0.0.2:33333';
    Server_config._Redis_Ip = '127.0.0.2';
}
else if (g_service_type == eServiceType.Service) {
    Server_config._Api_host = 'http://127.0.0.3:33333';
    Server_config._Redis_Ip = '127.0.0.3';
}
*/
/*
export class Server_Config {


    _port: number;
    _max_users: number;

    _event_get_EC2IP: string;
    _event_device_check: string;
    _event_login: string;
    _event_myinfo: string;
    _event_myinventory: string;
    _event_change_character: string;
    _event_change_effect: string;
    _event_change_ceremony: string;
    _event_free_charge_info: string;
    _event_free_charge: string;
    _event_select_queue: string;
    _event_buy_product: string;
    _event_refresh_token: string;
    _event_get_developer_payload: string;
    _event_validate_developer_payload: string;
    _event_refresh_refund: string;
    _event_buy_item: string;
    _event_refresh_user_token: string;


    constructor() {

        let temp: Server_Config = this;

        this._port = 33333;
        this._max_users = 5001;                  //5000 ������ ����



        this._event_get_EC2IP = "GetEC2IP";
        this._event_device_check = "DeviceCheck";
        this._event_login = "Login";
        this._event_myinfo = "MyInfo";
        this._event_myinventory = "MyInventory";
        this._event_change_character = "ChangeCharacter";
        this._event_change_effect = "ChangeEffect";
        this._event_change_ceremony = "ChangeCeremony";
        this._event_free_charge_info = "FreeChargeInfo";
        this._event_free_charge = "FreeCharge";
        this._event_select_queue = "SelectQueue";
        this._event_buy_product = "BuyProduct";
        this._event_refresh_token = "RefreshToken";
        this._event_get_developer_payload = "GetDeveloperPayload";
        this._event_validate_developer_payload = "ValidateDeveloperPayload";
        this._event_refresh_refund = "RefreshRefund";
        this._event_buy_item = "BuyItem";
        this._event_refresh_user_token = "RefreshUserToken";
    }
}

*/ 
//# sourceMappingURL=server_config.js.map