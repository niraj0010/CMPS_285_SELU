import { useEffect, useState } from 'react';
import { Table, Text, Title, Avatar, Alert, Container } from '@mantine/core';
import api from '../../config/axios';
import { ApiResponse, orderGetDto } from '../../constants/types';
import { useUser } from '../../authentication/use-auth';

export const ViewMyOrderPage = () => {
  const [orders, setOrders] = useState<orderGetDto[]>([]);
  const user = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<ApiResponse<orderGetDto[]>>(`/api/order`);
        const orderProducts = response.data.data.filter((order) => order.userId === user.id);
        setOrders(orderProducts);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user.id]);

  const formatMonthYear = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <Title order={2} mt={20} mb={20} ta="center" c="dimmed">Order History</Title>
      {orders.length === 0 ? (
        <Alert color="gray">No orders found.</Alert>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>OrderID</th>
              <th>Image</th>
              <th>Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{formatMonthYear(order.date)}</td>
                <td>
                  {order.orderItems.map((item) => (
                    <div key={item.id}>
                      <Text>{`${item.orderId}`}</Text>
                    </div>
                  ))}
                </td>
                <td>
                  {order.orderItems.map((item) => (
                    <Avatar
                      key={item.id}
                      src={`data:image/jpeg;base64,${item.image}`}
                      alt={`Product Image: ${item.image}`}
                    />
                  ))}
                </td>
                <td>
                  {order.orderItems.map((item) => (
                    <div key={item.id}>
                      <Text>{`$ ${item.price}`}</Text>
                    </div>
                  ))}
                </td>
                <td>${order.price}</td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

