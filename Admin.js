import {User} from './user.js';
export class AdminUser extends User 
{
constructor(name, email, company, permissions=["read","write"])
{
    super(name, email, company);
    this.permissions = permissions;
}
    getSummary()
    {
        return `-[Admin] ${this.name} (${this.email}) works at ${this.company} with permissions: ${this.permissions.join(", ")}`;
    }
}
