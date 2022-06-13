const handleError = require('../../error/HandleError');
const models = require('../../models');

const controller = {
  findMany: (req, res) => {
    models.roles.find()
    .then(data => res.status(200).send({data: data, success: true}))
    .catch(error => handleError.ServerError(error, res))
  }
}

module.exports = controller