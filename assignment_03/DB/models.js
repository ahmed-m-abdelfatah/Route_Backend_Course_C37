const { DataTypes } = require('sequelize'); // { DataTypes or Sequelize }
const { dummyUsers } = require('../dummy_data.js');
const sequelizeConnection = require('./connection.js');

const userModel = sequelizeConnection.define(
  'user',
  {
    firstName: {
      type: DataTypes.STRING(500), // VARCHAR(500) default is 255
      allowNull: false,
      require: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      require: true,
    },
  },
  { timestamps: false },
);

const productModel = sequelizeConnection.define(
  'product',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      require: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      require: true,
    },
  },
  { timestamps: false },
);

const commentModel = sequelizeConnection.define(
  'comment',
  {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: userModel,
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: productModel,
        key: 'id',
      },
    },
  },
  { timestamps: false },
);

// https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
// many to many means many comments can have many products
userModel.belongsToMany(productModel, {
  through: commentModel,
});
productModel.belongsToMany(userModel, {
  through: commentModel,
});

// https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
// one to many means one user can have many products
// choose one of the following associations
// userId
userModel.hasMany(commentModel, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
commentModel.belongsTo(userModel);

// productId
productModel.hasMany(commentModel, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
commentModel.belongsTo(productModel);

// https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-one-relationships
// one to one means one user can have one product
// choose one of the following associations
// userModel.hasOne(productModel); // foreignKey in productModel
// productModel.belongsTo(userModel); // foreignKey in productModel

const createTables = () => {
  // alter to edit table columns
  return sequelizeConnection
    .sync({ alter: true, force: true }) // force: true to drop tables
    .then(result => {
      // console.log('DB connected', result);
      console.log('~ DB connected');

      // add dummy users
      userModel
        .bulkCreate(dummyUsers)
        .then(() => {
          console.log('~ Dummy users added');
        })
        .catch(err => {
          console.log('~ Dummy users error', err);
        });
    })
    .catch(err => {
      console.log('~ DB connection error', err);
    });
};

// export to use in handler function
module.exports = {
  userModel,
  productModel,
  commentModel,
  createTables,
};
