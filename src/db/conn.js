const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_PATH)
.then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})