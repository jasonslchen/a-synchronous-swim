const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');
const keypressHandler = require('./keypressHandler')


// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

//messages.messages to access the array messages from messageQueue

keypressHandler.initialize(messages.enqueue);

// let messageQueue = null;

// module.exports.initialize = (queue) => {
//   messageQueue = queue;
//   // console.log(messageQueue);
// };

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);



  if (req.method === 'GET' || req.method === 'OPTIONS') {
    let command = messages.dequeue();
    res.writeHead(404, headers);
    if (module.exports.backgroundImageFile) {
      if (module.exports.backgroundImageFile  === 'background.jpg') {
        res.writeHead(200, headers);
        fs.readFile('./background.jpg', (err, data) => {
          if (err) throw err;
          res.write(data);
          res.end(); // asynchronous
        })
      }
    }
    if (command) {
      res.writeHead(200, headers);
      res.write(command);
    }
  }
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
  }
