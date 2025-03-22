document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const aartisContainer = document.getElementById('aartisContainer');
    const modal = document.getElementById('aartiModal');
    const closeModal = document.querySelector('.close-modal');
    const modalContent = document.getElementById('modalContent');
    
    // Toggle menu for mobile
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking a link
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            // Update active navigation link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Populate aartis
    function displayAartis(aartisToDisplay) {
        aartisContainer.innerHTML = '';
        
        if (aartisToDisplay.length === 0) {
            aartisContainer.innerHTML = '<p class="no-results">No aartis found matching your search.</p>';
            return;
        }
        
        aartisToDisplay.forEach(aarti => {
            const aartiCard = document.createElement('div');
            aartiCard.classList.add('aarti-card');
            aartiCard.setAttribute('data-id', aarti.id);
            
            aartiCard.innerHTML = `
                <img src="${aarti.image}" alt="${aarti.title}" class="aarti-img">
                <div class="aarti-info">
                    <h3>${aarti.title}</h3>
                    <span class="deity-name">${aarti.deity}</span>
                    <p>${aarti.lyrics.substring(0, 60)}...</p>
                </div>
            `;
            
            aartisContainer.appendChild(aartiCard);
        });
    }
    
    // Filter aartis by category
    function filterAartis(category) {
        if (category === 'all') {
            return aartis;
        } else {
            return aartis.filter(aarti => aarti.category === category);
        }
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let filteredAartis;
        
        // Get currently active category
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        
        // First filter by category
        filteredAartis = filterAartis(activeCategory);
        
        // Then filter by search term
        if (searchTerm) {
            filteredAartis = filteredAartis.filter(aarti => 
                aarti.title.toLowerCase().includes(searchTerm) || 
                aarti.deity.toLowerCase().includes(searchTerm) ||
                aarti.lyrics.toLowerCase().includes(searchTerm)
            );
        }
        
        displayAartis(filteredAartis);
    });
    
    // Category filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter aartis by category
            const category = this.dataset.category;
            const filteredAartis = filterAartis(category);
            
            // Apply search filter if there's a search term
            const searchTerm = searchInput.value.toLowerCase();
            let searchFilteredAartis = filteredAartis;
            
            if (searchTerm) {
                searchFilteredAartis = filteredAartis.filter(aarti => 
                    aarti.title.toLowerCase().includes(searchTerm) || 
                    aarti.deity.toLowerCase().includes(searchTerm) ||
                    aarti.lyrics.toLowerCase().includes(searchTerm)
                );
            }
            
            displayAartis(searchFilteredAartis);
        });
    });
    
    // Open modal when aarti card is clicked
    aartisContainer.addEventListener('click', function(e) {
        const aartiCard = e.target.closest('.aarti-card');
        if (!aartiCard) return;
        
        const aartiId = parseInt(aartiCard.dataset.id);
        const aarti = aartis.find(a => a.id === aartiId);
        
        if (aarti) {
            modalContent.innerHTML = `
                <div class="aarti-full">
                    <h2>${aarti.title}</h2>
                    <span class="deity">${aarti.deity}</span>
                    <div class="aarti-lyrics">${aarti.lyrics}</div>
                    <div class="aarti-meaning">
                        <h3>Meaning & Significance:</h3>
                        <p>${aarti.meaning}</p>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling again
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Initial display of all aartis
    displayAartis(aartis);
    
    // Handle scroll events to update active navigation link
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const currentId = section.getAttribute('id');
                
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});
