// Menu Data Management
let menuItemsData = [];

// Load menu items from localStorage or use HTML fallback
function loadMenuItemsData() {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        try {
            menuItemsData = JSON.parse(stored);
            if (menuItemsData.length > 0) {
                renderMenuFromData();
                return true;
            }
        } catch (e) {
            console.error('Error parsing menu items:', e);
        }
    }
    return false; // Use HTML fallback
}

// Render menu from data
function renderMenuFromData() {
    if (menuItemsData.length === 0) return;
    
    // Group items by category
    const categories = {
        'breakfast': [],
        'lunch': [],
        'small-plates': [],
        'coffee': [],
        'cold': [],
        'desserts': []
    };
    
    menuItemsData.forEach(item => {
        if (categories[item.category]) {
            categories[item.category].push(item);
        }
    });
    
    // Render each category section
    Object.keys(categories).forEach(category => {
        const sectionId = category === 'lunch' ? 'lunch-section' : 
                         category === 'small-plates' ? 'small-plates-section' :
                         category === 'coffee' ? 'coffee-section' :
                         category === 'cold' ? 'drinks-section' :
                         category === 'desserts' ? 'desserts-section' :
                         'breakfast-section';
        
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const itemsContainer = section.querySelector('.menu-section-items');
        if (!itemsContainer) return;
        
        // Clear existing items
        itemsContainer.innerHTML = '';
        
        // Render items
        categories[category].forEach(item => {
            const card = createMenuItemCard(item);
            itemsContainer.appendChild(card);
        });
    });
}

// Create menu item card element
function createMenuItemCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    card.setAttribute('data-category', item.category);
    
    // Image or icon
    let imageHtml = '';
    if (item.image) {
        imageHtml = `<div class="menu-item-image"><img src="${item.image}" alt="${item.name}"></div>`;
    } else if (item.icon) {
        const iconClass = item.icon.includes('coffee-image') ? 'coffee-image' : 
                         item.icon.includes('drink') ? 'drink-image' : 'coffee-image';
        imageHtml = `<div class="menu-item-image ${iconClass}"><i class="${item.icon}"></i></div>`;
    } else {
        imageHtml = `<div class="menu-item-image coffee-image"><i class="fas fa-utensils"></i></div>`;
    }
    
    // Price display
    let priceHtml = '';
    if (item.hasSizeOptions) {
        priceHtml = `<div class="price-options">
            <span class="price-regular">$${item.priceRegular || item.price || '0.00'}</span>
            <span class="price-separator">/</span>
            <span class="price-large">$${item.priceLarge || item.price || '0.00'}</span>
        </div>`;
    } else {
        priceHtml = `<span class="price">$${item.price || '0.00'}</span>`;
    }
    
    card.innerHTML = `
        ${imageHtml}
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${priceHtml}
    `;
    
    return card;
}

// Initialize menu on page load
document.addEventListener('DOMContentLoaded', () => {
    // Try to load from localStorage, fallback to HTML
    loadMenuItemsData();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navActions = document.querySelector('.nav-actions');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navActions.classList.remove('active');
            }
        }
    });
});

// Menu Navigation Tabs Functionality
const menuNavButtons = document.querySelectorAll('.menu-nav-btn');
const menuSections = document.querySelectorAll('.menu-section-content');

menuNavButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        menuNavButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const sectionId = button.getAttribute('data-menu-section') + '-section';
        
        // Hide all sections
        menuSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Smooth scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.menu-item, .location-card, .testimonial-card, .contact-card, .reservation-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// View Full Menu Button Handler
const viewFullMenuBtn = document.getElementById('viewFullMenuBtn');
if (viewFullMenuBtn) {
    viewFullMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            // Scroll to menu section smoothly
            menuSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Add a subtle highlight effect to the menu section
            menuSection.style.transition = 'box-shadow 0.3s ease';
            menuSection.style.boxShadow = '0 0 30px rgba(139, 69, 19, 0.3)';
            setTimeout(() => {
                menuSection.style.boxShadow = '';
            }, 2000);
            
            // Ensure the first tab (Breakfast) is active and visible
            setTimeout(() => {
                const firstTab = document.querySelector('.menu-nav-btn[data-menu-section="breakfast"]');
                if (firstTab && !firstTab.classList.contains('active')) {
                    firstTab.click(); // Trigger the click to show breakfast section
                }
            }, 300);
        }
    });
}

