// Cursor tracking
const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    requestAnimationFrame(updateCursor);
}
updateCursor();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Glitch effect on hero title
function createGlitchEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            const lines = heroTitle.querySelectorAll('.line');
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const originalText = randomLine.textContent;
            
            // Create glitch effect
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            randomLine.textContent = glitchedText;
            
            // Restore original text after 100ms
            setTimeout(() => {
                randomLine.textContent = originalText;
            }, 100);
        }
    }, 2000);
}

// Particle animation
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Typing effect for code block
function typeCode() {
    const codeLines = document.querySelectorAll('.code-line');
    let delay = 0;
    
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                line.style.transition = 'all 0.5s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 100);
        }, delay);
        delay += 200;
    });
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0%';
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 500);
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const finalNumber = parseInt(statNumber.textContent);
                let currentNumber = 0;
                
                const increment = finalNumber / 100;
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        currentNumber = finalNumber;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.floor(currentNumber) + '+';
                }, 20);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Parallax effect for sections
function parallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.particle');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Form submission
function handleFormSubmission() {
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.submit-btn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add loading state
        submitBtn.innerHTML = '<span>SENDING...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>MESSAGE SENT!</span>';
            submitBtn.style.background = '#00ffff';
            submitBtn.style.color = '#000000';
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = '<span>SEND MESSAGE</span>';
                submitBtn.style.background = 'transparent';
                submitBtn.style.color = '#00ffff';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Matrix rain effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Hover effects for interactive elements
function addHoverEffects() {
    const interactiveElements = document.querySelectorAll('.skill-card, .project-card, .contact-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#ffffff';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#00ffff';
        });
    });
}

// Navbar scroll effect
function navbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Projects slider functionality
function initProjectsSlider() {
    const projectsGrid = document.getElementById('projectsGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.projects-indicator');
    let currentSlide = 0;
    const totalSlides = 2;
    
    function updateSlider() {
        const translateX = -currentSlide * 100;
        projectsGrid.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Button event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Indicator event listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    projectsGrid.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    projectsGrid.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    // Mouse drag support
    let isDragging = false;
    let dragStartX = 0;
    
    projectsGrid.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        projectsGrid.style.cursor = 'grabbing';
    });
    
    projectsGrid.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    projectsGrid.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        projectsGrid.style.cursor = 'grab';
        
        const dragEndX = e.clientX;
        const diffX = dragStartX - dragEndX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
    
    projectsGrid.addEventListener('mouseleave', () => {
        isDragging = false;
        projectsGrid.style.cursor = 'grab';
    });
    
    function handleSwipe() {
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize
    updateSlider();
    projectsGrid.style.cursor = 'grab';
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    createGlitchEffect();
    createParticles();
    animateSkillBars();
    animateStats();
    parallaxEffect();
    handleFormSubmission();
    createMatrixRain();
    addHoverEffects();
    navbarScrollEffect();
    initProjectsSlider();
    
    // Delay typing effect to let page load
    setTimeout(typeCode, 2000);
});

// Loading animation
window.addEventListener('load', () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f0f0f;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            flex-direction: column;
        ">
            <div style="
                font-size: 2rem;
                color: #00ffff;
                margin-bottom: 30px;
                text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
            ">QA ENGINE</div>
            <div style="
                width: 200px;
                height: 4px;
                background: rgba(0, 255, 255, 0.3);
                border-radius: 2px;
                overflow: hidden;
            ">
                <div style="
                    width: 0%;
                    height: 100%;
                    background: #00ffff;
                    border-radius: 2px;
                    animation: loadingBar 2s ease-in-out forwards;
                "></div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes loadingBar {
            to { width: 100%; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
});