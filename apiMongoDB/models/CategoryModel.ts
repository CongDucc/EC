import mongoose, { Schema } from "mongoose";
import { CategoryObj } from "../dto/Categories";

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        images: {
            type: [String]
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                delete ret.createAt;
                delete ret.updateAt;
            }
        },
        timestamps: true
    }
);

const CATEGORIES = mongoose.model<CategoryObj>("categories", CategorySchema);

export { CATEGORIES };