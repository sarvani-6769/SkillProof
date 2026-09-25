import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/skillproof';

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n⚠️  [MongoDB Connection Warning]: Failed to connect to ${primaryUri}`);
    console.error(`   Reason: ${error.message}`);

    if (error.message.includes('authentication failed')) {
      console.warn(`   👉 Atlas Tip: Please verify in MongoDB Atlas > "Database Access" that:`);
      console.warn(`      1. User exists: ${process.env.MONGODB_USERNAME || 'sarvanisathuluri799_db_user'}`);
      console.warn(`      2. Password matches: "Edit Password" in Atlas and re-enter it.`);
      console.warn(`      3. User has "Read and write to any database" privileges.`);
    }

    if (primaryUri !== fallbackUri) {
      console.log(`   🔄 Attempting fallback to local MongoDB instance (${fallbackUri})...`);
      try {
        const localConn = await mongoose.connect(fallbackUri);
        console.log(`[MongoDB] Connected to local fallback: ${localConn.connection.host}`);
      } catch (localErr) {
        console.error(`[MongoDB Fatal]: Both primary and fallback connections failed: ${localErr.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
