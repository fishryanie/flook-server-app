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
    const setFeature = req.body.feature;
    try {
      const featureName = await modles.features.findOne({ featureName: dataFeature });

      if (featureName) {
        console.log("tên sách tồn tại!!!");
        return res.status(400).send(featureName);
      }

      const newBook = new models.ebooks({
        ...req.body, images: { background: { id: imageUpload.public_id, url: imageUpload.secure_url }, wallPaper: { id: imageUpload.public_id, url: imageUpload.secure_url } }, createAt: addDays(0)
      });

      const result = await newBook.save();
      if (result) {
        const response = {
          data: result,
          message: messages.InsertSuccessfully,
          success: true
        }
        return res.status(200).send(response);
      }
    } catch (error) {
      handleError.ServerError(error, res);
    }
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

  },

  decentralization: async (req, res) => {
    const setFeature = req.query.setFeature;
    const featureName = req.body.data.featureName;
    console.log("🚀 ~ file: feature.js ~ line 90 ~ decentralization: ~ featureName", featureName)
    const userId = req.body.userId;
    console.log("🚀 ~ file: feature.js ~ line 92 ~ decentralization: ~ userId", userId)
    let result;
    try {
      if(setFeature === "true"){
        result = await modles.features.findOneAndUpdate({featureName: featureName}, { $push: { roles: userId }})
      }else{
        result = await modles.features.findOneAndUpdate({featureName: featureName}, { $pull: { roles: userId }})
      }
      if (result) {
        const response = {
          data: result,
          message: 'Successfully updated feature!!!',
          success: true
        }
        return res.status(200).send(response);
      }else{
        return res.status(400).send({ message: 'Feature not updated!!!', success: false });
      }
    } catch (error) {
      handleError.ServerError(error, res);
    }

  }
}