// Button Click Handlers (for Order and Reservation buttons)
document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
    // Skip the View Full Menu button as it has its own handler
    if (button.id === 'viewFullMenuBtn') return;
    
    button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        
        if (buttonText.includes('Order')) {
            // Show order modal
            e.preventDefault();
            const orderModal = document.getElementById('orderModal');
            if (orderModal) {
                orderModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } else if (buttonText.includes('Reserve') || buttonText.includes('Reservation')) {
            // Scroll to reservation section
            e.preventDefault();
            const reservationSection = document.getElementById('reservation');
            if (reservationSection) {
                reservationSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add active state to current section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotBadge = document.querySelector('.chatbot-badge');

// Ensure chatbot starts closed
if (chatbotContainer) {
    chatbotContainer.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

// Toggle chatbot - only open when button is clicked
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (chatbotContainer) {
            chatbotContainer.classList.add('active');
            if (chatbotBadge) {
                chatbotBadge.style.display = 'none';
            }
            if (chatbotInput) {
                setTimeout(() => chatbotInput.focus(), 100);
            }
        }
    });
}

// Function to close chatbot and restore body scroll
function closeChatbot() {
    if (chatbotContainer) {
        chatbotContainer.classList.remove('active');
        // Always restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        // Force remove active class
        chatbotContainer.setAttribute('class', chatbotContainer.getAttribute('class').replace('active', '').trim());
        
        // Blur input if focused
        if (chatbotInput && document.activeElement === chatbotInput) {
            chatbotInput.blur();
        }
    }
}

// Close chatbot - multiple event handlers for reliability
function setupCloseButton() {
    const closeBtn = document.getElementById('chatbotClose');
    if (!closeBtn) return;
    
    function handleClose(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        closeChatbot();
        return false;
    }
    
    // Remove all existing event listeners by cloning
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    // Add fresh event listeners
    newCloseBtn.addEventListener('click', handleClose, { capture: true, once: false });
    newCloseBtn.addEventListener('touchstart', handleClose, { passive: false, capture: true, once: false });
    newCloseBtn.addEventListener('touchend', handleClose, { passive: false, capture: true, once: false });
    newCloseBtn.addEventListener('mousedown', handleClose, { capture: true, once: false });
    newCloseBtn.addEventListener('pointerdown', handleClose, { capture: true, once: false });
}

// Setup close button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCloseButton);
} else {
    setupCloseButton();
}

// Ensure chatbot is closed on page load
window.addEventListener('load', () => {
    if (chatbotContainer) {
        chatbotContainer.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
    }
});

// Also ensure it's closed immediately
if (chatbotContainer) {
    chatbotContainer.classList.remove('active');
    chatbotContainer.style.display = 'none';
}

// Close chatbot when clicking/touching outside (mobile-friendly)
function handleOutsideClick(e) {
    if (chatbotContainer && chatbotContainer.classList.contains('active')) {
        // Don't close if clicking inside chatbot or on toggle button
        if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
            // Close on mobile devices
            if (window.innerWidth <= 768) {
                e.preventDefault();
                closeChatbot();
            }
        }
    }
}

document.addEventListener('click', handleOutsideClick, true);
document.addEventListener('touchend', handleOutsideClick, true);

// Prevent body scroll when chatbot is open on mobile
if (chatbotContainer) {
    const observer = new MutationObserver(() => {
        if (chatbotContainer.classList.contains('active') && window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
            // Prevent scroll on iOS
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    });
    
    observer.observe(chatbotContainer, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Also restore scroll on window resize
window.addEventListener('resize', () => {
    if (!chatbotContainer || !chatbotContainer.classList.contains('active')) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
});

// Close chatbot with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbotContainer && chatbotContainer.classList.contains('active')) {
        closeChatbot();
    }
});

// Add swipe down to close on mobile
let touchStartY = 0;
let touchEndY = 0;
let lastTap = 0;

if (chatbotContainer) {
    chatbotContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    chatbotContainer.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const swipeDistance = touchStartY - touchEndY;
        // If swiped down more than 100px from the top, close chatbot
        if (swipeDistance < -100 && touchStartY < 100) {
            closeChatbot();
        }
    }, { passive: true });
}

// Double tap on header to close (mobile fallback)
const chatbotHeader = document.querySelector('.chatbot-header');
if (chatbotHeader) {
    chatbotHeader.addEventListener('click', (e) => {
        // Don't trigger if clicking the close button
        if (e.target.closest('.chatbot-close')) {
            return;
        }
        
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            e.preventDefault();
            closeChatbot();
        }
        lastTap = currentTime;
    });
}

