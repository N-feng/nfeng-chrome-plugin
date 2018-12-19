chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if (request.cmd == 'autofill') {
        // console.log(request.value);

        $.fn.autofill(data);
    }
    sendResponse('我收到了你的消息！');
});