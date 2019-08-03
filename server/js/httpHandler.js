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

// console.log(messageQueue);

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);


  if (req.method === 'GET' || 'OPTIONS') {
    let command = messages.dequeue();
    if ((module.exports.backgroundImageFile === 'background.jpg')) {
      // console.log(module.exports.backgroundImageFile);
      res.writeHead(200, headers);
      res.write(module.exports.backgroundImageFile)
    }
    if (command) {
      res.writeHead(200, headers);
      res.write(command);
    // }
    }
    else {
      // console.log(module.exports.backgroundImageFile)
      res.writeHead(404, headers);
    }

  // res.write(['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)]);
  // messages.dequeue()
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
  }
}