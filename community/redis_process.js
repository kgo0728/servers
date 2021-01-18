"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_Global = require("./server_globals");
const Redis_evnet_Account = require("./redis_event_account");
const Redis_evnet_User = require("./redis_event_user");
const Redis_evnet_System = require("./redis_event_system");
/**************************************************************************************
 * Redis sub ���� �̺�Ʈ ���
 * ********************************************************************************* */
function Register_Subscriptions() {
    Redis_evnet_Account.Register_Event_Subscriptions();
    //Redis_evnet_Match.Register_Event_Subscriptions();
    //Redis_evnet_League.Register_Event_Subscriptions();
    //Redis_evnet_Item.Register_Event_Subscriptions();
    Redis_evnet_User.Register_Event_Subscriptions();
    Redis_evnet_System.Register_Event_Subscriptions();
    //�޼��� ����
    Server_Global.g_redis_sub.on("message", function (channel, message) {
        if (Server_Global.G_redis_sub_MsgListener.has(channel)) {
            Server_Global.G_redis_sub_MsgListener.get(channel).call(Server_Global.G_redis_sub_Call_Param, channel, message);
        }
    });
}
exports.Register_Subscriptions = Register_Subscriptions;
//# sourceMappingURL=redis_process.js.map