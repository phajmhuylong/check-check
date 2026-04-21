import { User } from "../model/user.model.js"; // import model User để thao tác với database

// hàm xử lý đăng ký tài khoản mới — được gọi khi client gửi POST /api/users/register
const register = async (req, res) => {
  try {
    // lấy name, email, password từ dữ liệu người dùng gửi lên (req.body là body của HTTP request)
    const { name, email, password } = req.body;

    // kiểm tra xem người dùng có điền đủ 3 trường không, nếu thiếu thì trả về lỗi 400 (Bad Request)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // tìm trong database xem email này đã được đăng ký chưa
    // email.toLowerCase() để tránh trường hợp "Test@Gmail.com" và "test@gmail.com" bị coi là khác nhau
    const existing = await User.findOne({ email: email.toLowerCase() });

    // nếu tìm thấy email đã tồn tại thì từ chối đăng ký
    if (existing) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // tạo user mới và lưu vào database
    const user = await User.create({
      name,
      email: email.toLowerCase(),  // lưu email dạng chữ thường để đồng nhất dữ liệu
      // Ghi chú: password sẽ được hash tự động bởi `userSchema.pre("save")` trong model.
      // (User.create -> save -> hook chạy)
      password,
    });

    // trả về mã 201 (Created) và thông tin user vừa tạo — không trả về password vì lý do bảo mật
    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    // nếu có lỗi không mong muốn (ví dụ: mất kết nối DB), trả về lỗi 500 (Internal Server Error)
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async ( req , res ) => {
    try {
    
        // checking if the user already exists
        // Ghi chú: dữ liệu client gửi lên nằm ở `req.body` (không phải `req.res`).
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({
          email : email.toLowerCase()
        });

        if(!user) return res.status(400).json({ message: "User not found !" });


        // compare password 
        // Ghi chú:
        // - User mới: password trong DB là bcrypt hash ($2a$/$2b$/$2y$...) -> dùng bcrypt.compare.
        // - User cũ (tạo trước khi có hook hash / insert trực tiếp): password có thể là plain text.
        //   Nếu plain text match thì tự động migrate: gán lại password và save để hook hash chạy.
        const looksLikeBcryptHash = typeof user.password === "string" && /^\$2[aby]\$/.test(user.password);
        let isMatch = false;

        if (looksLikeBcryptHash) {
          isMatch = await user.comparePassword(password);
        } else {
          // Backward compatibility: some existing users may have plaintext passwords saved
          // (created before hashing middleware existed, or inserted without running hooks).
          isMatch = user.password === password;

          if (isMatch) {
            // migrate-in-place: set plaintext password and let pre("save") hash it
            user.password = password;
            await user.save();  
          }
        }

        if (!isMatch) return res.status(400).json({ message : "passwword is wrong !!! "}) ;

        res.status(200).json({ message : "User logged in " , 
          user : user._id,
          email : user.email,
          username : user.name
        }) ;

    } catch (error) {
      res.status(500).json({
        message : "Internal Sever Error ! "
      });
    }
};


const logout = async ( req , res ) => {
    try {
      const { email } = req.body ; 
      const user = await User.findOne({
        
      });

      if( !user ) return res.status(404).json({
        message : " User not found !"
      });

      res.status(200).json({
        message : " Logout seccesfull "
      });


    } catch (error) {
      res.status(500).json({
        message : " Internal Sever Error "
      });
    }
}


export { register , login , logout}; // xuất hàm để file route có thể import và sử dụng
