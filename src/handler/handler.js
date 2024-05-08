const bcrypt = require('bcryptjs');
const supabase = require("../config/connection");

function response(status, data, message, res) {
    res.status(status).json({ status, data, message });
}

// Function to register a new user
async function register(req, res) {
    const { Username, Email, Password } = req.body;

    // Regular expression for validating email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the provided email address is valid
    if (!emailRegex.test(Email)) {
        return response(400, null, "Invalid email address", res);
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([
                { Username, Email, Password: hashedPassword }
            ]);

        if (error) {
            return response(500, null, error.message, res);
        } else {
            // Fetch the inserted data
            const { data: registeredData, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('Email', Email);

            if (fetchError) {
                console.error('Error fetching inserted data', fetchError);
                return response(500, null, "Internal server error", res);
            }

            if (!registeredData || registeredData.length === 0) {
                console.error('No data found after registration');
                return response(500, null, "Internal server error", res);
            }

            // If data was inserted successfully, return it in the response
            const responseData = {
                Username: registeredData[0].Username,
                Email: registeredData[0].Email,
                inserted_at: registeredData[0].inserted_at,
                updated_at: registeredData[0].updated_at
            };

            return response(200, responseData, "Registration complete", res);
        }   
    } catch (error) {
        console.error('Error in registration process', error);
        return response(500, null, error.message, res);
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
            return response(500, null, error.message, res);
        }

        if (data.length === 0) {
            return response(401, null, "Invalid email address", res);
        }

        // Compare the hashed password
        const match = await bcrypt.compare(Password, data[0].Password);
        if (!match) {
            return response(401, null, "Invalid password", res);
        }

        const responseData = {
            Username: data[0].Username,
            Email: data[0].Email,
            inserted_at: data[0].inserted_at,
            updated_at: data[0].updated_at
        };
        
        return response(200, responseData, "Login successful", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

// Function to get user details
async function getUser(req, res) {
    try {
        const { data, error } = await supabase
        .from('users')
        .select('*');

        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "Data retreived", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

// Exporting the handler functions
module.exports = { register, logIn, getUser };