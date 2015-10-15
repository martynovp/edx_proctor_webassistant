(function () {
    angular.module('websocket', []).factory('WS', ['$rootScope', function ($rootScope) {
        var ws, ws_msg = null;

        var init = function (subcribe, callback) {
            if (["function", "object"].indexOf(typeof window.WebSocket) >= 0)
                ws = new WebSocket(
                    'ws://' +
                    $rootScope.apiConf.ioServer +
                    '/ws/' +
                    subcribe +
                    '?subscribe-broadcast&echo'
                );
            else {
                ws = {};
            }
            ws.onopen = function () {
                console.log("Websocket connected");
            };
            ws.onmessage = function (e) {
                try {
                    ws_msg = JSON.parse(e.data);
                    callback(ws_msg);
                }
                catch (err) { }
            };
            ws.onerror = function (e) {
                console.log(e);
            };
            ws.onclose = function (e) {
                console.log("Websocket connection closed");
            };
            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                ws.close();
            });
        };

        return {
            init: init
        };
    }]);
})();