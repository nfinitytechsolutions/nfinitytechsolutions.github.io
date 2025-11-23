// --- ROLE DEFINITIONS ---
const ROLES = {
    'Procurement': ['pr_contracts.html'],
    'Gate_Weighbridge': ['gate_weighbridge.html'],
    'Quality_Lab': ['lims.html'],
    'Inventory': ['silomanagement.html'],
    'Production_Control': ['milling.html', 'fermentation.html', 'distillation.html', 'coprod.html','batchmanagement.html','recipemanagement.html','lims_2.html','production.html','chemicalsinventory.html','yield_accounting.html','productinventory.html','coprod-inventory.html','coprod-salesandlogistics.html'],
    'Fermentation': ['fermentation.html','batchmanagement.html','recipemanagement.html','lims_2.html'],
    'Distillation': ['distillation.html'],
    'Sales_Logistics': ['sales_main.html', 'logistics.html','sales_management.html'], 
    'Finance': ['finance.html','general_ledger.html','accounts_payble.html','account_recievable.html','finance_reports.html'],
    'HR': ['emp_main.html','employeedirectory.html','leave_mgmt.html','payroll.html'],
    'Maintenance': ['plant_maintain.html'],
    'Admin': [
        'pr_contracts.html', 'gate_weighbridge.html', 'lims.html', 'silomanagement.html', 
        'milling.html', 'fermentation.html', 'distillation.html', 'coprod.html', 
        'sales_main.html', 'sales_management.html', 'logistics.html',
        'finance.html', 'plant_maintain.html', 'St_compliance_and_reporting.html', 'emp_main.html','employeedirectory.html','leave_mgmt.html',
		'work_order.html', 'preventive.html', 'spare_and_mro.html','accounts_payble.html','account_recievable.html','finance_reports.html','batchmanagement.html','recipemanagement.html','lims_2.html','production.html','chemicalsinventory.html','yield_accounting.html','productinventory.html','coprod-inventory.html','coprod-salesandlogistics.html','payroll.html','admin_settings.html','notifications.html', 'vehicles.html', 'canteen.html'
    ]
};

// --- AUTHENTICATION LOGIC ---

async function handleLogin(event) {
    event.preventDefault();
    const employeeId = document.getElementById('employeeId').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('users.txt');
        if (!response.ok) throw new Error('Could not fetch user data.');
        const text = await response.text();
        const users = text.split('\n').filter(line => line.trim() !== '');
        const userLine = users.find(line => line.startsWith(employeeId));

        if (userLine) {
            const [id, role, ...nameParts] = userLine.split(' ');
            const name = nameParts.join(' ');
            sessionStorage.setItem('user', JSON.stringify({ id, role, name }));
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid Employee ID or Password.';
        }
    } catch (error) {
        console.error('Login Error:', error);
        errorMessage.textContent = 'An error occurred during login.';
    }
}

