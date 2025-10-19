// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organization, sequelize, Sequelize } = require('../models');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Basic Validation
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields.' });
  }
  if (password.length < 10) {
    return res.status(400).json({ msg: 'Password must be at least 10 characters long.' });
  }

  const t = await sequelize.transaction();
  let newUser; // Define newUser here so we can access it outside the try block

  try {
    // 2. Check for existing user (moved inside transaction)
    const existingUser = await User.findOne({ 
      where: { email: email } 
    }, { transaction: t });

    if (existingUser) {
      await t.rollback(); // Abort the transaction
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user
    newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        // Credits will be set by the defaultValue in the model
    }, { transaction: t });

    // 5. Create the default organization
    await Organization.create({
        name: `${newUser.username}'s Organization`,
        adminId: newUser.id,
    }, { transaction: t });

    // If everything was successful, commit the transaction
    await t.commit();

  } catch (err) {
    // If any error occurred *before* the commit, rollback
    // We check if the transaction is finished, just in case
    if (!t.finished) {
      await t.rollback();
    }
    
    // Handle other errors (like duplicate username, since email is now checked above)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ msg: 'Username already taken.' });
    }
    
    console.error(err.message);
    return res.status(500).send('Server error during transaction.');
  }

  // --- Moved JWT and Response *outside* the transaction block ---
  // This code only runs if the transaction was successful
  try {
    // 6. Generate a JWT
    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3h' } // Token expires in 3 hours
    );

    // 7. Send the token back to the client
    res.status(201).json({ token });

  } catch (jwtError) {
    // This catches errors from jwt.sign (e.g., missing JWT_SECRET)
    console.error('JWT Signing Error:', jwtError.message);
    // We've created the user, but can't give them a token.
    // This is a server error, but the user *is* registered.
    res.status(500).json({ msg: 'User registered, but token generation failed.' });
  }
};


// controllers/authController.js

// ... (your register function) ...

exports.login = async (req, res) => {
  // Get the Op operator from the Sequelize constructor
  const { Op } = Sequelize; 
  
  // --- CHANGE 1: Expect 'loginIdentifier' instead of 'email' ---
  const { loginIdentifier, password } = req.body;

  // 1. Basic Validation
  if (!loginIdentifier || !password) {
    return res.status(400).json({ msg: 'Please provide a username/email and password.' });
  }

  try {
    // --- CHANGE 2: Update the database query ---
    // Find the user by EITHER email OR username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: loginIdentifier },
          { username: loginIdentifier }
        ]
      }
    });

    // 3. Check if user exists
    if (!user) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    // 4. Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    // 5. Check if password matches
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    // 6. User is valid! Create a JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // 7. Sign and send the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.status(200).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};