import { Container, Button, Title, Text } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useAuth } from "../../authentication/use-auth";
import { useCart } from "../../context/cart-context";
import { ApiResponse, OrderGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";

export const CartConfirmation = () => {
  const [, setCanAccess] = useState(false);
  const cartContext = useCart();
  const { cart } = cartContext || {};
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSaveOrder = async () => {
    if (!cart || cart.length === 0) {
      showNotification({
        message: "Cart is empty or undefined.",
        color: "red",
        style: { marginTop: "70px" },
      });
      return;
    }

    const saveOrder = {
      userId: user!.id,
      price: cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
      quantity: cart.reduce((total, item) => total + item.quantity, 0),
      date: new Date().toISOString(),
      status: "Processing",
      orderItems: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        image:
          item.product.images && item.product.images.length > 0
            ? item.product.images[0].data || ""
            : "",
      })),
    };

    try {
      const response = await api.post<ApiResponse<OrderGetDto>>(
        `/api/order`,
        saveOrder
      );
      if (response && response.data) {
        sessionStorage.removeItem("cart");
        showNotification({
          message: "Ordered product successfully",
          color: "green",
          style: { marginTop: "70px" },
        });
        navigate(routes.user);
        window.location.reload();
      } else {
        showNotification({
          message: "Invalid response format",
          color: "red",
          style: { marginTop: "70px" },
        });
      }
    } catch (error) {
      showNotification({
        message: "error saving Order",
        color: "red",
        style: { marginTop: "70px" },
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      setCanAccess(true);
    } else {
      navigate(routes.home);
    }
  }, [location, navigate]);

  return (
    <Container style={{ textAlign: "center" }}>
      <FontAwesomeIcon
        icon={faCheckCircle}
        size="4x"
        color="#68D391"
        style={{ marginBottom: "20px", marginTop:"20px" }}
      />
      <Title order={1}>Your order is confirmed!</Title>
      <Text size="lg" style={{ marginBottom: "20px" }}>
        Thank you for your purchase. We hope you enjoy your products.
      </Text>
      <Button
        variant="outline"
        color="teal"
        radius="md"
        onClick={() => handleSaveOrder()}
        style={{ marginTop: "20px" }}
      >
        Save Order
      </Button>
    </Container>
  );
};
