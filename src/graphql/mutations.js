import gql from "graphql-tag";

/* Sign Up */
export const ADD_USER_MUTATION = gql`
  mutation addUser($name: String, $username: String, $email: String, $password: String, $agreedToTOS: Boolean) {
    addUser (
      name: $name,
      username: $username,
      email: $email, 
      password: $password,
      agreedToTOS: $agreedToTOS
    ) {
      _id
      email
    }
  }
`;
/* Add User Role */
export const ADD_USER_ROLE = gql`
  mutation addUserRole($role: String!) {
    addUserRole (role: $role) 
  }
`;

/* Edit User */
export const EDIT_USER_MUTATION = gql`
  mutation editUser($name: String, $username: String, $email: String, $image: String, $userId: String, $carrierType: String, $neighborhood: String, $vehicalTypeId: String, $brand: String, $color: String, $model: String, $plateNumber: String, $valuePerKm: Int)  {
    editUser (
      name: $name,
      username: $username,
      email: $email, 
      image: $image,
      userId: $userId,
      carrierType: $carrierType,
      neighborhood: $neighborhood,
      vehicalTypeId: $vehicalTypeId,
      brand: $brand,
      color: $color,
      model: $model,
      plateNumber: $plateNumber,
      valuePerKm: $valuePerKm
    ) {
      _id
      email
      profile{
        name 
        carrierType
        neighborhood
        vehical {
          vehicalTypeId
          brand
          color
          model
          plateNumber
          valuePerKm
        }
      }
      username
      roles
      createdAt
    }
  }
`;

/* Delete User */
export const REMOVE_USER = gql`
  mutation removeUser($userId: String) {
    removeUser(userId: $userId)
  }
`;

/* Add Promotion */
export const ADD_PROMOTION = gql`
  mutation addPromotion($discount: Int) {
    addPromotion(discount: $discount) {
      _id,
      discount
      code
    }
  }
`

/* Remove Promotion */
export const REMOVE_PROMOTION = gql`
  mutation removePromotion($promotionId: String) {
    removePromotion(promotionId: $promotionId)
  }
`;


/* Add Notification */
export const ADD_NOTIFICATION = gql`
  mutation addNotification($title: String, $detail: String, $role: String) {
    addNotification(title: $title, detail: $detail, role: $role) {
      _id
      title
      type
      detail
      role
      userId
      createdAt
    }
  }
`

/* Add Notification */
export const ADD_SHIPMENT = gql`
  mutation addShipment($origin: String, $destination: String, $distance: Float, $description: String, $fromDate: Date, $toDate: Date, $dimensions: dimensionInput, $weight: String) {
    addShipment(origin: $origin, destination: $destination, distance: $distance, description: $description, fromDate: $fromDate, toDate: $toDate, dimensions: $dimensions, weight: $weight) {
      _id
      origin {
        address 
        location {
          lat
          lng
        }
      }
      destination {
        address 
        location {
          lat
          lng
        }
      }
      distance
      description
      fromDate
      toDate
      dimensions {
        width
        height
        length
      }
      weight
      userId
    }
  }
`

/* Edit Carrier Status */
export const UPDATE_CARRIER_USER_STATUS = gql`
  mutation updateCarrierStatus($status: Boolean) {
    updateCarrierStatus(status: $status) 
  }
`

/* Send freight request response to client */
export const SEND_FREIGHT_REQUEST_RESPONSE = gql`
  mutation addFreightRequestAmount($shipmentId: String, $amount: Int) {
    addFreightRequestAmount(shipmentId: $shipmentId, amount: $amount) 
  }
`

/* Add Carrier Rating */
export const ADD_CARRIER_RATING = gql `
  mutation addCarrierRating($shipmentId: String, $rating: Float, $carrierId: String) {
    addCarrierRating(shipmentId: $shipmentId, rating: $rating, carrierId: $carrierId) {
      _id
      rating
      clientId
      carrierId
      shipmentId
    }
  }
`

/* Add Client Payment */
export const ADD_ORDER = gql `
  mutation addOrder($freightRequestId: String, $shipmentId: String, $amount: Int, $paymentMethod: String, $paymentData: paymentInput) {
    addOrder(freightRequestId: $freightRequestId, shipmentId: $shipmentId, amount: $amount, paymentMethod: $paymentMethod, paymentData: $paymentData) {
      _id
      userId
      shipmentId
      amount
      paymentMethod
    }
  }
`

/* Add Chat Message */
export const ADD_CHAT_MESSAGE = gql `
  mutation addMessage($message: String, $roomId: String, $userId: String) {
    addMessage(message: $message, roomId: $roomId, userId: $userId) 
  }
`

/* Update Current Location */
export const UPDATE_LOCATION = gql `
  mutation updateLocation($currentLocation: locationInput) {
    updateLocation(currentLocation: $currentLocation) 
  }
`

/* Add Carrier User Merchadopago Account Detail */
export const ADD_MERCHADOPAGO_ACCOUNT = gql `
  mutation addMerchadopagoAccount($code: String, $type: String, $amount: Int, $paymentData: paymentInput) {
    addMerchadopagoAccount(code: $code, type: $type, amount: $amount, paymentData: $paymentData) 
  }
`

/* Set User Device Token */
export const SET_USER_DEVICE_TOKEN = gql `
  mutation setUserDeviceToken($deviceToken: String) {
    setUserDeviceToken(deviceToken: $deviceToken) 
  }
`