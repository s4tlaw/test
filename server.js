const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Choose an available port

app.use(bodyParser.json());

app.post('/submit-to-notion', async (req, res) => {
    try {
        const { name, email } = req.body;
        const notionDatabaseId = 'c24d7b2e847448c08cf298a182f1285b';
        const integrationToken = 'secret_lFvjG6V5rtoL1T7rHmZ6twLYaFeXRhRVHwex6CzFYrJ';

        const url = `https://api.notion.com/v1/pages`;

        const data = {
            parent: { database_id: notionDatabaseId },
            properties: {
                Name: { title: [{ text: { content: name } }] },
                Email: { email: email }
                // Add more properties based on your Notion database schema
            }
        };

       const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${integrationToken}`,
                'Notion-Version': '2021-08-16'
            },
            body: JSON.stringify(data)
        });

        if(result.status !== 200) {
          const error = await result.json();
          console.error('Got error saving data', error);
          return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ message: 'Data saved to Notion!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
