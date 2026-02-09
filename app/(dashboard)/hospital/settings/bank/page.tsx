'use client';
import { CreditCard, Building, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HospitalBankSettingsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Bank Account Details
                    </CardTitle>
                    <CardDescription>
                        Enter your bank account information for receiving weekly settlements.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="account_holder">Account Holder Name</Label>
                            <Input id="account_holder" placeholder="e.g. Apollo Hospital Pvt Ltd" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account_number">Account Number</Label>
                            <Input id="account_number" type="password" placeholder="xxxxxxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ifsc">IFSC Code</Label>
                            <Input id="ifsc" placeholder="HDFS0000123" className="uppercase" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_name">Bank Name</Label>
                            <Input id="bank_name" placeholder="e.g. HDFC Bank" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pan">PAN Number</Label>
                            <Input id="pan" placeholder="ABCDE1234F" className="uppercase" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gstin">GSTIN (Optional)</Label>
                            <Input id="gstin" placeholder="22AAAAA0000A1Z5" className="uppercase" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button>Save Bank Details</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-green-600" />
                        Settlement Information
                    </CardTitle>
                    <CardDescription>
                        Understanding your payout cycle
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Settlements are processed weekly every Monday.</p>
                    <p>• Minimum payout amount is ₹500.</p>
                    <p>• Platform fees (10%) are deducted automatically before settlement.</p>
                    <p>• Updates to bank details will be verified within 24 hours.</p>
                </CardContent>
            </Card>
        </div>
    );
}
