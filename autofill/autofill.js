window.onload = () => {
    new Vue({
        el: '#app',
        data() {
            return {
                autofill: ''
            }
        },
        methods: {
            sendMessage() {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    alert(tabs[0].id)
                    chrome.tabs.sendMessage(tabs[0].id, { action, attr }, (response) => {
                        alert(response)
                    })
                })
            }
        },
        ready() {
            this.sendMessage()
        }
    })
}