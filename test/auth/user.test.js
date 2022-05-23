require('dotenv/config')
const chaiHttp = require('chai-http');
const app = require('../../index')
const chai = require('chai');
const message = require('../../constants/messages')
const routesString = require('../../constants/routes')

const expect = chai.expect;

chai.use(chaiHttp);

describe('Route: Auth', () => {
  describe('GET', () => {
    describe('FIND MANY USER BY ROLE', () => {})
    describe('FIND ONE USER', () => {})
  })
  describe('POST', () => {
    describe('LOGIN', () => {
      const loginSuccess = {
        userName: 'moderator123456',
        password: 'Moderator123456@',
        type: 'LOGIN_APP',
      }
      const loginFailedWithUserName = {
        userName: 'moderator1234567890',
        password: 'Moderator123456@',
        type: 'LOGIN_APP',
      }
      const loginFailedWithPassword = {
        userName: 'moderator123456',
        password: 'Moderator1234567890@',
        type: 'LOGIN_APP',
      }
      it('Should return true if login successfull', done => {
        setTimeout(() => {
          chai.request(app).post(routesString.login).send(loginSuccess).end((req, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true)
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.all.keys('displayName','images','roles','accessToken');
            expect(res.body.data.images).to.be.a('object')
            expect(res.body.data.images).to.have.all.keys('wallPaper', 'background')
            expect(res.body.message).to.equal(message.LoginSuccessfully);
            return done()
          })
        }, 500);
      })
      it('Should return true if login failure with password dose not exist', done => {
        // setTimeout(() => {
          chai.request(app).post(routesString.login).send(loginFailedWithUserName).end((req, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.success).to.equal(false)
            expect(res.body.message).to.equal(`${message.NotFound} ${loginFailedWithUserName.userName}`);
            return done()
          })
        // }, 500);
      })
      it('Should return true if login failure with username dose not exist', done => {
        // setTimeout(() => {
          chai.request(app).post(routesString.login).send(loginFailedWithPassword).end((req, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.success).to.equal(false)
            expect(res.body.message).to.equal(message.InvalidPassword);
            return done()
          })
        // }, 500);
      })

    })    
  })

})


