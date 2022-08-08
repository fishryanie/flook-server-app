const models = require('../../models');
const handleError = require('../../error/HandleError');

module.exports = {

  findOneRole: (req, res) => {
    
  },

  findManyRole: async (req, res) => {
    models.roles.find({deleted: false})
    .then(data => res.status(200).send({data: data, success: true}))
    .catch(error => handleError.ServerError(error, res))
  },

  insertOneRole: async (req, res) => {

  },

  insertOneRole: async (req, res) => {
    const dataRole = req.body.name;
    console.log('name', dataRole);

    try {
      const name = await models.roles.findOne({ name: dataRole });

      const newRole = new models.roles({
        ...req.body
      });

      if (name) {
        console.log("tên role đã tồn tại!!!");
        res.status(400).send({ message: messages.InsertFail + `, ${name} already exist!!!` });
      }
      const result = await newRole.save();
      if (result) {
        const response = {
          data: result,
          success: true,
          message: messages.InsertSuccessfully
        }
        return res.status(200).send(response);
      }
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  insertManyRole: async (req, res) => {

  },

  updateOneRole: async (req, res) => {
    const id = req.query.id
    const roleData = new models.roles({ ...req.body, _id: id });
    const option = { new: true };
    try {
      const result = await models.roles.findByIdAndUpdate(id, roleData, option);
      if (!result) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound });
      }
      console.log({ data: result });
      return res.status(200).send({ message: messages.UpdateSuccessfully, data: result });
    } catch (error) {
      handleError.ServerError(error, res)
    }
  },

  deleteOneRole: async (req, res) => {
    try {
      const id = req.query.id;
      const row = await models.roles.findByIdAndRemove(id).exec();
      console.log(id)
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  deleteManyRole: async (req, res) => {

  },

  removeOneRole: async (req, res) => {
    const id = req.query.id;
    const roleFind = await models.roles.findById(id);
    let row;
    try {
      if (roleFind.deleted === true) {
        row = await models.roles.findByIdAndUpdate(id, { deleted: false, deleteAt: "", updateAt: roleFind.updateAt, createAt: roleFind.createAt }, option);
      } else {
        row = await models.roles.findByIdAndUpdate(id, { 
          deleted: true, 
          deleteAt: FormatDate.addDays(0), 
          updateAt: roleFind.updateAt, 
          createAt: roleFind.createAt 
        },  { upsert: true });
      }
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  removeManyRole: async (req, res) => {
    const listDelete = req.body;
    const option = { new: true };
    console.log('removeManyRole', listDelete)
    try {
      const result = await models.roles.updateMany(
        { "_id": { $in: listDelete } },
        { $set: { deleted: true, deleteAt: Date.now() } },
        option
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.RemoveNotSuccessfully });
      }
      const response = {
        success: true,
        message: messages.RemoveSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  searchRole: async (req, res) => {

  }

}
