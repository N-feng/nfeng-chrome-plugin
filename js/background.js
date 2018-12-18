chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开百度才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'baidu.com' } })
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

chrome.contextMenus.create({
	title: '谷歌搜索：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params) {
		// 注意不能使用location.href，因为location是属于background的window对象
		chrome.tabs.create({ url: 'https://www.google.com.tw/search?q=' + encodeURI(params.selectionText) });
	}
});

chrome.contextMenus.create({
	title: '度娘搜索：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params) {
		// 注意不能使用location.href，因为location是属于background的window对象
		chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText) });
	}
});

chrome.contextMenus.create({
	title: '度娘翻译：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params) {
		let value = params.selectionText;
		if (/^[A-Za-z]+$/.test(value)) {
			openUrlNextTab('https://fanyi.baidu.com/?#en/zh/' + value);
		}
		if (/^[\u4e00-\u9fa5]+$/.test(value)) {
			openUrlNextTab('https://fanyi.baidu.com/?#zh/en/' + value);
		}
	}
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});

// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	console.log('inputChanged: ' + text);
	if (!text) return;
	if (text == '美女') {
		suggest([
			{ content: '中国' + text, description: '你要找“中国美女”吗？' },
			{ content: '日本' + text, description: '你要找“日本美女”吗？' },
			{ content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？' },
			{ content: '韩国' + text, description: '你要找“韩国美女”吗？' }
		]);
	}
	else if (text == '微博') {
		suggest([
			{ content: '新浪' + text, description: '新浪' + text },
			{ content: '腾讯' + text, description: '腾讯' + text },
			{ content: '搜狐' + text, description: '搜索' + text },
		]);
	}
	else {
		suggest([
			{ content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text },
			{ content: '度娘搜索 ' + text, description: '度娘搜索 ' + text },
			{ content: '度娘翻译 ' + text, description: '度娘翻译 ' + text },
		]);
	}
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
	console.log('inputEntered: ' + text);
	if (!text) return;
	var href = '';
	if (text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
	else if (text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
	else if (text.startsWith('度娘搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
	else if (text.startsWith('度娘翻译')) {
		let value = text.replace('度娘翻译 ', '');
		if (/^[A-Za-z]+$/.test(value)) {
			href = 'https://fanyi.baidu.com/?#en/zh/' + value;
		}
		if (/^[\u4e00-\u9fa5]+$/.test(value)) {
			href = 'https://fanyi.baidu.com/?#zh/en/' + value;
		}
	}
	else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
	openUrlCurrentTab(href);
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

// 获取当前选项卡index
function getCurrentTabIndex(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		if (callback) callback(tabs.length ? tabs[0].index : null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, { url: url });
	})
}

// 下个标签打开某个连接
function openUrlNextTab(url) {
	getCurrentTabIndex(index => {
		chrome.tabs.create({index: index + 1, url: url});
	})
}
