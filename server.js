const express = require('express')
const axios = require('axios');
//const request = require('request');
const app = express();

app.use(express.urlencoded({extended: true,}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async(req, res) => {
    const playfulness = parseInt(req.body.playfulness);
    const children_friendly = parseInt(req.body.children_friendly);
    const other_pets_friendly = parseInt(req.body.other_pets_friendly);
    const shedding = parseInt(req.body.shedding);
    
    try {
        const result = await getCats(children_friendly, playfulness, shedding, other_pets_friendly);
        if (result) {
            res.send({
                data: result.data,
                selectedFilter: result.params
            });
        } else {
        res.status(404).send({ error: 'No cats found matching the criteria' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post("/breeding", async (req, res) => {
    const breeding = req.body.breeding;
    try {
        const response = await axios.get('https://api.api-ninjas.com/v1/cats', {
            params: { name: breeding },
            headers: { 'X-Api-Key': 'y3xqgHKhqirFf53dtszSAA==k58QDTGlgUKQzefV' }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Request failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getCats = async (children_friendly, playfulness, shedding, other_pets_friendly) => {
    const paramsList = [
        { children_friendly, playfulness, shedding, other_pets_friendly },
        { children_friendly, playfulness, shedding },
        { children_friendly, playfulness },
        { children_friendly },
    ];

    for (const params of paramsList) {
        try {
            const response = await axios.get('https://api.api-ninjas.com/v1/cats', {
            params,
            headers: {
                'X-Api-Key': 'y3xqgHKhqirFf53dtszSAA==k58QDTGlgUKQzefV'
            }
            });

            if (response.data.length > 0) {
                return { 
                    data: response.data, 
                    params 
                };
            } else {
                console.log('No result for params:', params);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.status, error.response.data);
            } else {
                console.error('Request failed:', error.message);
            }
        }
    }
    return null;  // If no results are found after all attempts
};

const PORT = 3333
app.listen(PORT, ()=>{
    console.log(`Server running on port : http://localhost:${PORT}`)
})