//handler.js
const bcrypt = require('bcryptjs');
const supabase = require("../config/connection");
const { generateAccessToken } = require("../middleware/jsonwebtoken");

//non routes function
function response(status, data, message, res) {
    res.status(status).json({ status, data, message });
}

function getDate() {
    var dt = new Date();
    var offset = 7 * 60 * 60 * 1000;
    var newDate = new Date(dt.getTime() + offset);

    return isoString = newDate.toISOString();
}

function calculateTemp(sedang1, sedang4) {
    let dingin1 = 0;
    let dingin2, dingin3, dingin4, sedang2, sedang3, panas1, panas2, panas3, panas4 = 90;

    sedang2 = sedang1 + (sedang4 - sedang1) / 3;
    sedang3 = sedang1 + 2 * ((sedang4 - sedang1) / 3);
    dingin4 = sedang1 + 5;
    dingin2 = dingin1 + (dingin4 - dingin1) / 3;
    dingin3 = dingin1 + 2 * ((dingin4 - dingin1) / 3);
    panas1 = sedang4 - 5;
    panas2 = panas1 + (panas4 - panas1) / 3;
    panas3 = panas1 + 2 * ((panas4 - panas1) / 3);

    return {
        dingin1,
        dingin2,
        dingin3,
        dingin4,
        sedang1,
        sedang2,
        sedang3,
        sedang4,
        panas1,
        panas2,
        panas3,
        panas4
    };
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
            ]);

        if (error) {
            return response(500, null, error.message, res);
        } else {
            const { data: registeredData, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('Email', Email);

            if (fetchError) {
                return response(500, null, "Internal server error", res);
            }

            if (!registeredData || registeredData.length === 0) {
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
            Username: data[0].Username,
            Email: data[0].Email,
            inserted_at: data[0].inserted_at,
            updated_at: data[0].updated_at,
            Token: token
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
            ]);
        if (error) {
            return response(500, null, error.message, res);
        }

        return response(200, data, "Latest data retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function postRecords(req, res) {
    let id;
    let increment;
    // let mesoTemp;
    // let thermoTemp;

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

            const { data: idData, error: idError } = await supabase
            .from('records')
            .select('*');

            if (Error) {
                return response(500, null, idError.message, res);
            }

            // const { data: tempData, tempError } = await supabase
            // .from('control')
            // .select('*')

            // if (error) {
            //     return response(500, null, tempError.message, res);
            // }

            // Check if there are more than 5 records
            increment = idData.length + 1;
            id = increment;

            // mesoTemp = tempData.sedang1[0];
            // thermoTemp = tempData.sedang4[0];

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
            ]);

            if (error) {
                return response(500, null, error.message, res);
            }

            await resetRealtimeTable();
        }

        // Return content of records table
        return response(200, null, "Data retrieved", res);
    } catch (error) {
        return response(500, null, error.message, res);
    }
}

async function getRecords(req, res) {
    try {
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

        const values = calculateTemp(mesophilic_temp, thermophilic_temp)
        
        sedang1 = mesophilic_temp;
        sedang4 = thermophilic_temp;

        const { data, error } = await supabase
            .from('control')
            .update({
                ...values,
                updated_at: getDate()
            })
            .eq('id', 1); // Assuming there's only one row in the control table

        if (error) {
            return response(500, null, error.message, res);
        } else {
            // Fetch the inserted data
            const { data: updatedSettings, error: fetchError } = await supabase
                .from('control')
                .select('*')

            if (fetchError) {
                return response(500, null, "Internal server error", res);
            }

            if (!updatedSettings || updatedSettings.length === 0) {
                return response(500, null, "Internal server error", res);
            }

            return response(200, updatedSettings, "Setting updated", res);
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
                updated_at: getDate()
            })
            .eq('id', 1); // Assuming there's only one row in the control table

        if (error) {
            return response(500, null, error.message, res);
        } else {
            // Fetch the inserted data
            const { data: updatedSettings, error: fetchError } = await supabase
                .from('control')
                .select('*')

            if (fetchError) {
                return response(500, null, "Internal server error", res);
            }

            if (!updatedSettings || updatedSettings.length === 0) {
                return response(500, null, "Internal server error", res);
            }

            return response(200, updatedSettings, "Setting updated", res);
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

        console.log("State Data:", stateData); // Debugging: Log the returned data

        // Check if stateData is empty or undefined
        if (!stateData || stateData.length === 0) {
            return response(404, null, "State data not found", res);
        }

        const currentState = stateData[0].state;

        if (currentState !== 0) {
            return response(400, null, "Device is already activated", res);
        }

        const state = 1;

        const { data, error } = await supabase
            .from('state')
            .update({
                state,
                date: getDate()
            })
            .eq('id', 1);

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

        console.log("State Data:", stateData); // Debugging: Log the returned data

        // Check if stateData is empty or undefined
        if (!stateData || stateData.length === 0) {
            return response(404, null, "State data not found", res);
        }

        const currentState = stateData[0].state;

        if (currentState !== 1) {
            return response(400, null, "Device is already deactivated", res);
        }

        const state = 0;

        const { data, error } = await supabase
            .from('state')
            .update({
                state,
                date: getDate()
            })
            .eq('id', 1);

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

        // Check if stateData is empty or undefined
        if (!stateData || stateData.length === 0) {
            return response(404, null, "State data not found", res);
        }

        const { state, date } = stateData[0];

        // Check if state is 1
        if (state !== 1) {
            return response(400, null, "State is not active", res);
        }

        // Calculate the number of days passed
        const currentDate = new Date();
        const pastDate = new Date(date);
        const diffTime = Math.abs(currentDate - pastDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return response(200, { days: diffDays }, "Days counted", res);
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
    getDays };