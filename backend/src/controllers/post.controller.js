import { Post } from "../model/post.model.js";

const createPost = async (req, res) => {
  try {
    const { name, desciption, age } = req.body;

    // Ghi chú:
    // - Schema hiện dùng field `desciption` (bị sai chính tả) → controller giữ nguyên để không phá data/API.
    // - Nếu muốn sửa thành `description` cần migration + update toàn bộ chỗ dùng field này.
    if (!name || !desciption || !age ) {
      return res.status(400).json({ message: "Name, desciption and age are required" });
    }

    const post = await Post.create({ name, desciption, age });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getPosts = async (req , res) => {
  try {
    const getPost = await Post.find();
    res.status(200).json({ message : "Posts fetched successfully" , getPost });
  } catch (error) {
    res.status(500).json({
      message : "Internal Server Error" ,
      error : error.message
    });
  }
}

const updatePost = async (req , res) => {
  try {
    // BASIC VALIVATION TO CHECK IF THE POST ID IS PROVIDED 
    // { name : x , desciption : y , age : z } -> { name , desciption , age }
    // { } = truthy
    if( Object.keys(req.body).length === 0 ) {
      return res.status(400).json({
        message : "No fields to update"
      });
    }

    const post = await Post.findByIdAndUpdate(req.params.id , req.body , { new : true }); 
    if( !post ) {
      return res.status(404).json({
        message : "Post not found"
      });
    }
    res.status(200).json({
      message : "Post updated successfully" , post });
  }catch (error) {
    res.status(500).json({
      message : "Internal Server Error" ,
      error : error.message
    });
  }
}


const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if ( !deleted)
    {
      return res.status(404).json({
        message : "Post not found"
      });
    }
    res.status(200).json({
      message : "Post deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message : "Internal Server Error" ,
      error : error.message
    });
  }
}

export { createPost , getPosts , updatePost , deletePost };