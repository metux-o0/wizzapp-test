const sequelize = require('sequelize');
const db = require('../../models');

const searchGame = async (name, platform) => {
  const query = {};
  if (name) {
    query.name = sequelize.where(
      sequelize.fn('LOWER', sequelize.col('name')),
      'LIKE',
      `%${name}%`,
    );
  }
  if (platform) { query.platform = platform; }

  const response = await db.Game.findAll({
    where: query,
  });
  return response;
};

module.exports = {
  searchGame,
};
