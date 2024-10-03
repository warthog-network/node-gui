class WSClient {
    constructor(url, callbacks) {
        this.url = url;
        this.timer = null
        this.callbacks = callbacks;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectDelay = 5000; // 5 seconds
        this.initialReconnectDelay = 200; // 1 second
        this.reconnectOnClose = true;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener('open', this.onOpen.bind(this));
        this.ws.addEventListener('close', this.onClose.bind(this));
        this.ws.addEventListener('message', this.onMessage.bind(this));
        this.ws.addEventListener('error', this.onError.bind(this));
    }
    disconnect() {
        this.reconnectOnClose = false;
        if (this.timer != null)
            clearTimeout(this.timer);
        this.ws.disconnect();
    }

    #send_json(json) {
        this.ws.send(JSON.stringify(json));
    }
    msg(action, topic, params) {
        var msg = { action: action, topic: topic }
        if (params) {
            msg.params = params
        }
        this.#send_json(msg);
    }

    onOpen() {
        console.log('WebSocket connection established');
        this.callbacks.onOpen();
        this.callbacks.onEvent({ eventName: "api.connected" });
        this.reconnectAttempts = 0;
    }

    onClose() {
        console.log('WebSocket connection closed');
        this.callbacks.onClose();
        this.callbacks.onEvent({ eventName: "api.disconnected" });
        if (this.reconnectOnClose)
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

        this.timer = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
            this.timer = null;
        }, delay);
    }
}

class ConnectionState {
    constructor() {
        this.connections = [];
    }
    data() {
        return this.connections;
    }
    setState(state) {
        this.connections = state;
    }
    addConnection(newConnection) {
        this.connections.push(newConnection)
    }
    removeConnection(id) {
        this.connections = this.connections.filter(item => item.id !== id);
    }
}
class ChainState {
    constructor() {
        this.blocks = [];
        this.head = null
    }
    blocks() {
        return this.blocks;
    }
    latest() {
        return blocks()[-1]
    }
    setState({ latestBlocks, head }) {
        this.head = head;
        this.blocks = latestBlocks
    }
    append({ newBlocks, head }) {
        this.head = head;
        this.blocks.concat(newBlocks)
    }
    fork({ latestBlocks, head }) {
        setState({ latestBlocks, head });
    }
}

class State {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.connectionState = new ConnectionState();
        this.chainState = new ChainState();
    }
    onEvent(event) {
        switch (event.eventName) {
            case 'connection.state':
                this.connectionState.setState(event.connections);
                this.callbacks.onConnectionsChanged(this.connectionState.data());
                break;
            case 'connection.add':
                this.connectionState.addConnection(event.connection);
                this.callbacks.onConnectionsChanged(this.connectionState.data());
                break;
            case 'connection.remove':
                this.connectionState.removeConnection(event.id);
                this.callbacks.onConnectionsChanged(this.connectionState.data());
                break;
            case 'chain.state':
                this.chainState.setState(event)
                this.callbacks.onChainChanged(this.chainState);
                break;
            case 'chain.append':
                this.chainState.append(event);
                this.callbacks.onChainChanged(this.chainState);
                break;
            case 'chain.fork':
                this.chainState.fork(event)
                this.callbacks.onChainChanged(this.chainState);
                break;
            default:
                console.warn('Unknown event name', event.eventName);
        }
    }
}

class APIClient {
    constructor(callbacks) {
        this.hostport = '127.0.0.1:3000'
        this.callbacks = callbacks
        this.state = new State(callbacks)
        this.wsClient = new WSClient('ws://' + this.hostport + '/stream', {
            onOpen: () => {
                this.wsClient
                this.subscribe('connection');
                this.subscribe('chain');
                this.callbacks.onOpen();
            },
            onClose: () => {
                this.callbacks.onClose();
            },
            onEvent: this.state.onEvent.bind(this.state)
        })
        this.wsClient.connect();
    }

    subscribe(topic, params) {
        this.wsClient.msg("subscribe", topic, params)
    }
    unsubscribe(topic, params) {
        this.wsClient.msg("unsubscribe", topic, params)
    }
    get(path) {
        return new Promise((resolve) => {
            var url = 'http://' + this.hostport + path;
            console.log("GET", url)
            fetch(url).then((res) => res.json())
                .then((json) => {
                    resolve(json)
                })
        });
    }
    post(path, params) {
        return new Promise((resolve) => {
            var url = 'http://' + this.hostport + path;
            console.log("POST", url)
            fetch(url, {
                method: "POST",
                body: JSON.stringify(params),
            }).then((res) => res.json())
                .then((json) => {
                    resolve(json)
                })
        });
    }

    disconnect(id) {
        return this.get(`/peers/disconnect/${id}`)
    }
    closeConnection() {
        this.wsClient.disconnect();
    }
}

export default APIClient;
