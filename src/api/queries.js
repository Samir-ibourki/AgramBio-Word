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
  query GetProducts($first: Int, $categoryIn: [String]) {
    products(first: $first, where: { categoryIn: $categoryIn }) {
      nodes {
        databaseId
        slug
        name
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
        ... on Product {
          description
          shortDescription
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
  }
`;

export const getProductById = gql`
  query GetProductById($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      ... on Product {
        databaseId
        slug
        name
        description
        shortDescription
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
    }
  }
`;