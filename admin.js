// Admin Dashboard JavaScript

// Default admin credentials (change these!)
const DEFAULT_ADMIN_EMAIL = 'gillyscafeco@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

// Initialize Admin Dashboard
function initializeAdmin() {
    // Check if logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }

    // Initialize default admin if not set
    const existingAdmins = localStorage.getItem('adminUsers');
    if (!existingAdmins || existingAdmins === '[]') {
        const defaultAdmin = {
            email: DEFAULT_ADMIN_EMAIL,
            password: DEFAULT_ADMIN_PASSWORD,
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
        console.log('Default admin created:', DEFAULT_ADMIN_EMAIL);
    } else {
        // Check if default admin exists, if not add it
        try {
            const admins = JSON.parse(existingAdmins);
            const defaultAdminExists = admins.some(admin => 
                admin.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()
            );
            if (!defaultAdminExists) {
                admins.push({
                    email: DEFAULT_ADMIN_EMAIL,
                    password: DEFAULT_ADMIN_PASSWORD,
                    role: 'admin',
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('adminUsers', JSON.stringify(admins));
                console.log('Default admin added:', DEFAULT_ADMIN_EMAIL);
            }
        } catch (e) {
            // If parsing fails, create fresh
            const defaultAdmin = {
                email: DEFAULT_ADMIN_EMAIL,
                password: DEFAULT_ADMIN_PASSWORD,
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
            console.log('Default admin recreated:', DEFAULT_ADMIN_EMAIL);
        }
    }

    // Initialize co-admins array if not exists
    if (!localStorage.getItem('coAdmins')) {
        localStorage.setItem('coAdmins', JSON.stringify([]));
    }

    // Check current user role and show/hide co-admin section
    checkUserRole();

    // Initialize menu data if not exists
    if (!localStorage.getItem('menuItems')) {
        initializeMenuData();
    }

    setupEventListeners();
    loadMenuItems();
}

// Show Login Screen
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show Dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    const dashboard = document.getElementById('adminDashboard');
    dashboard.classList.remove('hidden');
    dashboard.style.display = 'block';
    
    // Update header to show current user
    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole');
    const header = document.querySelector('.admin-header h1');
    if (header && userEmail) {
        const roleBadge = userRole === 'admin' ? '<span style="font-size: 0.6em; color: var(--primary-color);"> (Admin)</span>' : '<span style="font-size: 0.6em; color: var(--text-light);"> (Co-Admin)</span>';
        header.innerHTML = `<i class="fas fa-tachometer-alt"></i> Admin Dashboard${roleBadge}`;
    }
    
    checkUserRole();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            switchSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Category Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterMenuItems(category);
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Add Menu Item Button
    const addMenuItemBtn = document.getElementById('addMenuItemBtn');
    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', () => openMenuItemModal());
    }

    // Modal Controls
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const menuItemModal = document.getElementById('menuItemModal');
    const menuItemForm = document.getElementById('menuItemForm');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeMenuItemModal);
    }
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeMenuItemModal);
    }
    if (menuItemModal) {
        menuItemModal.addEventListener('click', (e) => {
            if (e.target === menuItemModal) {
                closeMenuItemModal();
            }
        });
    }
    if (menuItemForm) {
        menuItemForm.addEventListener('submit', handleMenuItemSubmit);
    }

    // Size Options Toggle
    const hasSizeOptions = document.getElementById('itemHasSizeOptions');
    const sizeOptionsContainer = document.getElementById('sizeOptionsContainer');
    if (hasSizeOptions && sizeOptionsContainer) {
        hasSizeOptions.addEventListener('change', (e) => {
            if (e.target.checked) {
                sizeOptionsContainer.classList.remove('hidden');
                sizeOptionsContainer.style.display = 'block';
            } else {
                sizeOptionsContainer.classList.add('hidden');
                sizeOptionsContainer.style.display = 'none';
            }
        });
    }

    // Pricing Tools
    const applyPriceChangeBtn = document.getElementById('applyPriceChangeBtn');
    if (applyPriceChangeBtn) {
        applyPriceChangeBtn.addEventListener('click', handleBulkPriceUpdate);
    }

    // Settings
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }

    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }

    const importDataBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    if (importDataBtn && importFileInput) {
        importDataBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', handleImportData);
    }

    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', handleResetData);
    }

    const migrateMenuBtn = document.getElementById('migrateMenuBtn');
    if (migrateMenuBtn) {
        migrateMenuBtn.addEventListener('click', handleMigrateMenu);
    }

    const addCoAdminForm = document.getElementById('addCoAdminForm');
    if (addCoAdminForm) {
        addCoAdminForm.addEventListener('submit', handleAddCoAdmin);
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');

    // Ensure default admin exists
    const existingAdmins = localStorage.getItem('adminUsers');
    if (!existingAdmins || existingAdmins === '[]') {
        const defaultAdmin = {
            email: DEFAULT_ADMIN_EMAIL,
            password: DEFAULT_ADMIN_PASSWORD,
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
    }

    // Get all admin users
    let adminUsers = [];
    try {
        adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    } catch (e) {
        console.error('Error parsing admin users:', e);
        adminUsers = [];
    }
    
    let coAdmins = [];
    try {
        coAdmins = JSON.parse(localStorage.getItem('coAdmins') || '[]');
    } catch (e) {
        console.error('Error parsing co-admins:', e);
        coAdmins = [];
    }
    
    // Check admin users
    const adminUser = adminUsers.find(user => 
        user.email.toLowerCase() === email && user.password === password
    );
    
    // Check co-admins
    const coAdmin = coAdmins.find(user => 
        user.email.toLowerCase() === email && user.password === password
    );

    if (adminUser) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userRole', 'admin');
        showDashboard();
        errorDiv.classList.remove('show');
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
    } else if (coAdmin) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userRole', 'co-admin');
        showDashboard();
        errorDiv.classList.remove('show');
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
    } else {
        // Debug info
        console.log('Login attempt failed');
        console.log('Email entered:', email);
        console.log('Admin users:', adminUsers);
        console.log('Co-admins:', coAdmins);
        errorDiv.textContent = 'Incorrect email or password. Please try again.';
        errorDiv.classList.add('show');
    }
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userRole');
        showLogin();
    }
}

