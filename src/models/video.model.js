import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginte from 
"mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,// cloudnary /
        required:true,

    },
    thumbnail:{
        type:String,// cloudnary /
        required:true,

    },
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,

    },
    duration:{
        type:Number,// cloudnary /
        required:true,

    },
    view:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


    



},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginte)
export const Video = mongoose.model("Video",videoSchema)