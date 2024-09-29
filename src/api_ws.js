class WSClient {
    constructor(url, callbacks) {
        this.url = url;
        this.callbacks = callbacks;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectDelay = 5000; // 5 seconds
        this.initialReconnectDelay = 1000; // 1 second
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener('open', this.onOpen.bind(this));
        this.ws.addEventListener('close', this.onClose.bind(this));
        this.ws.addEventListener('message', this.onMessage.bind(this));
        this.ws.addEventListener('error', this.onError.bind(this));
    }

    #send_json(json){
        this.ws.send(JSON.stringify(json));
    }
    msg(action, topic, params){
        var msg ={action: action, topic: topic}
        if (params) {
            msg.params = params
        }
        this.#send_json(msg);
    }

    onOpen(event) {
        console.log('WebSocket connection established');
        this.callbacks.onOpen();
        this.callbacks.onEvent({eventName: "api.connected"});
        this.reconnectAttempts = 0;
    }

    onClose(event) {
        console.log('WebSocket connection closed');
        this.callbacks.onEvent({eventName: "api.disconnected"});
        this.reconnect();
    }

    onMessage(event) {
        console.log('Websocket message received', JSON.parse(event.data));
        this.callbacks.onEvent(JSON.parse(event.data))
    }

    onError(error) {
        console.error('WebSocket error:', error);
    }

    reconnect() {
        const delay = Math.min(
            this.initialReconnectDelay * Math.pow(2, this.reconnectAttempts),
            this.maxReconnectDelay
        );

        console.log(`Attempting to reconnect in ${delay}ms...`);

        setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }
}
class APIClient {
    constructor(callbacks) {
        this.hostport = '127.0.0.1:3000'
        this.callbacks = callbacks
        this.wsClient = new WSClient('ws://'+this.hostport+'/stream', {
            onOpen: ()=>{
                this.wsClient
                this.subscribe('connection');
                this.subscribe('chain');
                // this.o;
            },
            onEvent: this.callbacks.onEvent
        })
        this.wsClient.connect();
    }

    subscribe(topic, params){
        this.wsClient.msg("subscribe", topic, params)
    }
    unsubscribe(topic, params){
        this.wsClient.msg("unsubscribe", topic, params)
    }
    get(path){
        return new Promise((resolve, reject) => {
            var url = 'http://'+this.hostport+path;
            console.log("GET", url)
            fetch(url).then((res)=> res.json())
            .then((json) =>{
                console.log("GET result:", json);
                resolve(json)
            })
        });
    }
    post(path, params){
        return new Promise((resolve, reject) => {
            var url = 'http://'+this.hostport+path;
            console.log("POST", url)
            fetch(url, {
                method: "POST",
                body: JSON.stringify(params),
            }).then((res)=> res.json())
            .then((json) =>{
                console.log("POST result:", json);
                resolve(json)
            })
        });
    }
}
