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

const typeToken = userId => {
  const token = jwt.sign(
    { id: userId }, 
    configsToken.secret, 
    { expiresIn: configsToken.jwtExpiration }
  );
  return token;
}



describe('Route: Auth', () => {
  let token
  beforeEach((done) => {
    Promise.all([
      models.users.findOne({userName: 'moderator123456'})

    ]).then((doc) => {
      token = typeToken(doc[0]._id)
      return done()
    })    
  }); 

  describe('GET', () => { 
    describe('FIND MANY USER', () => {
      it('Should return true if find many user successfully', (done) => {
        chai.request(app).get(routesString.findManyUser)
        .set('Authorization', token)
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
  })


  
  describe('POST', () => {
    describe('LOGIN', () => {
      const loginSuccess = {
        userName: 'moderator123456',
        password: 'Moderator123456@',
      }
      const loginFailedWithUserName = {
        userName: 'moderator1234567890',
        password: 'Moderator123456@',
      }
      const loginFailedWithPassword = {
        userName: 'moderator123456',
        password: 'Moderator1234567890@',
      }
      it('Should return true if login successfull', done => {
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
      })
      it('Should return true if login failure with password dose not exist', done => {
        chai.request(app).post(routesString.login).send(loginFailedWithUserName).end((req, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false)
          expect(res.body.message).to.equal(`${message.NotFound} ${loginFailedWithUserName.userName}`);
          return done()
        })
      })
      it('Should return true if login failure with username dose not exist', done => {
        chai.request(app).post(routesString.login).send(loginFailedWithPassword).end((req, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false)
          expect(res.body.message).to.equal(message.InvalidPassword);
          return done()
        })
      }) 

    })

  })
})
 

