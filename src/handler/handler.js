//handler.js
const bcrypt = require('bcryptjs');
const supabase = require("../config/connection");
const { generateAccessToken } = require("../middleware/jsonwebtoken");
const system = require("../functions/fuzzyinferencesystem");
const { response, getDate, calculateTemp, calculateAverage, distributeValues } = require("../functions/function");

// function determinePhase(mesotemp, thermotemp, temp, waktu) {
//     if (temp < thermotemp & waktu <= 4){
//         return "Mesofilik 1";
//     } else if (temp > thermotemp & 3 < waktu <= 14){
//         return "Thermofilik";
//     } else if (temp < thermotemp & 12 < waktu <= 20){
//         return "Mesofilik 2";
//     } else if (temp < mesotemp & 12 < waktu <= 20 or temp < thermotemp & 17 < waktu <= 40 ){
//         return "Maturasi";
//     }
// }

async function resetRealtimeTable() {
    // Delete all data from the realtime table
    await supabase
    .from('realtime')
    .delete()
    .gt('id', 0)
}

async function resetRecordsTable() {
    // Delete all data from the realtime table
    await supabase
    .from('records')
    .delete()
    .gt('id', 0)
}

//routes function
// Function to register a new user
async function register(req, res) {
    const { Username, Email, Password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(Email)) {
        return response(400, null, "Invalid email address", res);
    }

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);

        await supabase.auth.signUp({
            email: Email,
            password: hashedPassword
          })

        const { data, error } = await supabase
            .from('users')
            .insert([
                { Username, Email, Password: hashedPassword }
            ])
            .select();

        if (error) {
            return response(500, null, error.message, res);
        } else {
            return response(200, data, "Registration complete", res);
        }   
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

