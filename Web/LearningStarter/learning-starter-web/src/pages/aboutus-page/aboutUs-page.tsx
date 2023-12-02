import {
  Container,
  Text,
  createStyles,
  Image,
  Title,
  Group,
  Space,
} from "@mantine/core";
import TitleImage from "../../assets/aboutuspic.jpg";
import SectionImage from "../../assets/aboutuspic3.jpg";
import Aakash from "../../assets/Aakash.jpg";
import Anjali from "../../assets/Anjali.jpg";
import Niraj from "../../assets/Niraj.jpg";
import Subin from "../../assets/Subin.jpg";
import Sujana from "../../assets/Sujana.jpg";

export const AboutUsPage = () => {
  const { classes } = useStyles();

  const TeamMember = ({ name, imageUrl }) => (
    <Container className={classes.teamMember}>
      <Image src={imageUrl} alt={name} radius={80} height={220} width={200} />
      <Text size="xl" weight={500} style={{ marginBottom: "8px" }}>
        {name}
      </Text>
    </Container>
  );

  return (
    <>
      <Image
        src={TitleImage}
        alt="Online Shopping"
        height={300}
        width="100%"
        fit="cover"
      />
      <Title order={1} align="center" mt={30}>
        About Us
      </Title>

      <Container fluid className={classes.root}>
        <Container fluid className={classes.content}>
          <Container
            style={{ display: "flex", alignItems: "center", marginTop: "5rem" }}
          >
            <div style={{ flex: 1 }}>
              <Image src={SectionImage} alt="About Us Inage" />
            </div>
            <div style={{ flex: 1, marginLeft: "40px", textAlign: "left" }}>
              <Text>
                Selu thrift store is created exclusively for Southeastern
                Students. You can buy and sell products to other fellow
                students, fostering a sustainable and cost-effective marketplace
                within our university community.
                <Space h="lg" />
                Our platform aims to promote eco-conscious consumerism by
                encouraging the reuse and recycling of items. We believe in the
                power of a circular economy, where pre-loved goods find new
                homes rather than contributing to waste.
                <Space h="lg" />
                Join us in our mission to reduce environmental impact while
                providing affordable options for students. Whether you're
                decluttering your space or looking for unique finds, our
                platform connects you to a community that values sustainability
                and affordability.
              </Text>
            </div>
          </Container>
          <Container className={classes.team}>
            <Text
              align="center"
              style={{ marginTop: "40px", fontSize: "40px" }}
            >
              The OMC Team
            </Text>
            <Group style={{ marginTop: "20px", justifyContent: "center" }}>
              <TeamMember name="Suzana Mehta" imageUrl={Sujana} />
              <TeamMember name="Subin Bista" imageUrl={Subin} />
              <TeamMember name="Anjali Thapa" imageUrl={Anjali} />
              <TeamMember name="Niraj Bhatta" imageUrl={Niraj} />
              <TeamMember name="Aakash Poudel" imageUrl={Aakash} />
            </Group>
          </Container>
        </Container>
      </Container>
    </>
  );
};

const useStyles = createStyles((theme) => {
  return {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      color: "black",

      fontFamily: "Arial, sans-serif",
      marginBottom: "50px",
    },
    Main: {
      marginTop: "40px",
      display: "flex",
      flexDirection: "row",
      gap: "100px",
    },

    content: {
      textAlign: "center",
    },
    headimage: {
      marginTop: "10px",
      maxWidth: "100%",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      padding: "50px",
      height: "150px",
      objectFit: "cover",
    },

    main: {
      display: "flex",
      flexDirection: "row",
      gap: "2rem",
      marginTop: "11em",
      maxWidth: "100%",
    },

    rightcol: {
      maxWidth: "100%",
    },
    leftcol: {
      width: "100%",
      height: "100%",
    },
    team: {
      marginTop: "20px",
      textAlign: "center",
      position: "relative",
    },
    teamMember: {
      // display: "inline-block",
      // textAlign: "center",
      // margin: "20px",
      // overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    textOverlay: {
      opacity: "0",
    },
  };
});
