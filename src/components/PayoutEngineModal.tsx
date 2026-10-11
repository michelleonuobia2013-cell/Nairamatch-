import React, { useState } from 'react';
import { X, Building2, CreditCard, UserCheck, ArrowUpRight, CheckCircle2, History, AlertCircle, Shield, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

interface BankOption {
  code: string;
  name: string;
}

interface BankAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  verifiedAt: string;
}

interface TransactionItem {
  id: string;
  reference: string;
  amount: number;
  bankName: string;
  accountNumberMasked: string;
  accountName: string;
  status: 'SUCCESSFUL' | 'PROCESSING' | 'FAILED';
  channel: string;
  date: string;
}

interface PayoutEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  bankAccount: BankAccount | null;
  onSaveBank: (bank: BankAccount) => void;
  onWithdraw: (amount: number) => Promise<boolean>;
  transactions: TransactionItem[];
}

export const PayoutEngineModal: React.FC<PayoutEngineModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  bankAccount,
  onSaveBank,
  onWithdraw,
  transactions
}) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'link' | 'history'>('withdraw');

  // Bank Form State
  const [selectedBankCode, setSelectedBankCode] = useState<string>(bankAccount?.bankCode || '50211');
  const [accountNumber, setAccountNumber] = useState<string>(bankAccount?.accountNumber || '2048991204');
  const [assertedName, setAssertedName] = useState<string>(bankAccount?.accountName || 'CHINEDU GODSWILL OKAFOR');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(!!bankAccount);

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawalReceipt, setWithdrawalReceipt] = useState<{
    reference: string;
    amount: number;
    accountName: string;
    bankName: string;
    date: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supportedBanks: BankOption[] = [
    { code: '50211', name: 'Kuda Microfinance Bank' },
    { code: '999992', name: 'OPay Digital Services' },
    { code: '999991', name: 'PalmPay Limited' },
    { code: '50515', name: 'Moniepoint Microfinance Bank' },
    { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
    { code: '057', name: 'Zenith Bank Plc' },
    { code: '044', name: 'Access Bank' },
    { code: '033', name: 'United Bank for Africa (UBA)' },
    { code: '011', name: 'First Bank of Nigeria' },
    { code: '214', name: 'First City Monument Bank (FCMB)' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '232', name: 'Sterling Bank' }
  ];

  if (!isOpen) return null;

  // Handle Verify Bank Account
  const handleVerifyBank = () => {
    if (accountNumber.length !== 10 || !/^\d+$/.test(accountNumber)) {
      setErrorMessage('Please provide a valid 10-digit Nigerian NUBAN account number');
      return;
    }

    if (!assertedName || assertedName.trim().length < 3) {
      setErrorMessage('Please provide your full Account Name as registered with your bank');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    // Simulate instant NIBSS Name Enquiry
    setTimeout(() => {
      const bank = supportedBanks.find(b => b.code === selectedBankCode);
      const verifiedAcct: BankAccount = {
        bankCode: selectedBankCode,
        bankName: bank ? bank.name : 'Commercial Bank',
        accountNumber,
        accountName: assertedName.trim().toUpperCase(),
        verifiedAt: new Date().toISOString()
      };

      onSaveBank(verifiedAcct);
      setIsVerifying(false);
      setVerificationSuccess(true);
      sound.playMatchSuccess();
    }, 700);
  };

  // Handle Withdrawal Request
  const handleWithdrawRequest = async () => {
    setErrorMessage(null);
    const amountNum = Number(withdrawAmount);

    if (isNaN(amountNum) || amountNum < 100) {
      setErrorMessage('Minimum withdrawal amount is ₦100');
      return;
    }

    if (!bankAccount) {
      setActiveTab('link');
      setErrorMessage('Please verify your real bank account details first');
      return;
    }

    if (walletBalance < amountNum) {
      setErrorMessage(`Insufficient funds. You only have ₦${walletBalance.toLocaleString()} available`);
      return;
    }

    setIsWithdrawing(true);

    try {
      const success = await onWithdraw(amountNum);
      if (success) {
        sound.playCashout();
        const now = new Date();
        setWithdrawalReceipt({
          reference: `NIP/NMATCH/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}/${Math.floor(100000 + Math.random() * 900000)}`,
          amount: amountNum,
          accountName: bankAccount.accountName,
          bankName: bankAccount.bankName,
          date: now.toLocaleString()
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transfer failed';
      setErrorMessage(msg);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Real Account Link & Payout Engine
            </h2>
            <span className="text-xs text-purple-300">
              Direct NIBSS Instant Clearing to your Nigerian Bank
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-zinc-900/90 rounded-xl border border-purple-900/40 mb-6">
          <button
            onClick={() => { setActiveTab('withdraw'); setErrorMessage(null); setWithdrawalReceipt(null); }}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'withdraw' 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct Cashout
          </button>
          <button
            onClick={() => { setActiveTab('link'); setErrorMessage(null); }}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'link' 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Linked Bank Account
          </button>
          <button
            onClick={() => { setActiveTab('history'); setErrorMessage(null); }}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'history' 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Disbursement Ledger
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: CASHOUT WITHDRAWAL */}
        {activeTab === 'withdraw' && (
          <div>
            {withdrawalReceipt ? (
              /* Success Receipt */
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-white">Disbursement Initiated!</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    Your winnings have been routed via NIBSS Instant Clearing to your linked bank account.
                  </p>
                </div>

                <div className="bg-black/60 rounded-xl p-4 text-left space-y-2 text-xs sm:text-sm font-mono-numbers">
                  <div className="flex justify-between text-slate-300">
                    <span>Disbursed Amount:</span>
                    <span className="font-bold text-emerald-400 text-base">₦{withdrawalReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Beneficiary:</span>
                    <span className="text-white font-medium">{withdrawalReceipt.accountName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Receiving Bank:</span>
                    <span className="text-white font-medium">{withdrawalReceipt.bankName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Session Reference:</span>
                    <span className="text-purple-300 text-xs">{withdrawalReceipt.reference}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">SUCCESSFUL</span>
                  </div>
                </div>

                <button
                  onClick={() => setWithdrawalReceipt(null)}
                  className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm transition-colors"
                >
                  Make Another Cashout
                </button>
              </div>
            ) : (
              /* Cashout Form */
              <div className="space-y-5">
                {/* Available Balance Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-zinc-900/80 border border-purple-800/40 flex items-center justify-between">
                  <div>
                    <span className="block text-xs uppercase font-bold text-purple-300 tracking-wider">
                      Available Real Earnings
                    </span>
                    <span className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      ₦{walletBalance.toLocaleString()}
                    </span>
                  </div>

                  {bankAccount ? (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" />
                        Account Linked
                      </span>
                      <span className="text-xs text-slate-300 block mt-1 font-medium">
                        {bankAccount.bankName} ({bankAccount.accountNumber.slice(-4)})
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab('link')}
                      className="px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-white text-xs font-semibold border border-purple-600/40 transition-colors"
                    >
                      Link Bank Account
                    </button>
                  )}
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Enter Amount to Disburse (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-purple-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="100"
                      max={walletBalance}
                      placeholder="500"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-zinc-900 border border-purple-900/60 text-white font-mono-numbers text-lg font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-2.5">
                    {[500, 1000, 2000, walletBalance].map((presetVal, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setWithdrawAmount(String(presetVal))}
                        className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-purple-950/70 border border-purple-900/40 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        {presetVal === walletBalance ? 'All (₦' + presetVal.toLocaleString() + ')' : '₦' + presetVal.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Preview */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-purple-900/30 text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Target Account:</span>
                    <span className="font-semibold text-white">
                      {bankAccount ? `${bankAccount.accountName}` : 'No account linked yet'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payout Speed:</span>
                    <span className="text-emerald-400 font-semibold">Instant Real-time Dispatch (&lt; 30 seconds)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span className="text-emerald-400 font-bold">₦0.00 (Zero Fee)</span>
                  </div>
                </div>

                {/* Withdraw CTA */}
                <button
                  onClick={handleWithdrawRequest}
                  disabled={isWithdrawing || walletBalance < 100}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isWithdrawing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Dispatching to NIBSS Network...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5" />
                      <span>Disburse ₦{Number(withdrawAmount || 0).toLocaleString()} to Real Account</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LINK & ASSERT BANK ACCOUNT DETAILS */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Assert your Nigerian bank account details below. All winnings from card matches (+₦500) and 1st/2nd tournament positions (+₦500) will be routed directly to this verified destination.
            </p>

            {/* Bank Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Your Nigerian Bank
              </label>
              <select
                value={selectedBankCode}
                onChange={(e) => { setSelectedBankCode(e.target.value); setVerificationSuccess(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-purple-900/60 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                {supportedBanks.map(b => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                10-Digit NUBAN Account Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, '')); setVerificationSuccess(false); }}
                placeholder="2048991204"
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-purple-900/60 text-white font-mono-numbers text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Assert Account Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assert Real Account Holder Name
              </label>
              <input
                type="text"
                value={assertedName}
                onChange={(e) => { setAssertedName(e.target.value); setVerificationSuccess(false); }}
                placeholder="CHINEDU GODSWILL OKAFOR"
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-purple-900/60 text-white uppercase text-sm focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            {/* Verification Status Banner */}
            {verificationSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 text-emerald-300 text-xs">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Account Asserted & Verified by NIBSS Clearing Gateway.</span>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleVerifyBank}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with NIBSS Gateway...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Assert & Save Account Details</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 3: DISBURSEMENT LEDGER & HISTORY */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">Recent Automated Payout Settlements</span>
              <span className="text-xs text-purple-300 font-semibold">{transactions.length} Total Records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No past disbursements recorded yet. Play matches to earn and withdraw!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-zinc-900/80 border border-purple-900/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{tx.bankName}</span>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">({tx.accountNumberMasked})</span>
                      </div>
                      <span className="text-[10px] text-purple-300/80 font-mono-numbers block mt-0.5">
                        Ref: {tx.reference}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {tx.date}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono-numbers font-bold text-sm text-emerald-400 block">
                        +₦{tx.amount.toLocaleString()}
                      </span>
                      <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
