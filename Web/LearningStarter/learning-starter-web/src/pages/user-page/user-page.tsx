import {
  Card,
  Text,
  Image,
  Badge,
  Button,
  Group as MantineGroup,
  Container,
  Flex,
  createStyles,
  Avatar,
} from "@mantine/core";
import { useUser } from "../../authentication/use-auth";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { Carousel } from "@mantine/carousel";
import { ApiResponse, GetProduct, OrderDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case 'Excellent':
      return 'green';
    case 'Good':
      return 'blue';
    case 'Fair':
      return 'red';
    default:
      return 'gray';
  }
};

export const UserPage = () => {
  const { classes } = useStyles();
  const [products, setProducts] = useState<GetProduct[]>([]);
  const user = useUser();
  const navigate=useNavigate();
  
  useEffect(() => {
    async function fetchProductData() {
      const response = await api.get<ApiResponse<GetProduct[]>>(`/api/products`);
  
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching products" });
      }
      if (response.data.data) {
        const productsWithOwnership = response.data.data.filter((product) => product.userId===user.id);
        setProducts(productsWithOwnership);
      }
    }
    fetchProductData();
  }, [user.id]);
  return (
    <Container className={classes.userPageContainer}>
      <Flex direction="column" gap="30px">
        <Container className={classes.unsetLeftMargin}>
          <Container onClick={() => UserPage()} style={{ marginTop: "20%" }}>
            <MantineGroup position="left" spacing="lg">
              <Avatar 
              onClick={(e)=>e.stopPropagation()}
                size={200}
                radius="md"
                style={{ textTransform: "uppercase" }}
              >
                 {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
              </Avatar>
              <Container>
                <Text fz="lg" tt="uppercase" fw={700} c="dimmed" onClick={(e)=>e.stopPropagation()}>
                  
                  USER
                </Text>

                <Text fz="xl" fw={500} onClick={(e)=>e.stopPropagation()}>
                  {user?.firstName}
                </Text>

                <MantineGroup align="start" spacing="xs" onClick={(e)=>e.stopPropagation()}>
                  <Text fz="xl" c="dimmed" onClick={(e)=>e.stopPropagation()}>
                    {user?.email}
                  </Text>
                </MantineGroup>

                <MantineGroup align="start" spacing="xs" onClick={(e)=>e.stopPropagation()}>
                  <Text fz="xl" c="dimmed" onClick={(e)=>e.stopPropagation()}>
                    {user?.userName}
                  </Text>
                </MantineGroup>
                <Container onClick={(e)=>e.stopPropagation()}>
                <Button 
                //variant="light"
                color="white"
                radius="md"
                style={{ marginRight: "5px",  backgroundColor:"#524F81", marginTop:"10px" }}
                onClick={() => navigate(`/product`) }
              >
               Add Product 
              </Button>
              <Button
                //variant="light"
                color="white"
                radius="md"
                style={{ marginRight: "5px",  backgroundColor:"#524F81", marginTop:"10px" }}
                onClick={() => navigate(`/viewMyOrder`)}
              >
               View My Orders
              </Button>
              </Container>
              </Container>
            </MantineGroup>
          </Container>
        </Container>
        <Text size="lg" weight={300} align="center">My Products</Text>
        <Flex style={{ flexWrap: "wrap", justifyContent: "space-between" }}>
          {products && products.map((product) => (
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
                          style={{
                            objectFit: "cover",
                            objectPosition: "bottom",
                          }}
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
              <MantineGroup>
                <Text>{product.name}</Text>
                <Badge  variant="light"style={{marginTop:"10px", color: getStatusColor(product.status) }} >
                  {product.status}
                </Badge>
              </MantineGroup>
              <Text size="sm">Price: ${product.price}</Text>
              <Container className={classes.buttonContainer}>
                <Button variant="light" color="blue" radius="md"   onClick={() => navigate(`/productDetail/${product.id}`)}>
                  Product Details
                </Button>
              </Container>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    Main: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    unsetLeftMargin: {
      marginLeft: "unset",
    },
    textAlignLeft: {
      textAlign: "left",
    },

    labelText: {
      marginRight: "10px",
    },

    userPageContainer: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },

    buttonContainer: {
      display: "flex",
      justifyContent: "space-evenly",
    },
  };
});
function setData(arg0: OrderDto[]) {
  throw new Error("Function not implemented.");
}
