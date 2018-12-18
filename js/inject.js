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
      `
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

console.clown = function(obj) {
    console.log({ ...obj, __clown: true });
}
