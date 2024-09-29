> [!NOTE]
> This repo is still a draft skeleton

# A Web GUI for Warthog Nodes
This GUI is a work-in-progress and shall be designed such that it is reusable for both, normal nodes and browser nodes:

- In the case of normal nodes, the minified files can be compiled right into the Warthog node API such that the node acts as a web server for serving the GUI files.
- In the case of browser nodes, the website hosting the compiled WASM browser node can also serve this GUI.

## Design Choices
This GUI will be based on Tailwind CSS and React to build a single-page app. The communication with the Warthog node API is based on GET and POST requests and Websocket subscriptions to get real-time data updates in the case of normal nodes, and is based on Javascript function calls and callbacks in the case of browser nodes.
There shall be a Javascript file for each of these two scenarios which abstracts the communication such that the rest of the GUI can rely on a unified interface. The calls return promises.

## Test Server
### HTTP Header Notes
For testing purposes, also for normal nodes, the GUI files need to be hosted. It is important to set headers for testing:
- If an external server is used to host the GUI website for testing in connection with the normal node's API, the node API will be on a different port than the server such that the 'Access-Control-Allow-Origin: *' request header is necessary, both in the external server *and* in the node API reply. A recent patch in the node API adds this header on the node side.
- Browser nodes are multi-threaded and therefore [need the following headers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements) to enable `SharedArrayBuffer`:
```
'Cross-Origin-Opener-Policy: same-origin'
'Cross-Origin-Embedder-Policy: require-corp'
'Access-Control-Allow-Origin: *'
```


### Command to start the python server
```sh
cd src
python3 ../server.py
```

The python server started this way serves all required headers for testing. Note that for me, `http://localhost:<port>/index.html` won't work with the browser node while `http://127.0.0.1:<port>/index.html` does.



### Example for requesting API:
Assuming port 8000, after opening `http://127.0.0.1:8000/index.html`, we can call `client.get("/chain/head")`

```
>> client.get("/chain/head").then(console.log)
GET http://127.0.0.1:3000/chain/head api_ws.js:92:21
Promise { <state>: "pending" }

GET result:
Object { code: 0, data: {…} }
code: 0
data: Object { difficulty: 13363535720051.922, hash: "d24a6f0b437610939820c1c3ef10cdcf089f4b64f377db7936ea96c7158572ae", height: 1971278, … }
<prototype>: Object { … }
api_ws.js:95:25

```

POST API methods would be called like `client.get("/chain/transaction/add", {<params>})` where the parameters are passed as javascript object which is serialized automatically by the function.

See the Node API or the [docs](https://warthog.network/docs/developers/api/) for a list of available API methods.

