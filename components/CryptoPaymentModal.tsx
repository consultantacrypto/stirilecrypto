'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Globe, Copy, Zap, Layers, Mail, ArrowRight, BrainCircuit } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import emailjs from '@emailjs/browser';

// --- CONFIGURARE PORTOFELE ---
const RECIPIENT_WALLET = "0xdeab68fb2be0f1756ee61ac87f4d72527ad18e3d";
const MY_EMAIL = "consultantacrypto.ro@gmail.com";

// --- ✅ CONFIGURARE EMAILJS (COMPLETĂ) ---
const EMAILJS_SERVICE_ID = "service_ctx4uog"; // ✅ ID-ul Tău
const EMAILJS_TEMPLATE_ID = "template_1gs1u0i"; // ✅ ID-ul Template-ului
const EMAILJS_PUBLIC_KEY = "kgEy0emPtv1Fs89Gb"; // ✅ Cheia Publică

const WALLETS = {
  EVM: RECIPIENT_WALLET,
  TRON: "TU82iRPFDmQsGuwSvZQ64atQZCfmu8aFFA",
  SOLANA: "HDyrwRnhiHWu8f1AF95ETp8nhDbeovW2SnZ7ThD8m2bk"
};

const USDT_CONTRACTS: { [key: number]: string } = {
  1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  56: "0x55d398326f99059ff775485246999027b3197955",
  137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  8453: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
};

const ERC20_ABI = [
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  type: 'course' | 'consultancy';
}

