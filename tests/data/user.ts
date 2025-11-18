export type UserType = 'standard' | 'problem' | 'performance' | 'error' | 'visual' | 'locked';

export interface User {
  username: string;
  password: string;
  type: UserType;
  canLogin: boolean;
}

export class UserFactory {
  private static readonly users: User[] = [
    { username: 'standard_user', password: 'secret_sauce', type: 'standard', canLogin: true },
    { username: 'problem_user', password: 'secret_sauce', type: 'problem', canLogin: true },
    { username: 'performance_glitch_user', password: 'secret_sauce', type: 'performance', canLogin: true },
    { username: 'error_user', password: 'secret_sauce', type: 'error', canLogin: true },
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

  static getStandardUsers(): User[] {
    return this.users.filter(user => user.type === 'standard');
  }
}