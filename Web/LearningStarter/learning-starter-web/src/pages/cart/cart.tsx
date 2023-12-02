import {
  Image,
  Container,
  Button,
  Input,
  Text,
  Group,
  Grid,
  Col,
  Divider,
  CloseButton,
  Modal,
} from "@mantine/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/cart-context";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { StripeCheckout } from "./cart-checkout";
import { ApiResponse, stripeCheckoutResponse } from "../../constants/types";
import api from "../../config/axios";

export const CartPage = () => {
  const cartContext = useCart();
  const { cart, removeFromCart, updateCartItemQuantity } = cartContext || {};
  const [opendialog, setOpendialog] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [proceedCheckout, setProceedCheckout] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessionUrl, setSessionUrl] = useState("");

  const handleClearCart = () => {
    sessionStorage.removeItem("cart");
    window.location.reload();
  };
  const closeCheckout = () => {
    setCheckout(false);
  };

  const closeDialog = () => {
    setOpendialog(false);
  };

  const handleRemoveFromCart = (productId) => {
    if (removeFromCart) {
      removeFromCart(productId);
      setOpendialog(false);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const itemToUpdate = cart?.find((item) => item.product.id === productId);
    if (updateCartItemQuantity)
      if (itemToUpdate) {
        const updatedQuantity = Math.max(newQuantity, 0);
        updateCartItemQuantity(itemToUpdate.product.id, updatedQuantity);
      }
  };
  const calculateTotalPrice = (item) => {
    return item.product.price * item.quantity;
  };

  const calculateCartTotalPrice = () => {
    return cart
      ?.reduce((total, item) => total + calculateTotalPrice(item), 0)
      .toFixed(2);
  };

  const handleCartIncrease = (productId) => {
    const item = cart?.find((cartItem) => cartItem.product.id === productId);

    if (item && item.quantity === 1) {
      console.log(item.quantity);
      showNotification({
        message: "There is only one item in our stock",
        color: "red",
        style: {
          marginTop: "70px",
        },
      });
    } else {
      handleQuantityChange(productId, item?.quantity! + 1);
    }
  };

  const confirmRemove = () => {
    setOpendialog(true);
  };
  const confirmCheckout = () => {
    setCheckout(true);
  };

  const handleSubmitCheckout = async () => {
    const cartItems = cart!.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    try {
      const response = await api.post<ApiResponse<stripeCheckoutResponse>>(
        `/api/checkout`,
        cartItems
      );
      if (response && response.data) {
        setSessionId(response.data.data.sessionId);
        setSessionUrl(response.data.data.sessionUrl);
        setProceedCheckout(true);
      } else {
        showNotification({
          message: "Invalid response format",
          color: "red",
          style: {
            marginTop: "10px",
          },
        });
      }
    } catch (error) {
      showNotification({
        message: "Error to proceed stripe checkout",
        color: "red",
        style: {
          marginTop: "10px",
        },
      });
    }

    setCheckout(false);
  };

  useEffect(() => {
    console.log("Cart page mounted");
  }, []);
  return (
    <Container>
      <h2 style={{ textAlign: "center" }}>
        My Cart <FontAwesomeIcon icon={faShoppingBag} />
        <Button
          color="dark"
          style={{ backgroundColor: "#524F81" }}
          mx={20}
          onClick={() => handleClearCart()}
        >
          Clear my cart
        </Button>
      </h2>
      {cart?.length === 0 ? (
        <Container style={{ textAlign: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Empty cart</Text>
          <Text> Add Products to your cart</Text>
        </Container>
      ) : (
        <>
          <Grid>
            <Grid.Col span={9}>
              <Grid gutter="lg" style={{ fontWeight: "bold" }}>
                <Col span={3}>
                  <Text> Products</Text>
                </Col>
                <Col span={3}>
                  <Text> Quantity</Text>
                </Col>
                <Col span={2}>
                  <Text> Price</Text>
                </Col>
                <Col span={2}>
                  <Text> Action</Text>
                </Col>
              </Grid>
              <Divider mb={20} />
              {cart &&
                cart.map((item, index) => (
                  <Container key={item.product.id}>
                    <Grid gutter="lg">
                      <Col span={3}>
                        <Group align="middle">
                          <Image
                            src={`data:image/jpeg;base64,${item.product.images[0].data}`}
                            alt="Product Image"
                            width={90}
                            height={80}
                          />
                          <Text> {item.product.name}</Text>
                        </Group>
                      </Col>
                      <Col span={3}>
                        <Group
                          align="middle"
                          style={{
                            display: "flex",
                            justifyContent: " space-between",
                          }}
                        >
                          <Button
                            variant="outline"
                            size="xs"
                            style={{ width: "35px" }}
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            size="xs"
                            value={item.quantity}
                            style={{ width: "35px" }}
                            onChange={(Event) =>
                              handleQuantityChange(
                                item.product.id,
                                parseInt(Event.target.value)
                              )
                            }
                            min={1}
                          />
                          <Button
                            variant="outline"
                            style={{ width: "38px" }}
                            size="xs"
                            onClick={() => handleCartIncrease(item.product.id)}
                          >
                            +
                          </Button>
                        </Group>
                      </Col>
                      {opendialog && (
                        <Modal
                          opened
                          onClose={closeDialog}
                          title="Delete Confirmation"
                        >
                          <Text>
                            Are you sure you want to remove item from Cart?
                            <br />
                            <hr />
                            <Grid>
                              <Grid.Col span={3}>
                                <Button
                                  onClick={closeDialog}
                                  style={{ margin: "10px" }}
                                >
                                  No
                                </Button>{" "}
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <Button
                                  onClick={() =>
                                    handleRemoveFromCart(item.product.id)
                                  }
                                  style={{
                                    backgroundColor: "red",
                                    marginTop: "10px",
                                  }}
                                >
                                  Yes
                                </Button>
                              </Grid.Col>
                            </Grid>
                          </Text>
                        </Modal>
                      )}
                      {checkout && (
                        <Modal
                          opened
                          onClose={closeCheckout}
                          title="Confirm Checkout"
                        >
                          <Text>
                            Are you sure you want to Checkout?
                            <br />
                            <hr />
                            <Grid>
                              <Grid.Col span={3}>
                                <Button
                                  onClick={closeCheckout}
                                  style={{ margin: "10px" }}
                                >
                                  No
                                </Button>
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <Button
                                  style={{
                                    backgroundColor: "red",
                                    marginTop: "10px",
                                  }}
                                  onClick={() => handleSubmitCheckout()}
                                >
                                  Yes
                                </Button>
                              </Grid.Col>
                            </Grid>
                          </Text>
                        </Modal>
                      )}

                      <Col span={3}>
                        <Text>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Text>
                      </Col>
                      <Col span={3}>
                        <CloseButton onClick={confirmRemove}></CloseButton>
                      </Col>
                    </Grid>
                    {index < cart.length - 1 && (
                      <Divider
                        size="xs"
                        style={{ marginTop: "16px", marginBottom: "16px" }}
                      />
                    )}
                  </Container>
                ))}
              <Container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              ></Container>
            </Grid.Col>
            <Grid.Col span={3}>
              <Container
                style={{
                  padding: "16px",
                  borderStyle: "groove",
                  borderWidth: "1px",
                }}
              >
                <h3> Order Summary</h3>
                <p>Shipping cost : $0</p>
                <p>Discount: $0</p>
                <Divider />

                <p>Estimated Cost :${calculateCartTotalPrice()}</p>
                <Divider />
                <Button
                  variant="outline"
                  style={{
                    marginTop: "10px",
                    borderRadius: "25px",
                    backgroundColor: "#524F81",
                    color: "white",
                    padding: "15px, 50px,15px, 50px",
                    width: "190px",
                  }}
                  onClick={confirmCheckout}
                >
                  Checkout
                </Button>
              </Container>
              {proceedCheckout && sessionId && sessionUrl && (
                <StripeCheckout sessionId={sessionId} sessionUrl={sessionUrl} />
              )}
            </Grid.Col>
          </Grid>
        </>
      )}
    </Container>
  );
};
