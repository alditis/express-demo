/**
 * Init models.
 * @module model/index
 */

/**
 * Require modules.
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const db = {};

/**
 * Create new object Sequelize.
 */
const sequelize = new Sequelize(
    PER.config.db.database,
    PER.config.db.username,
    PER.config.db.password, {
        host: PER.config.db.host,
        dialect: PER.config.db.dialect,
        pool: {
            max: PER.config.db.pool.max,
            min: PER.config.db.pool.min,
            idle: PER.config.db.pool.idle
        },
        define: {
            timestamps: true,
            paranoid: true,
            underscored: true,
            freezeTableName: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            version: 'locking'
        },
        logging: PER.config.db.logging ?
            sql => {
                PER.log.info(sql);
            } : PER.config.db.logging
    }
);

/**
 * Add modules from files to db object.
 */
fs.readdirSync(__dirname)
    .filter(file => {
        return !PER.helper.isHiddenPath(file) && file !== "index.js";
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

/**
 * Add objects Squelize to db object.
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;