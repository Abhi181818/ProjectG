import React, { useRef } from 'react';
import { Download, TicketIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {QRCodeSVG} from "qrcode.react"
import { useUser } from '../../context/userContext';
import { motion } from 'framer-motion';

const DownloadTicket = ({ booking }) => {
    const ticketRef = useRef(null);
    const { state } = useUser();

    // Generate QR code data
    const qrCodeData = JSON.stringify({
        bookingId: booking.id,
        customerName: state.user.name,
        customerEmail: state.user.email,
        bookingDate: new Date(booking.createdAt).toLocaleDateString(),
        activities: booking.activities.map(activity => ({
            title: activity.title,
            quantity: activity.quantity,
            price: activity.price
        })),
        totalAmount: booking.totalAmount
    });

    const handleDownloadTicket = async () => {
        if (!ticketRef.current) return;

        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Ziplay-Ticket-${booking.id.slice(-6)}.pdf`);
        } catch (error) {
            console.error('Error downloading ticket:', error);
        }
    };

    return (
        <div>
            {/* Ticket Preview Modal/Popup */}
            <div
                ref={ticketRef}
                className="bg-white shadow-2xl rounded-2xl p-6 max-w-md mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <LogoSVG className="h-12 w-auto" />
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-indigo-600">Booking Ticket</h2>
                        <p className="text-gray-500">#{booking.id.slice(-6)}</p>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Customer</span>
                        <span className="font-semibold">{state.user.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Email</span>
                        <span className="font-semibold">{state.user.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Booking Date</span>
                        <span className="font-semibold">
                            {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Activities */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Activities</h3>
                    {booking.activities.map((activity, index) => (
                        <div
                            key={index}
                            className="flex justify-between py-2 border-b last:border-b-0"
                        >
                            <span>{activity.title}</span>
                            <span className="font-semibold">
                                ₹{activity.price} x {activity.quantity}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between mt-3 font-bold">
                        <span>Total</span>
                        <span className="text-indigo-600">₹{booking.totalAmount}</span>
                    </div>
                </div>

                <div className="flex justify-center mb-4">
                    <QRCodeSVG
                        value={qrCodeData}
                        size={128}
                        level={'H'}
                        marginSize={4}
                        bgColor="#ffffff"
                        fgColor="#4f46e5"
                    />
                </div>
            </div>

            {/* Download Button */}
            <motion.button
                onClick={handleDownloadTicket}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                <Download size={20} className="mr-2" />
                Download Ticket
            </motion.button>
        </div>
    );
};

// Logo Component (Placeholder SVG)
const LogoSVG = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 60"
        className={className}
    >
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            fontWeight="bold"
            fontSize="36"
            fill="#4f46e5"
        >
            Ziplay
        </text>
    </svg>
);

export default DownloadTicket;