module.exports = (sequelize, Sequelize) => {
    const UserModel = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey:true,
            allowNull:false
        },
        pseudo: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull:false
        },
        email: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull:false
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull:false
        },
        moderator: {
            type: Sequelize.BOOLEAN,
            default: false
        }
    },{
        modelName: 'User',
        timestamps: false,
        underscored: true
    }  
    );
    
    return UserModel;
};