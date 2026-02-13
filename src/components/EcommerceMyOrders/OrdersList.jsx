import { EmptyOrdersState } from "./EmptyOrdersState";
import OrderCard from "./OrderCard";
import { useEffect, useState } from "react";
import { getCustomerOrders } from "../../network/api";

const safeParse = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
};

export function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrders({
          limit: 100,
          offset: 0,
        });

        if (response.status === 200 && response.data) {
          // Handle both possible response structures
          let apiOrders = [];
          if (Array.isArray(response.data)) {
            apiOrders = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            apiOrders = response.data.data;
          } else if (
            response.data.data &&
            Array.isArray(response.data.data.data)
          ) {
            apiOrders = response.data.data.data;
          }

          // Transform API data to include all fields with complete structure
          const transformedOrders = apiOrders.map((order) => ({
            // Core IDs
            id: order.id,
            order_number: order.order_number,
            customer_id: order.customer_id,
            organization_id: order.organization_id,

            // Addresses
            billing_address_id: order.billing_address_id,
            shipping_address_id: order.shipping_address_id,

            // Dates
            order_date: order.order_date,
            shipping_date: order.shipping_date,

            // Status fields
            order_status: order.order_status || "pending",
            payment_status: order.payment_status || "unpaid",

            // Financial fields
            total_amount: order.total_amount,
            discount_on_order: order.discount_on_order || 0,
            shipping_cost: order.shipping_cost || 0,
            reward_points_earned: order.reward_points_earned || 0,

            // Additional fields
            notes: order.notes || "",
            is_active: order.is_active !== false,

            // Audit fields
            created_by: order.created_by,
            created_at: order.created_at,
            updated_by: order.updated_by,
            updated_at: order.updated_at,

            // Customer info (from JOIN)
            customer_name: order.customer_name || "N/A",
            customer_phone: order.customer_phone || "N/A",

            // Items array with parsed variants
            items: Array.isArray(order.items)
              ? order.items.map((item) => ({
                  ...item,
                  variant: safeParse(item.variant),
                }))
              : [],
          }));

          setOrders(transformedOrders);
        } else {
          console.error("Failed to fetch orders:", response.error);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  if (!orders.length) return <EmptyOrdersState />;

  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}
