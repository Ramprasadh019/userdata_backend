import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define a schema and model for your user data
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  address1: String,
  address2: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Create a route to handle form submissions using POST
app.post('/usersData', async (req, res) => {

  const { firstName, lastName, email, mobile, address1, address2} = req.body

  const data = {
    firstName: firstName,
    lastName:lastName,
    email:email,
    mobile:mobile,
    address1:address1,
    address2:address2
  }

  try {
    const newUser = await User.create(data);
    console.log(5, data); 
    if(newUser){
      res.status(201).json({ message: 'User data saved successfully' , data:newUser});
      console.log(newUser);
    }else{
      res.status(400).json({ message: 'User data not saved successfully'});
    }
   
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'An error occurred while saving user data' });
  }
});


app.get('/usersData', async (req, res) => {
  try{
    const userData = await User.find({});
    res.send({data:userData});
  }
  catch(err){
    console.log(err);
  }
})

app.put("/userEdit/:_id", async (req, res) => {
  const userId = req.params._id;
  const updatedUserData = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUserData },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ msg: 'User not found' });
    }

    return res.status(200).send({ msg: 'Successfully updated', data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: 'Internal server error' });
  }
});


app.delete("/users/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user);
   
    if(!user){
      return res.status(404).send({msg:'user not found'})
    }

    return res.status(200).send({msg:"successfully delete"})
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
