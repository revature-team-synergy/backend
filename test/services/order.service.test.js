const orderDao = require("../../src/dao/order.dao");
const { createOrder, getOrdersByUserId } = require("../../src/services/order.service")

describe('createOrder', () => {
  test('returns created order when given valid order object', async () => {
    const order = { userID: '123', orders: ['product1', 'product2'], totalPrice: 50 };
    const createdOrder = { id: 'abc', ...order };
    orderDao.createOrder = jest.fn().mockResolvedValue(createdOrder);
    
    const result = await createOrder(order);
    
    expect(result).toEqual(createdOrder);
    expect(orderDao.createOrder).toHaveBeenCalledWith(order);
  });
  
  test('throws error when given incomplete order object', async () => {
    const incompleteOrder = { userID: '123', totalPrice: 50 };
    
    await expect(createOrder(incompleteOrder)).rejects.toThrow('Not enough product information');
  });
});

describe('getOrdersByUserId', () => {
  test('returns orders for given user ID', async () => {
    const userID = '123';
    const orders = { Items: [{ id: 'abc', userID, orders: ['product1', 'product2'], totalPrice: 50 }] };
    orderDao.getOrdersByUserId = jest.fn().mockResolvedValue(orders);
    
    const result = await getOrdersByUserId(userID);
    
    expect(result).toEqual(orders.Items);
    expect(orderDao.getOrdersByUserId).toHaveBeenCalledWith(userID);
  });
  
  test('throws error when user ID is not found', async () => {
    const userID = '456';
    const orders = { Items: [] };
    orderDao.getOrdersByUserId = jest.fn().mockResolvedValue(orders);
    
    await expect(getOrdersByUserId(userID)).rejects.toThrow(`User with ID ${userID} not found`);
  });
  
  test('throws error when orderDao.getOrdersByUserId throws error', async () => {
    const userID = '123';
    const error = new Error('Database error');
    orderDao.getOrdersByUserId = jest.fn().mockRejectedValue(error);
    
    await expect(getOrdersByUserId(userID)).rejects.toThrow(error);
  });
});
