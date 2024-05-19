import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
    title: String,
    data: [
        {
          name: String,
          email: String,
          city: String,
          issubscribe: { type: Boolean, default: true }
        }
      ]
      });

const List = mongoose.model('List', listSchema);

export default List;
