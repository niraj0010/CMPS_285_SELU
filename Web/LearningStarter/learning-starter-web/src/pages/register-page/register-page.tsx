import { useState } from "react";
import { Link } from "react-router-dom";
import { FormErrors, useForm } from "@mantine/form";
import { useAsyncFn } from "react-use";
import { routes } from "../../routes";
import {
  Button,
  Container,
  Image,
  Input,
  Text,
  createStyles,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { ApiResponse } from "../../constants/types";
import Logo from "../../assets/logo.png";
import api from "../../config/axios";

type RegisterRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
};

type RegisterResponse = ApiResponse<boolean>;
type LoginResponse = ApiResponse<boolean>;

export const RegisterPage = () => {
  const { classes } = useStyles();
  const form = useForm<RegisterRequest>({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
    validate: {
      firstName: (value) =>
        value.trim() === "" ? "First Name must not be empty" : null,
      lastName: (value) =>
        value.trim() === "" ? "Last Name must not be empty" : null,
      userName: (value) =>
        value.trim() === "" ? "Username must not be empty" : null,
      email: (value) =>
        value.trim() === "" ? "Email must not be empty" : null,
      password: (value) =>
        value.trim() === "" ? "Password must not be empty" : null,
    },
  });

  const [, submitRegistration] = useAsyncFn(async (values: RegisterRequest) => {
    const response = await api.post<RegisterResponse>("/api/users", values);
    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      form.setErrors(formErrors);
    }
    if (response.data.data) {
      showNotification({
        message: "Registered Successfully!",
        color: "green",
        style: { marginTop: "70px" },
      });
      const loginResponse = await api.post<LoginResponse>("/api/authenticate", {
        userName: values.userName,
        password: values.password,
      });
      if (loginResponse.data.hasErrors) {
        showNotification({
          message: "Error logging in after registration",
          color: "red",
          style: { marginTop: "70px" },
        });
      } else {
        window.location.href = routes.login;
      }
    }
  }, []);
  const [registerMouseDown, setRegisterMouseDown] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);

  return (
    <Container className={classes.signupBox}>
      <Container className={classes.appLogo}>
        <Image src={Logo} alt="Logo" />
      </Container>

      <Container style={{ marginTop: "3rem" }}>
        <form onSubmit={form.onSubmit(submitRegistration)}>
          <Container className={classes.formField}>
            <label htmlFor="firstName" />
            <Input
              {...form.getInputProps("firstName")}
              placeholder="First Name"
              styles={{
                input: {
                  margin: ".5rem",
                  width: "90%",
                  height: "40px",
                  fontSize: "15px",
                },
              }}
            />

            <label htmlFor="lastName" />
            <Input
              {...form.getInputProps("lastName")}
              placeholder="Last Name"
              styles={{
                input: {
                  margin: ".5rem",
                  width: "90%",
                  height: "40px",
                  fontSize: "15px",
                },
              }}
            />
          </Container>
          <Text c="red">{form.errors.firstName}</Text>
          <Text c="red">{form.errors.lastName}</Text>
          <Container className={classes.formField}>
            <label htmlFor="userName" />
            <Input
              {...form.getInputProps("userName")}
              placeholder="UserName"
              styles={{
                input: {
                  width: "400px",
                  height: "40px",
                  fontSize: "15px",
                },
              }}
            />
          </Container>
          <Text c="red">{form.errors.userName}</Text>
          <Container className={classes.formField}>
            <label htmlFor="email" />
            <Input
              {...form.getInputProps("email")}
              type="email"
              placeholder="Email"
              styles={{
                input: { width: "400px", height: "40px", fontSize: "15px" },
              }}
            />
          </Container>
          <Text c="red">{form.errors.email}</Text>
          <Container className={classes.formField}>
            <label htmlFor="password" />
            <Input
              {...form.getInputProps("password")}
              type="password"
              placeholder="Password"
              styles={{
                input: { width: "400px", height: "40px", fontSize: "15px" },
              }}
            />
          </Container>
          <Text c="red">{form.errors.password}</Text>
          <Button
            type="submit"
            onMouseEnter={() => setRegisterHover(true)}
            onMouseLeave={() => setRegisterHover(false)}
            onMouseDown={() => setRegisterMouseDown(true)}
            onMouseUp={() => setRegisterMouseDown(false)}
            style={{
              backgroundColor: registerHover
                ? "#ffff"
                : registerMouseDown
                ? "#458588"
                : "#458588",
              margin: "14px",
              color: "black",
            }}
          >
            Sign Up
          </Button>
        </form>

        <Container m={2}>
          <Text>
            Already have an account? <Link to={routes.login}>Login</Link>
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

const useStyles = createStyles((theme) => {
  return {
    signupBox: {
      marginTop: "5rem",
      maxWidth: "600px",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      background: "#a89984",
    },
    appLogo: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "250px",
      height: "150px",
      objectFit: "cover",
    },
    formField: {
      marginBottom: "5px",
      width: "100%",
      height: "50px",
      alignContent: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
});
