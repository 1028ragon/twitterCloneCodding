const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true, // 없어도 됨 -> 카카오톡 로그인 같은건 이메일 안줌
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15), // 닉넴 15글자
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100), // 암호화 되는 길이 감안
        allowNull: true,
      },
      provider: { 
        type: Sequelize.ENUM('local', 'kakao'), // 로컬이나 카카오 하나만 가능하도록 제한 둠
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: { // 카카오 로그인 전용, email로 가입한 사람은 local임, 카카오는 provider로
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true, // ceatedAt, updatedAt
      underscored: false, // created_at, updatedAt
      modelName: 'User',
      tableName: 'users',
      paranoid: true, // deletedAt -> 유저 삭제일 // sofet delete
      charset: 'utf8', 
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, { // N:N관계, 팔로워
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, { // 팔로잉
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};

module.exports = User;