export interface User {
  username: string;
  password: string;
  type: 'standard' | 'problem' | 'performance' | 'error' | 'visual' | 'locked';
  canLogin: boolean;
}

export class UserFactory {
  private static readonly users: User[] = [
    { username: 'standard_user', password: 'secret_sauce', type: 'standard', canLogin: true },
    { username: 'problem_user', password: 'secret_sauce', type: 'problem', canLogin: false },
    { username: 'performance_glitch_user', password: 'secret_sauce', type: 'performance', canLogin: false },
    { username: 'error_user', password: 'secret_sauce', type: 'error', canLogin: false },
    { username: 'visual_user', password: 'secret_sauce', type: 'visual', canLogin: true },
    { username: 'locked_out_user', password: 'secret_sauce', type: 'locked', canLogin: false }
  ];

  static getRandomUser(): User {
    return this.users[Math.floor(Math.random() * this.users.length)];
  }

  static getRandomValidUser(): User {
    const validUsers = this.users.filter(user => user.canLogin);
    return validUsers[Math.floor(Math.random() * validUsers.length)];
  }

  static getLockedOutUser(): User {
    return this.users.find(user => user.type === 'locked')!;
  }

  static getAllValidUsers(): User[] {
    return this.users.filter(user => user.canLogin);
  }

  static getAllInvalidUsers(): User[] {
    return this.users.filter(user => !user.canLogin);
  }

  static getAllUsers(): User[] {
    return this.users;
  }
}