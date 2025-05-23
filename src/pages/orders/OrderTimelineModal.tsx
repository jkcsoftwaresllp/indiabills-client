import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { OrderShow } from "../../definitions/Types";
import ModalMaker from "../../components/core/ModalMaker";

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderShow;
  timelineCollapsed: Record<number, boolean>;
  toggleTimeline: (orderId: number) => void;
}

const OrderTimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  order,
  timelineCollapsed,
  toggleTimeline,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#dea01e]';
      case 'shipped':
        return 'bg-[#0db0b4]';
      case 'returned':
        return 'bg-red-500';
      case 'fulfilled':
        return 'bg-[#23ae8d]';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <ModalMaker isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
        <section id={"Timeline"}>
          <div className="mt-6">
            <button className="flex items-center text-[#474a77] hover:underline" onClick={() => toggleTimeline(order.orderId)}>
              {timelineCollapsed[order.orderId] ? ( <> <ExpandMoreIcon /> Show Timeline </> ) : ( <> <ExpandLessIcon /> Hide Timeline </> )}
            </button>
            {!timelineCollapsed[order.orderId] && (
              <div className="mt-4">
                <ul className="border-l-2 border-gray-300 pl-4">
                  {order.statusHistory && order.statusHistory.length > 0 ? (
                    order.statusHistory.map((status, index) => (
                      <li key={index} className="mb-4">
                        <div className="flex items-center">
                          <div className={`h-4 w-4 rounded-full ${getStatusColor(status.status)} mr-2`}></div>
                          <p className="font-medium">
                            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                          </p>
                        </div>
                        <p className="text-gray-600 ml-6">
                          {new Date(status.updatedAt).toLocaleString()}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-600">No status history available.</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </ModalMaker>
  );
};

export default OrderTimelineModal;