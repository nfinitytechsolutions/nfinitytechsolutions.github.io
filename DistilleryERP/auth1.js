// --- ROLE DEFINITIONS ---
const ROLES = {
    'Procurement': ['pr_contracts.html'],
    'Gate_Weighbridge': ['gate_weighbridge.html'],
    'Quality_Lab': ['lims.html'],
    'Inventory': ['silomanagement.html'],
    'Production_Control': ['milling.html', 'fermentation.html', 'distillation.html', 'coprod.html'],
    'Fermentation': ['fermentation.html'],
    'Distillation': ['distillation.html'],
    'Sales_Logistics': ['sales_main.html'],
    'Finance': ['finance.html'],
    'HR': ['emp_main.html'],
    'Maintenance': ['plant_maintain.html'],
    'Admin': ['pr_contracts.html', 'gate_weighbridge.html', 'lims.html', 'silomanagement.html', 'milling.html', 'fermentation.html', 'distillation.html', 'coprod.html', 'sales_main.html', 'finance.html', 'plant_maintain.html', 'St_compliance_and_reporting.html', 'emp_main.html']
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
        errorMessage.textContent = 'An error occurred. Please ensure you are running this from a local server.';
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
 * Creates the user profile dropdown menu in the header.
 * @param {object} user - The logged-in user object.
 */
function updateUserProfile(user) {
    const userProfileTrigger = document.getElementById('userProfileTrigger');
    if (!userProfileTrigger || !user) return;

    // --- Create the visible part of the trigger (Avatar, Name, Role) ---
    const initials = user.name.split(' ').map(n => n[0]).join('');
    userProfileTrigger.innerHTML = `
        <img class="h-9 w-9 rounded-full object-cover" src="https://placehold.co/100x100/E2E8F0/4A5568?text=${initials}" alt="User avatar">
        <div>
            <p class="text-sm font-semibold text-gray-700">${user.name}</p>
            <p class="text-xs text-gray-500">${user.role.replace('_', ' ')}</p>
        </div>
    `;

    // --- Style the trigger and create the dropdown menu ---
    userProfileTrigger.classList.add('relative');
    userProfileTrigger.style.cursor = 'pointer';

    const dropdown = document.createElement('div');
    dropdown.id = 'profileDropdownMenu';
    dropdown.className = 'absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 hidden';

    // --- Populate the dropdown with dynamic content ---
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

    // --- Append dropdown and add event listeners ---
    userProfileTrigger.appendChild(dropdown);
    
    // Render the new Lucide icons inside the dropdown
    if (window.lucide) {
        lucide.createIcons();
    }

    // Add event listener to the "Log out" link
    document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the link from navigating
        logout();
    });

    // Add event listener to toggle dropdown visibility
    userProfileTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    // Add global event listener to close dropdown when clicking outside
    window.addEventListener('click', (event) => {
        if (!userProfileTrigger.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    // Update welcome message if it exists
    const welcomeMessage = document.querySelector('h1.text-3xl');
    if (welcomeMessage && welcomeMessage.textContent.includes('Welcome back')) {
        welcomeMessage.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }
}


function applyRoleBasedAccess(role) {
    const allowedModules = ROLES[role] || [];
    allowedModules.push('my_leave.html'); // Add "My Leave" for everyone

    const allModules = document.querySelectorAll('.module-card');
    
    allModules.forEach(module => {
        const moduleHref = module.getAttribute('href');
        if (allowedModules.includes(moduleHref)) {
            module.style.display = 'flex';
        } else {
            module.style.display = 'none';
        }
    });
}


// --- INITIALIZATION ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('login.html')) {
        const user = checkAuthentication();
        if (user) {
            updateUserProfile(user);
            applyRoleBasedAccess(user.role);
        }
    }
});
