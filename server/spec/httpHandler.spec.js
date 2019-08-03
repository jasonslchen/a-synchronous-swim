
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');
// const message = require('./')

const httpHandler = require('../js/httpHandler');

const messages = require('../js/messageQueue.js')

describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let {req, res} = server.mock('http://127.0.0.1:3000', 'OPTIONS');
    messages.enqueue('up');
    console.log(messages.messages);
    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.equal('up');

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
    // write your test here
    messages.enqueue('down')
    let {req, res} = server.mock('http://127.0.0.1:3000', 'GET');
    httpHandler.router(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.equal('down');
    // ('' || '\'\'' || 'up' || 'down' || 'left' || 'right');

    done();
  });

  it('should respond with 404 to a GET request for a missing background image', (done) => {
    // messages.enqueue('up');
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'missing.jpg');
    let {req, res} = server.mock('http://127.0.0.1:3000', 'GET');
    console.log(httpHandler.backgroundImageFile);

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(404);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  it('should respond with 200 to a GET request for a present background image', (done) => {
    messages.enqueue('up');
    httpHandler.backgroundImageFile = path.join('.', 'background.jpg');
    let {req, res} = server.mock('http://127.0.0.1:3000', 'GET');
    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);

    done();
  });

  var postTestFile = path.join('.', 'spec', 'water-lg.jpg');
  console.log(postTestFile);

  it('should respond to a POST request to save a background image', (done) => {
    messages.enqueue('up');
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let {req, res} = server.mock('http://127.0.0.1:3000', 'POST', fileData);

      httpHandler.router(req, res, () => {
        expect(res._responseCode).to.equal(201);
        expect(res._ended).to.equal(true);
        done();
      });
    });
  });

  xit('should send back the previously saved image', (done) => {
    messages.enqueue('up');
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let post = server.mock('http://127.0.0.1:3000', 'POST', fileData);

      httpHandler.router(post.req, post.res, () => {
        let get = server.mock('http://127.0.0.1:3000', 'GET');
        httpHandler.router(get.req, get.res, () => {
          expect(Buffer.compare(fileData, get.res._data)).to.equal(0);
          done();
        });
      });
    });
  });
});
