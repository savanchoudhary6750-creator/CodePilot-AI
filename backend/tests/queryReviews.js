import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    for (const coll of collections) {
      const docs = await mongoose.connection.db.collection(coll.name).find({}).toArray();
      console.log(`\nCollection: ${coll.name} (${docs.length} docs)`);
      for (const doc of docs) {
        console.log(JSON.stringify(doc, null, 2));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

run();
