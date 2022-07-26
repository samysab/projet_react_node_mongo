exports.sequelize = require("./db");
exports.User = require("./User");
exports.Post = require("./Post");
exports.Relationship = require("./Relationship");
exports.Message = require("./Message");
exports.Report = require("./Report")
const { Post: PostMongo } = require("../mongo");

exports.User.hasMany(exports.Post);
exports.Post.belongsTo(exports.User);

exports.User.hasMany(exports.Report);
exports.Report.belongsTo(exports.User);

exports.User.belongsToMany(exports.User, { as:"following", through: exports.Relationship, foreignKey: "follower" });
exports.User.belongsToMany(exports.User, { as : "follower", through: exports.Relationship, foreignKey:"following" });
exports.Message.belongsTo(exports.User, {through: exports.Message, foreignKey: "from" });
exports.Message.belongsTo(exports.User, {through: exports.Message, foreignKey: "to" });

async function denormalizePost(post) {
  await PostMongo.deleteOne({ _id: post.id });
  await PostMongo.create(
    await exports.Post.findByPk(post.id, {
      include: [{ model: exports.User, as: "user" }],
    })
  );
}

exports.Post.addHook("afterCreate", denormalizePost);
exports.Post.addHook("afterUpdate", denormalizePost);
exports.Post.addHook("afterDestroy", async (post) => {
  await PostMongo.deleteOne({ _id: post.id });
});

// exports.User.addHook("afterUpdate", async (user) =>
//   Promise.all(user.posts.map((post) => denormalizePost(post)))
// );
exports.User.addHook("afterDestroy", async (post) => {
  return Promise.all(
    user.posts.map((post) => PostMongo.deleteOne({ _id: post.id }))
  );
});
