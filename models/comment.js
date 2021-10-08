module.exports = (sequelize, Sequelize) => {
    const CommentModel = sequelize.define('comment', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey:true,
            allowNull:false
        },
        post_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull:false
        },
        user_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull:false
        },
        message: {
            type: Sequelize.TEXT,
            allowNull:false
        },
    },{
        modelName: 'Comment',
        timestamps: true,
        underscored: true
    }  
    )
    return CommentModel;
};