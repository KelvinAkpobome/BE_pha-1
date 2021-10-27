const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

global.expect = chai.expect;
global.sinon = sinon;
chai.use(sinonChai);
chai.use(chaiHttp);
global.chai = chai;
