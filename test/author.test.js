'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const app = 'http://localhost:8000'
const expect = chai.expect;

// const { MODEL_AUTHORS } = require('../models')
chai.use(chaiHttp);


describe('Route: Author', () => {
  describe('GET', () => {
    describe('get all', () => {
      const APIFindMany = '/api/author-management/getAuthor'
      it('Should return 200 if successful', done => {
        chai.request(app).get(APIFindMany).end((req, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.length).to.greaterThan(0, "result null")
          return done()
        })
      })
    })
    describe('get one', () => {
      
    })
    
  })
  
})
