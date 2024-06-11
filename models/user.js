const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const UserSchema = newSchema({
    username: { type: String, required: true},
    hashedPassword: { type: String, required: true},
    start: { type: Number, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: { type: String, required: true }

})

UserSchema.virtual("fullName").get(function() {
    fullName = `${this.firstName} ${this.lastName}`;
    return fullName
})

UserSchema.virtual('url').get(function() {
    return `/users/${this._id}`
})

const User = mongoose.model("User", UserSchema);

module.exports = User;