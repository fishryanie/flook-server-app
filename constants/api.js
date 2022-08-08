// const { cast } = require("../controllers")

const role = '/api/role-management'
const user = '/api/user-management'
const author = '/api/author-management'
const genre = '/api/genre-management'
const ebook = '/api/ebook-management'
const chapter = '/api/chapter-management'
const review = '/api/review-management'
const comment = '/api/comment-management'
const feature = '/api/feature-management'
const featureGroup = '/api/feature-group-management'
const cast = '/api/cast-management'
const movie = '/api/movie-management'



const routesString = {
  login: `${user}/login`,
  logout: `${user}/log-out`,
  register: `${user}/register`,
  forgotPassword: `${user}/forgot-password`,
  changePassword: `${user}/change-password`,
  setActiveUser: `${user}/set-active-user`,
  findManyUser: `${user}/find-many-user`,
  findOneUser: `${user}/find-one-user`,
  insertOneUser: `${user}/insert-one-user`,
  updateOneUser: `${user}/update-one-user`,
  deleteOneUser: `${user}/delete-one-user`,
  deleteManyUser: `${user}/delete-many-user`,
  removeOneUser: `${user}/remove-one-user`,
  removeManyUser: `${user}/remove-many-user`,
  searchUser: `${user}/search-one-user`,
  findUserLoggin: `${user}/find-user-loggin`,

  // author
  findOneAuthor: `${author}/find-one-author`,
  findManyAuthor: `${author}/find-many-author`,
  insertOneAuthor: `${author}/insert-one-author`,
  insertManyAuthor: `${author}/insert-many-author`,
  updateOneAuthor: `${author}/update-one-author`,
  deleteOneAuthor: `${author}/delete-one-author`,
  deleteManyAuthor: `${author}/delete-many-author`,
  removeOneAuthor: `${author}/remove-one-author`,
  removeManyAuthor: `${author}/remove-many-author`,
  searchAuthor: `${author}/search-one-author`,

  //role
  findOneRole: `${role}/find-one-role`,
  findManyRole: `${role}/find-many-role`,
  insertOneRole: `${role}/insert-one-role`,
  insertManyRole: `${role}/insert-many-role`,
  updateOneRole: `${role}/update-one-role`,
  deleteOneRole: `${role}/delete-one-role`,
  deleteManyRole: `${role}/delete-many-role`,
  removeOneRole: `${role}/remove-one-role`,
  removeManyRole: `${role}/remove-many-role`,
  searchRole: `${role}/search-one-role`,

  // genre
  findOneGenre: `${genre}/find-One-genre`,
  findManyGenre: `${genre}/find-many-genre`,
  insertOneGenre: `${genre}/insert-one-genre`,
  insertManyGenre: `${genre}/insert-many-genre`,
  updateOneGenre: `${genre}/update-one-genre`,
  deleteOneGenre: `${genre}/delete-one-genre`,
  deleteManyGenre: `${genre}/delete-many-genre`,
  removeOneGenre: `${role}/remove-one-genre`,
  removeManyGenre: `${role}/remove-many-genre`,
  searchGenre: `${role}/search-one-genre`,

  // ebook
  findOneEbook: `${ebook}/find-one-ebook`,
  findManyEbook: `${ebook}/find-many-ebook`,
  insertOneEbook: `${ebook}/insert-one-ebook`,
  insertManyEbook: `${ebook}/insert-many-ebook`,
  updateOneEbook: `${ebook}/update-one-ebook`,
  deleteOneEbook: `${ebook}/delete-one-ebook`,
  deleteManyEbook: `${ebook}/delete-many-ebook`,
  removeOneEbook: `${ebook}/remove-one-ebook`,
  removeManyEbook: `${ebook}/remove-many-ebook`,
  searchEbook: `${ebook}/search-ebook`,
  findEbookSubscribe: `${ebook}/find-ebook-subscribe`,
  findEbookHistory: `${ebook}/find-ebook-history`,

  // chapter
  findChapterByEbook: `${chapter}/find-chapter-by-ebook`,
  findOneChapter: `${chapter}/find-one-chapter`,
  findManyChapter: `${chapter}/find-many-chapter`,
  insertOneChapter: `${chapter}/insert-one-chapter`,
  insertManyChapter: `${chapter}/insert-many-chapter`,
  updateOneChapter: `${chapter}/update-one-chapter`,
  deleteOneChapter: `${chapter}/delete-one-chapter`,
  deleteManyChapter: `${chapter}/delete-many-chapter`,
  removeOneChapter: `${chapter}/remove-one-chapter`,
  removeManyChapter: `${chapter}/remove-many-chapter`,
  searchChapter: `${chapter}/search-chapter`,

  // review
  findOneReview: `${review}/find-one-review`,
  findManyReview: `${review}/find-many-review`,
  insertOneReview: `${review}/insert-one-review`,
  insertManyReview: `${review}/insert-many-review`,
  updateOneReview: `${review}/update-one-review`,
  deleteOneReview: `${review}/delete-one-review`,
  deleteManyReview: `${review}/delete-many-review`,
  removeOneReview: `${review}/remove-one-review`,
  removeManyReview: `${review}/remove-many-review`,
  searchReview: `${review}/search-review`,

  // comment
  findOneComment: `${comment}/find-one-comment`,
  findManyComment: `${comment}/find-many-comment`,
  insertOneComment: `${comment}/insert-one-comment`,
  insertManyComment: `${comment}/insert-many-comment`,
  updateOneComment: `${comment}/update-one-comment`,
  deleteOneComment: `${comment}/delete-one-comment`,
  deleteManyComment: `${comment}/delete-many-comment`,
  removeOneComment: `${comment}/remove-one-comment`,
  removeManyComment: `${comment}/remove-many-comment`,
  searchComment: `${comment}/search-comment`,

  // feature
  findOneFeature: `${feature}/find-one-feature`,
  findManyFeature: `${feature}/find-many-feature`,
  insertOneFeature: `${feature}/insert-one-feature`,
  insertManyFeature: `${feature}/insert-many-feature`,
  updateOneFeature: `${feature}/update-one-feature`,
  deleteOneFeature: `${feature}/delete-one-feature`,
  deleteManyFeature: `${feature}/delete-many-feature`,
  removeOneFeature: `${feature}/remove-one-feature`,
  removeManyFeature: `${feature}/remove-many-feature`,
  searchFeature: `${feature}/search-one-feature`,
  decentralization: `${feature}/decentralization`,

  // featuresGroup
  findOneFeatureGroup: `${featureGroup}/find-one-feature-group`,
  findManyFeatureGroup: `${featureGroup}/find-many-feature-group`,
  insertOneFeatureGroup: `${featureGroup}/insert-one-feature-group`,
  insertManyFeatureGroup: `${featureGroup}/insert-many-feature-group`,
  updateOneFeatureGroup: `${featureGroup}/update-one-feature-group`,
  deleteOneFeatureGroup: `${featureGroup}/delete-one-feature-group`,
  deleteManyFeatureGroup: `${featureGroup}/delete-many-feature-group`,
  removeOneFeatureGroup: `${featureGroup}/remove-one-feature-group`,
  removeManyFeatureGroup: `${featureGroup}/remove-many-feature-group`,
  searchFeatureGroup: `${featureGroup}/search-one-feature-group`,

  //cast
  findOneCast: `${cast}/find-one-cast`,
  findManyCast: `${cast}/find-many-cast`,
  insertOneCast: `${cast}/insert-one-cast`,
  insertManyCast: `${cast}/insert-many-cast`,
  updateOneCast: `${cast}/update-one-cast`,
  deleteOneCast: `${cast}/delete-one-cast`,
  deleteManyCast: `${cast}/delete-many-cast`,
  removeOneCast: `${cast}/remove-one-cast`,
  removeManyCast: `${cast}/remove-many-cast`,
  searchCast: `${cast}/search-one-cast`,

  //movie
  findOneMovie: `${movie}/find-one-view`,
  findManyMovie: `${movie}/find-many-view`,
  insertOneMovie: `${movie}/insert-one-view`,
  insertManyMovie: `${movie}/insert-many-view`,
  updateOneMovie: `${movie}/update-one-view`,
  deleteOneMovie: `${movie}/delete-one-view`,
  deleteManyMovie: `${movie}/delete-many-view`,
  removeOneMovie: `${movie}/remove-one-view`,
  removeManyMovie: `${movie}/remove-many-view`,
  searchMovie: `${movie}/search-one-view`,
}


module.exports = routesString