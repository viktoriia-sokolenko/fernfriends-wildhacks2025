const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

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
    const { email, password, username } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        });
        console.log("User data:", data);
        console.log("Error data:", error);
        if (error) throw error;
        if (!data.user) throw new Error("Registration failed");
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: data.user.id,
                    username: username,
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
    console.log("Token:", token);
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
          created_at,
          username,
          location,
          bio,
          level,
          points,
          num_plants
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


app.put('/api/users/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { created_at, username, location, bio, level, points, num_plants } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .upsert({
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


app.delete('/api/users', checkAuth, async (req, res) => {
    const { user_id } = req.body;
    try {
        const { data, error } = await supabase
        .from('users')
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
  app.get('/api/plants', checkAuth, async (req, res) => { // id, birthday, userid, days between watering plants/id
    const { data, error } = await supabase
      .from('plants')
      .select('*');
  
    if (error) {
      console.error('Error fetching plants:', error);
      return res.status(500).json({ error: 'Failed to fetch plants' });
    }
  
    res.json(data);
  });
  
  // GET all plants for a specific user
  app.get('/api/plants/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    console.log('Fetching plant for user:', id);
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', id);  
    if (error) {
      console.error(`Error fetching plant with ID ${id}:`, error);
      return res.status(404).json({ error: 'Plant not found' });
    }
    console.log('Fetched plant data:', data);
    res.json(data);
  });
  
  
  // PUT (update or add) a plant
  app.put('/api/plants/:id', checkAuth, async (req, res) => {
    let id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { name, species, days_between_watering, last_watering, user_id, birthday } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (species !== undefined) updates.species = species;
    if (days_between_watering !== undefined && days_between_watering !== '') updates.days_between_watering = days_between_watering;
    if (last_watering !== undefined && last_watering !== '') updates.last_watering = last_watering;
    if (user_id !== undefined) updates.user_id = user_id;
    if (birthday !== undefined && birthday !== '') updates.birthday = birthday;
  
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update parameters provided' });
    }
    console.log('Updating plant with ID:', id, 'Updates:', updates);

    const { data: existingPlant, error: fetchError } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id);
    console.log('Existing plant data:', existingPlant);
    if (!existingPlant || existingPlant.length === 0) {
      console.log('Plant not found, creating new one');
      const { data: newPlant, error: insertError } = await supabase
        .from('plants')
        .insert(updates)
        .select()
        .single();
  
      if (insertError) {
        console.error(`Error inserting new plant:`, insertError);
        return res.status(500).json({ error: 'Failed to create plant' });
      }
  
      console.log('Created new plant:', newPlant);
      return res.status(201).json(newPlant);
    }
    console.log('Plant found, updating it');
    updates.id = id;
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
    console.log('Updated plant:', data);

    res.json(data);
  });
  
  // DELETE a plant
  app.delete('/api/plants/:id', checkAuth, async (req, res) => {
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

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });