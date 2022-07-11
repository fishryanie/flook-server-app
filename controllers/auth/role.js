const handleError = require('../../error/HandleError');
const models = require('../../models');

const controller = {
  findOneRole: (req, res) => {
    models.roles.find()
    .then(data => res.status(200).send({data: data, success: true}))
    .catch(error => handleError.ServerError(error, res))
  },

  findManyRole: async (req, res) => {
    
  },

  insertOneRole: async (req, res) => {

  },

  insertOneRole: async (req, res) => {

  },

  insertManyRole: async (req, res) => {

  },

  updateOneRole: async (req, res) => {

  },

  deleteOneRole: async (req, res) => {

  },

  deleteManyRole: async (req, res) => {

  },

  removeOneRole: async (req, res) => {

  },

  removeManyRole: async (req, res) => {

  },

  searchRole: async (req, res) => {

  }

}

module.exports = controller