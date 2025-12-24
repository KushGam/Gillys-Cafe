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

// Menu Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        menuItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hidden');
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
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

// Button Click Handlers (for Order and Reservation buttons)
document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        
        if (buttonText.includes('Order')) {
            // You can add order functionality here
            alert('Order functionality coming soon!');
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

// Toggle chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
        chatbotBadge.style.display = 'none';
        chatbotInput.focus();
    });
}

// Close chatbot
if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
}

// Close chatbot when clicking outside (mobile-friendly)
document.addEventListener('click', (e) => {
    if (chatbotContainer && chatbotContainer.classList.contains('active')) {
        if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
            // Only close on mobile devices
            if (window.innerWidth <= 768) {
                chatbotContainer.classList.remove('active');
            }
        }
    }
});

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
        return `<p>Hello! 👋 Welcome to Gilly's Cafe! How can I help you today?</p>
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

