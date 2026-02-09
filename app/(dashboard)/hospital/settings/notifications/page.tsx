

export default function HospitalNotificationSettingsPage() {
    const notifications = [
        { id: 'new_booking', label: 'New Booking', description: 'Get notified when a new appointment is booked', email: true, sms: true, push: true },
        { id: 'cancellation', label: 'Cancellation', description: 'Get notified when an appointment is cancelled', email: true, sms: false, push: true },
        { id: 'payment', label: 'Payment Received', description: 'Get notified when payment is received', email: true, sms: false, push: false },
        { id: 'review', label: 'New Review', description: 'Get notified when a patient leaves a review', email: false, sms: false, push: true },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-xl border">
                <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                    <span>Notification</span>
                    <span className="text-center">Email</span>
                    <span className="text-center">SMS</span>
                    <span className="text-center">Push</span>
                </div>
                <div className="divide-y">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                            <div>
                                <p className="font-medium">{notif.label}</p>
                                <p className="text-xs text-muted-foreground">{notif.description}</p>
                            </div>
                            <div className="text-center">
                                <input type="checkbox" defaultChecked={notif.email} className="rounded" />
                            </div>
                            <div className="text-center">
                                <input type="checkbox" defaultChecked={notif.sms} className="rounded" />
                            </div>
                            <div className="text-center">
                                <input type="checkbox" defaultChecked={notif.push} className="rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
