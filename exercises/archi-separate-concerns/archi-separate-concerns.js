// Architecture Understanding & Separation of Concerns Exercise
//
// This component violates proper architecture principles by:
// 1. Mixing data fetching, business logic, and UI rendering all in one place
// 2. Performing multiple responsibilities within a single component
// 3. Lacking proper separation between API calls, data processing, and UI
// 4. Containing both data fetching and state updates for unrelated features
//
// Your task: Refactor this component by:
// 1. Separating API calls into a dedicated service
// 2. Breaking down the UI into smaller, focused components
// 3. Properly separating business logic from presentation
// 4. Creating a proper architecture with clear separation of concerns

import React, { useState, useEffect } from "react";
import { filterOrders, getStatusBadgeColor, sortOrders } from "./utils/orders";
import * as api from "./services/api";

const OrdersDashboard = () => {
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [filter, setFilter] = useState("all");
   const [sortBy, setSortBy] = useState("date");
   const [refresh, setRefresh] = useState(false);

   const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
   const customerEmails = [...new Set(orders.map((order) => order.customerEmail))];

   // Fetch orders
   useEffect(() => {
      fetchOrders();
   }, [refresh]);

   const fetchOrders = async () => {
      try {
         setLoading(true);
         const data = await api.get("/api/orders");

         if (!data.ok) throw new Error(data.message || "Failed to fetch orders");

         setOrders(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   // Use the utility functions
   const filteredOrders = filterOrders(orders, filter);
   const sortedOrders = sortOrders(filteredOrders, sortBy);

   if (error) {
      return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;
   }

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-6">Orders Dashboard</h1>

         <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Dashboard Summary</h2>
            <p className="mb-1">Total Orders: {orders.length}</p>
            <p className="mb-1">Total Revenue: ${totalRevenue.toFixed(2)}</p>
            <p>Unique Customers: {customerEmails.length}</p>
         </div>

         <div className="mb-6 flex flex-wrap gap-4">
            <select
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md"
            >
               <option value="all">All Orders</option>
               <option value="completed">Completed</option>
               <option value="processing">Processing</option>
               <option value="shipped">Shipped</option>
            </select>

            <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md"
            >
               <option value="date">Sort by Date</option>
               <option value="total">Sort by Total</option>
            </select>
         </div>

         <OrdersTable
            loading={loading}
            orders={sortedOrders}
            setRefresh={setRefresh}
         />
      </div>
   );
};

const OrdersTable = ({ loading, orders, setRefresh }) => {
   const sendReminderEmail = async (orderId) => {
      try {
         const data = await api.post(`/api/orders/${orderId}/send-reminder`);

         if (!data.ok) throw new Error(data.message || "Failed to send reminder");

         alert("Reminder email sent successfully");
      } catch (err) {
         alert(`Error: ${err.message}`);
      }
   };

   const markAsShipped = async (orderId) => {
      try {
         const data = await api.put(`/api/orders/${orderId}`, {
            status: "shipped",
         });

         if (!data.ok) throw new Error(data.message || "Failed to update order");

         alert("Order marked as shipped");
      } catch (err) {
         alert(`Error: ${err.message}`);
      }
   };

   if (loading) {
      return (
         <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
         </div>
      );
   }

   return (
      <div className="overflow-x-auto">
         <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
               <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Actions
                  </th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
               {orders.map((order) => (
                  <tr key={order.id}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{order.id}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerName}
                        <br />
                        {order.customerEmail}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge order={order} />
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.total.toFixed(2)}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                           onClick={() => sendReminderEmail(order.id)}
                           className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                           Send Reminder
                        </button>
                        {order.status !== "shipped" && (
                           <button
                              onClick={() => {
                                 markAsShipped(order.id);
                                 setRefresh((prev) => !prev);
                              }}
                              className="text-green-600 hover:text-green-900"
                           >
                              Mark Shipped
                           </button>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

const StatusBadge = ({ order }) => (
   <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
         order.status
      )}`}
   >
      {order.status}
   </span>
);

export default OrdersDashboard;
