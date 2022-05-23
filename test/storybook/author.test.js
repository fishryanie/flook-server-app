require('dotenv/config')
const chaiHttp = require('chai-http');
const database = require('../../configs/mongodb')


const app = require('../../index')

const chai = require('chai');

const expect = chai.expect;

// const { MODEL_AUTHORS } = require('../models')
chai.use(chaiHttp);

describe('Route: Author', () => {
  describe('GET', () => {
    describe('FIND ALL', () => {
      const APIFindMany = '/api/author-management/getAuthor'
      it('Should return 200 if successful', done => {
        setTimeout(() => {
          chai.request(app).get(APIFindMany).end((req, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data.length).to.greaterThan(0, "result null")
            return done()
          })
        }, 500);
      })
    })
    describe('FIND ONE', () => {
      
    })
    
  })
  
})


