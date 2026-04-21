import mongoose, { Schema } from "mongoose"; // mongoose để kết nối MongoDB, Schema để định nghĩa cấu trúc dữ liệu
import bcrypt from "bcrypt" ; 


// định nghĩa cấu trúc (schema) cho bảng User trong database
const userSchema = new Schema(
  {
    name: {
      type: String,      // kiểu dữ liệu là chuỗi văn bản
      required: true,    // bắt buộc phải có, không được để trống
      unique: true,      // không được trùng tên với người dùng khác
      lowercase: true,   // tự động chuyển thành chữ thường khi lưu
      trim: true,        // tự động xóa khoảng trắng thừa ở đầu và cuối (ví dụ: "  huy long  " → "huy long")
      minlength: 1,      // độ dài tối thiểu là 1 ký tự
      maxLength: 10,     // độ dài tối đa là 10 ký tự
    },
    password: {
      type: String,      // kiểu dữ liệu là chuỗi văn bản
      required: true,    // bắt buộc phải có
      minlength: 1,      // độ dài tối thiểu là 1 ký tự
      maxLength: 10,     // độ dài tối đa là 10 ký tự
    },
    email: {
      type: String,      // kiểu dữ liệu là chuỗi văn bản
      required: true,    // bắt buộc phải có
      unique: true,      // mỗi email chỉ được dùng cho 1 tài khoản
      lowercase: true,   // tự động chuyển email thành chữ thường khi lưu
      trim: true,        // xóa khoảng trắng thừa ở đầu/cuối email
    },
  },
  {
    timestamps: true, // tự động thêm 2 trường: createdAt (ngày tạo) và updatedAt (ngày cập nhật cuối)
  }
);


// before saving any password we need to hash 
userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password , 10 );

  next();
});

// compare password
// Ghi chú: phải dùng `userSchema.methods` (số nhiều) để tạo instance method cho document.
// Nếu ghi nhầm `userSchema.method` thì `user.comparePassword` sẽ không tồn tại khi login.
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


// tạo model "User" từ schema trên — đây là đối tượng dùng để truy vấn database 
export const User = mongoose.model("User", userSchema);
