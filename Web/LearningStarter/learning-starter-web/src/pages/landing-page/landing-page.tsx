import { useState, useEffect, useRef } from "react";
import {
  Container,
  createStyles,
  Text,
  Image,
  Grid,
  Button,
  Card,
  Badge,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import homepageImage1 from "../../assets/photo12.png";
import homepageImage2 from "../../assets/photo13.png";
import homepageImage3 from "../../assets/photo7.png";
import homepageImage4 from "../../assets/photo6.png";
import categoryImage1 from "../../assets/photo5.jpg";
import clothing from "../../assets/cloth1.png";
import electronics from "../../assets/electronics.png";
import furniture from "../../assets/furniture.png";
import accessories from "../../assets/accessories.png";
import homeSectionImage from "../../assets/homePage.jpg";
import { Link } from "react-router-dom";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const images = [
    homepageImage2,
    homepageImage3,
    homepageImage4,
    homepageImage1,
  ];
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  const [, setActiveIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image
        onClick={(e) => e.stopPropagation()}
        w="auto"
        fit="contain"
        src={url}
        style={{ height: "650px" }}
      />
    </Carousel.Slide>
  ));

  return (
    <>
      <div
        style={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      >
        <Carousel
          withIndicators
          loop
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          style={{ zIndex: 1 }}
        >
          {slides}
        </Carousel>
        {showOverlay && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 2,
              padding: "0 20px",
              textAlign: "center",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                alignItems: "center",
                color: "#ffffff",
                fontSize: "3rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                letterSpacing: "2px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              SELU THRIFT STORE
            </Text>
            <Text
              align="center"
              size="md"
              style={{
                marginBottom: "20px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              Selu thrift store is created exclusively for Southeastern
              Students. You can buy and sell products to other fellow students,
              fostering a sustainable and cost-effective marketplace within our
              university community.
            </Text>
            <Link to="/aboutus">
              <Button variant="outline" color="cyan">
                Read More
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "5rem",
          marginBottom: "5rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <Image src={homeSectionImage} alt="Home Section Image" />
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: "20px",
            marginBottom: "20px",
            fontStyle: "italic",
          }}
        >
          <Text>
            <span
              style={{
                fontSize: "3em",
                fontWeight: "bold",
                float: "left",
                lineHeight: "1",
                marginRight: "0.1em",
              }}
            >
              W
            </span>
            elcome to Thrift Soft Store, where simplicity meets sustainability.
            Our platform is designed for users to easily sign up, empowering
            them to buy and sell pre-owned items effortlessly. Whether you're
            looking to declutter your space or find unique treasures, our
            user-friendly interface connects buyers and sellers, fostering a
            community-driven marketplace for pre-loved goods. Join us in
            reducing waste and giving belongings a second life.
          </Text>
        </div>
      </Container>
      <div
        style={{
          backgroundColor: "rgba(168, 153, 132, 0.4)",
        }}
      >
        <Text
          size={40}
          fw={700}
          style={{ textAlign: "center", marginTop: "10px" }}
          variant="gradient"
          gradient={{ from: "purple", to: "cyan", deg: 45 }}
        >
          Picks For You
        </Text>
        <Grid
          gutter="md"
          align="center"
          justify="center"
          style={{
            marginTop: "15px",
            display: "flex",
            flexWrap: "wrap",
            marginBottom: "5rem",
          }}
        >
          {/* Links to different categories */}
          <Grid.Col span={2}>
            <Link to="/shop" className={classes.circle}>
              <Image
                src={categoryImage1}
                alt="New Products"
                height={150}
                width={150}
                radius={30}
              />
              <h3>New Products</h3>
            </Link>
          </Grid.Col>
          <Grid.Col span={2}>
            <Link to="/shop" className={classes.circle}>
              <Image
                src={furniture}
                alt="Furniture"
                height={150}
                width={150}
                radius={30}
              />
              <h3>Furniture</h3>
            </Link>
          </Grid.Col>
          <Grid.Col span={2}>
            <Link to="/shop" className={classes.circle}>
              <Image
                src={clothing}
                alt="Clothing"
                height={150}
                width={150}
                radius={30}
              />
              <h3>Clothing</h3>
            </Link>
          </Grid.Col>
          <Grid.Col span={2}>
            <Link to="/shop" className={classes.circle}>
              <Image
                src={accessories}
                alt="Accessories"
                height={150}
                width={150}
                radius={30}
              />
              <h3>Accessories</h3>
            </Link>
          </Grid.Col>
          <Grid.Col span={2}>
            <Link to="/shop" className={classes.circle}>
              <Image
                src={electronics}
                alt="Electronics"
                height={150}
                width={150}
                radius={30}
              />
              <h3>Electronics</h3>
            </Link>
          </Grid.Col>
        </Grid>
      </div>
      <Container>
        <Text
          size={40}
          fw={600}
          style={{ textAlign: "center", marginTop: "10px",marginBottom:"10px" }}
          variant="gradient"
          gradient={{ from: "purple", to: "cyan", deg: 45 }}
        >
          A Sustainable Approach!
        </Text>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5rem",
          }}
        >
          <Card
            shadow="sm"
            style={{ width: "30%", textAlign: "center", padding: "20px" }}
            className={classes.circle}
          >
            <Badge
              color="cyan"
              radius={20}
              size="xl"
              style={{
                fontSize: "2rem",
                padding: "1.5rem 1rem",
                marginBottom: "1rem",
              }}
            >
              1
            </Badge>
            <Text
              size="lg"
              style={{ fontWeight: "bold", marginBottom: "15px" }}
            >
              Buy
            </Text>
            <Text>
              Explore a wide range of pre-owned items and find what you need
              with ease. Shop securely and conveniently.
            </Text>
          </Card>

          <Card
            shadow="sm"
            style={{ width: "30%", textAlign: "center", padding: "20px" }}
            className={classes.circle}
          >
            <Badge
              color="cyan"
              radius={20}
              size="xl"
              style={{
                fontSize: "2rem",
                padding: "1.5rem 1rem",
                marginBottom: "1rem",
              }}
            >
              2
            </Badge>
            <Text
              size="lg"
              style={{ fontWeight: "bold", marginBottom: "15px" }}
            >
              Sell
            </Text>
            <Text>
              List your pre-loved items effortlessly. Reach interested buyers
              and sell your items hassle-free.
            </Text>
          </Card>

          <Card
            shadow="sm"
            style={{ width: "30%", textAlign: "center", padding: "20px" }}
            className={classes.circle}
          >
            <Badge
              color="cyan"
              radius={20}
              size="xl"
              style={{
                fontSize: "2rem",
                padding: "1.5rem 1rem",
                marginBottom: "1rem",
              }}
            >
              3
            </Badge>
            <Text
              size="lg"
              style={{ fontWeight: "bold", marginBottom: "15px" }}
            >
              Reuse
            </Text>
            <Text>
              Discover unique ways to give items a second life. Find inspiration
              and contribute to sustainable living.
            </Text>
          </Card>
        </div>
      </Container>
      ;
    </>
  );
};