function checkAuthentication() {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    return JSON.parse(userString);
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// --- UI MANIPULATION ---

/**
 * Creates a dynamic SVG avatar with the user's initials.
 * This removes the dependency on external placeholder services.
 * @param {string} initials - The user's initials (e.g., 'JD').
 * @returns {string} A string containing the raw SVG markup.
 */
function createInitialsSVG(initials) {
    const width = 100;
    const height = 100;

    // Simple hash function to generate a color from initials for variety
    let hash = 0;
    if (initials.length === 0) {
        hash = 0;
    } else {
        for (let i = 0; i < initials.length; i++) {
            hash = initials.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
    }
    
    const h = hash % 360;
    const backgroundColor = `hsl(${h}, 70%, 85%)`; // Lighter, pastel-like background
    const textColor = `hsl(${h}, 50%, 40%)`;     // Darker, readable text color

    const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${backgroundColor}" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                  font-family="Arial, sans-serif" font-size="45" font-weight="bold" fill="${textColor}">
                ${initials}
            </text>
        </svg>
    `;
    return svg;
}


function updateUserProfile(user) {
    const userProfileTrigger = document.getElementById('userProfileTrigger');
    if (!userProfileTrigger || !user) return;

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // 1. Create the SVG string using our new helper function
    const svgString = createInitialsSVG(initials);
    // 2. Base64 encode the raw SVG string
    const svgBase64 = btoa(svgString);
    // 3. Create the data URI for the image source
    const svgDataUri = `data:image/svg+xml;base64,${svgBase64}`;

    // 4. Use the data URI as the image source, removing the placeholder.co dependency
    userProfileTrigger.innerHTML = `
        <img class="h-9 w-9 rounded-full object-cover" src="${svgDataUri}" alt="User avatar">
        <div>
            <p class="text-sm font-semibold text-gray-700">${user.name}</p>
            <p class="text-xs text-gray-500">${user.role.replace('_', ' ')}</p>
        </div>
    `;

    userProfileTrigger.classList.add('relative');
    userProfileTrigger.style.cursor = 'pointer';

    const dropdown = document.createElement('div');
    dropdown.id = 'profileDropdownMenu';
    dropdown.className = 'absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 hidden';

    dropdown.innerHTML = `
        <div class="px-4 py-3">
            <p class="text-sm">Signed in as</p>
            <p class="text-sm font-medium text-gray-900 truncate">${user.name}</p>
        </div>
        <div class="py-1">
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i data-lucide="user-circle-2" class="mr-3 h-5 w-5 text-gray-400"></i>
                <span>Profile (Emp ${user.id})</span>
            </a>
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i data-lucide="settings" class="mr-3 h-5 w-5 text-gray-400"></i>
                <span>Settings</span>
            </a>
        </div>
        <div class="py-1">
            <a href="#" id="logoutLink" class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i data-lucide="log-out" class="mr-3 h-5 w-5 text-gray-400"></i>
                <span>Log out</span>
            </a>
        </div>
    `;

    userProfileTrigger.appendChild(dropdown);
	
    if (window.lucide) {
        lucide.createIcons();
    }

    document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    userProfileTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    window.addEventListener('click', (event) => {
        if (!userProfileTrigger.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    const welcomeMessage = document.querySelector('h1.text-3xl');
    if (welcomeMessage && welcomeMessage.textContent.includes('Welcome back')) {
        welcomeMessage.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }
}


function applyRoleBasedAccess(role) {
    const allowedModules = ROLES[role] || [];
    if (!allowedModules.includes('my_leave.html')) {
        allowedModules.push('my_leave.html');
    }

    const allModules = document.querySelectorAll('.module-card');
    
    allModules.forEach(module => {
        const moduleHref = module.getAttribute('href');
        if (allowedModules.includes(moduleHref)) {
            module.style.display = 'flex';
        } else {
            module.style.display = 'none';
        }
    });

    // --- NEW LOGIC TO HIDE EMPTY SECTIONS ---
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(section => {
        // Find all cards within this section
        const cardsInSection = section.querySelectorAll('.module-card');
        
        // Check if at least one card is visible (i.e., its display style is not 'none')
        const hasVisibleCards = Array.from(cardsInSection).some(
            card => card.style.display !== 'none'
        );

        // If no cards are visible, hide the whole section
        if (hasVisibleCards) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    // --- END OF NEW LOGIC ---

    // --- Show/Hide Notification Bell for Admin ---
    const notificationContainer = document.getElementById('notificationContainer');
    if (notificationContainer) {
        if (role === 'Admin') {
            notificationContainer.style.display = 'block';
        } else {
            notificationContainer.style.display = 'none';
        }
    }
}


// --- INITIALIZATION ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

document.addEventListener('DOMContentLoaded', () => {
    // This check ensures we don't run auth logic on the login page itself
    if (!window.location.pathname.endsWith('login.html')) {
        const user = checkAuthentication();
        if (user) {
            updateUserProfile(user);
            applyRoleBasedAccess(user.role);
        }
    }
});
