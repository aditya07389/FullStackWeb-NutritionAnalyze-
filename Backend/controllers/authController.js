// Backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organization, sequelize, Sequelize } = require('../models');

// ============================
// REGISTER FUNCTION
// ============================
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
  let newUser;

  try {
    // 2. Check for existing user
    const existingUser = await User.findOne({ 
      where: { email: email } 
    }, { transaction: t });

    if (existingUser) {
      await t.rollback();
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
    }, { transaction: t });

    // 5. Create the default organization
    await Organization.create({
        name: `${newUser.username}'s Organization`,
        adminId: newUser.id,
    }, { transaction: t });

    await t.commit();

  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ msg: 'Username already taken.' });
    }
    
    console.error(err.message);
    return res.status(500).send('Server error during transaction.');
  }

  // 6. Generate JWT and send to client
  try {
    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.status(201).json({ token });
  } catch (jwtError) {
    console.error('JWT Signing Error:', jwtError.message);
    res.status(500).json({ msg: 'User registered, but token generation failed.' });
  }
};

// ============================
// LOGIN FUNCTION
// ============================
exports.login = async (req, res) => {
  const { Op } = Sequelize; 
  const { loginIdentifier, password } = req.body;

  if (!loginIdentifier || !password) {
    return res.status(400).json({ msg: 'Please provide a username/email and password.' });
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: loginIdentifier },
          { username: loginIdentifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    );

    res.status(200).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ============================
// GOOGLE CALLBACK FUNCTION
// ============================
exports.googleCallback = (req, res) => {
  const user = req.user;

  const payload = { user: { id: user.id } };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '100h' }
  );

  res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
};
