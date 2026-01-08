# E-commerce Project Setup Instructions

## Database Setup

1. **Create Database and Tables:**
   ```sql
   -- Run the complete database setup script
   mysql -u root -p < complete_database_setup.sql
   ```

2. **Alternative: Run individual SQL files:**
   ```sql
   mysql -u root -p
   CREATE DATABASE a2z47_ecom;
   USE a2z47_ecom;
   SOURCE create_tables.sql;
   SOURCE product_variations_table.sql;
   ```

## Project Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Update Database Connection:**
   - Edit `conn.js` to match your MySQL credentials:
   ```javascript
   var conn = mysql.createConnection({
       host:"localhost",
       user:"root",
       password:"your_password",  // Update this
       database:"a2z47_ecom"
   });
   ```

3. **Run the Application:**
   ```bash
   node index.js
   ```

4. **Access the Application:**
   - User Interface: `http://localhost:3000`
   - Admin Interface: `http://localhost:3000/admin`

## Fixed Issues

### Database Schema Issues:
- ✅ Fixed column name inconsistencies (`product_id` vs `id`)
- ✅ Created missing `product_variations` table
- ✅ Updated all SQL queries to use correct column names

### Template Issues:
- ✅ Fixed product ID references in templates
- ✅ Added proper currency formatting for prices
- ✅ Dynamic product count display

### Route Issues:
- ✅ Fixed SQL JOIN queries in user routes
- ✅ Updated admin routes to use correct column names

## Database Tables Structure

1. **category** - Product categories
2. **products** - Main product information
3. **product_variations** - Product variants (size, storage, etc.)
4. **users** - User accounts (admin/customer)
5. **slider** - Homepage slider images
6. **orders** - Order information
7. **order_items** - Individual order items

## Sample Data

The setup script includes sample data for:
- 9 product categories
- 4 sample products
- 10 product variations
- 3 slider images
- 1 admin user (username: admin, password: admin123)

## Testing the Fix

1. Start the application
2. Visit `http://localhost:3000/products`
3. You should see products displayed with:
   - Correct product names
   - Proper prices (current and market price)
   - Product images
   - Dynamic product count
   - Working product links

## Troubleshooting

If you encounter issues:

1. **Database Connection Error:**
   - Check MySQL is running
   - Verify credentials in `conn.js`
   - Ensure database exists

2. **Products Not Displaying:**
   - Check if `product_variations` table exists
   - Verify sample data was inserted
   - Check browser console for errors

3. **Image Display Issues:**
   - Ensure `public/uploads/` directory exists
   - Check file permissions
   - Verify image files are in the uploads folder

