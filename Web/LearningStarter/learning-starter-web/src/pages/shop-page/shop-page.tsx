import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Image,
  Badge,
  Button,
  Group,
  Container,
  Flex,
  createStyles,
  Pagination,
} from "@mantine/core";
import { GetProduct } from "../../constants/types";
import { Carousel } from "@mantine/carousel";
import { useUser } from "../../authentication/use-auth";
import { showNotification } from "@mantine/notifications";
import { ApiResponse } from "../../constants/types";
import { useCart } from "../../context/cart-context";

import api from "../../config/axios";
import { useSearch } from "../../context/search-context";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "Excellent":
      return "green";
    case "Good":
      return "blue";
    case "Fair":
      return "red";
    default:
      return "gray";
  }
};
export const ShopPage = () => {
  const { classes } = useStyles();
  const [products, setProducts] = useState<GetProduct[]>([]);
  const user = useUser();
  const [activePage, setPage] = useState(1);
  const navigate = useNavigate();

  const itemPerPage = 6;
  const handlePageChanges = (page) => {
    setPage(page);
  };

  const cartContext = useCart();
  const { addToCart } = cartContext || {};
  const { searchQuery } = useSearch();

  const handleAddToCart = (product: GetProduct) => {
    const currentuser = user.id;
    if (currentuser === product.userId) {
      showNotification({
        message: "You cannot buy your own item",
        color: "red",
        style: {
          marginTop: "70px",
        },
      });
      return;
    }

    if (addToCart) {
      addToCart(product);
      showNotification({
        message: "Product added to cart!",
        color: "green",
        style: {
          marginTop: "70px",
        },
      });
    } else {
      console.error("Add to cart function is not available");
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const response = await api.get<ApiResponse<GetProduct[]>>(
        `/api/products?page=${activePage}`
      );

      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching products" });
      }
      if (response.data.data) {
        const filteredProducts = response.data.data.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const productsWithOwnership = filteredProducts.map((product) => ({
          ...product,
          isCurrentUserOwner: product.userId === user.id,
        }));
        setProducts(productsWithOwnership);
      }
    };

    fetchProductData();
  }, [activePage, searchQuery, user]);

  const totalPages = Math.ceil(products.length / itemPerPage);
  const indexOfLastItem = activePage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Flex
        style={{
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginTop: "5rem",
        }}
      >
        {currentProducts.map((product) => (
          <Card
            key={product.id}
            shadow="sm"
            radius="md"
            withBorder
            style={{ width: "30%", height: "auto", margin: "10px" }}
          >
            <Card.Section>
              {product.images.length > 1 ? (
                <Carousel withIndicators height={270}>
                  {product.images.map((image) => (
                    <Carousel.Slide key={image.id}>
                      <Image
                        src={`data:image/jpeg;base64,${image.data}`}
                        alt="Product Image"
                        width="100%"
                        height={300}
                        style={{ objectFit: "cover", objectPosition: "bottom" }}
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Carousel withIndicators height={270}>
                  <Image
                    src={`data:image/jpeg;base64,${product.images[0].data}`}
                    alt="Product Image"
                    width="100%"
                    height={300}
                    style={{ objectFit: "cover", objectPosition: "bottom" }}
                  />
                </Carousel>
              )}
            </Card.Section>
            <Group>
              <Text style={{ marginTop: "10px" }}>{product.name}</Text>
              <Badge
                variant="light"
                style={{
                  marginTop: "10px",
                  color: getStatusColor(product.status),
                }}
              >
                {product.status}
              </Badge>
            </Group>
            <Text size="sm">Price: ${product.price}</Text>
            <Container className={classes.buttonContainer}>
              <Button
                color="white"
                radius="md"
                style={{
                  marginRight: "5px",
                  backgroundColor: "#524F81",
                  marginTop: "10px",
                }}
                onClick={() => navigate(`/productDetail/${product.id}`)}
              >
                Product Details
              </Button>
              {!product.isCurrentUserOwner && (
                <Button
                  color="white"
                  radius="md"
                  onClick={() => handleAddToCart(product)}
                  style={{
                    marginLeft: "4px",
                    backgroundColor: "#524F81",
                    marginTop: "10px",
                  }}
                >
                  Add to cart
                </Button>
              )}
            </Container>
          </Card>
        ))}
      </Flex>
      {
        <Pagination
          page={activePage}
          onChange={handlePageChanges}
          total={totalPages}
          style={{ marginBottom: "3rem", marginTop: "3rem" }}
        />
      }
    </Container>
  );
};
const useStyles = createStyles(() => {
  return {
    buttonContainer: {
      display: "flex",
      justifyContent: "space-evenly",
    },
  };
});
