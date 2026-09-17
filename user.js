export class User {
    #id
    #posts = [];
    constructor(id,name, email, company, posts)
    {
       this.#id = id;
        this.name = name;
        this.email= email;
        this.company= company;
        this.#posts = posts;
        
    }
    addposts(allPosts)
    {
        this.#posts = allPosts.filter(posts => posts.userId==this.#id);
    }
  
toJSON() {
    return {
        id: this.#id,
        name: this.name,
        email: this.email,
        company: this.company,
        posts: this.#posts
    };
}

    getSummary()
    {
        return `-[ID: ${this.#id}] ${this.name}| posts: ${this.#posts.length}`;
    }
    }
   