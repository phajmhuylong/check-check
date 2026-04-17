import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    // Fail fast để tránh app chạy “giả vờ” trong khi thiếu cấu hình DB.
    throw new Error("MONGODB_URI is not defined in environment");
  }

  try {
    // strictQuery giúp tránh các query “mơ hồ” khi bạn vô tình truyền field không tồn tại.
    // (Mongoose đã thay đổi default theo version, nên set rõ ràng cho dễ đoán hành vi.)
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Tránh bị treo lâu khi URI sai / DNS lỗi / không có mạng.
      serverSelectionTimeoutMS: 10_000,
    });

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Bọc lại message để log rõ là lỗi ở bước connect DB.
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;