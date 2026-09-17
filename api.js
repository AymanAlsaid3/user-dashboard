export async function fetchUsers() {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('API Error:', error);
        return [];
    }
}
    
export async function fetchPosts() 
{
    try
    {
        let response = await fetch ('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new error ('Failed to fetch posts');
        return await response.json();

    }
    catch (error)
    {
        console.error("Error fetching posts:", error.message);
        return[];

    }
}