import { fetchUsers, fetchPosts } from './api.js';
import { User } from './user.js';
import { saveUserData, loadUserData } from './storage.js';

let allUsers = []; // Global variable to hold all users

// 1. Populate allUsers and render them on startup
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        allUsers = await response.json();
        renderUsers(allUsers); // Display all users initially
    } catch (err) {
        console.error('Failed to load users:', err);
    }
}

// 2. Define the missing renderUsers function to update the HTML
function renderUsers(usersToRender) {
    const userListContainer = document.getElementById('userList'); // Ensure this matches your HTML container ID
    if (!userListContainer) return;

    if (usersToRender.length === 0) {
        userListContainer.innerHTML = '<p class="p-2 text-gray-500">No users found.</p>';
        return;
    }

    userListContainer.innerHTML = usersToRender.map(user => `
        <div class="p-2 border-b">
            <strong>${user.name}</strong> (${user.email})
        </div>
    `).join('');
}

async function runApp() {
    console.log("Fetching users and posts concurrently...");
    
    let [rawUsers, rawPosts] = await Promise.all([
        fetchUsers(),
        fetchPosts()
    ]);

    let users = rawUsers.map(u => {
        let user = new User(u.id, u.name, u.email, u.company.name, u.posts);
        user.addposts(rawPosts);
        return user;
    });

    users.slice(0, 3).forEach(user => {
        console.log(user.getSummary());
    });

    await saveUserData('users_output.json', users);
}

async function runReaderApp() {
    console.log("Loading data from local storage...");
    let savedUsers = await loadUserData('users_output.json');
    console.log(`loaded ${savedUsers.length} users from disk.`); 
    if (savedUsers.length > 0) {
        let firstUser = savedUsers[0];
        console.log(`- [ID: ${firstUser.id}] ${firstUser.name} | Total saved posts: ${firstUser.posts.length}`);
    }
} 

// Event listener for CSV Export button
document.addEventListener('DOMContentLoaded', () => {
    loadUsers(); // Load users from backend when page opens

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.location.href = '/api/users/export/csv';
        });
    }
});

// Search function
function searchUsers() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    
    if (typeof allUsers === 'undefined') return;

    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );
        
    renderUsers(filteredUsers);
}

// Instant search event listener as you type
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchUsers);
    }
});

runReaderApp();