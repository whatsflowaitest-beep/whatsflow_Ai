import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import webhookRoutes from './routes/webhook.routes.js';
import apiRoutes from './routes/api.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Client Setup
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api', apiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'WhatsFlow AI API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
