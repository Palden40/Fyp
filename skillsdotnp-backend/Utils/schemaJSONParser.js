const transFormFunc = (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.createdAt && ret.updatedAt) {
        delete ret.createdAt;
        delete ret.updatedAt;
    }
};

module.exports = (...schemas) => {
    if (schemas.length == 1) {
        schemas[0].set('toJSON', {
            transform: transFormFunc,
        });
    } else {
        schemas.forEach((schema) => {
            schema.set('toJSON', {
                transform: transFormFunc,
            });
        });
    }
};
