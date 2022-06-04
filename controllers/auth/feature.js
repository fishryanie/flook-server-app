const handleError = require('../../error/HandleError')
const modles = require('../../models')

module.exports = {
  findMany: async (req, res) => {
    try {
      const result = await modles.features.find()
      !result && res.status(400).send({ success: false, message: 'Find many feature group failed'})
      return res.status(200).send({ success: true, data: result})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  findByFeatureGroupId: async (req, res) => {
    try {
      const idGroup = req.params.id
      console.log(idGroup)
      const result = await modles.features.find({featureGroupId: idGroup})
      !result && res.status(400).send({ success: false, message: 'Find many feature group failed'})
      return res.status(200).send({ success: true, data: result})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  }


}