// Utility script to extract menu items from HTML and populate localStorage
// Run this once in the browser console to migrate existing menu items

function extractMenuItemsFromHTML() {
    const menuItems = [];
    const menuCards = document.querySelectorAll('.menu-item-card');
    
    // Category mapping
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
        
        // Check for size options (coffee items)
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
        
        const item = {
            name: name || '',
            category: categoryMap[category] || category || 'breakfast',
            description: description || '',
            price: hasSizeOptions ? null : price,
            image: image,
            icon: icon,
            hasSizeOptions: hasSizeOptions,
            priceRegular: priceRegular,
            priceLarge: priceLarge
        };
        
        if (name) {
            menuItems.push(item);
        }
    });
    
    return menuItems;
}

// Run extraction and save to localStorage
function migrateMenuItems() {
    const items = extractMenuItemsFromHTML();
    localStorage.setItem('menuItems', JSON.stringify(items));
    console.log(`Extracted ${items.length} menu items and saved to localStorage`);
    return items;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { extractMenuItemsFromHTML, migrateMenuItems };
}

