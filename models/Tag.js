const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
    {
        name : String,
        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        occurences: Number
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Tag", tagSchema);