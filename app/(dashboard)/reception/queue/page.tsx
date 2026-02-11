'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, UserCheck, Clock, AlertCircle, RefreshCw, CreditCard, X, User, Phone, Calendar, ClipboardList, Activity, Printer, Pill, IndianRupee } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { useReceptionQueue, useCheckInPatient, useCheckInWithPayment, useMarkNoShow, useAppointmentDetails } from '@/features/reception';
import { useDoctors } from '@/features/doctors';
import { useAuth } from '@/hooks/use-auth';
import { useHospital } from '@/features/hospitals';

export default function ReceptionQueuePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');

    const { data: doctorsData } = useDoctors();
    const doctors = doctorsData?.doctors || [];

    // Get hospital data for professional printing
    const { user } = useAuth();
    const hospitalId = user?.hospital?.id || null;
    const { data: hospital } = useHospital(hospitalId);
    const { data, isLoading, error, refetch, isRefetching } = useReceptionQueue(
        undefined,
        undefined,
        selectedDoctorId === 'all' ? undefined : selectedDoctorId
    );
    const checkInMutation = useCheckInPatient();
    const checkInWithPaymentMutation = useCheckInWithPayment();
    const noShowMutation = useMarkNoShow();

    const searchParams = useSearchParams();
    const queryAptId = searchParams.get('appointmentId');

    const [selectedAptForPayment, setSelectedAptForPayment] = useState<any | null>(null);
    const [viewingAppointmentId, setViewingAppointmentId] = useState<string | null>(queryAptId);

    useEffect(() => {
        if (queryAptId) {
            setViewingAppointmentId(queryAptId);
        }
    }, [queryAptId]);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

    const { data: details, isLoading: isLoadingDetails } = useAppointmentDetails(viewingAppointmentId);

    const appointments = data?.appointments || [];

    // Client-side filtering by search query
    const filteredAppointments = appointments.filter((apt) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            apt.patient.name?.toLowerCase().includes(query) ||
            apt.patient.phone?.includes(query) ||
            apt.doctor.name?.toLowerCase().includes(query)
        );
    });

    const handleCheckIn = async (appointmentId: string) => {
        checkInMutation.mutate(appointmentId);
    };

    const handleCheckInWithPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAptForPayment) return;

        checkInWithPaymentMutation.mutate({
            appointmentId: selectedAptForPayment.id,
            amount: selectedAptForPayment.consultationFee || 500,
            method: paymentMethod,
        }, {
            onSuccess: () => {
                setSelectedAptForPayment(null);
            }
        });
    };

    const handleNoShow = async (appointmentId: string) => {
        noShowMutation.mutate({ appointmentId });
    };



    // Print professional Bill/Receipt
    const handlePrintBill = (apt: any) => {
        const printWindow = window.open('', '_blank', 'width=750,height=900');
        if (!printWindow) return;

        // Use hospital from hook, strictly
        const hospitalName = hospital?.name;
        const hospitalAddress = hospital?.address ? `${hospital.address}, ${hospital.city}, ${hospital.state} - ${hospital.pincode}` : '';
        const hospitalPhone = hospital?.phone || '';
        const hospitalLogo = hospital?.logoUrl || '';

        const receiptNo = `RZ-${apt.appointmentNumber || apt.id.slice(0, 8).toUpperCase()}`;
        const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = new Date(apt.scheduledStart).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const gender = apt.patient.gender === 'M' ? 'Male' : 'Female';
        const age = new Date().getFullYear() - new Date(apt.patient.dateOfBirth).getFullYear();

        const html = `
            <html>
                <head>
                    <title>Payment Receipt - ${receiptNo}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; 
                            color: #1f2937;
                            font-size: 14px;
                            line-height: 1.5;
                            padding: 40px; 
                            max-width: 800px; 
                            margin: auto; 
                        }
                        
                        /* HEADER */
                        .header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 20px; border-bottom: 2px solid #f3f4f6; margin-bottom: 30px; }
                        .logo-area { display: flex; align-items: center; gap: 15px; }
                        .logo-area img { max-height: 60px; }
                        .hospital-details h1 { font-size: 20px; font-weight: 700; color: #111827; text-transform: uppercase; margin-bottom: 4px; }
                        .hospital-details p { font-size: 13px; color: #4b5563; max-width: 300px; line-height: 1.4; }
                        
                        .receipt-meta { text-align: right; }
                        .receipt-badge { 
                            display: inline-block; 
                            background: #f3f4f6; 
                            color: #374151; 
                            font-weight: 700; 
                            font-size: 12px; 
                            padding: 6px 12px; 
                            border-radius: 4px; 
                            text-transform: uppercase; 
                            letter-spacing: 0.5px;
                            margin-bottom: 10px;
                        }
                        .meta-row { font-size: 13px; margin-bottom: 2px; }
                        .meta-row span { font-weight: 500; color: #6b7280; margin-right: 5px; }
                        .meta-val { font-weight: 600; color: #111827; }

                        /* INFO GRID */
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
                        .info-group h3 { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 5px; }
                        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                        .info-label { color: #6b7280; }
                        .info-value { font-weight: 500; color: #111827; text-align: right; }

                        /* TABLE */
                        .charges-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .charges-table th { text-align: left; padding: 12px 10px; border-bottom: 2px solid #f3f4f6; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px; }
                        .charges-table td { padding: 12px 10px; border-bottom: 1px solid #f9fafb; font-size: 14px; color: #1f2937; }
                        .charges-table td:last-child { text-align: right; font-weight: 500; }
                        .charges-table th:last-child { text-align: right; }

                        /* TOTALS */
                        .total-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
                        .total-box { width: 250px; }
                        .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
                        .total-row.final { border-top: 2px solid #f3f4f6; border-bottom: 2px solid #f3f4f6; font-weight: 700; font-size: 16px; color: #111827; margin-top: 5px; padding: 15px 0; }
                        
                        /* FOOTER */
                        .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px dashed #e5e7eb; }
                        .signature-area { text-align: center; }
                        .sign-line { width: 180px; border-top: 1px solid #d1d5db; margin-top: 40px; }
                        .sign-label { font-size: 12px; color: #6b7280; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
                        
                        .branding { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 40px; }

                        @media print { 
                            body { padding: 20px; max-width: 100%; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo-area">
                            ${hospitalLogo ? `<img src="${hospitalLogo}" alt="Logo" />` : ''}
                            <div class="hospital-details">
                                <h1>${hospitalName || 'Medical Center'}</h1>
                                <p>
                                    ${hospitalAddress}<br/>
                                    ${hospitalPhone ? `Phone: ${hospitalPhone}` : ''}
                                </p>
                            </div>
                        </div>
                        <div class="receipt-meta">
                            <div class="receipt-badge">Payment Receipt</div>
                            <div class="meta-row"><span>Receipt No:</span> <span class="meta-val">${receiptNo}</span></div>
                            <div class="meta-row"><span>Date:</span> <span class="meta-val">${dateStr}</span></div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-group">
                            <h3>Patient Details</h3>
                            <div class="info-row">
                                <span class="info-label">Name</span>
                                <span class="info-value">${apt.patient.name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Mobile</span>
                                <span class="info-value">${apt.patient.phone || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Gender</span>
                                <span class="info-value">${gender}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Age</span>
                                <span class="info-value">${age}</span>
                            </div>
                        </div>
                        <div class="info-group">
                            <h3>Appointment Details</h3>
                            <div class="info-row">
                                <span class="info-label">Doctor</span>
                                <span class="info-value">Dr. ${apt.doctor.name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Department</span>
                                <span class="info-value">${apt.doctor.specialization || 'General'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Appointment Date</span>
                                <span class="info-value">${dateStr}</span> 
                            </div>
                            <div class="info-row">
                                <span class="info-label">Appointment Time</span>
                                <span class="info-value">${timeStr}</span> 
                            </div>
                        </div>
                    </div>

                    <table class="charges-table">
                        <thead>
                            <tr>
                                <th>Description / Service</th>
                                <th>Qty</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Consultation Fee</strong><br/>
                                    <span style="font-size: 12px; color: #6b7280;">(${apt.consultationType?.replace('_', ' ').toUpperCase() || 'IN PERSON'})</span>
                                </td>
                                <td>1</td>
                                <td>₹ ${apt.consultationFee || 800}.00</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="total-section">
                        <div class="total-box">
                            <div class="total-row">
                                <span>Subtotal</span>
                                <span>₹ ${apt.consultationFee || 800}.00</span>
                            </div>
                            <div class="total-row">
                                <span>Tax (0%)</span>
                                <span>₹ 0.00</span>
                            </div>
                            <div class="total-row final">
                                <span>Total Paid</span>
                                <span>₹ ${apt.consultationFee || 800}.00</span>
                            </div>
                            <div style="text-align: right; font-size: 12px; color: #6b7280; margin-top: 5px;">
                                Paid via CASH
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="signature-area">
                            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 40px;">Received By</div>
                            <div class="sign-line"></div>
                            <div class="sign-label">RECEPTIONIST</div>
                        </div>
                         <div class="signature-area">
                             <div style="font-size: 12px; color: #9ca3af; margin-bottom: 40px;">Authorized By</div>
                            <div class="sign-line"></div>
                            <div class="sign-label">AUTHORITY SIGNATURE</div>
                        </div>
                    </div>

                    <div class="branding">
                        Generated by <strong>Rozx Healthcare</strong> • www.rozx.in
                    </div>

                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };




    // Print professional Prescription
    const handlePrintPrescription = async (apt: any) => {
        try {
            // Fetch prescription data
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'} /api/v1 / reception / appointments / ${apt.id}/prescription`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            const presData = data.data;

            if (!presData) {
                alert('Could not fetch prescription data.');
                return;
            }

            const printWindow = window.open('', '_blank', 'width=750,height=900');
            if (!printWindow) return;

            const hospitalDetails = presData.hospital;
            const docDetails = presData.doctor;
            const patDetails = presData.patient;
            const rx = presData.prescription;
            const consultation = presData.consultation;

            // Use fetched details strictly
            const hospitalName = hospitalDetails?.name;
            const hospitalAddress = hospitalDetails?.address ? `${hospitalDetails.address}, ${hospitalDetails.city}, ${hospitalDetails.state} - ${hospitalDetails.pincode}` : '';
            const hospitalPhone = hospitalDetails?.phone || '';
            const hospitalLogo = hospitalDetails?.logo_url || '';
            const rxNo = rx?.prescription_number || `RX-${apt.appointmentNumber}`;
            const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

            const medicationsHtml = rx && rx.medications ? rx.medications.map((med: any, i: number) => `
                <div style="margin-bottom: 8px; border-bottom: 1px dotted #000; padding-bottom: 5px;">
                    <div style="font-weight: bold; font-size: 14px;">${i + 1}. ${med.medicine_name || med.name} <span style="font-weight: normal;">(${med.strength || '-'})</span></div>
                    <div style="font-size: 13px; margin-top: 2px;">
                        ${med.dosage || ''} - ${med.frequency || ''} - ${med.duration || ''} 
                        <span style="float: right;">Qty: ${med.quantity || '-'}</span>
                    </div>
                    ${med.instructions ? `<div style="font-size: 12px; font-style: italic;">Note: ${med.instructions}</div>` : ''}
                </div>
            `).join('') : '<div style="text-align:center; color:#555;">No medications prescribed.</div>';

            const diagnosis = rx?.diagnosis ? rx.diagnosis.join(', ') : (consultation?.diagnosis || '');
            const advice = rx?.lifestyle_advice || rx?.general_instructions || '';
            const labTests = rx?.lab_tests ? rx.lab_tests.join(', ') : '';

            const html = `
                <html>
                    <head>
                        <title>Prescription - ${rxNo}</title>
                        <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body { font-family: 'Courier New', Courier, monospace; padding: 30px; max-width: 800px; margin: auto; color: #000; }
                            
                            .container { border: 1px solid #000; padding: 20px; }

                            /* HEADER - Matches Receipt */
                            .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
                            .header img { max-height: 50px; margin-bottom: 10px; }
                            .hospital-name { font-size: 22px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
                            .hospital-info { font-size: 13px; line-height: 1.4; }

                            .doc-title { text-align: center; font-size: 16px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; text-decoration: underline; }

                            /* INFO BOXES */
                            .box-section { border: 1px solid #000; margin-bottom: 20px; }
                            .row { display: flex; border-bottom: 1px solid #000; }
                            .row:last-child { border-bottom: none; }
                            .col { flex: 1; padding: 8px 12px; border-right: 1px solid #000; font-size: 13px; }
                            .col:last-child { border-right: none; }
                            .label { font-weight: bold; margin-right: 5px; }

                            .rx-symbol { font-size: 32px; font-weight: bold; margin-bottom: 10px; }

                            /* CONTENT */
                            .content-section { margin-bottom: 15px; }
                            .sec-header { font-weight: bold; text-transform: uppercase; font-size: 13px; border-bottom: 1px solid #000; margin-bottom: 5px; display: inline-block; }
                            .sec-body { font-size: 14px; line-height: 1.5; }

                            /* FOOTER - Matches Receipt */
                            .footer-section { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
                            .stamp-box { width: 100px; height: 80px; border: 1px dashed #999; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999; }
                            .signature-line { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-size: 13px; font-weight: bold; }

                            .brand-footer { margin-top: 40px; text-align: center; font-size: 11px; border-top: 1px solid #000; padding-top: 10px; }
                            .brand-footer .highlight { font-weight: bold; }

                            @media print { body { padding: 0; } .container { border: none; } }
                        </style>
                    </head>
                    <body>
                         <div class="container">
                            <div class="header">
                                ${hospitalLogo ? `<img src="${hospitalLogo}" alt="Logo" />` : ''}
                                <div class="hospital-name">${hospitalName || 'HOSPITAL NAME'}</div>
                                <div class="hospital-info">
                                    ${hospitalAddress}<br/>
                                    ${hospitalPhone ? `Phone: ${hospitalPhone}` : ''}
                                </div>
                            </div>

                            <div class="box-section">
                                <div class="row">
                                    <div class="col"><span class="label">Doctor:</span> Dr. ${docDetails.name}</div>
                                    <div class="col"><span class="label">Spec:</span> ${docDetails.specialization || 'General'}</div>
                                    ${docDetails.registrationNumber ? `<div class="col"><span class="label">Reg:</span> ${docDetails.registrationNumber}</div>` : ''} 
                                </div>
                            </div>

                            <div class="box-section">
                                <div class="row">
                                    <div class="col"><span class="label">Patient:</span> ${patDetails.name}</div>
                                    <div class="col"><span class="label">Age/Sex:</span> ${patDetails.dob ? (new Date().getFullYear() - new Date(patDetails.dob).getFullYear()) : '-'} / ${patDetails.gender || '-'}</div>
                                </div>
                                <div class="row">
                                    <div class="col"><span class="label">Date:</span> ${dateStr}</div>
                                    <div class="col"><span class="label">Rx No:</span> ${rxNo}</div>
                                </div>
                            </div>

                            <div class="rx-symbol">Rx</div>

                            ${diagnosis ? `
                            <div class="content-section">
                                <div class="sec-header">Diagnosis</div>
                                <div class="sec-body">${diagnosis}</div>
                            </div>
                            ` : ''}

                            <div class="content-section">
                                <div class="sec-header">Medications</div>
                                <div class="sec-body" style="margin-top: 5px;">
                                    ${medicationsHtml}
                                </div>
                            </div>

                            ${labTests ? `
                            <div class="content-section">
                                <div class="sec-header">Lab Tests</div>
                                <div class="sec-body">${labTests}</div>
                            </div>
                            ` : ''}

                            ${advice ? `
                            <div class="content-section">
                                <div class="sec-header">Advice</div>
                                <div class="sec-body">${advice}</div>
                            </div>
                            ` : ''}

                            <div class="footer-section">
                                <div class="stamp-box">HOSPITAL STAMP</div>
                                <div>
                                    <div class="signature-line">Dr. ${docDetails.name}</div>
                                </div>
                            </div>

                            <div class="brand-footer">
                                Order medicines online & get them delivered via <span class="highlight">ROZX</span> App<br/>
                                Powered by Rozx Healthcare Platform • www.rozx.in
                            </div>
                        </div>

                        <script>window.print();</script>
                    </body>
                </html>
            `;

            printWindow.document.write(html);
            printWindow.document.close();

        } catch (error) {
            console.error('Error printing prescription:', error);
            alert('Failed to load prescription details. Please try again.');
        }
    };

    const handlePrintQueue = () => {
        const printWindow = window.open('', '_blank', 'width=800,height=800');
        if (!printWindow) return;

        const doctorName = selectedDoctorId === 'all' ? 'All Doctors' : doctors.find(d => d.id === selectedDoctorId)?.name || 'Doctor';
        const dateStr = new Date().toLocaleDateString();

        const rows = filteredAppointments.map(apt => `
            <tr>
                <td>${apt.patient.name}</td>
                <td>Dr. ${apt.doctor.name}</td>
                <td>${new Date(apt.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${apt.status.replace('_', ' ')}</td>
            </tr>
        `).join('');

        const html = `
            <html>
                <head>
                    <title>Patient Queue - ${doctorName}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h1 { font-size: 20px; margin-bottom: 5px; }
                        .meta { font-size: 14px; margin-bottom: 20px; color: #666; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
                        th { background: #f9f9f9; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>Patient Queue List</h1>
                    <div class="meta">Doctor: ${doctorName} | Date: ${dateStr}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <script>window.print(); window.close();</script>
                </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                    <p className="text-destructive mb-2">Failed to load queue</p>
                    <button
                        onClick={() => refetch()}
                        className="text-sm text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Patient Queue</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage today's appointments and patient check-ins
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrintQueue}
                        disabled={filteredAppointments.length === 0}
                        className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                    >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Print Queue</span>
                    </button>
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by patient name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <div className="flex items-center gap-2 mr-2 border-r pr-4">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={selectedDoctorId}
                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Doctors</option>
                            {doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    Dr. {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            {data?.stats && (
                <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                        {data.stats.confirmed} Waiting
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        {data.stats.checkedIn} Checked In
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {data.stats.inProgress} In Progress
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {data.stats.completed} Completed
                    </span>
                </div>
            )}

            {/* Queue List */}
            {filteredAppointments.length === 0 ? (
                <div className="rounded-xl border p-12 text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No appointments found</h3>
                    <p className="text-sm text-muted-foreground">
                        No appointments scheduled for today.
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border">
                    {/* Desktop Table Header - Hidden on mobile */}
                    <div className="hidden md:grid grid-cols-6 gap-4 p-4 text-sm font-medium text-muted-foreground border-b bg-muted/50">
                        <div className="col-span-2">Patient</div>
                        <div>Doctor</div>
                        <div>Time</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </div>
                    <div className="divide-y">
                        {filteredAppointments.map((apt) => (
                            <div key={apt.id} className="p-4">
                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm shrink-0">
                                                {apt.patient.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'P'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{apt.patient.name}</p>
                                                <p className="text-sm text-muted-foreground">{apt.patient.phone || 'No phone'}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium shrink-0 ${apt.status === 'checked_in'
                                            ? 'bg-green-100 text-green-700'
                                            : apt.status === 'confirmed'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : apt.status === 'pending_payment'
                                                    ? 'bg-red-50 text-red-700'
                                                    : apt.status === 'in_progress'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : apt.status === 'completed'
                                                            ? 'bg-gray-100 text-gray-700'
                                                            : apt.status === 'no_show'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {apt.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Dr. {apt.doctor.name}</span>
                                        <span>•</span>
                                        <span>{new Date(apt.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {apt.status === 'confirmed' && (
                                            <>
                                                <button
                                                    onClick={() => handleCheckIn(apt.id)}
                                                    disabled={checkInMutation.isPending}
                                                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Check In
                                                </button>
                                                <button
                                                    onClick={() => handleNoShow(apt.id)}
                                                    disabled={noShowMutation.isPending}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                                                >
                                                    No Show
                                                </button>
                                            </>
                                        )}
                                        {apt.status === 'pending_payment' && (
                                            <button
                                                onClick={() => setSelectedAptForPayment(apt)}
                                                className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700"
                                            >
                                                Check In & Pay
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setViewingAppointmentId(apt.id)}
                                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                                        >
                                            View
                                        </button>
                                        {(apt.status === 'checked_in' || apt.status === 'in_progress' || apt.status === 'completed') && (
                                            <button
                                                onClick={() => handlePrintBill(apt)}
                                                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                                            >
                                                Bill
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Table Row */}
                                <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                                            {apt.patient.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{apt.patient.name}</p>
                                            <p className="text-sm text-muted-foreground">{apt.patient.phone || 'No phone'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium">Dr. {apt.doctor.name}</p>
                                        <p className="text-sm text-muted-foreground">{typeof apt.doctor.specialization === 'object' ? (apt.doctor.specialization as any)?.name : apt.doctor.specialization || 'General'}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {new Date(apt.scheduledStart).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {apt.consultationType === 'walk_in' ? 'Walk-in' : apt.consultationType?.replace('_', ' ') || 'In-person'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${apt.status === 'checked_in'
                                            ? 'bg-green-100 text-green-700'
                                            : apt.status === 'confirmed'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : apt.status === 'pending_payment'
                                                    ? 'bg-red-50 text-red-700'
                                                    : apt.status === 'in_progress'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : apt.status === 'completed'
                                                            ? 'bg-gray-100 text-gray-700'
                                                            : apt.status === 'no_show'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {apt.status === 'checked_in' && <UserCheck className="h-3 w-3" />}
                                            {apt.status === 'no_show' && <AlertCircle className="h-3 w-3" />}
                                            {apt.status === 'pending_payment' && <CreditCard className="h-3 w-3" />}
                                            {apt.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {apt.status === 'confirmed' && (
                                            <>
                                                <button
                                                    onClick={() => handleCheckIn(apt.id)}
                                                    disabled={checkInMutation.isPending}
                                                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Check In
                                                </button>
                                                <button
                                                    onClick={() => handleNoShow(apt.id)}
                                                    disabled={noShowMutation.isPending}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                                                >
                                                    No Show
                                                </button>
                                            </>
                                        )}
                                        {apt.status === 'pending_payment' && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedAptForPayment(apt)}
                                                    className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700"
                                                >
                                                    Check In & Pay
                                                </button>
                                                <button
                                                    onClick={() => handleNoShow(apt.id)}
                                                    disabled={noShowMutation.isPending}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                                                >
                                                    No Show
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setViewingAppointmentId(apt.id)}
                                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                                        >
                                            View
                                        </button>
                                        {(apt.status === 'checked_in' || apt.status === 'in_progress' || apt.status === 'completed') && (
                                            <button
                                                onClick={() => handlePrintBill(apt)}
                                                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted flex items-center gap-1"
                                                title="Print Bill"
                                            >
                                                <IndianRupee className="h-3 w-3" />
                                                Bill
                                            </button>
                                        )}
                                        {apt.status === 'completed' && (
                                            <button
                                                onClick={() => handlePrintPrescription(apt)}
                                                className="rounded-md border border-primary text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/10 flex items-center gap-1"
                                                title="Print Prescription"
                                            >
                                                <Pill className="h-3 w-3" />
                                                Rx
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {selectedAptForPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 border animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Collect Payment</h2>
                            <button
                                onClick={() => setSelectedAptForPayment(null)}
                                className="p-2 rounded-full hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-orange-800">Payment Required</p>
                                    <p className="text-xs text-orange-700 mt-0.5">
                                        This appointment has pending payment. Please collect payment before checking in the patient.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm py-2 border-b">
                                <span className="text-muted-foreground">Patient</span>
                                <span className="font-medium">{selectedAptForPayment.patient.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm py-2 border-b">
                                <span className="text-muted-foreground">Appointment</span>
                                <span className="font-medium">{selectedAptForPayment.appointmentNumber}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold py-2">
                                <span>Amount to Collect</span>
                                <span className="text-primary">₹{selectedAptForPayment.consultationFee || 500}</span>
                            </div>

                            <div className="pt-4">
                                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all ${paymentMethod === 'cash'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-muted hover:bg-muted'
                                            }`}
                                    >
                                        Cash
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all ${paymentMethod === 'card'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-muted hover:bg-muted'
                                            }`}
                                    >
                                        Card/UPI
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedAptForPayment(null)}
                                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckInWithPayment}
                                disabled={checkInWithPaymentMutation.isPending}
                                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {checkInWithPaymentMutation.isPending && <LoadingSpinner size="sm" />}
                                Collect & Check In
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Appointment Details Drawer */}
            {viewingAppointmentId && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/50 overflow-hidden">
                    <div className="bg-background h-full w-full max-w-lg shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-bold">Appointment Details</h2>
                                <p className="text-sm text-muted-foreground">
                                    {details ? `Ref: ${details.appointmentNumber || details.bookingId}` : 'Loading...'}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingAppointmentId(null)}
                                className="p-2 rounded-full hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        {isLoadingDetails ? (
                            <div className="flex-1 flex items-center justify-center">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : details ? (
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Patient Info Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <User className="h-5 w-5" />
                                        <h3 className="font-semibold uppercase tracking-wider text-xs">Patient Information</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-4 rounded-xl border p-4 bg-muted/30">
                                        <div className="col-span-2 flex items-center gap-3 pb-2 border-b">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {details.patient?.name?.[0] || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{details.patient?.name}</p>
                                                <p className="text-xs text-muted-foreground">{details.patient?.gender} • {details.patient?.age || details.patient?.date_of_birth?.split('T')[0] || 'Age not provided'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Phone className="h-3 w-3" />
                                                <p className="text-sm font-medium">{details.patient?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="text-sm font-medium mt-1 truncate">{details.patient?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Appointment Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <Calendar className="h-5 w-5" />
                                        <h3 className="font-semibold uppercase tracking-wider text-xs">Visit Details</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 rounded-lg border">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">Scheduled Time</span>
                                            </div>
                                            <span className="text-sm font-bold">
                                                {new Date(details.scheduledStart).toLocaleDateString()} at {new Date(details.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg border">
                                            <div className="flex items-center gap-2">
                                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">Status</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${details.status === 'checked_in' ? 'bg-green-100 text-green-700' :
                                                details.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {details.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg border">
                                            <span className="text-sm">Consultation Type</span>
                                            <span className="text-sm font-medium capitalize">{details.consultationType?.replace('_', ' ')}</span>
                                        </div>
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-xs text-muted-foreground mb-1">Doctor Info</p>
                                            <p className="text-sm font-bold">Dr. {details.doctor?.name || details.doctorName}</p>
                                            <p className="text-xs text-muted-foreground">{details.doctor?.specialization}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Clinical Section (Vitals/Notes) */}
                                {(details.vitals || details.patient_notes || details.notes) && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-4 text-primary">
                                            <Activity className="h-5 w-5" />
                                            <h3 className="font-semibold uppercase tracking-wider text-xs">Clinical Information</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {details.vitals && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {Object.entries(details.vitals).map(([key, val]: [string, any]) => (
                                                        <div key={key} className="p-2 rounded bg-muted/50 border border-dashed">
                                                            <p className="text-[10px] text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                            <p className="text-sm font-bold">{val}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {(details.patient_notes || details.notes) && (
                                                <div className="p-4 rounded-lg bg-yellow-50/50 border border-yellow-100">
                                                    <p className="text-xs font-semibold text-yellow-800 mb-1">Chief Complaint / Notes</p>
                                                    <p className="text-sm text-yellow-900">{details.patient_notes || details.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Payment Info Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <IndianRupee className="h-5 w-5" />
                                        <h3 className="font-semibold uppercase tracking-wider text-xs">Billing Information</h3>
                                    </div>
                                    <div className="rounded-xl border p-4 bg-muted/10">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Consultation Fee</span>
                                            <span className="font-medium">₹{details.consultationFee || details.totalAmount || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                                            <span>Total Amount</span>
                                            <span className="text-primary">₹{details.totalAmount || details.consultationFee || 0}</span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground italic">
                                            <div className={`h-2 w-2 rounded-full ${details.status === 'pending_payment' ? 'bg-red-500' : 'bg-green-500'}`} />
                                            {details.status === 'pending_payment' ? 'Payment is still pending' : 'Payment has been processed'}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="p-6 text-center text-muted-foreground">
                                Failed to load appointment details.
                            </div>
                        )}

                        {/* Drawer Footer (Removed redundant button as requested) */}
                    </div>
                </div>
            )}
        </div>
    );
}
