import mongoose from 'mongoose';

let isConnecting = false;

const attemptConnection = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;

  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/skillproof';

  try {
    if (primaryUri) {
      const conn = await mongoose.connect(primaryUri);
      console.log(`[MongoDB] Connected successfully to Atlas: ${conn.connection.host}`);
      isConnecting = false;
      return;
    }
  } catch (error) {
    console.error(`\n============================================================`);
    console.error(`🚨 [MongoDB Atlas Connection Issue]`);
    console.error(`Reason: ${error.message}`);
    if (error.message.includes('authentication failed')) {
      console.error(`\n👉 HOW TO FIX MONGODB ATLAS AUTHENTICATION:`);
      console.error(`   1. Go to https://cloud.mongodb.com -> "Database Access"`);
      console.error(`   2. Find user: ${process.env.MONGODB_USERNAME || 'sarvanisathuluri799_db_user'}`);
      console.error(`   3. Click "Edit" -> "Edit Password" -> Set/Confirm password`);
      console.error(`   4. Go to "Network Access" -> Ensure "0.0.0.0/0" (Allow All) is Active`);
    }
    console.error(`============================================================\n`);
  }

  // Attempt local fallback
  try {
    const localConn = await mongoose.connect(fallbackUri);
    console.log(`[MongoDB] Connected to local fallback instance: ${localConn.connection.host}`);
    isConnecting = false;
    return;
  } catch (localErr) {
    console.warn(`[MongoDB Notice]: Local fallback unavailable (${localErr.message}).`);
  }

  isConnecting = false;

  // In cloud deployment (Render/Railway), schedule auto-retry every 20 seconds instead of hard crashing
  if (process.env.NODE_ENV === 'production') {
    console.log(`[MongoDB] Retrying database connection in 20 seconds...`);
    setTimeout(attemptConnection, 20000);
  }
};

const connectDB = async () => {
  await attemptConnection();
};

export default connectDB;
