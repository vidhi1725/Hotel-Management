import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Hotel, Receipt, Bed, LogOut } from 'lucide-react';
import { rooms, services } from './data';
import { Bill, Room, Service } from './types';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<'rooms' | 'billing'>('rooms');
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [guestName, setGuestName] = React.useState('');
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    const roomTotal = selectedRoom.pricePerNight * nights;
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    return roomTotal + servicesTotal;
  };

  const handleBooking = () => {
    if (!selectedRoom || !guestName || !checkIn || !checkOut) return;
    
    const newBill: Bill = {
      id: Date.now().toString(),
      guestName,
      roomNumber: selectedRoom.number,
      checkIn,
      checkOut,
      services: selectedServices,
      totalAmount: calculateTotal(),
      isPaid: false,
    };

    setBills([...bills, newBill]);
    setSelectedRoom(null);
    setGuestName('');
    setCheckIn('');
    setCheckOut('');
    setSelectedServices([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hotel className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Hotel Billing System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'rooms' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'
                }`}
                onClick={() => setActiveTab('rooms')}
              >
                <Bed className="h-5 w-5" />
                <span>Rooms</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'billing' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'
                }`}
                onClick={() => setActiveTab('billing')}
              >
                <Receipt className="h-5 w-5" />
                <span>Billing</span>
              </button>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {activeTab === 'rooms' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`bg-white rounded-lg shadow-md p-6 ${
                    room.isOccupied ? 'opacity-50' : 'hover:shadow-lg transition'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Room {room.number}</h3>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      {room.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">${room.pricePerNight} per night</p>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setSelectedRoom(room)}
                    disabled={room.isOccupied}
                  >
                    {room.isOccupied ? 'Occupied' : 'Book Now'}
                  </button>
                </div>
              ))}
            </div>

            {selectedRoom && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Book Room {selectedRoom.number}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <label key={service.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServices([...selectedServices, service]);
                                } else {
                                  setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">{service.name} - ${service.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-lg font-semibold">
                      Total: ${calculateTotal()}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                        onClick={() => setSelectedRoom(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={handleBooking}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bills</h2>
            <div className="grid gap-6">
              {bills.map((bill) => (
                <div key={bill.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{bill.guestName}</h3>
                      <p className="text-gray-600">Room {bill.roomNumber}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bill.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bill.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p>Check-in: {new Date(bill.checkIn).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(bill.checkOut).toLocaleDateString()}</p>
                    {bill.services.length > 0 && (
                      <div>
                        <p className="font-medium">Additional Services:</p>
                        <ul className="list-disc list-inside">
                          {bill.services.map((service) => (
                            <li key={service.id}>
                              {service.name} - ${service.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-lg font-semibold">Total Amount: ${bill.totalAmount}</p>
                  </div>
                  {!bill.isPaid && (
                    <button
                      className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      onClick={() => {
                        setBills(
                          bills.map((b) =>
                            b.id === bill.id ? { ...b, isPaid: true } : b
                          )
                        );
                      }}
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;