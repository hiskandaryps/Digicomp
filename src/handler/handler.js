const bcrypt = require('bcryptjs');
const supabase = require("../config/connection");

//non routes function
function response(status, data, message, res) {
    res.status(status).json({ status, data, message });
}

// Function to calculate average values
function calculateAverage(data) {
    const total = data.length;
    const sum = data.reduce((acc, curr) => {
        return {
            temp: acc.temp + curr.temp,
            humi: acc.humi + curr.humi,
            ph: acc.ph + curr.ph,
            temp_ambiance: acc.temp_ambiance + curr.temp_ambiance,
            humi_ambiance: acc.humi_ambiance + curr.humi_ambiance
        };
    }, { temp: 0, humi: 0, ph: 0, temp_ambiance: 0, humi_ambiance: 0 });

    return {
        temp: sum.temp / total,
        humi: sum.humi / total,
        ph: sum.ph / total,
        temp_ambiance: sum.temp_ambiance / total,
        humi_ambiance: sum.humi_ambiance / total
    };
}

async function insertRecords(data) {
    await supabase
        .from('records')
        .insert([
            {
                temp: data.temp,
                humi: data.humi,
                ph: data.ph,
                temp_ambiance: data.temp_ambiance,
                humi_ambiance: data.humi_ambiance
            }
        ]);
}

async function resetRealtimeTable() {
    // Delete all data from the realtime table
    await supabase
    .from('realtime')
    .delete()
    .gt('id', 0)
}

//routes function
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

async function getRealtime(req, res) {
    try {
        const { data, error } = await supabase
            .from('realtime')
            .select('*')
            .order('inserted_at', { ascending: false }) // Sort by newest timestamp first
            .limit(1); // Limit to only one row

        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "Latest data retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function getRecords(req, res) {
    try {
        // Fetch data from realtime table
        const { data: realtimeData, error: realtimeError } = await supabase
            .from('realtime')
            .select('*');

        if (realtimeError) {
            return response(500, null, realtimeError.message, res);
        }

        // Check if there are more than 5 records
        if (realtimeData.length >= 5) {
            // Calculate average values
            const averageValues = calculateAverage(realtimeData);

            // Insert average values into records table
            await insertRecords(averageValues);

            await resetRealtimeTable();

        }

        // Fetch content of records table
        const { data: recordsData, error: recordsError } = await supabase
            .from('records')
            .select('*');

        if (recordsError) {
            return response(500, null, recordsError.message, res);
        }

        // Return content of records table
        return response(200, recordsData, "Data retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

// Exporting the handler functions
module.exports = { register, logIn, getUser, getRealtime, getRecords };