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
});

chrome.runtime.onMessage.addListener(function(params, sender, sendResponse) {
    sendResponse('我收到了你的消息！');

    // 将图片转换为Base64
    function getImgToBase64(url,callback){
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0);
            var dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
            canvas = null;
        };
        try {
            img.src = url;
        } catch (e) {
            console.log(e)
        }
    }
    // 将base64转换为文件对象
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length; 
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        // 转换成file对象
        return new File([u8arr], filename, {type:mime});
        // 转换成成blob对象
        // return new Blob([u8arr],{type:mime});
    }
    // 将图片转换为base64,再将base64转换成file对象
    var imgUrl = params.srcUrl;
    var fileName = location.hostname + '/' + new Date().getTime();
    getImgToBase64(imgUrl,function(data){
        var myFile = dataURLtoFile(data, fileName);
        console.log(myFile)
        uploadFile(myFile, fileName);
    });

    function uploadFile(file, key) {
        var options = {
            Method: 'PUT',
            Key: key,
        }
        $.post('http://0.0.0.0:3000/global/getSignature', options).then(res => {
            const info = res.data
            const { url, Authorization } = info
            const xhr = new XMLHttpRequest()
            xhr.open('PUT', url, true)
            xhr.setRequestHeader('Authorization', Authorization)
            xhr.setRequestHeader('x-cos-acl', 'public-read')
            xhr.send(file)
        })
    }
})