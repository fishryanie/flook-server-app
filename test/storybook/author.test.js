require('dotenv/config')
const chaiHttp = require('chai-http');
const jwt = require("jsonwebtoken");
const user = require('../../jsons/user.json')
const app = require('../../index')
const chai = require('chai');
const message = require('../../constants/messages')
const routesString = require('../../constants/routes')
const configsToken = require("../../configs/token");
const expect = chai.expect;
const models = require('../../models');
const database = require('../../configs/mongodb');

chai.use(chaiHttp);

describe('Routes: Author', function () {
  beforeEach((done) => {
    database.then(() => {
      return done()
    })
  });
  it('should return true if find successfully', (done) => {
    chai.request(app).get(routesString.findManyAuthor)
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.all.keys('data', 'count', 'success')
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.greaterThan(0, "result null")    
      return done()
    })
  });








})