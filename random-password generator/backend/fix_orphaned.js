import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const db = mongoose.connection;
    const passwords = await db.collection('passwords').find({ deleted: false }).toArray();
    const groups = await db.collection('groups').find({}).toArray();
    const groupIds = groups.map(g => g._id.toString());
    
    let orphanedCount = 0;
    for (let p of passwords) {
      if (p.group && !groupIds.includes(p.group.toString())) {
        orphanedCount++;
        await db.collection('passwords').updateOne(
          { _id: p._id },
          { $set: { deleted: true, deletedAt: new Date(), group: null } }
        );
      }
    }
    console.log('Fixed orphaned passwords:', orphanedCount);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
