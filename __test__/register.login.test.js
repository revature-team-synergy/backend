const { registerUser } = require('../dao/user.dao');

test('register existing user should throw error',  async () => {
    // AAA
    // Arrange, Act, Assert

    let email = 'user';
    let password = 'password';

    /**
     * Act
     * This is where the code under test is executed. This can include calling a method, or getting a property value
     */
    let result = Boolean(!(await registerUser(email, password)));


    /**
     * Assert
     * This is where the test's expected outcome is checked.
     * This includes verifying that the code under test has produced the expected results, and that no unexpected exceptions were thrown
     */

    expect(result).toBe(false);
})