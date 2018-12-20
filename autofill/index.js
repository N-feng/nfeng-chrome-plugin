window.onload = () => {
    new Vue({
        el: '#app',
        data() {
            return {
                autofill: '',
                message: ''
            }
        },
        methods: {
            getLocalstorage(action) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
                        this.autofill = response;
                    })
                })
            },
            setLocalstorage(action, value) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action, value }, (response) => {
                        this.message = response;
                    })
                })
            },
            setautofill() {
                this.message = '';
                this.setLocalstorage('setStorage', this.autofill);
            }
        },
        ready() {
            this.getLocalstorage('getStorage');
        }
    })
}