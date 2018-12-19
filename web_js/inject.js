// 向content-script主动发送消息(三种方法):
// 通过postMessage调用content-script
function invokeContentScript(code) {
    window.postMessage({ cmd: 'invoke', code: code }, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data) {
    window.postMessage({ cmd: 'message', data: data }, '*');
}
// 通过DOM事件发送消息给content-script
(function() {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('myCustomEvent', true, true);
    // 通过事件发送消息给content-script
    function sendMessageToContentScriptByEvent(data) {
        data = data || '你好，我是injected-script!';
        var hiddenDiv = document.getElementById('myCustomEventDiv');
        hiddenDiv.innerText = data
        hiddenDiv.dispatchEvent(customEvent);
    }
    window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
})();

// 新增 clown 方法
(() => {
    window.devtoolsFormatters = [{
        header: function(obj) {
            if (!obj.__clown) {
                return null;
            }
            delete obj.__clown;
            const style = `
                color: red;
                border: dotted 2px gray;
                border-radius: 4px;
                padding: 5px;
            `;
            const content = `🤡 ${JSON.stringify(obj, null, 2)}`;

            try {
                return ['div', { style }, content]
            } catch (err) { // for circular structures
                return null;  // use the default formatter
            }
        },
        hasBody: function() {
            return false;
        }
    }]

    function clown(obj) {
        console.log({ ...obj, __clown: true });
    }

    window.clown = clown;

    clown({ message: '欢迎使用nfeng-chrome-plugin' });
})();

// 设置默认的 autofill data
(() => {
    var aValue = localStorage.getItem('data-autofill');
    if (!aValue) {
        var data = {
            "name": "John Doe",
            "email": "johndoe@mail.com",
            "lovejquery": "yes",
            "username": "John Doe",
            "password": "123456"
        };
        localStorage.setItem("data-autofill", JSON.stringify(data));
    }
})();