export default function CryptoPaymentModal({ isOpen, onClose, title, price, type }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [copied, setCopied] = useState(false);
  const [manualSent, setManualSent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [targetNetwork, setTargetNetwork] = useState<string>("");

  useEffect(() => {
    if (chainId === 1) setTargetNetwork("Ethereum");
    else if (chainId === 56) setTargetNetwork("BSC (Binance)");
    else if (chainId === 137) setTargetNetwork("Polygon");
    else if (chainId === 42161) setTargetNetwork("Arbitrum");
    else if (chainId === 8453) setTargetNetwork("Base");
    else setTargetNetwork("Nesuportată");
  }, [chainId]);

  // --- 🚀 SISTEM DE NOTIFICARE AUTOMATĂ ---
  const sendAutomatedEmail = (txHash: string, method: string) => {
    if (emailStatus === 'sent' || emailStatus === 'sending') return;
    
    setEmailStatus('sending');

    const templateParams = {
        type: type === 'course' ? 'CURS PREMIUM' : 'CONSULTANTA VIP',
        title: title,
        amount: price,
        method: method,
        wallet_address: address || 'Anonim (Manual)',
        tx_hash: txHash,
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then((response) => {
        console.log('EMAIL SENT SUCCESS!', response.status, response.text);
        setEmailStatus('sent');
      }, (err) => {
        console.log('EMAIL FAILED...', err);
        setEmailStatus('error');
      });
  };

  // 1. Trigger la Plata Automată (EVM)
  useEffect(() => {
    if (isConfirmed && hash) {
        trackSuccess();
        sendAutomatedEmail(hash, `Auto EVM (${targetNetwork})`);
    }
  }, [isConfirmed, hash]);

  // 2. Trigger la Plata Manuală
  const handleManualSent = () => {
      setManualSent(true);
      trackSuccess();
      sendAutomatedEmail('Transfer Manual (Vezi Wallet)', 'Manual (TRON/SOL)');
  };

  const trackSuccess = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: `tx_${Date.now()}`,
        value: price,
        currency: 'USD',
        items: [{ item_name: title, item_category: type }]
      });
    }
  };

  const handleClose = () => {
    if (!isConfirmed && !manualSent) {
       // Tracking Abandon
    }
    onClose();
  };

  const handlePayment = () => {
    if (!isConnected) return;
    const contractAddress = USDT_CONTRACTS[chainId];
    if (!contractAddress) {
      alert("Schimbă rețeaua pe ETH, BSC sau Polygon.");
      return;
    }
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [WALLETS.EVM as `0x${string}`, parseUnits(price.toString(), 6)],
      });
    } catch (e) { console.error(e); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // --- ECRAN DE SUCCES (SPACESHIP MODE) ---
  if (isConfirmed || manualSent) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose}/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#0f1629] border border-green-500/50 w-full max-w-md p-8 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.2)] text-center overflow-hidden">
                
                {/* Background Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>

                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 size={40}/>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">PLATĂ REUȘITĂ!</h3>
                <p className="text-gray-400 mb-8 text-sm">Banii au intrat. Accesul se pregătește.</p>
                
                {/* Status Notificare Automată */}
                <div className="bg-[#0a0f1e] border border-white/5 p-4 rounded-xl mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sistem Notificare</span>
                        {emailStatus === 'sending' && <Loader2 size={14} className="animate-spin text-blue-400"/>}
                        {emailStatus === 'sent' && <CheckCircle2 size={14} className="text-green-400"/>}
                        {emailStatus === 'error' && <X size={14} className="text-red-400"/>}
                    </div>
                    
                    {emailStatus === 'sending' && <p className="text-sm text-blue-400 font-medium">Se trimite alerta către Mihai...</p>}
                    {emailStatus === 'sent' && <p className="text-sm text-green-400 font-bold">Mihai a fost notificat instant! 🚀</p>}
                    {emailStatus === 'error' && <p className="text-sm text-red-400">Eroare server. Trimite un mail manual.</p>}
                </div>

                <div className="bg-blue-900/20 border-l-2 border-blue-500 p-4 rounded-r-xl text-left mb-6">
                    <h4 className="text-blue-200 font-bold text-xs uppercase mb-1 flex items-center gap-2"><Mail size={14}/> Ultimul Pas:</h4>
                    <p className="text-sm text-gray-300">
                        Trimite un email scurt la <b>{MY_EMAIL}</b> cu <b>adresa ta de Gmail</b> (pentru acces la materialele private).
                    </p>
                </div>

                <a href={`mailto:${MY_EMAIL}?subject=CONFIRMARE ACCES - ${title}&body=Salut, am efectuat plata. Adresa mea de Gmail este:`} className="w-full py-4 bg-white text-black font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] mb-4">
                    Trimite Gmail-ul Tău <ArrowRight size={18}/>
                </a>
                
                <button onClick={handleClose} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">Închide Fereastra</button>
            </motion.div>
        </div>
      )
  }

  // --- ECRAN DE PLATĂ (MODAL) ---
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose} />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0f1629] border border-blue-500/30 w-full max-w-lg p-0 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 bg-[#0a0f1e] border-b border-white/5 relative">
                <button onClick={handleClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24}/></button>
                <h3 className="text-xl font-bold text-white text-center">Alege metoda de plată</h3>
                <p className="text-center text-gray-400 text-sm mt-1">{title}</p>
                <div className="mt-2 text-center text-3xl font-mono font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                    ${price} USDT
                </div>
            </div>

            <div className="flex p-2 bg-[#050810]">
                <button onClick={() => setActiveTab('auto')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'auto' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white'}`}><Zap size={16}/> Automat (EVM)</button>
                <button onClick={() => setActiveTab('manual')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white'}`}><Layers size={16}/> Manual (Tron/Sol)</button>
            </div>

            <div className="p-8 pb-4">
                {activeTab === 'auto' && (
                    <div className="space-y-6">
                        {!isConnected ? (
                            <div className="text-center py-4">
                                <p className="text-gray-300 mb-6 text-sm">Conectează wallet-ul pentru plată instant.</p>
                                <div className="flex justify-center transform scale-110"><ConnectButton /></div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Globe size={18} className="text-blue-400"/><span className="text-sm text-gray-300">Rețea Activă:</span></div>
                                    <span className="font-bold text-white text-sm bg-blue-500/20 px-3 py-1 rounded-lg">{targetNetwork || "Unknown"}</span>
                                </div>
                                {!isPending && !isConfirming && (
                                    <button onClick={handlePayment} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                                        Confirmă Plata
                                    </button>
                                )}
                                {isPending && <div className="text-center text-blue-400 font-bold animate-pulse"><Loader2 className="animate-spin mx-auto mb-2"/> Confirmă în Metamask...</div>}
                                {isConfirming && <div className="text-center text-yellow-400 font-bold animate-pulse"><Loader2 className="animate-spin mx-auto mb-2"/> Se procesează pe Blockchain...</div>}
                                {writeError && <div className="text-center text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">Eroare: Fonduri insuficiente sau tranzacție anulată.</div>}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'manual' && (
                    <div className="space-y-6">
                        <div className="text-center mb-4"><p className="text-sm text-gray-400">Trimite exact <b>${price} USDT</b> la una din adrese:</p></div>
                        
                        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-white/5 hover:border-red-500/50 transition-all group cursor-pointer" onClick={() => copyToClipboard(WALLETS.TRON)}>
                            <div className="flex justify-between items-center mb-2"><span className="text-red-500 font-bold text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> TRON (TRC-20)</span><Copy size={16} className="text-gray-500 group-hover:text-white"/></div>
                            <div className="font-mono text-xs text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">{WALLETS.TRON}</div>
                        </div>
                        
                        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-white/5 hover:border-purple-500/50 transition-all group cursor-pointer" onClick={() => copyToClipboard(WALLETS.SOLANA)}>
                            <div className="flex justify-between items-center mb-2"><span className="text-purple-500 font-bold text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> SOLANA</span><Copy size={16} className="text-gray-500 group-hover:text-white"/></div>
                            <div className="font-mono text-xs text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">{WALLETS.SOLANA}</div>
                        </div>

                        {copied && <div className="text-center text-green-500 text-xs font-bold animate-bounce">Adresă Copiată în Clipboard!</div>}
                        
                        <button onClick={handleManualSent} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl mt-2 border border-white/10 hover:border-white/30 transition-all">
                            Am efectuat transferul
                        </button>
                    </div>
                )}
            </div>

            {/* AI Upsell */}
            <div className="p-4 bg-[#0a0f1e]/80 border-t border-white/5 text-center backdrop-blur-sm">
                <a href="/#ai" onClick={handleClose} className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-widest opacity-70 hover:opacity-100">
                    <BrainCircuit size={12}/> Powered by Mihai AI
                </a>
            </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
} 