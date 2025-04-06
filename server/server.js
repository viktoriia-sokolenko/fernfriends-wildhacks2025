const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
        try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("Invalid credentials");
        res.status(200).json({ token: data.session.access_token, userId: data.user.id });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
    });


app.post("/api/register", async (req, res) => {
    const { email, password, first_name, last_name, username } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        });
        if (error) throw error;
        if (!data.user) throw new Error("Registration failed");
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: data.user.id,
                    email: data.user.email,
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    username: data.user.username,
                }
            ]);
        if (insertError) {
            throw insertError;
        }
        res.status(201).json({ message: "Registration successful! Please log in", user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    });

const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const { data: user, error } = await supabase.auth.getUser(token);
        if (error) throw error
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
    };

app.get('/api/users', checkAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('users')
        .select('*');
        if (error) {
            throw error;
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


app.get('/api/users/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
        .from('users')
        .select(`
            id,
            created_at, username, location, bio, level, points, num_plants

            )
        `)
        .eq('id', id)
        .single();
        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).send('User not found');
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


app.patch('/api/users/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { created_at, username, location, bio, level, points, num_plants
    } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                created_at: created_at,
                username: username,
                location: location,
                bio: bio,
                level: level,
                points: points,
                num_plants: num_plants
            })
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }
        res.json({ message: "Profile updated successfully", data });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
});

app.patch('/api/plants/:id', checkAuth, async (req, res) => {
    const { id } = req.params; // This should be the plant's ID
    const { birthday, user_id, days_between_watering, name, species, last_watering } = req.body;

    try {
        const updates = {};
        if (birthday !== undefined) updates.birthday = birthday;
        if (user_id !== undefined) updates.user_id = user_id;
        if (days_between_watering !== undefined) updates.days_between_watering = days_between_watering;
        if (name !== undefined) updates.name = name;
        if (species !== undefined) updates.species = species;
        if (last_watering !== undefined) updates.last_watering = last_watering;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No update parameters provided' });
        }

        const { data, error } = await supabase
            .from('plants') // Correct table name should be 'plants'
            .update(updates)
            .eq('id', id) // Update based on the plant's ID
            .select() // It's good practice to select the updated data
            .single();

        if (error) {
            console.error('Error updating plant:', error);
            return res.status(500).json({ error: 'Failed to update plant' });
        }

        if (!data) {
            return res.status(404).json({ error: 'Plant not found' });
        }

        res.json({ message: "Plant updated successfully", data });
    } catch (error) {
        console.error('Error updating plant:', error);
        res.status(500).send('Server Error');
    }
});


app.delete('/api/users', checkAuth, async (req, res) => {
    const { saved_id, user_id } = req.body;
    try {
        const { data, error } = await supabase
        .from('Users')
        .delete()
        .eq('id', user_id)
        if (error) throw error;
        res.json({ message: 'Profile deleted successfully', data });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


  

  
  // --- Plant API Endpoints ---
  
  // GET all plants
  app.get('/plants', checkAuth, async (req, res) => { // id, birthday, userid, days between watering plants/id
    const { data, error } = await supabase
      .from('plants')
      .select('*');
  
    if (error) {
      console.error('Error fetching plants:', error);
      return res.status(500).json({ error: 'Failed to fetch plants' });
    }
  
    res.json(data);
  });
  
  // GET a single plant by ID
  app.get('/plants/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error(`Error fetching plant with ID ${id}:`, error);
      return res.status(404).json({ error: 'Plant not found' });
    }
  
    res.json(data);
  });
  
  // GET all plants for a specific user
  app.get('/users/:user_id/plants', checkAuth, async (req, res) => {
    const userId = req.params.user_id;
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId);
  
    if (error) {
      console.error(`Error fetching plants for user ${userId}:`, error);
      return res.status(500).json({ error: 'Failed to fetch plants for this user' });
    }
  
    res.json(data);
  });
  
  // POST a new plant
  app.post('/plants', async (req, res) => {
    const { name, species, water_needs, sunlight_needs, user_id } = req.body;
  
    if (!name || !user_id) {
      return res.status(400).json({ error: 'Name and user_id are required' });
    }
  
    const { data, error } = await supabase
      .from('plants')
      .insert([{ name, species, water_needs, sunlight_needs, user_id }])
      .select();
  
    if (error) {
      console.error('Error creating plant:', error);
      return res.status(500).json({ error: 'Failed to create plant' });
    }
  
    res.status(201).json(data[0]);
  });
  
  // PUT (update) an existing plant
  app.put('/plants/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    const { name, species, water_needs, sunlight_needs, user_id } = req.body;
  
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (species !== undefined) updates.species = species;
    if (water_needs !== undefined) updates.water_needs = water_needs;
    if (sunlight_needs !== undefined) updates.sunlight_needs = sunlight_needs;
    if (user_id !== undefined) updates.user_id = user_id;
  
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update parameters provided' });
    }
  
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      console.error(`Error updating plant with ID ${id}:`, error);
      return res.status(500).json({ error: 'Failed to update plant' });
    }
  
    if (!data) {
      return res.status(404).json({ error: 'Plant not found' });
    }
  
    res.json(data);
  });
  
  // DELETE a plant
  app.delete('/plants/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error(`Error deleting plant with ID ${id}:`, error);
      return res.status(500).json({ error: 'Failed to delete plant' });
    }
  
    res.status(204).send();
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

