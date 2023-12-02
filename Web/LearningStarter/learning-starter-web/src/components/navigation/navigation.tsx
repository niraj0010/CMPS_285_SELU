import React, { useEffect, useState } from "react";
import { routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IconSearch, IconShoppingBag } from "@tabler/icons-react";
import {
  Header,
  Menu,
  Image,
  Input,
  createStyles,
  Container,
  Group,
  useMantineColorScheme,
  Button,
  Flex,
  Text,
  Avatar,
  Badge,
} from "@mantine/core";
import {
  NAVBAR_HEIGHT,
  NAVBAR_HEIGHT_NUMBER,
} from "../../constants/theme-constants";
import {
  Link,
  NavLink,
  NavLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserDto } from "../../constants/types";
import { useAuth } from "../../authentication/use-auth";
import { useSearch } from "../../context/search-context";
import { useCart } from "../../context/cart-context";

type PrimaryNavigationProps = {
  user?: UserDto;
};

type NavigationItem = {
  text: string;
  icon?: IconProp | undefined;
  hide?: boolean;
} & (
  | {
      nav: Omit<
        NavLinkProps,
        keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
      >;
      children?: never;
    }
  | { nav?: never; children: NavigationItemForceNav[] }
);

export type NavigationItemForceNav = {
  text: string;
  icon?: IconProp | undefined;
  hide?: boolean;
  nav: NavLinkProps;
};

const navigation: NavigationItem[] = [
  {
    text: "Home",
    hide: false,
    nav: {
      to: routes.home,
    },
  },
  {
    text: "About",
    hide: false,
    nav: {
      to: routes.aboutus,
    },
  },
  {
    text: "Add Products",
    hide: false,
    nav: {
      to: routes.product,
    },
  },
  {
    text: "Shop",
    hide: false,
    nav: {
      to: routes.shop,
    },
  },
];

const DesktopNavigation = () => {
  const { classes, cx } = useStyles();
  const { pathname } = useLocation();
  const [active, setActive] = useState(navigation[0].nav?.to.toString());

  useEffect(() => {
    setActive(pathname);
  }, [pathname, setActive]);

  return (
    <>
      <Container px={0} className={classes.desktopNav}>
        <Flex direction="row" align="center" className={classes.fullHeight}>
          {navigation
            .filter((x) => !x.hide)
            .map((x, i) => {
              if (x.children) {
                return (
                  <Menu trigger="hover" key={i}>
                    <Menu.Target>
                      <Button
                        size="md"
                        className={classes.paddedMenuItem}
                        variant="subtle"
                        key={i}
                      >
                        {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {x.children
                        .filter((x) => !x.hide)
                        .map((y) => {
                          return (
                            <Menu.Item
                              key={`${y.text}`}
                              to={y.nav.to}
                              component={NavLink}
                            >
                              <Flex direction="row">
                                <Text size="sm">
                                  {y.icon && <FontAwesomeIcon icon={y.icon} />}{" "}
                                  {y.text}
                                </Text>
                              </Flex>
                            </Menu.Item>
                          );
                        })}
                    </Menu.Dropdown>
                  </Menu>
                );
              }
              return (
                <Button
                  size="md"
                  style={{ color: "black" }}
                  component={NavLink}
                  to={x.nav.to}
                  className={cx(classes.paddedMenuItem, {
                    [classes.linkActive]: active === x.nav.to,
                  })}
                  variant="subtle"
                  key={i}
                >
                  {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
                </Button>
              );
            })}
        </Flex>
      </Container>
    </>
  );
};

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  user,
}) => {
  const { classes } = useStyles();
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const cartContext = useCart();
  const { cart } = cartContext || {};
  const dark = colorScheme === "dark";
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();

  return (
    <Header height={NAVBAR_HEIGHT_NUMBER}>
      <Container px={20} fluid className={classes.navContainer}>
        <Flex direction="row" justify="space-between" align="center">
          <Group>
            <Flex direction="row" align="center">
              <NavLink to={routes.root}>
                <Image
                  width={100}
                  height={75}
                  radius="md"
                  withPlaceholder
                  fit="contain"
                  src={logo}
                  alt="logo"
                />
              </NavLink>
              {user && <DesktopNavigation />}
            </Flex>
          </Group>
          {user && (
            <Group>
              <Flex
                direction={{ base: "column", sm: "row" }}
                gap="sm"
                align="center"
              >
                <Input
                  icon={<IconSearch />}
                  placeholder="Search"
                  radius="sm"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Flex>
            </Group>
          )}
          <Group>
            {user && (
              <Menu>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginRight: "10px",
                    marginTop: "15px",
                  }}
                >
                  <Link to="/cart">
                    <Badge
                      style={{
                        position: "absolute",
                        top: "-9px",
                        right: "-10px",
                      }}
                      color="#CBC3E3"
                      size="xs"
                    >
                      <span>{cart?.length}</span>
                    </Badge>
                    <IconShoppingBag color="black" size={32} />
                  </Link>
                </div>

                <Menu.Target>
                  <Avatar className={classes.pointer}>
                    {user.firstName.substring(0, 1)}
                    {user.lastName.substring(0, 1)}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => toggleColorScheme()}>
                    {dark ? "Light mode" : "Dark mode"}
                  </Menu.Item>
                  <Menu.Item onClick={() => navigate(routes.user)}>
                    Profile
                  </Menu.Item>
                  <Menu.Item onClick={() => logout()}>Sign Out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Flex>
      </Container>
    </Header>
  );
};

const useStyles = createStyles((theme) => {
  return {
    pointer: {
      cursor: "pointer",
    },
    paddedMenuItem: {
      margin: "0px 5px 0px 5px",
      "&:hover": {
        backgroundColor: "#458588",
        color: "black",
      },
    },
    linkActive: {
      borderBottom: "1px solid #458588",
      textDecorationColor: "#458588",
      //color: "white",
      "&:hover": {
        backgroundColor: "#458588",
        color: "black",
      },
    },
    desktopNav: {
      height: NAVBAR_HEIGHT,
    },
    navContainer: {
      backgroundColor: "#a89984",
    },
    fullHeight: {
      height: "100%",
    },
  };
});
