import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import fs from'fs'
import path from 'path'


const jwt_key = process.env.JWT_KEY;


//הצגת כל הפוסטים
export const getAllPosts = async (req, res) => {
  try {
    const { search, category, gender, location, type, isEducated, isImmune, isCastrated, minAge, maxAge, myPosts } = req.query;

    let query = {};

    query.isConfirmed = true;
    if (myPosts) {

      const token = myPosts;
        const decoded = jwt.verify(token, jwt_key);
        const userId = decoded.id;
        
        
      query.author = userId;
    }

    if (search) {
      var regexp = new RegExp("^" + search, "i");
      query.name = { $regex: regexp };
    }
    

    if (category) {
      query.category = category;
    }

    if (gender) {
      query.gender = gender;
    }

    if (location) {
      query.location = location;
    }

    if (type) {
      query.type = type;
    }

    if (isEducated) {
      query.isEducated = isEducated;
    }

    if (isImmune) {
      query.isImmune = isImmune;
    }

    if (isCastrated) {
      query.isCastrated = isCastrated;
    }


    if (minAge && maxAge) {
      const minAgeNumber = parseInt(minAge);
      const maxAgeNumber = parseInt(maxAge);

      if (minAgeNumber > maxAgeNumber) {
        return res.status(400).json({ message: "Invalid age range. Minimum age should be less than or equal to maximum age." });
      }

      // Add age range condition to the query
      query.age = {
        $gte: minAgeNumber,
        $lte: maxAgeNumber
      };
    }

    let posts = await Post.find(query);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getMyPosts = async (req, res) => {
  try {
    const { search, category, gender, location, type, isEducated, isImmune, isCastrated, minAge, maxAge, myPosts } = req.query;

    let query = {};

    
    if (myPosts) {

      const token = myPosts;
        const decoded = jwt.verify(token, jwt_key);
        const userId = decoded.id;
        
        
      query.author = userId;
    }

    if (search) {
      var regexp = new RegExp("^" + search, "i");
      query.name = { $regex: regexp };
    }

    if (category) {
      query.category = category;
    }

    if (gender) {
      query.gender = gender;
    }

    if (location) {
      query.location = location;
    }

    if (type) {
      query.type = type;
    }

    if (isEducated) {
      query.isEducated = isEducated;
    }

    if (isImmune) {
      query.isImmune = isImmune;
    }

    if (isCastrated) {
      query.isCastrated = isCastrated;
    }


    if (minAge && maxAge) {
      const minAgeNumber = parseInt(minAge);
      const maxAgeNumber = parseInt(maxAge);

      if (minAgeNumber > maxAgeNumber) {
        return res.status(400).json({ message: "Invalid age range. Minimum age should be less than or equal to maximum age." });
      }

      // Add age range condition to the query
      query.age = {
        $gte: minAgeNumber,
        $lte: maxAgeNumber
      };
    }

    let posts = await Post.find(query);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const adoptedPosts = async (req, res) => {
  try {
    const { search, category, gender, location, type, isEducated, isImmune, isCastrated, minAge, maxAge, } = req.query;

    let query = {};
    query.isAdopted = true;
    query.isConfirmed = true;
 
    if (search) {
      var regexp = new RegExp("^" + search, "i");
      query.name = { $regex: regexp };
    }

    if (category) {
      query.category = category;
    }

    if (gender) {
      query.gender = gender;
    }

    if (location) {
      query.location = location;
    }

    if (type) {
      query.type = type;
    }

    if (isEducated) {
      query.isEducated = isEducated;
    }

    if (isImmune) {
      query.isImmune = isImmune;
    }

    if (isCastrated) {
      query.isCastrated = isCastrated;
    }


    if (minAge && maxAge) {
      const minAgeNumber = parseInt(minAge);
      const maxAgeNumber = parseInt(maxAge);

      if (minAgeNumber > maxAgeNumber) {
        return res.status(400).json({ message: "Invalid age range. Minimum age should be less than or equal to maximum age." });
      }

      // Add age range condition to the query
      query.age = {
        $gte: minAgeNumber,
        $lte: maxAgeNumber
      };
    }

    let posts = await Post.find(query);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





  // Server controller
export const adoptPost = async (req, res) => {
  try {
    const postId = req.params.id; // Assuming the post ID is passed as a route parameter

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update the isAdopted field to true
    post.isAdopted = true;
    await post.save();

    // Return the updated post
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  

//הצגת פוסט יחיד
// Server controller
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id; // Assuming the post ID is passed as a route parameter

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(post.author);

    let username = 'משתמש לא קיים';
    let image = '/maleDefaultImage.jpg'; // You can set a default image URL or any other value

    if (user) {
      // If the user is found, extract username and image from the user object
      username = user.username;
      image = user.image;
    }

    const postWithUser = {
      ...post.toObject(),
      author: {
        id: post.author,
        username: username,
        image: image
      }
    };

    res.json(postWithUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};





//העלאת פוסט
export const savePost = async (req, res) => {
    try 
    {
        //const image  = req.file.path.replace('uploads\\', "/");
        const token = req.body.userId;
        const decoded = jwt.verify(token, jwt_key);
        const userId = decoded.id;
        
    
        let post = new Post({
            title: req.body.title,
            category: req.body.category,
            gender: req.body.gender,
            location: req.body.location,
            type: req.body.type,
            age: req.body.age,
            description: req.body.description,
            name: req.body.name,
            author: userId,
            
        });
        console.log("req.files : ",req.files)


        const uploadPromises = req.files.map(file => file.path);
        const uploadedPaths = await Promise.all(uploadPromises);

        if (uploadedPaths.length > 0) {
            post.image = uploadedPaths.join(',');
        } else {
            post.image = '/defaultImage.png';
        }
        
        if(req.files) {
          let path = ''
          req.files.forEach(function(files, index, arr) {
            path = path + files.path + ','
          })
            path = path.substring(0, path.lastIndexOf(","))
            post.image = path;
          }
          if(post.image == ''){
            post.image = '/defaultImage.png'
          }
        
        if(req.body.isImmune)
        {
          post.isImmune = req.body.isImmune;
        }
        if(req.body.isEducated)
        {
          post.isEducated = req.body.isEducated;
        }
        if(req.body.isCastrated)
        {
          post.isCastrated = req.body.isCastrated;
        }
      
        console.log(post)
        const insertedpost = await post.save();
        res.status(201).json(insertedpost);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const updatePost = async (req, res) => {
  try {
    const token = req.body.userId;
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;
    const user = await User.findById(decoded.id);


    const postById = await Post.findById(req.params.id);

    if (userId != postById.author || !user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
   

    console.log("Received files:", req.files);
    const { title, category, gender, location, type, age, description, name, isImmune, isEducated, isCastrated } = req.body;

    // Get existing post data from the database
    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    let remainingImagePaths = existingPost.image.split(',');

    const removedImageIndices = JSON.parse(req.body.removedImageIndices) || [];
    removedImageIndices.sort((a, b) => b - a); // Sort indices in descending order
    removedImageIndices.forEach((index) => {
      if (index >= 0 && index < remainingImagePaths.length) {
        remainingImagePaths.splice(index, 1);
      }
    });
    let finalImagePaths = remainingImagePaths.join(','); // Join remaining paths
    // Add new images to the final image paths
    if (req.files) {
      const uploadedPaths = req.files.map((file) => file.path);
      uploadedPaths.forEach((path) => {
        // Check if the path is not the default image and not in finalImagePaths
        if (path !== '/defaultImage.png' && !finalImagePaths.includes(path)) {
          finalImagePaths = finalImagePaths.length > 0 ? `${finalImagePaths},${path}` : path;
        }
      });
    }

    // If there are no images at all, set the image to the default image path
    if (!finalImagePaths) {
      finalImagePaths = '/defaultImage.png';
    } else {
      // Remove the default image if present among the images
      finalImagePaths = finalImagePaths.replace('/defaultImage.png,', '');
    }

    // Update the post with new data and appended images
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        gender,
        location,
        type,
        age,
        description,
        name,
        isImmune,
        isEducated,
        isCastrated,
        image: finalImagePaths, // Update the image field with finalImagePaths
      },
      { new: true }
    );

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

 


export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const token = req.headers.authorization; // Retrieve the entire Authorization header
    const decoded = jwt.verify(token, jwt_key);
    const user = await User.findById(decoded.id);

    const post = await Post.findById(postId);
    if (post.author.toString() == decoded.id || user.isAdmin ) {
      await Post.findByIdAndDelete(postId);
      return res.status(200).json({ message: 'Post deleted' });
    }
    else {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'You are not authorized to perform this action' });
  }
};


export const somePosts = async (req, res) => {
  try {
    const posts = await Post.find().limit(6); // Retrieve only the top 5 posts
    
    return res.json(posts);
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
};


  export const getPostImage = async (req, res) => {
    const { filename } = req.params;
  const imagePath = path.join(__dirname, 'public', 'images', filename);

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    // Read the file from disk and send it to the client
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, send a 404 error
    res.sendStatus(404);
  }
  }


  export const deleteImage = async (req, res) => {
    try {
      const posts = await Post.find().limit(6); // Retrieve only the top 5 posts
      
      return res.json(posts);
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }
  };