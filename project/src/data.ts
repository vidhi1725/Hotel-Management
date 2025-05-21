import { Room, Service } from './types';

export const rooms: Room[] = [
  { id: '1', number: '101', type: 'Standard', pricePerNight: 100, isOccupied: false },
  { id: '2', number: '102', type: 'Standard', pricePerNight: 100, isOccupied: false },
  { id: '3', number: '201', type: 'Deluxe', pricePerNight: 200, isOccupied: false },
  { id: '4', number: '202', type: 'Deluxe', pricePerNight: 200, isOccupied: false },
  { id: '5', number: '301', type: 'Suite', pricePerNight: 300, isOccupied: false },
];

export const services: Service[] = [
  { id: '1', name: 'Room Service', price: 20 },
  { id: '2', name: 'Laundry', price: 15 },
  { id: '3', name: 'Spa Treatment', price: 50 },
  { id: '4', name: 'Airport Transfer', price: 40 },
];