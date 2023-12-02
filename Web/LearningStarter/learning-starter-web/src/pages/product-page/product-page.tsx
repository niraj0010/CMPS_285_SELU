import { FormEvent, useState } from "react";
import {
  createStyles,
  Text,
  Container,
  TextInput,
  Button,
  Paper,
  Textarea,
  Flex,
  Select,
} from "@mantine/core";
import { useUser } from "../../authentication/use-auth";
import api from "../../config/axios";
import { FormData, ProductResponse } from "../../constants/types";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { showNotification } from "@mantine/notifications";

export const ProductPage = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    userId: user.id,
    productCategories: "",
    description: "",
    price: 0,
    status: "",
    dateAdded: new Date().toISOString(),
    images: [],
  });

  // Update a specific 'field' in 'FormData' state with a new 'value'.
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Update or change an image at the specified 'index' in 'formData.images'.
  const handleImageChange = async (index: number, file: File | null) => {
    const updatedImages = [...formData.images];

    if (file) {
      // If a file is provided, convert it to a base64 string
      const base64String = await convertImageToBase64(file);
      if (base64String) {
        updatedImages[index] = { data: base64String };
      }
    } else {
      const currentData = updatedImages[index].data;
      if (currentData && typeof currentData === "string") {
        // If the data is already a base64 string, leave it as is
      } else {
        console.error("Invalid image data:", currentData);
      }
    }

    // Update the 'formData' state with 'updatedImages'.
    setFormData((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };

  // Convert an image file to a Base64 encoded string.
  const convertImageToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };

  const addImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, { data: null }],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = {
      ...formData,
      images: formData.images.map((image) => {
        if (typeof image.data === "string") {
          const base64Data = image.data.split(",")[1];
          return {
            Data: base64Data,
          };
        } else {
          return {
            Data: null,
          };
        }
      }),
    };
    try {
      const response = await api.post<ProductResponse>(
        `/api/products`,
        formDataToSend
      );

      if (response.status === 201) {
        showNotification({
          message: "Product created successfully",
          color: "green",
          style: {
            marginTop: "70px",
          },
        });
        setFormData({
          name: "",
          userId: user.id,
          productCategories: "",
          description: "",
          price: 0,
          status: "",
          dateAdded: new Date().toISOString(),
          images: [],
        });
        navigate(routes.shop);
      } else {
        showNotification({
          message: "Failed to create the product",
          color: "red",
          style: {
            marginTop: "70px",
          },
        });
      }
    } catch (error) {
      showNotification({
        message: "An error occurred while creating the product:",
        color: "red",
        style: {
          marginTop: "70px",
        },
      });
    }
  };
  return (
    <Container px={0} fluid style={{ marginTop: "5rem",marginBottom:"5rem", width: "40%" }}>
      <Paper shadow="xs" className={classes.productContainer}>
        <Text size="xl" fw={500} style={{ textAlign: "center" }}>
          Add Product
        </Text>
        <form onSubmit={handleSubmit}>
          <TextInput
            disabled
            label="User Id"
            required
            value={formData.userId}
          />
          <TextInput
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Select
            label="Category"
            required
            data={[
              {
                value: "Clothing And Accessories",
                label: "Clothing and Accessories",
              },
              {
                value: "Furniture And HomeDecor",
                label: "Furniture and Home Decor",
              },
              { value: "Electronics", label: "Electronics" },
              { value: "Books And Media", label: "Books and Media" },
              { value: "Toys And Collection", label: "Toys and Collection" },
            ]}
            value={formData.productCategories}
            onChange={(value) =>
              setFormData({ ...formData, productCategories: value })
            }
          />
          <Textarea
            label="Description"
            required
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <TextInput
            label="Price"
            type="number"
            required
            value={formData.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          />

          <Select
            label="Status"
            required
            data={[
              { value: "Fair", label: "Fair" },
              { value: "Good", label: "Good" },
              { value: "Excellent", label: "Excellent" },
            ]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
          />
          <Text size="sm" weight={700} style={{ marginTop: "16px" }}>
            Images
          </Text>

          {formData.images.map((image, index) => (
            <div key={index}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(
                    index,
                    e.target.files ? e.target.files[0] : null
                  )
                }
              />
              <Button
                size="md"
                variant="light"
                onClick={() => removeImage(index)}
                style={{
                  marginTop: "8px",
                  backgroundColor: "#524F81",
                  color: "white",
                }}
              >
                Remove Image
              </Button>
            </div>
          ))}

          <Button
            size="md"
            onClick={addImage}
            style={{
              marginTop: "16px",
              backgroundColor: "#458588",
              color: "white",
            }}
          >
            Add Image
          </Button>
          <Flex justify={{ sm: "center" }}>
            <Button
              type="submit"
              size="md"
              style={{
                marginTop: "16px",
                backgroundColor: "#458588",
                color: "white",
              }}
            >
              Create Product
            </Button>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
};
const useStyles = createStyles(() => {
  return {
    productContainer: {
      justifyContent: "center",
      padding: "2rem",
    },
  };
});
