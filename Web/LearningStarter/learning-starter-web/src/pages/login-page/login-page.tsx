import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { routes } from "../../routes";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Container,
  createStyles,
  Image,
  Input,
  Text,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import Logo from "../../assets/logo.png";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

type LoginRequest = {
  userName: string;
  password: string;
};

type LoginResponse = ApiResponse<boolean>;

export const LoginPage = ({
  fetchCurrentUser,
}: {
  fetchCurrentUser: () => void;
}) => {
  const { classes } = useStyles();

  const form = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) =>
        value.length <= 0 ? "Username must not be empty" : null,
      password: (value) =>
        value.length <= 0 ? "Password must not be empty" : null,
    },
  });

  const [, submitLogin] = useAsyncFn(async (values: LoginRequest) => {
    if (baseUrl === undefined) {
      return;
    }

    const response = await api.post<LoginResponse>(`/api/authenticate`, values);
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
        message: "Successfully Logged In!",
        color: "green",
        style: { marginTop: "70px" },
      });
      fetchCurrentUser();
    }
  }, []);

  const [loginMouseDown, setLoginMouseDown] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const [registerMouseDown, setRegisterMouseDown] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible);
  };

  return (
    <Container className={classes.loginBox}>
      <Container className={classes.appLogo}>
        <Image src={Logo} alt="Logo" />
      </Container>

      <Container className={classes.loginHeader}> Login</Container>

      {form.errors[""] && (
        <Alert className={classes.generalErrors} color="red">
          <Text>{form.errors[""]}</Text>
        </Alert>
      )}

      <form onSubmit={form.onSubmit(submitLogin)}>
        <Container className={classes.formField}>
          <label htmlFor="userName" />
          <Input
            {...form.getInputProps("userName")}
            placeholder="Username"
            styles={{
              input: { width: "100%", height: "40px" },
            }}
          />
          <Text color="red">{form.errors["userName"]}</Text>
        </Container>

        <Container className={classes.formField}>
          <label htmlFor="password" />
          <Input
            type={passwordVisible ? "text" : "password"}
            {...form.getInputProps("password")}
            placeholder="Password"
            styles={{
              input: { width: "100%", height: "40px" },
            }}
          />
        </Container>
        <Text color="red">{form.errors["password"]}</Text>

        <Container className={classes.checkboxContainer}>
          <input type="checkbox" onChange={togglePasswordVisibility} />

          <Text style={{ marginLeft: "0.5rem" }}> Show Password</Text>
        </Container>

        <Container className={classes.buttonContainer}>
          <Button
            type="submit"
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
            onMouseDown={() => setLoginMouseDown(true)}
            onMouseUp={() => setLoginMouseDown(false)}
            style={{
              backgroundColor: loginHover
                ? "#ffff"
                : loginMouseDown
                ? "#458588"
                : "#458588",
              color: "black",
            }}
          >
            Login
          </Button>

          <Button
            component={NavLink}
            to={routes.register}
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
              color: "black",
            }}
          >
            Sign Up
          </Button>
        </Container>
      </form>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    loginBox: {
      marginTop: "5rem",
      maxWidth: "400px",
      paddingBottom: "20px",
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
      height: "180px",
      objectFit: "cover",
      marginBottom: "20px",
    },
    loginHeader: {
      fontSize: "24px",
      marginBottom: "20px",
      fontFamily: "sans-serif",
    },
    generalErrors: {
      marginBottom: "8px",
    },
    formField: {
      padding: "10px",
      width: "70%",
    },

    buttonContainer: {
      display: "flex",
      justifyContent: "space-around", // spaces two elements from each other, in our case our buttons
      alignItems: "center",
      marginTop: "20px",
      marginBottom: "20px",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "Center", // Center vertically
      marginTop: "5px", // Space from the top element
      cursor: "pointer",
      marginLeft: "5rem",
    },
  };
});
