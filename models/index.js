const Users = require('./model.auth')
const Roles = require('./model.roles')
const Categories = require('./model.categories')
const ChapterComic = require('./model.chapterComic')
const ChapterChat = require('./model.chapterChat')
const ChapterNovel = require('./model.chapterNovel')
const Evaluation = require('./model.evaluation')
const Casts = require('./model.cast')
const Movies = require('./model.movie')
const Comments = require('./model.comment')
const eBooks = require('./model.eBooks')
const Genre = require('./model.genre')
const Author = require('./model.author')
const Status = require('./model.status')
const ChatBox = require('./model.chatBox')
const ShopItems = require('./model.shopItems')
const FanHistories = require('./model.fanHistories')
const Wallet = require('./model.wallet')
const Vip = require('./model.vip')
const Topics = require('./model.topics')
const ForumPost = require('./model.forumPost')
const UserItemHistories = require('./model.userItemHistories')
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const MODEL_USERS = mongoose.model('users', Users)
const MODEL_ROLES = mongoose.model('roles', Roles)
const MODEL_CATEGORIES = mongoose.model('categories', Categories)
const MODEL_CASTS = mongoose.model('casts', Casts)
const MODEL_MOVIES = mongoose.model("movies", Movies)
const MODEL_COMMENTS = mongoose.model("comments", Comments)
const MODEL_EBOOKS = mongoose.model('mangas', eBooks)
const MODEL_GENRES = mongoose.model('genres', Genre)
const MODEL_CHAPTERS_CONMIC = mongoose.model('chaptercomic', ChapterComic)
const MODEL_CHAPTERS_CHAT = mongoose.model('chapterchat', ChapterChat)
const MODEL_CHAPTERS_NOVEL = mongoose.model('chapternovel', ChapterNovel)
const MODEL_AUTHORS = mongoose.model('authors', Author)
const MODEL_STATUS = mongoose.model('authors', Status)
const MODEL_CHATBOX = mongoose.model('chatbox', ChatBox)
const MODEL_SHOPITEMS = mongoose.model('shopitems', ShopItems)
const MODEL_EVALUATION = mongoose.model('evaluation', Evaluation)
const MODEL_FANHISTORIES = mongoose.model('fanhistories', FanHistories)
const MODEL_WALLET = mongoose.model('wallet', Wallet)
const MODEL_VIP = mongoose.model('vip', Vip)
const MODEL_TOPICS = mongoose.model('topics', Topics)
const MODEL_FORUMPOSTS = mongoose.model('forumpost', ForumPost)
const MODEL_USERITEMHISTORIES = mongoose.model('useritemhistories', UserItemHistories)


module.exports = {
  mongoose,
  MODEL_USERS,
  MODEL_ROLES,
  MODEL_CATEGORIES,
  MODEL_CASTS,
  MODEL_MOVIES,
  MODEL_CHAPTERS_CONMIC,
  MODEL_CHAPTERS_CHAT,
  MODEL_CHAPTERS_NOVEL,
  MODEL_COMMENTS,
  MODEL_EBOOKS,
  MODEL_GENRES,
  MODEL_AUTHORS,
  MODEL_STATUS,
  MODEL_EVALUATION,
  MODEL_FANHISTORIES,
  MODEL_CHATBOX,
  MODEL_SHOPITEMS,
  MODEL_USERITEMHISTORIES,
  MODEL_WALLET,
  MODEL_VIP,
  MODEL_TOPICS,
  MODEL_FORUMPOSTS

}