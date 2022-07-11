const handleError = require('../../error/HandleError')
const modles = require('../../models')

module.exports = {
  findOneFeature: async (req, res) => {
    try {
      const result = await modles.features.find()
      !result && res.status(400).send({ success: false, message: 'Find many feature group failed' })
      return res.status(200).send({ success: true, data: result })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  findManyFeature: async (req, res) => {
    try {
      const idGroup = req.query.id
      console.log(idGroup)
      const result = await modles.features.find({ featureGroupId: idGroup })
      !result && res.status(400).send({ success: false, message: 'Find many feature group failed' })
      return res.status(200).send({ success: true, data: result })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  insertOneFeature: async (req, res) => {

  },

  insertOneFeature: async (req, res) => {

  },

  insertManyFeature: async (req, res) => {

  },

  updateOneFeature: async (req, res) => {

  },

  deleteOneFeature: async (req, res) => {

  },

  deleteManyFeature: async (req, res) => {

  },

  removeOneFeature: async (req, res) => {

  },

  removeManyFeature: async (req, res) => {

  },

  searchFeature: async (req, res) => {

  }
}

