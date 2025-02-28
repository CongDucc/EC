import { userModelParams } from "./../dto/User";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    mobileNo: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    confirmPassword: {
        type: String,
        require: true,
    },
    userAddressInfo: [
        {
            firstName: String,
            lastName: String,
            email: String,
            mobileNo: String,
            deliveryInfo: String,
            region: String,
            city: String,
        },
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Orders",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const USERLOG = mongoose.model<userModelParams>("User", userSchema);
export { USERLOG };