const useStyles = createStyles(() => {
  return {
    homePage: {
      maxWidth: "100%",
      maxHeight: 15000,
    },
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
      maxHeight: "100%",
      maxWidth: "100%",
      width: "100%",
    },
    imageContainer: {
      backgroundColor: "black",
      marginBottom: "100",
      transition: "transform 0.2s",
    },
    titleStyle: {
      color: "black",
      fontWeight: "bold",
      fontSize: "50px",
      fontFamily: "serif",
      marginTop: "20px",
      textAlign: "center",
    },
    circle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textDecoration: "none",
      color: "#524F81",
      fontSize: "16px",
      margin: "20px",

      "&:hover": {
        cursor: "pointer",
        //boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        transform: "scale(1.25)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      },
      featuredProduct: {
        textAlign: "center",
        width: "110%",
      },

      productGrid: {
        display: "grid",

        gridTemplateColumns: "repeat(4, 1fr)",
      },
      product: {
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        margin: "5px",
        "&:hover": {
          transform: "scale(1.08)",
        },
      },

      productImage: {
        width: "100%",
        height: "100%",
      },
      productInfo: {
        textAlign: "left",
      },

      productName: {
        fontSize: "18px",
        margin: "0",
      },
      category: {
        fontStyle: "italic",
        margin: "0",
      },
      price: {
        color: "green",
        fontWeight: "bold",
        fontSize: "18px",
      },
      details: {
        margin: "0",
      },
      bodyContainer: {
        display: "flex",
        justifyContent: "space-evenly",
        margin: "8px",
      },
    },
  };
});
