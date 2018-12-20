chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if (request.cmd == 'autofill') {
        var aValue = JSON.parse(localStorage.getItem('Autofill'));
        $.fn.autofill(aValue);
        sendResponse('我收到了你的消息！');
    }
});

chrome.runtime.onMessage.addListener(function({action, value}, sender, sendResponse) {
    if (action === 'getStorage') {
        sendResponse(localStorage.getItem('Autofill'))
    }
    if (action === 'setStorage') {
        if (!value) {
            sendResponse('设置失败！');
        } else {
            localStorage.setItem('Autofill', value);
            sendResponse('设置成功！');
        }
    }
})