// Send message function
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Simulate bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Check if text contains HTML or is plain text
    if (text.includes('<p>') || text.includes('<ul>')) {
        contentDiv.innerHTML = text;
    } else {
        const p = document.createElement('p');
        p.textContent = text;
        contentDiv.appendChild(p);
    }
    
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Get bot response based on user input
function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Menu queries
    if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('dish')) {
        return `<p>We have a delicious menu! Here are some popular items:</p>
                <ul>
                    <li><strong>Breakfast:</strong> Smashed Avo, Big Breakfast, Belgian Waffle</li>
                    <li><strong>Lunch:</strong> Chicken Schnitzel, Classic Cheese Burger, Tropical Prawn Salad</li>
                    <li><strong>Desserts:</strong> Choco Lava Cake, Passionfruit Slice, Pistachio Friands</li>
                </ul>
                <p>You can view our full menu on the website! Would you like to know more about any specific dish?</p>`;
    }
    
    // Hours queries
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time') || lowerMessage.includes('close')) {
        return `<p>Our opening hours are:</p>
                <p><strong>Monday - Sunday: 6am - 4pm</strong></p>
                <p>We're open every day! Come visit us for breakfast, lunch, or a coffee break! ☕</p>`;
    }
    
    // Reservation queries
    if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('table') || lowerMessage.includes('reserve')) {
        return `<p>To make a reservation, you can:</p>
                <ul>
                    <li><strong>Call us:</strong> <a href="tel:+61405290710" style="color: var(--primary-color);">+61 405 290 710</a></li>
                    <li><strong>Email us:</strong> <a href="mailto:gillyscafeco@gmail.com" style="color: var(--primary-color);">gillyscafeco@gmail.com</a></li>
                </ul>
                <p>We'd love to have you! 🎉</p>`;
    }
    
    // Location queries
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('find')) {
        return `<p>We're located at:</p>
                <p><strong>C6 / Level 1/2 Hector Ct, Kellyville NSW 2155</strong></p>
                <p>You can find us on the map on our website, or use Google Maps to get directions! 📍</p>`;
    }
    
    // Contact queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('call')) {
        return `<p>You can reach us at:</p>
                <ul>
                    <li><strong>Phone:</strong> <a href="tel:+61405290710" style="color: var(--primary-color);">+61 405 290 710</a></li>
                    <li><strong>Email:</strong> <a href="mailto:gillyscafeco@gmail.com" style="color: var(--primary-color);">gillyscafeco@gmail.com</a></li>
                    <li><strong>Address:</strong> C6 / Level 1/2 Hector Ct, Kellyville NSW 2155</li>
                </ul>`;
    }
    
    // Price queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return `<p>Our prices vary by item. Here are some examples:</p>
                <ul>
                    <li>Breakfast items: $16 - $28</li>
                    <li>Lunch items: $18 - $28</li>
                    <li>Desserts: $6 - $14</li>
                    <li>Coffee: $10</li>
                </ul>
                <p>Check our menu section for detailed pricing! 💰</p>`;
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `<p>Hello! 👋 Welcome to Gillys Breakfast & Lunch! How can I help you today?</p>
                <p>You can ask me about our menu, opening hours, reservations, location, or anything else!</p>`;
    }
    
    // Default response
    return `<p>Thanks for your message! 😊</p>
            <p>I can help you with:</p>
            <ul>
                <li>Our menu and dishes</li>
                <li>Opening hours</li>
                <li>Making reservations</li>
                <li>Location and directions</li>
                <li>Contact information</li>
            </ul>
            <p>What would you like to know?</p>`;
}

// Event listeners for send button and Enter key
if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Theme Toggle Functionality
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const themeIconDesktop = document.getElementById('themeIconDesktop');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeIconMobile = document.getElementById('themeIconMobile');
const html = document.documentElement;

// Function to update theme icons
function updateThemeIcons(theme) {
    if (theme === 'dark') {
        if (themeIconDesktop) {
            themeIconDesktop.classList.remove('fa-moon');
            themeIconDesktop.classList.add('fa-sun');
        }
        if (themeIconMobile) {
            themeIconMobile.classList.remove('fa-moon');
            themeIconMobile.classList.add('fa-sun');
        }
    } else {
        if (themeIconDesktop) {
            themeIconDesktop.classList.remove('fa-sun');
            themeIconDesktop.classList.add('fa-moon');
        }
        if (themeIconMobile) {
            themeIconMobile.classList.remove('fa-sun');
            themeIconMobile.classList.add('fa-moon');
        }
    }
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Set new theme
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icons
    updateThemeIcons(newTheme);
    
    // Close mobile menu after theme change on mobile
    if (window.innerWidth <= 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navActions = document.querySelector('.nav-actions');
        if (hamburger && navMenu && navActions) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navActions.classList.remove('active');
        }
    }
}

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Update icons based on current theme
updateThemeIcons(currentTheme);

// Theme toggle event listeners
if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
    });
}

// Order Modal Functionality
const orderModal = document.getElementById('orderModal');
const orderModalClose = document.getElementById('orderModalClose');

// Close modal when close button is clicked
if (orderModalClose) {
    orderModalClose.addEventListener('click', () => {
        if (orderModal) {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close modal when clicking outside
if (orderModal) {
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal && orderModal.classList.contains('active')) {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});


