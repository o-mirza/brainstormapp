/* Server setup */
const express = require('express');
const app = express();
const path = require('path');
const process = require('process');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const {PRODUCTION, PORT} = require('./config.js');

const { errMsg, dbg } = require('./logging.js');

/**
 * API Routes
 */


app.use('/start',
// Create room
// Set cookie
// Validate
(req, res) => {
  dbg('Creating room: ', res.locals.roomId);
  res.sendStatus(200)
})


app.use(
  '/join/:roomId',
  /* Match room ID */
  /* Create session cookie */
  (req, res) => {
    dbg('Request to join room: ', req.params.roomId);
    res.redirect(`/view/${req.params.roomId}`)
    res.sendStatus(200)
  }
)

app.use(
  '/view/:roomId',
  /* Validate session cookie */
  /* Send page */
  (req, res) => {
    dbg('Sending page: ', req.params.roomId);
})



/**
 * Static Pages
 */
app.use('/bundle.js', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index_bundle.js'));
});

app.get('/', (req, res) => {
  dbg('Request to main page.');
  return res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
});


/**
 * 404 handler
 */
app.use('*', (req, res) => {
  dbg("Unknown request: ", req.path);
  res.status(404).send('Not Found');
});


/**
 * Global error handler
 */

const defaultErr = {
  log: 'Express error handler caught unknown middleware error',
  status: 500,
  message: { err: 'An error occurred' }
};

function errorHandler (err, req, res, next) {
  const errorObj = Object.assign({}, defaultErr, err);
  dbg(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
}
app.use(errorHandler);


app.listen(PORT, () => { dbg(`Listening on port ${PORT}...`); });



// Websocket server

const { WebSocketServer } = require('ws')
const wsserver = new WebSocketServer({ port: 443 })

wsserver.on('connection', ws => {
  // Try saving a cookie or session key to the ws object?
  // Initialize events for new client
  dbg('New client connected!')
  ws.session = "Secret";


  ws.on('close', () => dbg('Client has disconnected!'))

  ws.on('message', msg => {
    let parsedMsg;
    try {
      parsedMsg = JSON.parse(msg);
    }
    catch (err) {
      return dbg('Could not parse message: ', msg)
    }
    // Route data
    switch (parsedMsg.type) {
      case "join":
        // Validate session
        // Read state from the database on initial join
        // Store properties on ws.session
        // setInfo();
        // ws.send(serialized_state);
        break;
      case "message":
        // Note: we need to filter clients by room
        // Push message to the database here
        // Do we read it back from the database? Caching issues...
        // For now: try without sync and see if it causes problems
        // Simultaneously broadcast to clients
        const responseMsg = JSON.stringify({response: parsedMsg.message});
        dbg(`distributing message: ${responseMsg}`)
        wsserver.clients.forEach(client => {
          client.send(responseMsg);
          dbg("ws.session: " + ws.session);
        })
        break;
      case "setUsername":
        //
        break;
      default:
        return dbg('Unknown message: ', parsedMsg);
    }
})


 ws.onerror = function () {
   dbg('websocket error')
 }
})
