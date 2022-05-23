require('dotenv/config')
const chaiHttp = require('chai-http');
const message = require('../../constants/messages')
const routesString = require('../../constants/routes')

const app = require('../../index')

const chai = require('chai');

const expect = chai.expect;

// const { MODEL_AUTHORS } = require('../models')
chai.use(chaiHttp);

describe('Route: Auth', () => {
  describe('GET', () => {

    describe('FIND MANY ROLES ', () => {})
    describe('FIND ONE ROLES', () => {})
    describe('EDIT ONE ROLES', () => {})
    describe('DELETE MANY ROLES', () => {})
    describe('DELETE ONE ROLES', () => {})
  })
  

})


