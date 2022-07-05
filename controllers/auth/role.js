const models = require('../../models');
const handleError = require('../../error/HandleError');

const controller = {
  findMany: async (req, res) => res.status(200).send({data: await models.roles.find({deleted: false}), success: true}),

  findTrash: async (req, res) =>  res.status(200).send({data: await models.roles.find({deleted: true}), success: true}),

  

  
}

module.exports = controller