// Function to log in an existing user
async function logIn(req, res) {
    const { Email, Password } = req.body;

    try {
        await supabase.auth.signInWithPassword({
            email: Email,
            password: Password
          })

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

        const token = generateAccessToken(data[0].Username);

        const responseData = {
            username: data[0].Username,
            email: data[0].Email,
            token: token
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

async function postRealtime(req, res) {
    let id;
    let increment;
    
    const { 
        temp,
        humi,
        ph,
        temp_ambiance,
        humi_ambiance } = req.body;

    try {
        const { data: realtimeData, error: realtimeError } = await supabase
            .from('realtime')
            .select('*');

        if (realtimeError) {
            return response(500, null, realtimeError.message, res);
        }

        // Check if there are more than 5 records
        increment = realtimeData.length + 1;
        id = increment;

        const { data, error } = await supabase
            .from('realtime')
            .insert([
            {
                id,
                temp,
                humi,
                ph,
                temp_ambiance,
                humi_ambiance
            }
            ])
            .select();
        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "Data inserted", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function postRecords(req, res) {
    let id;
    let increment;

    try {
        // Fetch data from realtime table
        const { data: realtimeData, error: realtimeError } = await supabase
            .from('realtime')
            .select('*');

        if (realtimeError) {
            return response(500, null, realtimeError.message || "Realtime error", res);
        }

        // Check if there are more than 5 records
        if (realtimeData.length >= 5) {
            // Calculate average values
            const averageValues = calculateAverage(realtimeData);

            const { data: idData, error: idError } = await supabase
            .from('records')
            .select('*');

            if (idError) {
                return response(500, null, idError.message || "ID error", res);
            }

            increment = idData.length + 1;
            id = increment;

            const { data, error } = await supabase
            .from('records')
            .insert([
                {
                    id,
                    temp: averageValues.temp,
                    humi: averageValues.humi,
                    ph: averageValues.ph,
                    temp_ambiance: averageValues.temp_ambiance,
                    humi_ambiance: averageValues.humi_ambiance
                }
            ])
            .select();

            if (error) {
                return response(500, null, error.message || "Insert error", res);
            }

            await resetRealtimeTable();
            return response(200, data, "Data inserted", res);
        }

    } catch (error) {
        return response(500, null, error.message || "Unknown error", res);
    }
}

async function getRecords(req, res) {
    try {
        // Fetch content of records table
        const { data, error } = await supabase
            .from('records')
            .select('*');

        if (recordsError) {
            return response(500, null, error.message, res);
        }

        // Return content of records table
        return response(200, data, "Data retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function getControl(req, res) {
    try {
        const { data, error } = await supabase
            .from('control')
            .select('*')

        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "Control settings retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function putControlTemp(req, res) {

    try {
        const { 
            mesophilic_temp, 
            thermophilic_temp
        } = req.body;

        const values = distributeValues(mesophilic_temp, thermophilic_temp)

        const { data, error } = await supabase
            .from('control')
            .update({
                ...values,
                inserted_at: getDate()
            })
            .eq('id', 1)
            .select(); // Assuming there's only one row in the control table

        if (error) {
            return response(500, null, error.message, res);
        } else {
            return response(200, data, "Setting updated", res);
        }  
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function putControlMoist(req, res) {
    try {
        const { 
            moist_min, 
            moist_max
        } = req.body;

        const { data, error } = await supabase
            .from('control')
            .update({
                moist_min,
                moist_max,
                inserted_at: getDate()
            })
            .eq('id', 1)
            .select(); // Assuming there's only one row in the control table

        if (error) {
            return response(500, null, error.message, res);
        } else {
            return response(200, data, "Setting updated", res);
        }  
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function activateDevice(req, res) {
    try {
        const { data: stateData, error: stateError } = await supabase
            .from('state')
            .select('*');

        if (stateError) {
            return response(500, null, stateError.message, res);
        }

        if (stateData[0].state !== 0) {
            return response(400, null, "Device is already activated", res);
        }

        const state = 1;

        const { data, error } = await supabase
            .from('state')
            .update({
                state,
                date: getDate()
            })
            .eq('id', 1)
            .select();

        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "State updated", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function deactivateDevice(req, res) {
    try {
        const { data: stateData, error: stateError } = await supabase
            .from('state')
            .select('*');

        if (stateError) {
            return response(500, null, stateError.message, res);
        }

        if (stateData[0].state !== 1) {
            return response(400, null, "Device is already deactivated", res);
        }

        const state = 0;

        const { data, error } = await supabase
            .from('state')
            .update({
                state,
                date: getDate()
            })
            .eq('id', 1)
            .select();

        if (error) {
            return response(500, null, error.message, res);
        }

        resetRealtimeTable();
        resetRecordsTable();

        return response(200, data, "State updated", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function getState(req, res) {
    try {
        const { data, error } = await supabase
            .from('state')
            .select('*')

        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "State retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function getDays(req, res) {
    try {
        const { data: stateData, error: stateError } = await supabase
            .from('state')
            .select('*')
            .eq('id', 1);

        if (stateError) {
            return response(500, null, stateError.message, res);
        }

        const { state, date } = stateData[0];

        // Check if state is 1
        if (state !== 1) {
            return response(400, null, "State is not active", res);
        }

        const pastDate = new Date(date);
        const currentDate = new Date();
        const currentDateWithOffset = new Date(currentDate.getTime() + (7 * 60 * 60 * 1000));

        // Calculate the difference in time
        const diffTime = Math.abs(currentDateWithOffset - pastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return response(200, { days: diffDays }, "Elapsed days counted", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

// async function getMinutes(req, res) {
//     try {
//         const { data: stateData, error: stateError } = await supabase
//             .from('state')
//             .select('*')
//             .eq('id', 1);

//         if (stateError) {
//             return response(500, null, stateError.message, res);
//         }

//         const { state, date } = stateData[0];

//         // Check if state is 1
//         if (state !== 1) {
//             return response(400, null, "State is not active", res);
//         }

//         const pastDate = new Date(date);
//         const currentDate = new Date();
//         const currentDateWithOffset = new Date(currentDate.getTime() + (7 * 60 * 60 * 1000));

//         console.log("Parsed past date:", pastDate);
//         console.log("Current date:", currentDateWithOffset);

//         // Calculate the difference in time
//         const diffTime = Math.abs(currentDateWithOffset - pastDate);
//         const diffMinutes = Math.floor(diffTime / (1000 * 60));

//         console.log("Difference in time (ms):", diffTime);
//         console.log("Difference in minutes:", diffMinutes);

//         return response(200, { minutes: diffMinutes }, "Minutes counted", res);
//     } catch (error) {
//         return response(500, null, error.message, res);
//     }
// }

async function calculateFIS(req, res) {
    const { currentTemp, targetTemp } = req.body;

    try {
        const [heaterPWM, exhaustPWM] = system.getPreciseOutput([currentTemp, targetTemp]);
        

        const responseData = {
            heater_pwm: heaterPWM,
            exhaust_pwm: exhaustPWM
        };
        return response(200, responseData, "Fuzzy output calculated", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

// Exporting the handler functions
module.exports = { register, 
    logIn, 
    getUser, 
    getRealtime, 
    postRealtime, 
    postRecords,
    getRecords, 
    getControl, 
    putControlTemp, 
    putControlMoist, 
    deactivateDevice, 
    activateDevice, 
    getState,
    getDays,
    calculateFIS };