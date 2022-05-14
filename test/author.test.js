'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../app');
const expect = chai.expect;

// const { MODEL_AUTHORS } = require('../models')
chai.use(chaiHttp);


describe('Route: Author', () => {
  describe('GET', () => {
    describe('get all', () => {
      it('Should return 200 if successful', done => {
        chai.request('http://localhost:8000')
          .get('/api/author-management/getAuthor')
          .end((req, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data.length).to.greaterThan(0, "result null")
            return done()
          }
        )
      })
    })
    describe('get one', () => {
      
    })
    
  })
  
})
