const fs = require('fs');
const path = require('path');
const keypressHandler = require('./keypressHandler');
const httpHandler = require('./httpHandler');

const messages = []; // the storage unit for messages

// console.log(httpHandler);
// httpHandler.initialize(messages)
// handler.initialize(messages);

module.exports.enqueue = (message) => {
  console.log(`Enqueing message: ${message}`);
  messages.push(message);
};

module.exports.dequeue = () => {
  // returns undefined if messages array is empty
  return messages.shift();
};

module.exports.messages = messages;