import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Container,
  Select,
  Textarea,
} from "@mantine/core";
import { ApiResponse, GetProduct, updateProduct } from "../../constants/types";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { showNotification } from "@mantine/notifications";

export const ProductEditPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState<updateProduct | null>(null);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await api.get<ApiResponse<GetProduct>>(
          `/api/products/${productId}`
        );
        console.log("from edit page", response.data.data);
        setProductData(response.data.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchProductData();
  }, [productId]);

  const handleEditSubmit = async () => {
    try {
      const response = await api.put(`/api/products/${productId}`, {
        name: productData?.name,
        productCategories: productData?.productCategories,
        description: productData?.description,
        price: productData?.price,
        status: productData?.status,
      });

      if (response.status === 200) {
        showNotification({
          message: "Product updated successfully",
          color: "green",
          style: {
            marginTop: "70px",
          },
        });
        navigate(routes.shop);
      } else {
        showNotification({
          message: "Failed to update product",
          color: "red",
          style: {
            marginTop: "70px",
          },
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (field: keyof GetProduct, value: string | number) => {
    setProductData((prevData) => ({
      ...(prevData as GetProduct),
      [field]: value,
    }));
  };

  return (
    <Container style={{ marginTop: "10px", width: "50%" }}>
      <Text size="xl" style={{ textAlign: "center" }}>
        Edit Product
      </Text>

      <form>
        <TextInput
          label="Product Name"
          value={productData?.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Select
          label="Product Categories"
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
          value={productData?.productCategories || "Clothing and Accessories"}
          onChange={(value) => handleChange("productCategories", value!)}
        />
        <Textarea
          label="Description"
          value={productData?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <TextInput
          label="Price"
          type="number"
          value={productData?.price || 0}
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
          value={productData?.status || "Fair"}
          onChange={(value) => handleChange("status", value!)}
        />
        <Button
          onClick={handleEditSubmit}
          style={{
            marginTop: "10px",
            marginBottom: "30px",
            backgroundColor: "#524F81",
          }}
        >
          Update Product
        </Button>
      </form>
    </Container>
  );
};
