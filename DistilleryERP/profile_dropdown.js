document.addEventListener('DOMContentLoaded', function() {
    // Find the user profile element in the header
    const userProfileTrigger = document.getElementById('userProfileTrigger');

    if (userProfileTrigger) {
        // Make the trigger element relative to position the dropdown correctly
        userProfileTrigger.classList.add('relative');
        userProfileTrigger.style.cursor = 'pointer';

        // 1. Create the dropdown menu element
        const dropdown = document.createElement('div');
        dropdown.id = 'profileDropdownMenu';
        dropdown.className = 'absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 hidden';
        
        // Get the employee name from the header to personalize the dropdown
        const employeeName = userProfileTrigger.querySelector('.font-semibold').textContent || 'Employee';

        // 2. Populate the dropdown with menu items
        dropdown.innerHTML = `
            <div class="px-4 py-3">
                <p class="text-sm">Signed in as</p>
                <p class="text-sm font-medium text-gray-900 truncate">${employeeName}</p>
            </div>
            <div class="py-1">
                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-lucide="user-circle-2" class="mr-3 h-5 w-5 text-gray-400"></i>
                    <span>Profile (Emp100122)</span>
                </a>
                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-lucide="settings" class="mr-3 h-5 w-5 text-gray-400"></i>
                    <span>Settings</span>
                </a>
                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-lucide="help-circle" class="mr-3 h-5 w-5 text-gray-400"></i>
                    <span>Help</span>
                </a>
            </div>
            <div class="py-1">
                <a href="#" class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-lucide="log-out" class="mr-3 h-5 w-5 text-gray-400"></i>
                    <span>Log out</span>
                </a>
            </div>
        `;

        // 3. Append the dropdown to the trigger element
        userProfileTrigger.appendChild(dropdown);
        
        // Must call this after adding new HTML with data-lucide attributes
        if (window.lucide) {
            lucide.createIcons();
        }

        // 4. Add event listener to toggle dropdown visibility
        userProfileTrigger.addEventListener('click', function(event) {
            // Stop the click from immediately being caught by the 'window' listener
            event.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // 5. Add event listener to close dropdown when clicking outside
        window.addEventListener('click', function(event) {
            if (!userProfileTrigger.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
});
