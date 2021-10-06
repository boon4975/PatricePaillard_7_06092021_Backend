module.exports = (sequelize, Sequelize) => {
    const PostModel = sequelize.define('post', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey:true,
            allowNull:false
        },
        title: {
            type: Sequelize.STRING(50),
            allowNull:false
        },
        message: {
            type: Sequelize.TEXT,
            allowNull:false
        },
        url_image: {
            type: Sequelize.STRING(255)
        },
        user_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull:false
        },
    },{
        modelName: 'Post',
        timestamps: true,
        underscored: true
    }  
    )
    return PostModel;
};
