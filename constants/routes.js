
const role = '/api/role-management'
const user = '/api/user-management'
const author = '/api/author-management'

const routesString = {
  login: `${user}/login`,
  register: `${user}/register`,
  forgotPassword: `${user}/forgotPassword`,
  changePassword: `${user}/changePassword`,
  setActiveUser: `${user}/setActiveUser/:id`,
  findManyUser: `${user}/findManyUser`,
  findOneUser: `${user}/findOneUser/:id`,
  insertOneUser: `${user}/insertOneUser`,
  updateOneUser: `${user}/updateOneUser/:id`,
  deleteOneUser: `${user}/deleteOneUser/:id`,
  deleteManyUsers: `${user}/deleteManyUsers`,

  // author
  findOneAuthor: `${author}/findOne`,
  findManyAuthor: `${author}/findMany`,
  insertOneAuthor: `${author}/insertOne`,
  insertManyAuthor: `${author}/insertMany`,
  updateOneAuthor: `${author}/updateOne`,
  deleteOneAuthor: `${author}/deleteOne`,
  deleteManyAuthor: `${author}/deleteMany`,

  //role
  findManyRole: `${role}/findManyRole`
}

module.exports = routesString