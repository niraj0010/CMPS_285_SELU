import { UserDto } from "../../constants/types";
import { PrimaryNavigation } from "../navigation/navigation";
import { Container } from "@mantine/core";
import { Footer } from "../footer/footer-page";

type PageWrapperProps = {
  user?: UserDto;
  children?: React.ReactNode;
};

//This is the wrapper that surrounds every page in the app.  Changes made here will be reflect all over.
export const PageWrapper: React.FC<PageWrapperProps> = ({ user, children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr) auto",
        minHeight: "100vh",
      }}
    >
      <PrimaryNavigation user={user} />
      <Container px={0} fluid style={{ marginTop: "10px", width: "100%" }}>
        {children}
      </Container>
      <Footer />
    </div>
  );
};