// Check User Role
function checkUserRole() {
    const userRole = sessionStorage.getItem('userRole');
    const coAdminCard = document.getElementById('coAdminCard');
    
    if (userRole === 'admin' && coAdminCard) {
        coAdminCard.classList.remove('hidden');
        coAdminCard.style.display = 'block';
        loadCoAdmins();
    } else if (coAdminCard) {
        coAdminCard.classList.add('hidden');
        coAdminCard.style.display = 'none';
    }
}

// Switch Section
function switchSection(section) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Initialize Menu Data from HTML (extract current menu items)
function initializeMenuData() {
    // Check if we're on the main site and can extract menu items
    const menuCards = document.querySelectorAll('.menu-item-card');
    
    if (menuCards.length > 0) {
        // Extract menu items from HTML
        const menuItems = [];
        
        menuCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const name = card.querySelector('h3')?.textContent.trim();
            const description = card.querySelector('p')?.textContent.trim();
            const priceText = card.querySelector('.price')?.textContent.trim();
            const price = parseFloat(priceText?.replace('$', '') || '0');
            
            // Check for image or icon
            const imageElement = card.querySelector('.menu-item-image img');
            const iconElement = card.querySelector('.menu-item-image.coffee-image i, .menu-item-image.drink-image i');
            
            let image = '';
            let icon = '';
            
            if (imageElement) {
                image = imageElement.getAttribute('src') || '';
            } else if (iconElement) {
                icon = iconElement.getAttribute('class') || '';
            }
            
            // Check for size options
            const priceOptions = card.querySelector('.price-options');
            let hasSizeOptions = false;
            let priceRegular = null;
            let priceLarge = null;
            
            if (priceOptions) {
                hasSizeOptions = true;
                const regularPrice = priceOptions.querySelector('.price-regular')?.textContent;
                const largePrice = priceOptions.querySelector('.price-large')?.textContent;
                priceRegular = regularPrice ? parseFloat(regularPrice.replace('$', '')) : null;
                priceLarge = largePrice ? parseFloat(largePrice.replace('$', '')) : null;
            }
            
            // Map category names
            const categoryMap = {
                'breakfast': 'breakfast',
                'lunch': 'lunch',
                'small-plates': 'small-plates',
                'coffee': 'coffee',
                'drinks': 'cold',
                'desserts': 'desserts'
            };
            
            const mappedCategory = categoryMap[category] || category || 'breakfast';
            
            if (name) {
                menuItems.push({
                    name: name,
                    category: mappedCategory,
                    description: description || '',
                    price: hasSizeOptions ? null : price,
                    image: image,
                    icon: icon,
                    hasSizeOptions: hasSizeOptions,
                    priceRegular: priceRegular,
                    priceLarge: priceLarge
                });
            }
        });
        
        if (menuItems.length > 0) {
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
            console.log(`Extracted ${menuItems.length} menu items from HTML`);
            return menuItems;
        }
    }
    
    // If no items found, create empty array
    const menuItems = [];
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    return menuItems;
}

