export interface Room {
  id: string;
  number: string;
  type: 'Standard' | 'Deluxe' | 'Suite';
  pricePerNight: number;
  isOccupied: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Bill {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  services: Service[];
  totalAmount: number;
  isPaid: boolean;
}

export interface User {
  username: string;
  password: string;
}