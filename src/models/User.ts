import mongoose, { Document, Schema } from "mongoose";

interface Text {
  id: number;
  text: string;
  time: string;
}

interface ChatData {
  myTextList: Text[];
  aiTextList: Text[];
}

interface User extends Document {
  id: number;
  profileUrl: string;
  username: string;
  chatData: {
    sarcastic: ChatData;
    lovely: ChatData;
    exhausted: ChatData;
    translation: ChatData;
    dictionary: ChatData;
  };
}

const TextSchema: Schema = new Schema({
  id: Number,
  text: String,
  time: String,
});

const ChatDataSchema: Schema = new Schema({
  myTextList: [TextSchema],
  aiTextList: [TextSchema],
});

const UserDataSchema: Schema = new Schema({
  id: Number,
  profileUrl: String,
  username: String,
  chatData: {
    sarcastic: ChatDataSchema,
    lovely: ChatDataSchema,
    exhausted: ChatDataSchema,
    translation: ChatDataSchema,
    dictionary: ChatDataSchema,
  },
});

const User = mongoose.model<User>("User", UserDataSchema);
export default User;