// Load Menu Items
function loadMenuItems(category = 'all') {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const grid = document.getElementById('menuItemsGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    if (menuItems.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No menu items yet. Click "Add Menu Item" to get started.</p>';
        return;
    }

    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);

    filteredItems.forEach((item, index) => {
        const card = createMenuItemCard(item, index);
        grid.appendChild(card);
    });
}

// Create Menu Item Card
function createMenuItemCard(item, index) {
    const card = document.createElement('div');
    card.className = 'menu-item-admin-card';
    card.setAttribute('data-category', item.category);

    const priceDisplay = item.hasSizeOptions 
        ? `Regular: $${item.priceRegular || item.price} | Large: $${item.priceLarge || item.price}`
        : `$${item.price}`;

    card.innerHTML = `
        <div class="category-badge">${item.category}</div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price-display">${priceDisplay}</div>
        <div class="item-actions">
            <button class="edit-btn" onclick="editMenuItem(${index})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteMenuItem(${index})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

// Filter Menu Items
function filterMenuItems(category) {
    loadMenuItems(category);
}

// Open Menu Item Modal
function openMenuItemModal(itemIndex = null) {
    const modal = document.getElementById('menuItemModal');
    const form = document.getElementById('menuItemForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (itemIndex !== null) {
        // Edit mode
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const item = menuItems[itemIndex];
        
        modalTitle.textContent = 'Edit Menu Item';
        document.getElementById('itemId').value = itemIndex;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemImage').value = item.image || '';
        document.getElementById('itemIcon').value = item.icon || '';
        document.getElementById('itemHasSizeOptions').checked = item.hasSizeOptions || false;
        
        if (item.hasSizeOptions) {
            document.getElementById('sizeOptionsContainer').style.display = 'block';
            document.getElementById('itemPriceRegular').value = item.priceRegular || item.price;
            document.getElementById('itemPriceLarge').value = item.priceLarge || item.price;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add Menu Item';
        form.reset();
        document.getElementById('itemId').value = '';
        document.getElementById('sizeOptionsContainer').style.display = 'none';
    }
    
    modal.classList.add('active');
}

// Close Menu Item Modal
function closeMenuItemModal() {
    const modal = document.getElementById('menuItemModal');
    modal.classList.remove('active');
    document.getElementById('menuItemForm').reset();
}

// Handle Menu Item Submit
function handleMenuItemSubmit(e) {
    e.preventDefault();
    
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const itemId = document.getElementById('itemId').value;
    const hasSizeOptions = document.getElementById('itemHasSizeOptions').checked;
    
    const item = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value,
        price: hasSizeOptions ? null : parseFloat(document.getElementById('itemPrice').value),
        image: document.getElementById('itemImage').value,
        icon: document.getElementById('itemIcon').value,
        hasSizeOptions: hasSizeOptions,
        priceRegular: hasSizeOptions ? parseFloat(document.getElementById('itemPriceRegular').value) : null,
        priceLarge: hasSizeOptions ? parseFloat(document.getElementById('itemPriceLarge').value) : null
    };

    if (itemId === '') {
        // Add new item
        menuItems.push(item);
    } else {
        // Update existing item
        menuItems[parseInt(itemId)] = item;
    }

    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    closeMenuItemModal();
    loadMenuItems();
    
    // Show success message
    showNotification('Menu item saved successfully!', 'success');
}

// Edit Menu Item
function editMenuItem(index) {
    openMenuItemModal(index);
}

// Delete Menu Item
function deleteMenuItem(index) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        menuItems.splice(index, 1);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenuItems();
        showNotification('Menu item deleted successfully!', 'success');
    }
}

// Handle Bulk Price Update
function handleBulkPriceUpdate() {
    const percentage = parseFloat(document.getElementById('pricePercentage').value);
    
    if (isNaN(percentage)) {
        alert('Please enter a valid percentage');
        return;
    }

    if (!confirm(`Apply ${percentage > 0 ? '+' : ''}${percentage}% to all prices?`)) {
        return;
    }

    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const multiplier = 1 + (percentage / 100);

    menuItems.forEach(item => {
        if (item.hasSizeOptions) {
            if (item.priceRegular) item.priceRegular = parseFloat((item.priceRegular * multiplier).toFixed(2));
            if (item.priceLarge) item.priceLarge = parseFloat((item.priceLarge * multiplier).toFixed(2));
        } else {
            if (item.price) item.price = parseFloat((item.price * multiplier).toFixed(2));
        }
    });

    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    loadMenuItems();
    document.getElementById('pricePercentage').value = '';
    showNotification(`Prices updated by ${percentage > 0 ? '+' : ''}${percentage}%`, 'success');
}

// Handle Password Change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole');

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    if (userRole === 'admin') {
        // Update admin password
        const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
        const userIndex = adminUsers.findIndex(user => user.email.toLowerCase() === userEmail.toLowerCase());
        
        if (userIndex === -1) {
            alert('User not found');
            return;
        }

        if (adminUsers[userIndex].password !== currentPassword) {
            alert('Current password is incorrect');
            return;
        }

        adminUsers[userIndex].password = newPassword;
        localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
    } else if (userRole === 'co-admin') {
        // Update co-admin password
        const coAdmins = JSON.parse(localStorage.getItem('coAdmins') || '[]');
        const userIndex = coAdmins.findIndex(user => user.email.toLowerCase() === userEmail.toLowerCase());
        
        if (userIndex === -1) {
            alert('User not found');
            return;
        }

        if (coAdmins[userIndex].password !== currentPassword) {
            alert('Current password is incorrect');
            return;
        }

        coAdmins[userIndex].password = newPassword;
        localStorage.setItem('coAdmins', JSON.stringify(coAdmins));
    }

    document.getElementById('changePasswordForm').reset();
    showNotification('Password updated successfully!', 'success');
}

// Load Co-Admins
function loadCoAdmins() {
    const coAdmins = JSON.parse(localStorage.getItem('coAdmins') || '[]');
    const coAdminList = document.getElementById('coAdminList');
    
    if (!coAdminList) return;

    if (coAdmins.length === 0) {
        coAdminList.innerHTML = '<p style="color: var(--text-light);">No co-admins added yet.</p>';
        return;
    }

    coAdminList.innerHTML = coAdmins.map((coAdmin, index) => `
        <div class="co-admin-item">
            <div class="co-admin-item-info">
                <strong>${coAdmin.email}</strong>
                <p>Added: ${new Date(coAdmin.createdAt).toLocaleDateString()}</p>
            </div>
            <button class="btn-danger" onclick="removeCoAdmin(${index})" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `).join('');
}

// Handle Add Co-Admin
function handleAddCoAdmin(e) {
    e.preventDefault();
    
    const email = document.getElementById('coAdminEmail').value.trim().toLowerCase();
    const password = document.getElementById('coAdminPassword').value;

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Check if email already exists
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const coAdmins = JSON.parse(localStorage.getItem('coAdmins') || '[]');
    
    const emailExists = adminUsers.some(user => user.email.toLowerCase() === email) ||
                       coAdmins.some(user => user.email.toLowerCase() === email);

    if (emailExists) {
        alert('This email is already registered as an admin or co-admin');
        return;
    }

    // Add new co-admin
    const newCoAdmin = {
        email: email,
        password: password,
        role: 'co-admin',
        createdAt: new Date().toISOString()
    };

    coAdmins.push(newCoAdmin);
    localStorage.setItem('coAdmins', JSON.stringify(coAdmins));
    
    document.getElementById('addCoAdminForm').reset();
    loadCoAdmins();
    showNotification(`Co-admin ${email} added successfully!`, 'success');
}

// Remove Co-Admin
function removeCoAdmin(index) {
    if (!confirm('Are you sure you want to remove this co-admin?')) {
        return;
    }

    const coAdmins = JSON.parse(localStorage.getItem('coAdmins') || '[]');
    const removed = coAdmins.splice(index, 1)[0];
    localStorage.setItem('coAdmins', JSON.stringify(coAdmins));
    
    loadCoAdmins();
    showNotification(`Co-admin ${removed.email} removed successfully!`, 'success');
}

// Make removeCoAdmin available globally
window.removeCoAdmin = removeCoAdmin;

// Export Data
function exportData() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const data = {
        menuItems: menuItems,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gillys-menu-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// Handle Import Data
function handleImportData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.menuItems && Array.isArray(data.menuItems)) {
                if (confirm('This will replace all current menu items. Continue?')) {
                    localStorage.setItem('menuItems', JSON.stringify(data.menuItems));
                    loadMenuItems();
                    showNotification('Data imported successfully!', 'success');
                }
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

// Handle Reset Data
function handleResetData() {
    if (confirm('Are you sure you want to reset all menu data? This cannot be undone!')) {
        localStorage.removeItem('menuItems');
        initializeMenuData();
        loadMenuItems();
        showNotification('Data reset to default', 'success');
    }
}

// Handle Migrate Menu from HTML
async function handleMigrateMenu() {
    if (!confirm('This will extract menu items from index.html. Continue?')) {
        return;
    }

    try {
        const response = await fetch('/index.html');
        const html = await response.text();
        
        // Create a temporary DOM to parse
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const menuCards = doc.querySelectorAll('.menu-item-card');
        const menuItems = [];
        
        const categoryMap = {
            'breakfast': 'breakfast',
            'lunch': 'lunch',
            'small-plates': 'small-plates',
            'coffee': 'coffee',
            'drinks': 'cold',
            'desserts': 'desserts'
        };
        
        menuCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const name = card.querySelector('h3')?.textContent.trim();
            const description = card.querySelector('p')?.textContent.trim();
            const priceText = card.querySelector('.price')?.textContent.trim();
            const price = parseFloat(priceText?.replace('$', '') || '0');
            
            // Check for image or icon
            const imageElement = card.querySelector('.menu-item-image img');
            const iconElement = card.querySelector('.menu-item-image.coffee-image i, .menu-item-image.drink-image i');
            
            let image = '';
            let icon = '';
            
            if (imageElement) {
                image = imageElement.getAttribute('src') || '';
            } else if (iconElement) {
                icon = iconElement.getAttribute('class') || '';
            }
            
            // Check for size options
            const priceOptions = card.querySelector('.price-options');
            let hasSizeOptions = false;
            let priceRegular = null;
            let priceLarge = null;
            
            if (priceOptions) {
                hasSizeOptions = true;
                const regularPrice = priceOptions.querySelector('.price-regular')?.textContent;
                const largePrice = priceOptions.querySelector('.price-large')?.textContent;
                priceRegular = regularPrice ? parseFloat(regularPrice.replace('$', '')) : null;
                priceLarge = largePrice ? parseFloat(largePrice.replace('$', '')) : null;
            }
            
            const mappedCategory = categoryMap[category] || category || 'breakfast';
            
            if (name) {
                menuItems.push({
                    name: name,
                    category: mappedCategory,
                    description: description || '',
                    price: hasSizeOptions ? null : price,
                    image: image,
                    icon: icon,
                    hasSizeOptions: hasSizeOptions,
                    priceRegular: priceRegular,
                    priceLarge: priceLarge
                });
            }
        });
        
        if (menuItems.length > 0) {
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
            loadMenuItems();
            showNotification(`Successfully migrated ${menuItems.length} menu items!`, 'success');
        } else {
            showNotification('No menu items found in index.html', 'error');
        }
    } catch (error) {
        console.error('Migration error:', error);
        showNotification('Error migrating menu items. Make sure index.html is accessible.', 'error');
    }
}

// Show Notification (update to support error type)
function showNotification(message, type = 'success') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

