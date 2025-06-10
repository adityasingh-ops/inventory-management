import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://glygonoatszhjjwrwets.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseWdvbm9hdHN6aGpqd3J3ZXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDg4MDAsImV4cCI6MjA2NTEyNDgwMH0.IIElYwzAsqPj4r9LmyycG-O5oP-INqmUMqoDE9fbCps';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Schema
export const createTables = async () => {
  // Products table
  const { error: productsError } = await supabase.rpc('create_products_table');
  if (productsError) console.error('Error creating products table:', productsError);

  // Sales table
  const { error: salesError } = await supabase.rpc('create_sales_table');
  if (salesError) console.error('Error creating sales table:', salesError);

  // Sale items table
  const { error: saleItemsError } = await supabase.rpc('create_sale_items_table');
  if (saleItemsError) console.error('Error creating sale_items table:', saleItemsError);
};

// SQL Functions to create tables
export const sqlQueries = {
  createProductsTable: `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100) UNIQUE NOT NULL,
      barcode VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(100) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      cost DECIMAL(10,2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 0,
      supplier VARCHAR(255),
      warranty VARCHAR(100),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  
  createSalesTable: `
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      sale_number VARCHAR(100) UNIQUE NOT NULL,
      customer_name VARCHAR(255),
      customer_phone VARCHAR(20),
      total_amount DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0,
      tax DECIMAL(10,2) DEFAULT 0,
      payment_method VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  
  createSaleItemsTable: `
    CREATE TABLE IF NOT EXISTS sale_items (
      id SERIAL PRIMARY KEY,
      sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
};