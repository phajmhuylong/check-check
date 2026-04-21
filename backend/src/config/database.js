import mongoose from "mongoose"; // thư viện kết nối MongoDB cho Node.js

// hàm bất đồng bộ để kết nối tới MongoDB
const connectDB = async () => {
  // kiểm tra xem biến môi trường MONGODB_URI đã được cấu hình chưa
  if (!process.env.MONGODB_URI) {
    // Fail fast để tránh app chạy "giả vờ" trong khi thiếu cấu hình DB.
    throw new Error("MONGODB_URI is not defined in environment");
  }

  try {
    // strictQuery: true → Mongoose sẽ báo lỗi nếu bạn truy vấn field không có trong schema,
    // giúp phát hiện lỗi typo sớm hơn thay vì âm thầm trả về kết quả rỗng.
    mongoose.set("strictQuery", true);

    // thực hiện kết nối tới MongoDB bằng URI trong file .env
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // nếu sau 10 giây không kết nối được (sai URI, mất mạng…) thì tự động báo lỗi
      serverSelectionTimeoutMS: 10_000,
    });

    // in ra host của MongoDB khi kết nối thành công
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    return conn; // trả về đối tượng kết nối để dùng nếu cần
  } catch (error) {
    // bọc lại lỗi với thông điệp rõ ràng hơn để dễ debug
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB; // xuất hàm để index.js gọi khi khởi động server
