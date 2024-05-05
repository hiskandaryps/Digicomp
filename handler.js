// handler.js
const supabase = require("./connection");

function response(status, data, message, res) {
    res.status(status).json({ status, data, message });
}

async function getUser(req, res) {
    try {
        let { data: students, error } = await supabase
            .from('users')
            .select('*')
            .order('id', { ascending: true });
        
        if (error) {
            response(500, null, "Internal Server Error", res);
        } else {
            if (students.length === 0) {
                response(404, null, "No data found", res);
            } else {
                response(200, students, "Data fetched successfully", res);
            }
        }
    } catch (error) {
        response(500, null, "Internal Server Error", res);
    }
}

async function checkUser(req, res) {
    const { email, password } = req.body;

    try {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
            if (!users) {
                response(404, null, "User not found", res);
            } else {
                const isValidCredentials = users.password === password;
                if (!isValidCredentials) {
                    response(401, null, "Invalid credentials", res);
                } else {
                    response(200, "Confidentials", "Login Success", res);
                }
            }
        
    } catch (error) {
        console.error('Error executing query', error);
        response(500, null, "Internal Server Error", res);
    }
}

async function postUser(req, res) {
    const { username, email, password } = req.body;

    try {
        let { error } = await supabase
            .from('users')
            .insert([
                { username, email, password }
            ]);

        if (error) {
            console.error('Error executing query', error);
            response(500, null, "Internal Server Error", res);
        } else {
            // Fetch the inserted data
            let { data: insertedData, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email) // Assuming student_id is unique

            if (fetchError) {
                console.error('Error fetching inserted data', fetchError);
                response(500, null, "Internal Server Error", res);
            } else {
                // If data was inserted successfully, return it in the response
                response(201, insertedData[0], "Student data inserted successfully", res);
            }
        }
    } catch (error) {
        console.error('Error executing query', error);
        response(500, null, "Internal Server Error", res);
    }
}

module.exports = { getUser, checkUser, postUser };