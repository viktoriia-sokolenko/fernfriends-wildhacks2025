const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const allowedOrigins = ['http://localhost:3000', 'https://fernfriends.vercel.app'];
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

const updatePoints = async (userId) => {
    const { data: plants, error: plantsError } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId);

    if (plantsError) {
        throw plantsError;
    }

    let totalPoints = 0;
    if (!plants || plants.length === 0) {
        return res.status(200).json({ token: data.session.access_token, userId: data.user.id });
    }
    if (plants && plants.length > 0) {
      plants.forEach(plant => {
          const birthday = new Date(plant.birthday);
          const lastWatering = new Date(plant.last_watering);

          const diffMs = lastWatering - birthday;
          const wateringPeriodMs = plant.days_between_watering * 24 * 60 * 60 * 1000;

          if (diffMs > 0) {
              const wateringPeriodsPassed = Math.floor(diffMs / wateringPeriodMs);
              totalPoints += wateringPeriodsPassed * 5; // 5 points per watering period
          }
      });
      const now = new Date();
      const updatedUser = {
              points: totalPoints,
              last_points_update: now.toISOString(),
      };

      const { error: updateError } = await supabase
          .from('users')
          .update(updatedUser)
          .eq('id', userId)
          .single();

      if (updateError) {
          throw updateError;
      }
    }
};

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
        try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("Invalid credentials");

        const userId = data.user.id;
        try {
          await updatePoints(userId);
        } catch (error) {
          console.error(`Error updating points on login for user ${userId}:`, error);
          return res.status(500).json({ error: 'Failed to update user points' });
        }

        res.status(200).json({ token: data.session.access_token, userId: data.user.id });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
  });


app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }

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

// --- User API Endpoints ---
// GET all users    
app.get('/api/users', checkAuth, async (req, res) => {
  console.log('Fetching all users');
    try {
        const { data, error } = await supabase
        .from('users')
        .select('*');
        if (error) {
            throw error;
        }
        if (!data) {
            console.log('No users found');
            return res.status(404).send('No users found');
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server Error');
    }
});

// GET a user profile by ID
app.get('/api/users/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    console.log('Fetching user with ID:', id);
    try {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        if (error) {
            throw error;
        }
        if (!data) {
            console.error('User not found with ID:', id);
            return res.status(404).send('User not found');
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server Error');
    }
});

// PUT (update or add) a user profile
app.put('/api/users/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    
    const allowedFields = [
        'username',
        'location',
        'bio',
        'points',
        'num_plants',
        'last_points_update',
        'profile_picture',
        'private',
        'contact_info'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    try {
      const { data: existingUser, error: userFetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id);
      if (userFetchError) {
        throw userFetchError;
      }

      if (!existingUser || existingUser.length === 0) {
        console.log('User not found with such id:', id);

        if (updateData.username === undefined || updateData.username === '') {
            return res.status(400).json({ error: 'Username is required to create a new user' });
        }
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert(updateData)
          .select()
          .single();

        if (insertError) {
            console.error('Error inserting new user:', insertError);
            return res.status(500).json({ error: 'Failed to create user' });
        }
        console.log('Created new user', newUser.id);
        return res.status(201).json(newUser);
      }

      console.log('Updating user with ID:', id);
      const { data, error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', id)
          .single();

      if (updateError) {
          throw updateError;
      }
      res.json({ message: "Profile updated successfully", data });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a user profile
app.delete('/api/users/:id', checkAuth, async (req, res) => {
    const { user_id } = req.params.id;
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
  
  // GET all plants for a specific user
  app.get('/api/plants/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    console.log('Fetching plant for user:', id);
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', id);
      if (error) {
        throw error;
      }
      if (!data || data.length === 0) {
        console.log('No plants found for user:', id);
        return res.status(404).json({ error: 'Plants not found' });
      }
      res.json(data);
    } catch (error) {
      console.error(`Error fetching plants for user ID ${id}:`, error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
  
  // PUT (update or add) a plant
  app.put('/api/plants/:id', checkAuth, async (req, res) => {
    let id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const allowedFields = [
      'name',
      'species',
      'days_between_watering',
      'last_watering',
      'user_id',
      'birthday',
    ];

    const updates = {};

    allowedFields.forEach(field => {
      const value = req.body[field];
      // Include the field if it's not undefined and (if string) not empty
      if (value !== undefined && (typeof value !== 'string' || value.trim() !== '')) {
        updates[field] = value;
      }
});
  
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update parameters provided' });
    }
    console.log('Updating plant with ID:', id);

    try {
      const { data: existingPlant, error: fetchError } = await supabase
        .from('plants')
        .select('*')
        .eq('id', id);

      if (fetchError) {
        throw fetchError;
      }

      if (!existingPlant || existingPlant.length === 0) {
        console.log('Plant not found, creating new one');
        const { data: newPlant, error: insertError } = await supabase
          .from('plants')
          .insert(updates)
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('num_plants')
        .eq('id', user_id)
        .single();

        if (fetchError) {
        console.error(fetchError);
        return;
        }

        const { data, error } = await supabase
        .from('users')
        .update({ num_plants: userData.num_plants + 1 })
        .eq('id', user_id);
        if (error) {
          console.error('Error updating user plant count:', error);
          return res.status(500).json({ error: 'Failed to update user plant count' });
        }

        console.log('Created new plant:', newPlant.id);
        return res.status(201).json(newPlant);
      }

      console.log('Plant found, updating it');
      updates.id = id;
      const { data, error: updateError } = await supabase
        .from('plants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!data) {
        return res.status(404).json({ error: 'Plant not found' });
      }

      console.log('Updated plant:', data.id);

      try {
        await updatePoints(user_id);
      } catch (error) {
        console.error(`Error updating points on login for user ${user_id}:`, error);
        return res.status(500).json({ error: 'Failed to update user points' });
      }

      res.json(data);
    } catch (error) {
      console.error(`Error processing plant with ID ${id}:`, error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
  // DELETE a plant
  app.delete('/api/plants/:id/:user_id', checkAuth, async (req, res) => {
    const { id, user_id } = req.params;
    console.log('Deleting plant with ID:', id);
    console.log('User ID:', user_id);
    try {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);
      if (error) {
        throw error;
      }

      const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('num_plants')
      .eq('id', user_id)
      .single();

      if (fetchError) {
      console.error(fetchError);
      return;
      }

      const { data, error: updateError } = await supabase
      .from('users')
      .update({ num_plants: userData.num_plants - 1 })
      .eq('id', user_id);
      if (updateError) {
        console.error('Error updating user plant count:', updateError);
        return res.status(500).json({ error: 'Failed to update user plant count' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting plant with ID ${id}:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
