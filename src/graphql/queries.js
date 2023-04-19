import gql from "graphql-tag";

/* Login */
export const AUTH_USER = gql`
  query authUser($email: String, $password: String, $deviceToken: String) {
    authUser(email: $email, password: $password, deviceToken: $deviceToken) {
      _id
      username
      name
      email
      role
      token
      vehical {
        vehicalTypeId
        brand
        color
        model
        plateNumber
        valuePerKm
      }
    }
  }
`;

/* Facebook login */
export const FACEBOOK_LOGIN = gql`
  query facebookLogin($token: String) {
    facebookLogin(token: $token) {
       _id
      username
      name
      email
      role
      token
      vehical {
        vehicalTypeId
        brand
        color
        model
        plateNumber
        valuePerKm
      }
    }
  }
`;

/*Get User Details */
export const GET_USER_DETAILS = gql`
  query getUserDetails($id: String) {
    getUserDetails(id: $id){
      _id
      email
      rating
      shipment {
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
      }
      profile{
        name 
        image
        carrierType
        neighborhood
        vehical {
          vehicalTypeId
          brand
          color
          model
          plateNumber
          valuePerKm
          status
        }
        deviceToken
      }
      username
      roles
      createdAt
    }
  }
`;

/* Change Passwod */
export const CHANGE_PASSWORD = gql`
  query changePassword($oldPassword: String, $newPassword: String) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

/* Get Users By Role */
export const USERS_LIST = gql`
  query getAllUsers($role: String, $search: String) {
    getAllUsers(role: $role, search: $search){
      _id
      email
      profile{
        name 
        image
        carrierType
        neighborhood
        vehical {
          vehicalTypeId
          brand
          color
          model
          plateNumber
          valuePerKm
          status
        }
      }
      username
      roles
      createdAt
    }
  }
`;

/* Get Promotions */
export const PROMOTIONS_LIST = gql`
  query getPromotions($id: String) {
    getPromotions(id: $id){
      _id
      discount
      code
    }
  }
`;

/* Get Notifications */
export const GET_NOTIFICATIONS = gql `
query getNotifications {
  getNotifications{
    _id
    title
    type
    detail
    role
    shipmentId
    shipment {
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
      user {
        name
        image
      }
      carrierId
      isDeliveredByCarrier
      status
    }
    rating
    amount
    freightRequestId
    freightRequest {
      carrier {
        name
        image
        carrierType
        publicKey
      }
      carrierId
    }
    isRequestAcceptedByClient
    isRequestAcceptedByCarrier
    userId
    createdAt
  }
}
`;

/* Get Vehicle Types */
export const GET_VEHICLE_TYPES = gql `
query getVehicalTypes($vehicleId: String) {
  getVehicalTypes(vehicleId: $vehicleId){
    _id
    name
    dimension {
      width
      height
      length
    }
    capacity
    createdAt
  }
}
`;

/* Get Carrier Users */
export const GET_CARRIER_USERS = gql `
  query getCarrierUsers($filter: filterInput, $sort: String, $sortByRating: String, $location: locationInput) {
    getCarrierUsers(filter: $filter, sort: $sort, sortByRating: $sortByRating, location: $location){
      _id
      profile {
        name
        image
        carrierType
        neighborhood
        vehical {
          vehicalTypeId
          brand
          color
          model
          plateNumber
          valuePerKm
          status
        }
      }
      rating
      username
    }
  }
`

/* Send Quote Request */
export const SEND_FREIGHT_REQUEST = gql`
  query sendFreightRequest($userId: String, $shipmentId: String) {
    sendFreightRequest(userId: $userId, shipmentId: $shipmentId)
  }
`
/* Reject Freight Request */
export const REJECT_FREIGHT_REQUEST = gql `
  query rejectFreightRequest($freightRequestId: String) {
    rejectFreightRequest(freightRequestId: $freightRequestId)
  }
`

/* Start Trip */
export const START_TRIP = gql`
  query startTrip($shipmentId: String) {
    startTrip(shipmentId: $shipmentId)
  }
`

/* Delivery Confirmed By Carrier */ 
export const DELIVERY_CONFIRMED = gql `
  query deliveryConfirmation($shipmentId: String) {
    deliveryConfirmation(shipmentId: $shipmentId)
  }
`
/* Delivery Confirmed By Client */
export const SHIPMENT_CONFIRMED = gql `
  query shipmentConfirmation($shipmentId: String) {
    shipmentConfirmation(shipmentId: $shipmentId)
  }
`
/* Get Agenda */
export const GET_AGENDA = gql `
  query getAgenda {
    getAgenda {
      carrierId
      shipment {
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
        isDeliveredByCarrier
        status
        userId
        user {
          name
        }
        carrierId
      }
      deliveredDate {
        type
        date
      }
      confirmedDate {
        type
        date
      }
      fromDate {
        type
        date
      }
    }
  }
`

/* Get Freight History */
export const GET_FREIGHT_REQUESTS = gql `
  query getFreightRequests($status: Int) {
    getFreightRequests(status: $status) {
      carrierId
      amount
      shipment {
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
        isDeliveredByCarrier
        status
        userId
        user {
          name
        }
        carrierId
      }
      profile {
        name
        image
        carrierType
        neighborhood
        vehical {
          vehicalTypeId
          vehicalName
          brand
          color
          model
          plateNumber
          valuePerKm
          status
        }
      }
      order {
        _id
        userId
        shipmentId
        amount
        paymentMethod
      }
    }
  }
`

/* Get Chat Room List */
export const GET_CHAT_ROOM_LIST = gql `
  query getChatRoomList {
    getChatRoomList {
      _id
      users {
        _id
        name
        image
      }
      creatorId
      unread
      lastMessage
      createdAt
      updatedAt
    }
  }
`

/* Get Chat Room Messages */
export const GET_CHAT_ROOM_MESSAGES = gql `
  query getChatRoomMessages($roomId: String!, $limit: Int, $skip: Int) {
    getChatRoomMessages(roomId: $roomId, limit: $limit, skip: $skip) {
      messages {
        _id
        roomId
        message
        isRead
        creator {
          creatorId
          creatorName
          role
        }
        createdAt
        status
      }
      limit
      skip
    }
  }
`

/* Validate Promo Code */
export const VALIDATE_PROMO_CODE = gql `
  query validatePromoCode($amount: Int, $code: String) {
    validatePromoCode(amount: $amount, code: $code) 
  }
`

/* Get Carrier Location */
export const GET_CARRIER_LOCATION = gql `
  query getCarrierLocation($carrierId: String) {
    getCarrierLocation(carrierId: $carrierId) {
      lat
      lng
    }
  }
`

/* Get Unread Notification Count */
export const GET_NOTIFICATIONS_COUNT =  gql `
   query getNotificationsCount {
    getNotificationsCount
  }
`

export const CARRIER_DELIVERY_CONFIRMATION = gql`
  query carrierDeliveryConfirmation($shipmentId: String) {
    carrierDeliveryConfirmation(shipmentId: $shipmentId)
  }
`

export const DOWNLOAD_USERS_DATA = gql`
  query downloadUsersData {
    downloadUsersData {
      usersDataUrl
      shipmentDataUrl
    }
  }
`