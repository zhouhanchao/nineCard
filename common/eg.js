var websocket = window.WebSocket || window.MozWebSocket;
var isConnected = false;

function doOpen() {
    isConnected = true;
    if (deviceType == 'B') {
        mapArea = 'mapB';
        doLoginB(mapArea);
    }
    else {
        mapArea = 'mapA';
        doLoginA(mapArea);
    }
}

function doClose() {
    showDiagMsg("infoField", "已经断开连接", "infoDialog");
    isConnected = false;
}

function doError() {
    showDiagMsg("infoField", "连接异常!", "infoDialog");
    isConnected = false;
}

function doMessage(message) {
    var event = $.parseJSON(message.data);
    doReciveEvent(event);
}

function doSend(message) {
    if (websocket != null) {
        websocket.send(JSON.stringify(message));
    }
    else {
        showDiagMsg("infoField", "您已经掉线，无法与服务器通信!", "infoDialog");
    }
}
//初始话 WebSocket
function initWebSocket(wcUrl) {
    if (window.WebSocket) {
        websocket = new WebSocket(encodeURI(wcUrl));
        websocket.onopen = doOpen;
        websocket.onerror = doError;
        websocket.onclose = doClose;
        websocket.onmessage = doMessage;
    }
    else {
        showDiagMsg("infoField", "您的设备不支持 webSocket!", "infoDialog");
    }
};
initWebSocket("ws://echo.websocket.org");

function doReciveEvent(event) {
    //设备不存在，客户端断开连接
    if (event.eventType == 101) {
        showDiagMsg("infoField", "设备不存在或设备号密码错!", "infoDialog");
        websocket.close();
    }
    //返回组设备及计算目标位置信息，更新地图
    else if (event.eventType == 104 || event.eventType == 103) {
        clearGMapOverlays(mapB);
        $.each(event.eventObjs, function (idx, item) {
            var deviceNm = item.deviceNm;
            //google api
            // var deviceLocale = new google.maps.LatLng(item.lag,item.lat);
            //baidu api
            var deviceLocale = new BMap.Point(item.lng, item.lat);
            var newMarker;
            if (item.status == 'target') {
                newMarker = addMarkToMap(mapB, deviceLocale, deviceNm, true);
                //…以下代码省略
            }
            else {
                newMarker = addMarkToMap(mapB, deviceLocale, deviceNm);
            }
            markArray.push(newMarker);
        });
        showDiagMsg("infoField", "有新报修设备或设备离线, 地图已更新！", "infoDialog");
    }
}