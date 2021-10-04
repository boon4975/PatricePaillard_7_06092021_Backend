module.exports = (sequelize, Sequelize) => {
    const PostModel = sequelize.define('post', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey:true,
            allowNull:false
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull:false
        },
        message: {
            type: Sequelize.STRING(255),
            allowNull:false
        },
        urlImage: {
            type: Sequelize.STRING(255)
        },
        user_id: {
            type: Sequelize.INTEGER.UNSIGNED
        },
    },{
        modelName: 'Post',
        timestamps: true,
        underscored: true
    }  
    )
    return PostModel;
};
