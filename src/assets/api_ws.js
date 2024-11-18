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
        this.ws.close();
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
        this.callbacks.onEvent({ event: null, type: "api.connected" });
        this.reconnectAttempts = 0;
    }

    onClose() {
        console.log('WebSocket connection closed');
        this.callbacks.onClose();
        this.callbacks.onEvent({ event: null, type: "api.disconnected" });
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
            console.error("try reconnect connect", this.reconnectAttempts)
            this.connect();
            this.timer = null;
        }, delay);
    }
}

class ConnectionState {
    constructor() {
        this.connections = [];
    }
    setConnections(conns) {
        this.connections = conns;
    }
    addConnection(newConnection) {
        this.connections.push(newConnection)
    }
    removeConnection(id) {
        this.connections = this.connections.filter(item => item.id !== id);
    }
}

class Block {
    constructor(data) {
        Object.assign(this, data);
    }
    reward_tx() {
        return this.body.rewards[0];
    }
    miner() {
        return this.reward_tx().toAddress
    }
    transactionCount() {
        return this.body.transfers.length + 1
    }
    reward() {
        return this.reward_tx().amount;
    }
}

class ChainState {
    constructor() {
        this.blocks = [];
        this.head = null
    }
    blocks() {
        return this.blocks.map((data) => new Block(data));
    }
    latest() {
        return blocks()[-1]
    }
    setState({ latestBlocks, head }) {
        this.head = head;
        this.blocks = latestBlocks.map((data) => new Block(data));
    }
    append({ newBlocks, head }) {
        this.head = head;
        console.log("newBlocks", newBlocks)
        this.blocks.concat(newBlocks.map((data) => new Block(data)))
    }
    fork({ latestBlocks, head }) {
        setState({ latestBlocks, head });
    }
}

class LogState {
    constructor() {
        this.lines = [];
    }
    addLine(line) {
        this.lines.push(line);
        if (this.lines.length > 1100) {
            this.lines = this.lines.slice(100);
        }
    }
    setLines(lines) {
        this.lines = []
        for (let i = 0, len = lines.length; i < len; i++) {
            this.addLine(lines[i]);
        }
    }
}

class State {
    constructor() {
        this.connection = new ConnectionState();
        this.chain = new ChainState();
        this.log = new LogState();
        this.subscribed = false;
    }
    onEvent(msg) {
        var event = msg.event;
        switch (msg.type) {
            case 'connection.state':
                this.connection.setConnections(event.connections);
                return 'connection';
            case 'connection.add':
                this.connection.addConnection(event.connection);
                return 'connection';
            case 'connection.remove':
                this.connection.removeConnection(event.id);
                // return ['connection', this.connectionState.get_state];
                return 'connection';
            case 'chain.state':
                this.chain.setState(event)
                return 'chain';
            case 'chain.append':
                this.chain.append(event);
                return 'chain';
            case 'chain.fork':
                this.chain.fork(event)
                return 'chain';
            case 'log.state':
                this.log.setLines(event)
                return 'log'
            case 'log.line':
                this.log.addLine(event)
                return 'log'
            case 'api.connected':
                this.subscribed = true;
                return 'subscribed';
            case 'api.disconnected':
                this.subscribed = false;
                return 'subscribed';
            default:
                console.warn('Unknown event type', msg.type, msg);
                return ['', null];
        }
    }
}

class APIClient {
    constructor() {
        this.hostport = '127.0.0.1:3000'
        this.setters = null
        this.state = new State()
        this.notifyChange = (key) => {
            console.log('notifyChange', key)
            if (this.setters != null) {
                switch (key) {
                    case 'connection':
                        this.setters.setConnections([...this.connectionState().connections]);
                        break;
                    case 'chain':
                        this.setters.setChain({...this.chainState()});
                        break;
                    case 'log':
                        this.setters.setLog({...this.logState()});
                        break;
                    case 'subscribed':
                        this.setters.setSubscribed(this.subscribedState());
                        break;
                }
            }
        }
        this.wsClient = new WSClient('ws://' + this.hostport + '/stream', {
            onOpen: () => {
                this.wsClient
                this.subscribe('connection');
                this.subscribe('chain');
                this.subscribe('log');
            },
            onClose: () => {
                this.state.subscribed = false;
                return 'subscribed';
            },
            onEvent: (event) => {
                var key = this.state.onEvent(event)
                this.notifyChange(key);
            }
        })
        this.wsClient.connect();
    }
    connectionState() {
        return this.state.connection;
    }
    chainState() {
        return this.state.chain;
    }
    logState() {
        return this.state.log;
    }
    subscribedState() {
        return this.state.subscribed;
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
        console.log("disconnect");
        // this.wsClient.disconnect();
    }
}

export default APIClient;
