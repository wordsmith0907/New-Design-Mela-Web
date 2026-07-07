import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Building2, User2, MessageSquare } from 'lucide-react';
import { DemoBooking } from '../types';

interface DemoSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function DemoScheduler({ isOpen, onClose, userEmail }: DemoSchedulerProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [form, setForm] = useState({
    name: '',
    email: userEmail || '',
    company: '',
    useCase: 'Liquid Staking Protocol',
  });

  const availableDates = [
    { day: 'Wed', num: '24', full: 'Wednesday, June 24' },
    { day: 'Thu', num: '25', full: 'Thursday, June 25' },
    { day: 'Fri', num: '26', full: 'Friday, June 26' },
    { day: 'Mon', num: '29', full: 'Monday, June 29' },
  ];

  const timeslots = ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'];

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) return;
    setStep(prev => prev + 1);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="scheduler-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-slate-950 text-white shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <div>
                  <h3 className="font-display text-lg font-bold">Book a Live Demo</h3>
                  <p className="text-xs text-slate-400">Discover custom liquid yield strategies for your firm</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            {step < 3 && (
              <div className="flex h-1 bg-slate-800">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            )}

            {/* Body */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-5">
                  {/* Select Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                      1. Select a Date
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {availableDates.map((date) => (
                        <button
                          key={date.num}
                          type="button"
                          onClick={() => setSelectedDate(date.full)}
                          className={`rounded-2xl border p-3.5 text-center transition-all ${
                            selectedDate === date.full
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-65">
                            {date.day}
                          </span>
                          <span className="block text-xl font-display font-black mt-1">{date.num}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                      2. Select a Time Slot (EDT)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeslots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-2 text-xs font-bold transition-all ${
                            selectedTime === time
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5 opacity-60" />
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 1 Footer */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      Next Step <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 rounded-2xl px-4 py-3 text-xs border border-white/5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" /> {selectedDate}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" /> {selectedTime}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Your Name</label>
                      <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-indigo-500 rounded-2xl px-3 py-2.5">
                        <User2 className="h-4 w-4 text-slate-500 shrink-0 mr-2" />
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your Name"
                          className="bg-transparent text-sm w-full outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Work Email</label>
                      <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-indigo-500 rounded-2xl px-3 py-2.5">
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="name@company.com"
                          className="bg-transparent text-sm w-full outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Company Name</label>
                      <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-indigo-500 rounded-2xl px-3 py-2.5">
                        <Building2 className="h-4 w-4 text-slate-500 shrink-0 mr-2" />
                        <input
                          type="text"
                          required
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="e.g. YieldLab"
                          className="bg-transparent text-sm w-full outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Primary Use Case</label>
                      <select
                        value={form.useCase}
                        onChange={(e) => setForm({ ...form, useCase: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-2xl p-3 text-sm outline-none text-white [&>option]:bg-slate-900"
                      >
                        <option value="Liquid Staking Protocol">Liquid Staking Protocol</option>
                        <option value="Smart Vault Yield Optimization">Smart Vault Yield Optimization</option>
                        <option value="Asset Redemptions & Collateral">Asset Redemptions & Collateral</option>
                        <option value="General Investment Demo">General Investment Demo</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 2 Footer */}
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-white/10 rounded-2xl hover:bg-white/5 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg"
                    >
                      Complete Booking
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg border border-emerald-500/20">
                    <CheckCircle className="h-10 w-10 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-extrabold text-xl text-white tracking-tight">Demo Booked successfully!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      We have sent a calendar invite with a Google Meet link to <span className="text-indigo-300 font-mono">{form.email}</span>.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left max-w-sm mx-auto space-y-1 text-xs">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Meeting Details</p>
                    <p className="font-display font-bold text-slate-100">Fluid Asset Streams Demo</p>
                    <p className="text-indigo-400 font-medium mt-1">{selectedDate} @ {selectedTime}</p>
                    <p className="text-slate-500">Host: Sarah Finch (Director of Growth)</p>
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-white text-slate-950 hover:opacity-90 text-xs font-bold rounded-xl transition-all shadow"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
