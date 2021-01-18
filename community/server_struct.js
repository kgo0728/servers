"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//��ġ �۷ι� ���� ID 
exports.G_Entry_Match_ID = {
    Entry_Match_ID: '0',
};
//module.exports = abbbbbb;
exports.G_MatchPoint = {
    Win_Point: 100,
    Lose_Point: 10,
    Draw_Min_Point: 1,
    Draw_Max_Point: 99,
    Ads_show_add_Per: 50 //�������� �� ���� 50% �߰� 
};
var eUserState;
(function (eUserState) {
    eUserState[eUserState["lobby_stay"] = 0] = "lobby_stay";
    eUserState[eUserState["match_stay"] = 1] = "match_stay";
    eUserState[eUserState["Multi_stay"] = 2] = "Multi_stay";
})(eUserState = exports.eUserState || (exports.eUserState = {}));
var eMulti_Type;
(function (eMulti_Type) {
    eMulti_Type[eMulti_Type["None"] = 0] = "None";
    eMulti_Type[eMulti_Type["Battle_Dual_1_1"] = 1] = "Battle_Dual_1_1";
    eMulti_Type[eMulti_Type["Battle_Survival_5"] = 2] = "Battle_Survival_5";
})(eMulti_Type = exports.eMulti_Type || (exports.eMulti_Type = {}));
var eMulti_R_State;
(function (eMulti_R_State) {
    eMulti_R_State[eMulti_R_State["Ready"] = 0] = "Ready";
    eMulti_R_State[eMulti_R_State["ReadyToGame"] = 1] = "ReadyToGame";
    eMulti_R_State[eMulti_R_State["Game"] = 2] = "Game";
    eMulti_R_State[eMulti_R_State["GameToClose"] = 3] = "GameToClose";
    eMulti_R_State[eMulti_R_State["Close"] = 4] = "Close";
    eMulti_R_State[eMulti_R_State["CloseToReady"] = 5] = "CloseToReady";
})(eMulti_R_State = exports.eMulti_R_State || (exports.eMulti_R_State = {}));
var eMulti_U_State;
(function (eMulti_U_State) {
    eMulti_U_State[eMulti_U_State["waiting"] = 0] = "waiting";
    eMulti_U_State[eMulti_U_State["stand_by"] = 1] = "stand_by";
    eMulti_U_State[eMulti_U_State["count_down"] = 2] = "count_down";
})(eMulti_U_State = exports.eMulti_U_State || (exports.eMulti_U_State = {}));
class TeamInfo {
    constructor() {
        this.Init();
    }
    Init() {
        this._WIN = 0;
        this._LOSE = 0;
    }
}
class ArenaInfo {
    constructor() {
        this.Init();
    }
    Init() {
        this._ARENA_START = false;
        this._ARENA_LEAVE = false;
        this._My_Deck_Info = "0";
        this._Enemy_Deck_Info = "0";
        this._MY_TEAM_SKILL = "0";
        this._ENEMY_TEAM_SKILL = "0";
        this._SERVE_TEAM = 0;
        this._REMAKEINDEX = 0;
        this._PINCHSERVE_TEAM = 0;
        this._ARENA_ID = "0";
        //this._ARENA_RESULT = "0";
        this._ARENA_SCORE = "0";
        this._ARENA_SETSCORE = "0";
        this._ARENA_WIN = 0;
        this._ARENA_RESULT_SIZE = 0;
    }
}
/*
class HonorInfo {

    _HONOR_START: boolean;  // ������ ����
    _HONOR_LEAVE: boolean;  // ������ ����

    _My_Deck_Info: string;      // �� �� ���� ����
    _Enemy_Deck_Info: string;   // �� �� ���� ����

    _MY_TEAM_SKILL: string;         // ��  �� ��ų ����
    _ENEMY_TEAM_SKILL: string;      // ����� ��ų ����
    _SERVE_TEAM: number;            // ������
    _PINCHSERVE_TEAM: number;       // ��ġ ���� ��

    _HONOR_ID: string;
    _HONOR_RESULT: string;          // ��� ����Ʈ

    _HONOR_SETSCORE: string;        // ��� ��Ʈ ���ھ� 0-0
    _HONOR_SCORE: string;           // ���ھ� 0-0|0-0|0-0
    _HONOR_WIN: number;             // �¸� �� 1: �� �¸�, 2: ���� �¸�
    _HONOR_RESULT_SIZE: number;     // ����� ������

    _MY_TEAM_POWER: number;         // �� �� �Ŀ�
    _ENEMY_TEAM_POWER: number;      // ���� �� �ǿ�


    constructor() {
        this._HONOR_START = false;
        this._HONOR_LEAVE = false;

        this._My_Deck_Info = null;
        this._Enemy_Deck_Info = null;
        this._MY_TEAM_SKILL = null;
        this._ENEMY_TEAM_SKILL = null;
        this._SERVE_TEAM = 0;
        this._PINCHSERVE_TEAM = 0;
        this._HONOR_ID = null;
        this._HONOR_RESULT = null;
        this._HONOR_SCORE = null;
        this._HONOR_SETSCORE = null;
        this._HONOR_WIN = 0;
        this._HONOR_RESULT_SIZE = 0;
        this._MY_TEAM_POWER = 0;
        this._ENEMY_TEAM_POWER = 0;
    }

    Init() {
        this._HONOR_START = false;
        this._HONOR_LEAVE = false;

        this._My_Deck_Info = "0";
        this._Enemy_Deck_Info = "0";
        this._MY_TEAM_SKILL = "0";
        this._ENEMY_TEAM_SKILL = "0";
        this._SERVE_TEAM = 0;
        this._PINCHSERVE_TEAM = 0;
        this._HONOR_ID = "0";
        this._HONOR_RESULT = "0";
        this._HONOR_SCORE = "0";
        this._HONOR_SETSCORE = "0";
        this._HONOR_WIN = 0;
        this._HONOR_RESULT_SIZE = 0;
    }
}
*/
/*
class MatchInfo {


    _MATCH_START: boolean;   //��ġ ����
    _MATCH_LEAVE: boolean;   //��ġ ����
    _TeamInfo: Array<TeamInfo>;
    _My_Deck_Info       : string;   // �� �� ���� ����
    _Enemy_Deck_Info: string;   // �� �� ���� ����

    _MATCH_ID: string;
    _MATCH_RESULT: string;
    
    constructor() {

        this._TeamInfo = new Array();
        this._TeamInfo.push(new TeamInfo());
        this._TeamInfo.push(new TeamInfo());
        //this._TeamInfo[0] = new TeamInfo();
        //this._TeamInfo[1] = new TeamInfo();
        this._MATCH_START = false;
        this._MATCH_LEAVE = false;

    }

    Init() {

        this._MATCH_START = false;
        this._MATCH_LEAVE = false;
    }
   
}
*/
class ServerUser {
    constructor(ACC_ID, GAME_ID, ACC_UKEY, SOCKET) {
        this._ACC_ID = ACC_ID;
        this._GAME_ID = GAME_ID;
        this._ACC_UKEY = ACC_UKEY;
        this._SOCKET = SOCKET;
        this._GAME_NICK = "0";
        this._ARENAINFO = new ArenaInfo();
    }
}
exports.ServerUser = ServerUser;
/*
export class LobbyUser {

    _ACC_ID: string;
    _GAME_ID: number;
    _ACC_UKEY: string;
    _SOCKET: socket_io.Socket
    _STORE_TYPE: number;

    _GAME_NICK: string;
    _TICKET: number;
    _POINT: number;   //���� �� ��
    _STRONGBOX_POINT: number;
    _BOX_TICKET: number;
    _FEVER_GAUGE: number;
    _FEVER_START: boolean;
    _USER_STATE: number;

    _MATCH_ID: string;
    _MATCH_GET_POINT: number;    //��ġ���� ���� ��
    _MATCH_START: boolean;   //��ġ ����
    _MATCH_LEAVE: boolean;   //��ġ ����
    _MATCH_RESULT: number;       //��ġ ���� ��� ����
    _MATCH_WIN_COUNT: number;    //��ġ �¸� ī��Ʈ
    _MATCH_MODE: number;         //��� ����
    _MATCH_ADD_PER_MODE: number; //��庰 �߰� ����Ʈ


    _MATCH_ABLE_TIME: string;      //��ġ�� ������ �ð�
    _MATCH_ABLE_DELAY: number;     //��ġ ������ �� �ð�

    _MATCH_FIX_ABLE_TIME: string;  //���� ����� ������ �ִ� ������ �ð�
    _MATCH_FIX_ABLE_DELAY: number;

    _ITEM_BOOSTER: string;           //������ �ν��� ��� ���� �ð�
    _ITEM_BOOSTER_ADD_PER: number;   //������ �ν��� ��� �ۼ�Ʈ ��
    _ITEM_BOOSTER_GET_POINT: number;

    _FEVER_ADD_PER: number;          //�ǹ� ��� �ۼ�Ʈ ��
    _FEVER_GET_POINT: number;

    _CHAT_SEND_TIME: number;         //������ ���� �ð�

    _MULTI_ID: string;              //��Ƽ ID
    _MULTI_TYPE: number;            //��Ƽ Ÿ�� 1 = ( 1:1[��Ʋ] )  2 = ( 5����[�����̹�] )
    _MULTI_U_STATE: number;         //��Ƽ �� ���� ����
    _MULTI_U_SLOT_NUM: number;      //��Ƽ �� ���� ���� ��ȣ

    constructor(ACC_ID: string, GAME_ID: number, ACC_UKEY: string, SOCKET: socket_io.Socket) {

        this._ACC_ID = ACC_ID;
        this._GAME_ID = GAME_ID;
        this._ACC_UKEY = ACC_UKEY;
        this._SOCKET = SOCKET;
        this._STORE_TYPE = 0;

        this._GAME_NICK = "0";
        this._TICKET = 0;
        this._POINT = 0;
        this._STRONGBOX_POINT = 0;
        this._BOX_TICKET = 0;
        this._FEVER_GAUGE = 0;
        this._FEVER_START = false;
        this._USER_STATE = eUserState.lobby_stay;

        this._ITEM_BOOSTER = G_ITEM_DATE_TIME_ZERO;
        this._ITEM_BOOSTER_ADD_PER = 0;
        this._ITEM_BOOSTER_GET_POINT = 0;

        this._FEVER_ADD_PER = 0;
        this._FEVER_GET_POINT = 0;

        this._MATCH_ID = "0";
        this._MATCH_GET_POINT = 0;
        this._MATCH_START = false;
        this._MATCH_LEAVE = false;
        this._MATCH_RESULT = 0;
        this._MATCH_WIN_COUNT = 0;

        this._MATCH_ABLE_TIME = G_ITEM_DATE_TIME_ZERO;

        this._CHAT_SEND_TIME = 0;
    }

    User_Match_Start_init() {

        this._ITEM_BOOSTER = G_ITEM_DATE_TIME_ZERO;
        this._ITEM_BOOSTER_ADD_PER = 0;
        this._ITEM_BOOSTER_GET_POINT = 0;

        this._FEVER_ADD_PER = 0;
        this._FEVER_GET_POINT = 0;
        this._FEVER_START = false;

        this._MATCH_ID = "0";
        this._MATCH_GET_POINT = 0;
        this._MATCH_START = false;
        this._MATCH_LEAVE = false;
        this._MATCH_RESULT = 0;
        this._MATCH_WIN_COUNT = 0;
        this._MATCH_MODE = 0;
        this._MATCH_ADD_PER_MODE = 0;

        this._MATCH_ABLE_DELAY = 0;
        this._MATCH_FIX_ABLE_DELAY = 0;

        this._MATCH_FIX_ABLE_TIME = G_ITEM_DATE_TIME_ZERO;
    }

    User_Multi_Start_Init() {

        this._MULTI_ID = '0';
        this._MULTI_TYPE = 0;
        this._MULTI_U_STATE = 0;
        this._MULTI_U_SLOT_NUM = -1;
    }


}

*/ 
//# sourceMappingURL=server_struct.js.map