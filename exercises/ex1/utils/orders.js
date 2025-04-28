export const filterOrders = (orders, filter) => {
   return orders.filter((order) => {
      if (filter === "all") return true;
      if (filter === "completed") return order.status === "completed";
      if (filter === "processing") return order.status === "processing";
      if (filter === "shipped") return order.status === "shipped";
      return true;
   });
};

export const sortOrders = (orders, sortBy) => {
   return [...orders].sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "total") return b.total - a.total;
      return 0;
   });
};

export const getStatusBadgeColor = (status) => {
   if (status === "completed") return "bg-green-100 text-green-800";
   if (status === "processing") return "bg-yellow-100 text-yellow-800";
   return "bg-blue-100 text-blue-800";
};
