import { gql } from "@apollo/client";

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
