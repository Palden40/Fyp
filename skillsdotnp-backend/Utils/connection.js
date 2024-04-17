const mongoose = require('mongoose');

const dbConnection = (URI) => {
    mongoose
        .connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log(`Connection Successful`);
        })
        .catch((err) => {
            console.log(err);
        });
};

mongoose.set('strictQuery', false);

module.exports = dbConnection;
