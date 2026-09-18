import { fetchUsers, fetchPosts } from './api.js';
import { User } from './user.js';
import {saveUserData,loadUserData} from './storage.js'

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

    // Display summaries in console as before
    users.slice(0, 3).forEach(user => {
        console.log(user.getSummary());
    });

    // Save the structured data locally to a file named 'users_output.json'
    await saveUserData('users_output.json', users);
}
async function runReaderApp()
{
  console.log("Loading data from local storage...");
 let savedUsers = await loadUserData ('users_output.json');
 console.log (`loaded ${savedUsers.length} users from disk.`); 
if (savedUsers.length>0)
{
  let firstUser = savedUsers[0];
  console.log(`- [ID: ${firstUser.id}] ${firstUser.name} | Total saved posts: ${firstUser.posts.length}`);
}
} 
document.addEventListener ('DOMContentLoaded',()=>{
    const exportBtn = document.getElementById('exportBtn');
    if(exportBtn)
    {
    exportBtn.addEventListener('click',()=>
    {
        window.location.href = '/api/users/export/csv';
    });
}
});
const searchInput = document.getElementById('searchInput');
if (searchInput) 
    {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredUsers = allusers.filter(user=>
                user.name.toLowerCase.includes(searchTerm) || 
                user.email.toLowerCase.includes(searchTerm)
            );
            renderUsers(filteredUsers);
});
        }
runReaderApp();


