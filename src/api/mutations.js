import { gql } from "@apollo/client";

export const addToCartMutation = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cartItem {
        key
        quantity
      }
    }
  }
`;

export const createOrder = gql`
  mutation CreateOrder($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderKey
        status
        total
      }
      result
      redirect
    }
  }
`;

export const writeReview = gql`
  mutation WriteReview($input: WriteReviewInput!) {
    writeReview(input: $input) {
      rating
      review {
        id
        content
        date
        author {
          node {
            name
          }
        }
      }
    }
  }
`;