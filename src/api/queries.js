import { gql } from '@apollo/client';

export const getCategories = gql`
  query GetCategories {
    productCategories(first: 10) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl
        }
      }
    }
  }
`;

export const getProducts = gql`
  query GetProducts($first: Int, $category: String) {
    products(first: $first, where: { category: $category }) {
      nodes {
        databaseId
        slug
        name
        description
        shortDescription
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
        }
        image {
          sourceUrl
        }
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const getProductById = gql`
  query GetProductById($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      databaseId
      slug
      name
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
      image {
        sourceUrl
      }
      galleryImages {
        nodes {
          sourceUrl
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;
