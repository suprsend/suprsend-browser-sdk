"use strict"

// suprsend sdk related constants
var constants={
    distinct_id:"_suprsend_dist_id"
}

// suprsend sdk related config
var config = {
    api_url:"https://collector.suprsend.workers.dev"
}

// suprsend sdk related util functions
var utils={
uuid:function (){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
},
set_cookie:function(name,value,days=365) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
},
get_cookie:function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
},
remove_cookie: function(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
}

// api calls function
function call_api(body){
fetch(config.api_url, {method:"post",body: JSON.stringify(body)})
    .then(()=>console.log("success"))
    .catch(err=>console.log("error occured", err))
}

// initializing supersend library function
function SuprSend(){}
var suprSendInstance;

function create_instance(ENV_API_Key){
    var anon_id=utils.get_cookie(constants.distinct_id);
    if(!anon_id){
       anon_id = utils.uuid();
       utils.set_cookie(constants.distinct_id,anon_id);
    }
    
    if(suprSendInstance){
        console.log("SuprSend instance is already initialized");
        suprSendInstance.distinct_id=utils.get_cookie(constants.distinct_id);
        return suprSendInstance
    }
    suprSendInstance={ENV_API_Key:ENV_API_Key, distinct_id:utils.get_cookie(constants.distinct_id)};
    return suprSendInstance
}

SuprSend.prototype.getInstance =function(ENV_API_Key) {
    create_instance(ENV_API_Key);
}

SuprSend.prototype.identify=function(unique_id){
    call_api({
        ENV_API_Key:suprSendInstance.ENV_API_Key,
        event:"identify",
        properties:{
            identified_id:unique_id,
            anon_id:suprSendInstance.distinct_id
        }});
}

module.exports = new SuprSend()