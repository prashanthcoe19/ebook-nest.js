import { User } from '../users/user.entity';

export const userProviders = [
    {
        provide: 'USER_REPOSITORY',
        useValue: User
    }
]