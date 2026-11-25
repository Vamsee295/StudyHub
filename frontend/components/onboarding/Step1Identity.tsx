import React from 'react';
import { UserIdentity } from '@/types';
import { ChevronDown } from 'lucide-react';

interface Step1IdentityProps {
  data: UserIdentity;
  update: (updates: Partial<UserIdentity>) => void;
}

export default function Step1Identity({ data, update }: Step1IdentityProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="display text-[32px] md:text-[38px]">About you</h2>
        <p className="text-sm text-mute leading-relaxed">
          Your college and graduation year, so the roadmap fits your placement season.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-xs font-mono font-semibold uppercase tracking-wider text-body">
            Full Name <span className="text-accent-ink">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={data.fullName || ''}
            onChange={(e) => update({ fullName: e.target.value })}
            className="w-full bg-paper-2/60 border-[1.5px] border-hair rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-card transition-all"
          />
        </div>

        {/* College / University */}
        <div className="flex flex-col gap-2">
          <label htmlFor="college" className="text-xs font-mono font-semibold uppercase tracking-wider text-body">
            College / University <span className="text-accent-ink">*</span>
          </label>
          <input
            id="college"
            type="text"
            placeholder="e.g. Indian Institute of Technology"
            value={data.college || ''}
            onChange={(e) => update({ college: e.target.value })}
            className="w-full bg-paper-2/60 border-[1.5px] border-hair rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-card transition-all"
          />
        </div>

        {/* Degree / Discipline */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="degree" className="text-xs font-mono font-semibold uppercase tracking-wider text-body">
            Degree &amp; Discipline
          </label>
          <div className="relative">
            <select
              id="degree"
              value={data.degree || 'B.Tech — Computer Science & Engineering'}
              onChange={(e) => update({ degree: e.target.value })}
              className="w-full bg-paper-2/60 border-[1.5px] border-hair rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-card transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="B.Tech — Computer Science & Engineering">B.Tech — Computer Science & Engineering</option>
              <option value="B.Tech — Information Technology">B.Tech — Information Technology</option>
              <option value="B.Tech — Electronics & Communication">B.Tech — Electronics & Communication</option>
              <option value="B.Tech — Electrical Engineering">B.Tech — Electrical Engineering</option>
              <option value="B.Tech — Mechanical Engineering">B.Tech — Mechanical Engineering</option>
              <option value="M.Tech / MS">M.Tech / MS</option>
              <option value="BCA / MCA">BCA / MCA</option>
              <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="w-4 h-4 text-mute absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Graduation Year */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gradYear" className="text-xs font-mono font-semibold uppercase tracking-wider text-body">
            Graduation Year
          </label>
          <div className="relative">
            <select
              id="gradYear"
              value={data.graduationYear || '2026'}
              onChange={(e) => update({ graduationYear: e.target.value })}
              className="w-full bg-paper-2/60 border-[1.5px] border-hair rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-card transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
            <ChevronDown className="w-4 h-4 text-mute absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Target Drive Cycle */}
        <div className="flex flex-col gap-2">
          <label htmlFor="driveCycle" className="text-xs font-mono font-semibold uppercase tracking-wider text-body">
            Target Drive Cycle
          </label>
          <div className="relative">
            <select
              id="driveCycle"
              value={data.driveCycle || 'Campus & Off-Campus 2026–27'}
              onChange={(e) => update({ driveCycle: e.target.value })}
              className="w-full bg-paper-2/60 border-[1.5px] border-hair rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-card transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="Campus & Off-Campus 2024–25">Campus & Off-Campus 2024–25</option>
              <option value="Campus & Off-Campus 2025–26">Campus & Off-Campus 2025–26</option>
              <option value="Campus & Off-Campus 2026–27">Campus & Off-Campus 2026–27</option>
              <option value="Immediate Off-Campus / Lateral">Immediate Off-Campus / Lateral</option>
            </select>
            <ChevronDown className="w-4 h-4 text-mute absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
