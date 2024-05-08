const bcrypt = require('bcryptjs');
const supabase = require("../config/connection");

function response(status, data, message, res) {
    res.status(status).json({ status, data, message });
}

// Function to register a new user
async function register(req, res) {
    const { Username, Email, Password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        const { data, error } = await supabase
        .from('users')
        .insert([
            { Username, Email, Password: hashedPassword }
        ]);

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            // Fetch the inserted data
            const { data: registeredData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('Email', Email);

        if (fetchError) {
            console.error('Error fetching inserted data', fetchError);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (!registeredData || registeredData.length === 0) {
            console.error('No data found after registration');
            return res.status(500).json({ error: "No data found after registration" });
        }

        // If data was inserted successfully, return it in the response
        const responseData = {
            Username: registeredData[0].Username,
            Email: registeredData[0].Email,
            inserted_at: registeredData[0].inserted_at,
            updated_at: registeredData[0].updated_at
        };

        res.status(200).json({ message: "Login successful", user: responseData });
        }   
    } catch (error) {
        console.error('Error in registration process', error);
        res.status(500).json({ error: error.message });
    }
}

// Function to log in an existing user
async function logIn(req, res) {
    const { Email, Password } = req.body;

    try {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('Email', Email);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid email" });
        }

        // Compare the hashed password
        const match = await bcrypt.compare(Password, data[0].Password);
        if (!match) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const responseData = {
            Username: data[0].Username,
            Email: data[0].Email,
            inserted_at: data[0].inserted_at,
            updated_at: data[0].updated_at
        };
        
        res.status(200).json({ message: "Login successful", user: responseData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to get user details
async function getUser(req, res) {
    try {
        const { data, error } = await supabase
        .from('users')
        .select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ users: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Exporting the handler functions
module.exports = { register, logIn, getUser };