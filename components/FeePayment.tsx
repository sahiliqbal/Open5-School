import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle, ChevronRight, DollarSign, Loader2, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { FeeInvoice } from '../types';
import { MOCK_FEES } from '../constants';

interface FeePaymentProps {
    isOpen: boolean;
    onClose: () => void;
}

type PaymentStep = 'REVIEW' | 'METHOD' | 'PROCESSING' | 'SUCCESS';

export const FeePayment: React.FC<FeePaymentProps> = ({ isOpen, onClose }) => {
    const [invoices, setInvoices] = useState<FeeInvoice[]>(MOCK_FEES);
    const [step, setStep] = useState<PaymentStep>('REVIEW');
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [processingStage, setProcessingStage] = useState(0); // 0: Connecting, 1: Verifying, 2: Finalizing

    // Reset state
    useEffect(() => {
        if (isOpen) {
            setInvoices(MOCK_FEES);
            setStep('REVIEW');
            setProcessingStage(0);
        }
    }, [isOpen]);

    const pendingInvoices = invoices.filter(inv => inv.status !== 'PAID');
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const totalDue = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const handleProcessPayment = () => {
        setStep('PROCESSING');
        // Simulate stages
        setTimeout(() => setProcessingStage(1), 1500);
        setTimeout(() => setProcessingStage(2), 3000);
        setTimeout(() => {
            // Success
            setInvoices(prev => prev.map(inv => ({ ...inv, status: 'PAID' })));
            setStep('SUCCESS');
        }, 4500);
    };

    if (!isOpen) return null;

    // Helper for Stepper
    const StepIndicator = () => (
        <div className="flex items-center justify-between px-8 mb-6 mt-2 relative">
            {[
                { id: 'REVIEW', label: 'Review' },
                { id: 'METHOD', label: 'Method' },
                { id: 'SUCCESS', label: 'Done' }
            ].map((s, idx) => {
                let status = 'inactive';
                if (step === s.id || (step === 'PROCESSING' && s.id === 'METHOD') || (step === 'SUCCESS')) status = 'complete';
                if (step === s.id) status = 'active';
                if (step === 'PROCESSING' && s.id === 'METHOD') status = 'active'; // visual keep
                if (step === 'SUCCESS' && s.id === 'SUCCESS') status = 'active';

                const isCompleted = (step === 'METHOD' && idx === 0) || (step === 'PROCESSING' && idx <= 1) || (step === 'SUCCESS');
                const isActive = (step === 'REVIEW' && idx === 0) || (step === 'METHOD' && idx === 1) || (step === 'PROCESSING' && idx === 1) || (step === 'SUCCESS' && idx === 2);

                return (
                    <div key={s.id} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                            isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 
                            isActive ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-300'
                        }`}>
                            {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold mt-1 transition-colors ${isActive || isCompleted ? 'text-indigo-600' : 'text-slate-300'}`}>{s.label}</span>
                    </div>
                );
            })}
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 mx-12 -z-0">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
                    style={{ 
                        width: step === 'REVIEW' ? '0%' : step === 'METHOD' ? '50%' : step === 'PROCESSING' ? '50%' : '100%' 
                    }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#F8F9FA] w-full sm:max-w-md h-[90vh] sm:h-[700px] rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                
                {/* Header */}
                <div className="px-6 pt-6 pb-2 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        {step === 'METHOD' && (
                            <button onClick={() => setStep('REVIEW')} className="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Fee Payment</h2>
                            <p className="text-xs text-slate-400 font-medium">Session 2024-25</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="relative pt-2 pb-4">
                     <StepIndicator />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
                    
                    {step === 'REVIEW' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Total Card */}
                            <div className="w-full bg-slate-900 rounded-[28px] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                                <div className="relative z-10 text-center py-2">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Outstanding</p>
                                    <h1 className="text-4xl font-bold mb-1 flex items-start justify-center gap-1">
                                        <span className="text-2xl mt-1 opacity-50">$</span>
                                        {totalDue.toLocaleString()}
                                    </h1>
                                    <p className="text-slate-500 text-xs mt-2 bg-slate-800/50 inline-block px-3 py-1 rounded-full border border-slate-700">Due Feb 28, 2024</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500 opacity-20 rounded-full blur-3xl transform -translate-x-5 translate-y-5"></div>
                            </div>

                            {/* Invoices List */}
                            <div>
                                <h3 className="text-slate-800 font-bold text-sm mb-3 uppercase tracking-wide opacity-50">Breakdown</h3>
                                {pendingInvoices.length > 0 ? (
                                    <div className="space-y-3">
                                        {pendingInvoices.map((inv) => (
                                            <div key={inv.id} className="bg-white p-4 rounded-[20px] shadow-sm border border-orange-100 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-700 text-sm">{inv.month}</h4>
                                                        <p className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">OVERDUE</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-slate-800">${inv.amount}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-[24px] border border-slate-100">
                                        <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
                                        <p className="text-slate-500 font-medium">No pending dues!</p>
                                    </div>
                                )}
                            </div>

                             {/* Paid History */}
                             {paidInvoices.length > 0 && (
                                <div className="opacity-60">
                                    <h3 className="text-slate-800 font-bold text-sm mb-3 uppercase tracking-wide opacity-50">History</h3>
                                    <div className="space-y-2">
                                        {paidInvoices.map((inv) => (
                                            <div key={inv.id} className="bg-white p-3 rounded-[16px] border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{inv.month}</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">Paid ${inv.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'METHOD' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-[20px] flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-indigo-400 font-bold uppercase">Paying Amount</p>
                                    <p className="text-2xl font-bold text-indigo-900">${totalDue.toLocaleString()}</p>
                                </div>
                                <ShieldCheck className="text-indigo-300" size={32} />
                            </div>

                            <div>
                                <h3 className="text-slate-800 font-bold text-base mb-4">Select Method</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'card', icon: CreditCard, title: 'Credit / Debit Card', desc: 'Visa ending in 4242' },
                                        { id: 'apple', icon: CheckCircle, title: 'Apple Pay', desc: 'Fast checkout' }, // reusing CheckCircle as mock
                                        { id: 'net', icon: DollarSign, title: 'Net Banking', desc: 'Chase, BoA, Wells' }
                                    ].map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => setSelectedMethod(m.id)}
                                            className={`w-full p-4 rounded-[20px] border transition-all flex items-center gap-4 text-left ${
                                                selectedMethod === m.id 
                                                ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                                                : 'bg-white border-slate-100 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedMethod === m.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <m.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-bold ${selectedMethod === m.id ? 'text-indigo-900' : 'text-slate-700'}`}>{m.title}</h4>
                                                <p className="text-xs text-slate-400">{m.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === m.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-200'}`}>
                                                {selectedMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 -mt-10 animate-in fade-in zoom-in duration-300">
                             <div className="relative">
                                 {/* Pulse rings */}
                                 <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                                 <div className="relative w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center p-2">
                                     <div className="w-full h-full border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <DollarSign size={32} className="text-indigo-600" />
                                     </div>
                                 </div>
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-slate-800 mb-2">
                                     {processingStage === 0 ? 'Connecting to Bank...' : 
                                      processingStage === 1 ? 'Verifying Credentials...' : 'Finalizing Payment...'}
                                 </h3>
                                 <p className="text-slate-400 text-sm">Please do not close this window</p>
                             </div>
                             
                             {/* Mock Progress Bar for stage */}
                             <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                                    style={{ width: `${(processingStage + 1) * 33}%` }}
                                 ></div>
                             </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-6 -mt-10 animate-in fade-in zoom-in duration-500">
                             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-2">
                                 <CheckCircle size={48} />
                             </div>
                             <div>
                                 <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
                                 <p className="text-slate-500 text-sm mt-1">Transaction ID: #TXN-883492</p>
                             </div>
                             
                             <div className="bg-white p-6 rounded-[24px] border border-slate-100 w-full shadow-sm">
                                 <div className="flex justify-between items-center mb-2 border-b border-slate-50 pb-2">
                                     <span className="text-slate-400 text-xs">Amount Paid</span>
                                     <span className="text-slate-800 font-bold">${totalDue.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center mb-2 border-b border-slate-50 pb-2">
                                     <span className="text-slate-400 text-xs">Date</span>
                                     <span className="text-slate-800 font-bold text-xs">{new Date().toLocaleDateString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                     <span className="text-slate-400 text-xs">Method</span>
                                     <span className="text-slate-800 font-bold text-xs uppercase">{selectedMethod}</span>
                                 </div>
                             </div>
                         </div>
                    )}

                </div>

                {/* Bottom Bar */}
                {step !== 'PROCESSING' && step !== 'SUCCESS' && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-20">
                        {step === 'REVIEW' && (
                            <button 
                                onClick={() => setStep('METHOD')}
                                disabled={totalDue === 0}
                                className="w-full py-4 rounded-[24px] font-bold text-lg bg-slate-900 text-white shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Pay Now <ChevronRight size={20} />
                            </button>
                        )}
                        {step === 'METHOD' && (
                            <button 
                                onClick={handleProcessPayment}
                                className="w-full py-4 rounded-[24px] font-bold text-lg bg-indigo-600 text-white shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Confirm Payment <ShieldCheck size={20} />
                            </button>
                        )}
                    </div>
                )}
                {step === 'SUCCESS' && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-20">
                         <button 
                            onClick={onClose}
                            className="w-full py-4 rounded-[24px] font-bold text-lg bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition-all"
                        >
                            Download Receipt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};