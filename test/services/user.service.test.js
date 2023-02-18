const userDao = require("../../src/dao/user.dao");
const { registerUser, login, getUserById, updateUser } = require('../../src/services/user.service');

describe('registerUser', () => {
    test('registers a new user', async () => {
        const user = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        };

        userDao.registerUser = jest.fn().mockResolvedValue(user);

        const result = await registerUser(user);
        expect(result).toBeTruthy();
    });

    test('throws an error if email is invalid', async () => {
        const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        password: 'password123'
        };

        const error = new Error('Please enter a valid email. (ex. example@email.com)');

        await expect(registerUser(user)).rejects.toThrow(error);
    });

    test('throws an error if email is already registered', async () => {
        const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
        };
        const error = new Error(`Email ${user.email} has already been registered`);

        userDao.registerUser = jest.fn().mockRejectedValue(error);

        await registerUser(user);
        await expect(registerUser(user)).rejects.toThrow(error);
    });

    test('throws an error if password length is less than 8', async () => {
        const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'short'
        };

        const error = new Error(`Password length must be at least 8 characters`);

        await expect(registerUser(user)).rejects.toThrow(error);
    });

    test('throws an error if not enough user information is provided', async () => {
        const user = {
        firstName: 'John',
        lastName: 'Doe'
        };
        
        const error = new Error("Not enough user information");
        await expect(registerUser(user)).rejects.toThrow(error);
    });
});

describe('login', () => {
    test('logs in a user with correct credentials', async () => {
        const email = 'johndoe@example.com';
        const password = 'password123';

        userDao.getUserByEmail = jest.fn().mockResolvedValue({email, password});

        const result = await login(email, password);
        expect(result).toBeTruthy();
    });

    test('returns null for incorrect email', async () => {
        const email = 'nonexistent@example.com';
        const password = 'password123';
        const result = await login(email, password);
        expect(result).toBeNull();
    });

    test('returns null for incorrect password', async () => {
        const email = 'johndoe@example.com';
        const password = 'incorrectpassword';
        const result = await login(email, password);
        expect(result).toBeNull();
    });
});

describe('getUserById', () => {
    test('returns a user with correct ID', async () => {
        const userId = '12345';
        const result = await getUserById(userId);
        expect(result).toBeTruthy();
    });

    test('throws an error for non-existent user', async () => {
        const userId = 'nonexistent';
        await expect(getUserById(userId)).rejects.toThrow();
    });
});

describe('updateUser', () => {
    test('updates user information', async () => {
        const user = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@example.com',
        password: 'password123'
        };
        const userId = '12345';
        const result = await updateUser(user, userId);
        expect(result).toBeTruthy();
    });

    test('throws an error if email is already taken', async () => {
        const user = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
        };
    });
});