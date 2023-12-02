import logo from "../../assets/logo.png";
import {
  IconBrandFacebook,
  IconBrandGmail,
  IconBrandInstagram,
  IconBrandYoutube,
  IconPhone,
} from "@tabler/icons-react";
import { ActionIcon, Group, Text } from "@mantine/core";

export const Footer = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#a89984",
        padding: "10px",
        paddingBottom: "20px",
        zIndex: 1,
      }}
    >
      <div>
        <img src={logo} alt="Logo" height={90} />
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginBottom: "10px",
          }}
        >
          <ActionIcon size="lg" color="blue" variant="subtle" radius="xl">
            <IconBrandFacebook />
          </ActionIcon>
          <ActionIcon size="lg" color="red" variant="subtle" radius="xl">
            <IconBrandYoutube />
          </ActionIcon>
          <ActionIcon size="lg" color="pink" variant="subtle" radius="xl">
            <IconBrandInstagram />
          </ActionIcon>
        </div>
        <Text align="center" style={{ color: "#458588" }}>
          © 2023 Selu Thrift Store. All rights reserved.
        </Text>
      </div>

      <Group>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
            color: "#458588",
            justifyContent: "left",
          }}
        >
          <span>
            <IconBrandGmail /> seluthrift@gmail.edu
          </span>
          <span>
            <IconPhone /> 985-687-6543
          </span>
        </div>
      </Group>
    </div>
  );
};
