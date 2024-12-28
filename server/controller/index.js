const { queryDb } = require("../helper/adminHelper");

const jwt = require('jsonwebtoken');  // Import the JWT library

const JWT_SECRET = 'sushma';
const generateJWT = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });  
};

exports.Registration = async (req, res) => {
    const { username, email, mobile_no, set_password, confirm_password } = req.body;
    if (!username || !email || !mobile_no || !set_password || !confirm_password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    try {
        const procedureQuery = 'CALL registration(?, ?, ?, ?, ?)';
        const result = await queryDb(procedureQuery, [username, email, mobile_no, set_password, confirm_password]);
        const userId = result.insertId;
        const token = generateJWT(userId);
        const tokenUpdateQuery = 'UPDATE contact SET token = ? WHERE id = ?';
        await queryDb(tokenUpdateQuery, [token, userId]);
        return res.status(200).json({
            msg: "Registered successfully",
            userId: userId,
            token: token 
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};


exports.UserList = async (req, res) => {
  try {
      const procedureQuery = 'SELECT id , mobile_no , username FROM registration'; 
      const result = await queryDb(procedureQuery);
      if (result.length === 0) {
          return res.status(404).json({ msg: "No users found" });
      }
      return res.status(200).json({ msg: "Users retrieved successfully", data: result });
  } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
  }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(201).json({ msg: 'email and password are required' });
    }
    try {
        const query = 'SELECT * FROM Registration WHERE email = ?';
        const login = await queryDb(query, [email]);
        if (login.length === 0) {
            return res.status(201).json({ msg: 'User not registered' });
        }
        const user = login[0];
        if (password !== user.set_password) {
            return res.status(201).json({ msg: 'Invalid email or password' });
        }
        const token = generateJWT(user.id);
        return res.status(200).json({
            msg: 'Login SuccessFully.',
            token: token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                mobile_no: user.mobile_no,
                set_password:user.set_password
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong in the API call' });
    }
};



exports.addContact = async (req, res) => {
    const { userid, username, t_id } = req.body;
    if (!userid || !username || !t_id) {
        return res.status(201).json({ msg: 'Both userid, username, and t_id are required' });
    }
    try {
        const checkQuery = 'SELECT * FROM contact WHERE userid = ? AND t_id = ?';
        const existingContact = await queryDb(checkQuery, [userid, t_id]);
        if (existingContact.length > 0) {
            return res.status(201).json({ msg: 'Contact already exists' });
        }
        const query = 'INSERT INTO contact (userid, username, t_id) VALUES (?, ?, ?)';
        await queryDb(query, [userid, username, t_id]);
        return res.status(200).json({ msg: 'Contact added successfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong while adding the contact' });
    }
};

exports.Contactlist = async (req, res) => {
    try {
        const { userId } = req.query; 
        const procedureQuery = 'SELECT id, username ,t_id  FROM contact WHERE userid = ?'; 
        const result = await queryDb(procedureQuery, [userId]);
        if (result.length === 0) {
            return res.status(201).json({ msg: "No users found for this UserId Please add the contact" });
        }
        return res.status(200).json({ msg: "Users retrieved successfully", data: result });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};


const moment = require('moment');
exports.SendMessage = async (req, res) => {
    const { userid, username, t_id, message } = req.body;
    const time = moment().format("YYYY-MM-DD HH:mm:ss"); 
    if (!userid || !username || !t_id || !message) {
        return res.status(400).json({ msg: 'Both userid, username, t_id, and message are required' });
    }
    
    try {
        const query = 'INSERT INTO Chat (userid, username, t_id, message, time) VALUES (?, ?, ?, ?, ?)';
        await queryDb(query, [userid, username, t_id, message, time]); 
        return res.status(200).json({
            msg: 'Message sent successfully',
            message: { userid, username, t_id, message, time }
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong while sending the message' });
    }
};


exports.RecieverList = async (req, res) => {
    try {
        const { userId } = req.query;
        const procedureQuery = `
            SELECT id, username, t_id, message , time
            FROM chat
            WHERE t_id = ? AND userid != ?`; 
       const result = await queryDb(procedureQuery, [userId, userId]);
        if (result.length === 0) {
            return res.status(201).json({ msg: "No messages found" });
        }
        return res.status(200).json({ msg: "Users retrieved successfully", data: result });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};
exports.AllChat = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ msg: "User ID is required." });
        }

        const procedureQuery = `
            SELECT id, username, t_id, message, time
            FROM chat
            WHERE userid = ?`;

        const result = await queryDb(procedureQuery, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ msg: "No messages found" });
        }

        return res.status(200).json({ msg: "Messages retrieved successfully", data: result });
    } catch (e) {
        console.error("Error: ", e); // Log the entire error object for better debugging.
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};





