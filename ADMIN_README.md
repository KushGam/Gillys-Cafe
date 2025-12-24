# Admin Dashboard Guide

## Accessing the Admin Dashboard

1. Open `admin.html` in your browser
2. **Default Admin Credentials:**
   - Email: `gillyscafeco@gmail.com`
   - Password: `admin123`
3. **IMPORTANT:** Change the password immediately after first login!

## User Roles

### Admin
- Full access to all features
- Can manage menus, pricing, and settings
- Can add/remove co-admins
- Can change own password

### Co-Admin
- Can manage menus and pricing
- Can change own password
- **Cannot** add new admins or co-admins
- **Cannot** access co-admin management section

## Features

### 1. Menu Management
- **Add Menu Items**: Click "Add Menu Item" to create new items
- **Edit Items**: Click "Edit" on any menu item card
- **Delete Items**: Click "Delete" to remove items
- **Filter by Category**: Use category buttons to filter items
- **Size Options**: Enable Regular/Large pricing for items like coffee

### 2. Pricing Management
- **Bulk Price Updates**: Apply percentage increases/decreases to all items
- Example: Enter `10` for 10% increase, or `-5` for 5% decrease

### 3. Settings
- **Change Password**: Update your admin password
- **Export Data**: Download menu data as JSON file
- **Import Data**: Upload previously exported JSON file
- **Reset Data**: Clear all menu items (use with caution!)

## Migrating Existing Menu Items

If you have existing menu items in your HTML:

1. Open `index.html` in your browser
2. Open browser console (F12)
3. Copy and paste the contents of `menu-extractor.js`
4. Run: `migrateMenuItems()`
5. This will extract all menu items and save them to localStorage

## Menu Item Structure

Each menu item has:
- **Name**: Item name
- **Category**: breakfast, lunch, small-plates, coffee, cold, desserts
- **Description**: Item description
- **Price**: Single price OR Regular/Large prices
- **Image**: Image filename (e.g., "image.jpg")
- **Icon**: Font Awesome icon class (if no image)

## Co-Admin Management

### Adding Co-Admins (Admin Only)
1. Go to **Settings** section
2. Find **Co-Admin Management** card (only visible to admins)
3. Enter co-admin email and initial password
4. Click **Add Co-Admin**
5. Co-admin can now login with their email and password

### Co-Admin Permissions
- ✅ Manage menu items (add, edit, delete)
- ✅ Update pricing (individual and bulk)
- ✅ Change own password
- ✅ Export/import data
- ❌ Add new admins or co-admins
- ❌ Access co-admin management

## Security Notes

- Admin credentials are stored in localStorage (not secure for production)
- For production use, implement proper backend authentication
- Default admin email: `gillyscafeco@gmail.com`
- Default admin password: `admin123` - change it immediately!
- Each user (admin or co-admin) has their own password

## Data Storage

- All menu data is stored in browser localStorage
- Data persists across browser sessions
- To clear data: Use "Reset Data" in Settings or clear browser localStorage

## Troubleshooting

**Menu items not showing on main website:**
- Check if menu items exist in localStorage
- Open browser console and check for errors
- Make sure `script.js` is loading menu data correctly

**Can't login:**
- Default password is `admin123`
- Check browser console for errors
- Try clearing localStorage and resetting password

**Changes not reflecting:**
- Refresh the main website page
- Check if localStorage has the updated data
- Clear browser cache if needed

