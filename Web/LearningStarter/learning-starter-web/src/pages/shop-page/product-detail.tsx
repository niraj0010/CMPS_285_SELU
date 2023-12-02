import { useEffect, useState } from "react";
import {
  Text,
  Image,
  Badge,
  Button,
  Group,
  Container,
  createStyles,
  Grid,
  Textarea,
  Rating,
  Avatar,
  Divider,
  Paper,
} from "@mantine/core";
import { GetProduct } from "../../constants/types";
import { Carousel } from "@mantine/carousel";
import { useUser } from "../../authentication/use-auth";
import { showNotification } from "@mantine/notifications";
import { ApiResponse, ReviewDto } from "../../constants/types";
import { useCart } from "../../context/cart-context";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import { routes } from "../../routes";

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

type DeleteRequest = {
  status:boolean
};

export const ProductDetailPage = () => {
  const { classes } = useStyles();
  const user = useUser();
  const cartContext = useCart();
  const navigate = useNavigate();
  const { addToCart } = cartContext || {};
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
  const [singleProduct, setSingleProduct] = useState<GetProduct>();
  const { productId } = useParams();
  const [reviewText, setReviewText] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ ratings: 0, comments: "" });

  const handleAddToCart = (product: GetProduct) => {
    if (addToCart) {
      addToCart(product);
      showNotification({
        message: "Product added to cart!",
        color: "green",
      });
    } else {
      console.error("Add to cart function is not available");
    }
  };
  const handleEdit = (editProductId) => {
    navigate(routes.productEdit.replace(":productId", editProductId));
  };

  const handleDelete = async () => {
    try {
    const response=  await api.delete<ApiResponse<DeleteRequest>>(`/api/products/${productId}`);
    if(response.data.data){
      showNotification({
        message: "Product deleted successfully",
        color: "green",
        style:{marginTop:'70px'}
      });
      navigate(routes.shop);
    }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    async function fetchProductData() {
      const response = await api.get<ApiResponse<GetProduct>>(
        `/api/products/${productId}`
      );
      setSingleProduct(response.data.data);

      const productOwnerId = response.data.data.userId;
      setIsCurrentUserOwner(productOwnerId === user.id);

      const reviewResponse = await api.get<ApiResponse<ReviewDto[]>>(
        `/api/Reviews?productId=${productId}`
      );

      const matchingResposne = reviewResponse.data.data.filter(
        (review) => `${review.productId}` === `${productId}`
      );

      setReviewText(matchingResposne);
    }
    fetchProductData();
  }, [productId, user.id]);

  const handleReviewSubmit = async () => {
    try {
      const existingReview = reviewText.find(
        (review) =>
          review.userId === user.id &&
          review.productId === (singleProduct?.id || 0)
      );
      if (existingReview) {
        showNotification({
          message: "You have already reviewed this product",
          color: "red",
        });
      } else {
        const newReviewData = {
          userId: user.id,
          productId: singleProduct?.id,
          ratings: newReview.ratings,
          comments: newReview.comments,
        };

        const response = await api.post<ApiResponse<ReviewDto>>(
          `/api/Reviews`,
          newReviewData
        );

        if (response.status === 201) {
          setReviewText((preReviews) => [...preReviews, newReview]);
          setNewReview({ ratings: 0, comments: "" });
          showNotification({
            message: "Review posted successfully",
            color: "green",
          });
        } else {
          showNotification({
            message: "failed to post review",
            color: "red",
          });
        }
      }
    } catch (error) {
      console.log("error posting review", error);
    }
  };

  if (singleProduct && singleProduct.images) {
    return (
      <Container className={classes.productDetailContainer}>
        <Grid grow>
          <Grid.Col span={8} mt={40}>
            {/* Product image */}
            {singleProduct.images.length > 1 ? (
              <Carousel
                withIndicators
                height={500}
                style={{ maxWidth: "400px" }}
              >
                {singleProduct.images.map((image) => (
                  <Carousel.Slide key={image.id}>
                    <Image
                      onClick={(e) => e.stopPropagation()}
                      src={`data:image/jpeg;base64,${image.data}`}
                      alt="Product Image"
                      width={400}
                      height={500}
                      fit="contain"
                      style={{ borderRadius: "10px" }}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            ) : (
              <Image
                onClick={(e) => e.stopPropagation()}
                src={`data:image/jpeg;base64,${singleProduct.images[0].data}`}
                alt="Product Image"
                height={400}
                width={500}
                fit="contain"
                style={{ borderRadius: "10px" }}
              />
            )}
          </Grid.Col>
          {/* Other product details */}
          <Grid.Col span={3} className={classes.details} mt={40}>
            <Container>
              <Text size="xl">{singleProduct.name}</Text>
              <Text size="sm" c="dimmed" fs="italic">
                Seller: {singleProduct.userName}
              </Text>
              Product Condition:
              <Badge
                variant="light"
                style={{ color: getStatusColor(singleProduct.status) }}
              >
                {singleProduct.status}
              </Badge>
              Product Details:
              <Text size="md" c="dimmed">
                {singleProduct.description}
              </Text>
              <Text size="md">Price: ${singleProduct.price}</Text>
            </Container>
            {/* Button to add to cart */}
            <Container className={classes.buttonContainer}>
              {!isCurrentUserOwner && (
                <Button
                  // variant="light"
                  color="white"
                  radius="md"
                  onClick={() => handleAddToCart(singleProduct)}
                  style={{ backgroundColor: "#458588" }}
                >
                  Add to cart
                </Button>
              )}
              {isCurrentUserOwner && (
                <>
                  <Button
                    variant="outline"
                    color="red"
                    radius="md"
                    onClick={handleDelete}
                  >
                    Delete Product
                  </Button>
                  <Button
                    style={{ backgroundColor: "#524F81" }}
                    onClick={() => handleEdit(singleProduct.id)}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Container>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text size="lg" style={{ marginTop: "30px" }}>
              Rate Your Experience
            </Text>
            <Rating
              value={newReview.ratings}
              onChange={(value) =>
                setNewReview({ ...newReview, ratings: value })
              }
            />
            <Textarea
              value={newReview.comments}
              onChange={(e) =>
                setNewReview({ ...newReview, comments: e.target.value })
              }
              placeholder="enter review for the product"
            />
            <Button
              //variant="light"
              color="white"
              radius="md"
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                backgroundColor: "#458588",
              }}
              onClick={handleReviewSubmit}
            >
              Submit review
            </Button>
            <Container mb={40}>
              <Text size="lg"> Customer Review:</Text>
              {Array.isArray(reviewText) && reviewText.length > 0 ? (
                reviewText.map((review, index) => (
                  <Paper key={index}>
                    <Group>
                      <Avatar
                        color="blue"
                        style={{ textTransform: "uppercase" }}
                      >
                        {review.userName
                          ? review.userName.substring(0, 1)
                          : "U"}
                      </Avatar>
                      <Text>{review.userName}</Text>
                    </Group>
                    <Divider />
                    <Rating value={review.ratings} />
                    <Text size="sm">{review.comments}</Text>
                  </Paper>
                ))
              ) : (
                <Text size="sm"> No reviews available for this Product</Text>
              )}
            </Container>
          </Grid.Col>
        </Grid>
      </Container>
    );
  } else {
    return <p>No product found or missing necessary data.</p>;
  }
};

const useStyles = createStyles(() => {
  return {
    productDetailContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-evenly",
      marginTop: "20px",
    },
    details: {
      justifyContent: "left",
      margin: "10px",
    },
  };
});
