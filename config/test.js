
const { MongoClient } = require("mongodb");

const uri = "'mongodb://127.0.0.1:27017/mongodb+srv://admin:<admin>@admin.eptu5.mongodb.net/Hospital_Management?retryWrites=true&w=majority&appName=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");
  } catch (error) {
    console.error("❌ Connection error:", error);
  } finally {
    await client.close();
  }
}

run();
