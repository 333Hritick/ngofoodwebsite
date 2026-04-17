import { useState, useEffect } from 'react';
import api from '../lib/api';
import { X, CheckCircle, Truck, Package, Users } from 'lucide-react';

interface TrackingUpdate {
  id: number;
  pickup: number;
  status: string;
  message: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

interface TrackingModalProps {
  donationId: number;
  onClose: () => void;
}

export default function TrackingModal({ donationId, onClose }: TrackingModalProps) {
  const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, [donationId]);

  const loadTracking = async () => {
    try {
      const response = await api.get(`/tracking/${donationId}`);
      // Reverse to show newest first
      setUpdates(response.data.reverse());
    } catch (error: any) {
      if (error.response?.status === 404) {
        setUpdates([]);
      } else {
        console.error('Failed to load tracking:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'claimed':
        return <CheckCircle className="text-blue-600" size={24} />;
      case 'picked_up':
        return <Package className="text-yellow-600" size={24} />;
      case 'in_transit':
        return <Truck className="text-orange-600" size={24} />;
      case 'delivered':
        return <Users className="text-green-600" size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Tracking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No tracking information available yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Status Updates</h3>

                {updates.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No updates yet</p>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update, index) => (
                      <div key={update.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(update.status)}
                          {index < updates.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {update.status.replace('_', ' ')}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {new Date(update.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{update.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              by {update.created_by_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
