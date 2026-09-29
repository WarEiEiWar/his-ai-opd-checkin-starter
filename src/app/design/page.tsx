import Link from 'next/link';
import type { ReactNode } from 'react';
import { TrainingNotice } from '@/components/TrainingNotice';
import { PatientSearchResults } from '@/features/opd-checkin/PatientSearchResults';
import { patients } from '@/mocks/patients';

const focusClass = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600';

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 dark:border-white/20 dark:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SourceTag({ children, proposed = false }: { children: ReactNode; proposed?: boolean }) {
  return (
    <span className={proposed
      ? 'inline-flex rounded-full border border-amber-700/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-900 dark:text-amber-200'
      : 'inline-flex rounded-full border border-teal-700/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-800 dark:text-teal-200'}>
      {children}
    </span>
  );
}

function StateCard({ title, description, tone }: { title: string; description: string; tone: 'neutral' | 'info' | 'error' | 'validation' }) {
  const toneClass = {
    neutral: 'border-black/20 bg-black/[0.03] dark:border-white/25 dark:bg-white/5',
    info: 'border-teal-700/30 bg-teal-500/10',
    error: 'border-red-700/40 bg-red-500/10 text-red-900 dark:text-red-200',
    validation: 'border-red-700/50 bg-white text-red-900 dark:bg-white/5 dark:text-red-200',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </div>
  );
}

export default function DesignPage() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">Issue #5 · Human review</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">OPD Design System</h1>
          <p className="mt-3 max-w-3xl text-lg opacity-75">ฐานการออกแบบสำหรับ prototype นี้ แยกหลักฐานที่ยืนยันได้ออกจากรูปแบบที่เสนอเพื่อให้ทีมตรวจสอบก่อนนำไปใช้</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <SourceTag>ยืนยันจาก Source</SourceTag>
            <SourceTag proposed>Proposed pattern</SourceTag>
            <Link href="/opd/check-in" className={`rounded-xl border border-black/30 px-4 py-2 text-sm font-semibold dark:border-white/40 ${focusClass}`}>ไปหน้า OPD Check-in</Link>
          </div>
        </header>

        <TrainingNotice />

        <div className="grid gap-6 lg:grid-cols-2">
          <Section eyebrow="Confirmed · Existing code" title="Color foundation">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Page background', '#f6f8f7', 'bg-[#f6f8f7] text-[#19332e]'],
                ['Page foreground', '#19332e', 'bg-[#19332e] text-white'],
                ['Primary action', 'teal-700', 'bg-teal-700 text-white'],
                ['Dark surface', '#091411', 'bg-[#091411] text-[#e6f2ef]'],
              ].map(([name, value, classes]) => (
                <div key={name} className={`rounded-xl border border-black/15 p-4 dark:border-white/20 ${classes}`}>
                  <p className="font-semibold">{name}</p>
                  <p className="mt-1 text-sm opacity-80">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm opacity-75">ค่าเหล่านี้มาจาก global styles และ Component ปัจจุบัน ไม่ได้อ้างว่าเป็นค่าสีที่อ่านจากภาพแบบ exact</p>
          </Section>

          <Section eyebrow="Confirmed · Reference + code" title="Type and hierarchy">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Context label</p>
                <p className="mt-2 text-4xl font-bold tracking-tight">หัวข้อหน้าหลัก</p>
                <p className="mt-2 max-w-xl opacity-75">ข้อความอธิบายสั้นเพื่อบอกเป้าหมายของหน้าและช่วยให้ผู้ใช้เริ่มงานได้อย่างมั่นใจ</p>
              </div>
              <div className="border-t border-black/10 pt-4 dark:border-white/20">
                <p className="text-xl font-bold">หัวข้อ Panel</p>
                <p className="mt-1 text-sm opacity-75">Label และข้อความรองใช้ความเข้มลดหลั่นจากหัวข้อ</p>
              </div>
            </div>
          </Section>
        </div>

        <Section eyebrow="Confirmed · Existing components" title="Reusable product patterns">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-bold">Form controls</h3>
              <label htmlFor="design-search" className="mt-4 block text-sm font-semibold">HN หรือชื่อผู้ป่วย</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input id="design-search" defaultValue="65000123" className={`min-w-0 flex-1 rounded-xl border border-black/50 bg-transparent px-4 py-3 dark:border-white/30 ${focusClass}`} />
                <button type="button" className={`rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white ${focusClass}`}>ค้นหา</button>
              </div>
              <p className="mt-2 text-sm opacity-75">Label ต้องมองเห็นได้ และ Control ต้องมี visible focus</p>
            </div>
            <div>
              <h3 className="font-bold">Patient results</h3>
              <div className="mt-4">
                <PatientSearchResults patients={patients.slice(0, 2)} />
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow="Proposed · Human review required" title="Requirement states">
          <p className="max-w-3xl text-sm opacity-75">Requirement กำหนดว่าต้องมีสถานะเหล่านี้ แต่ Visual Reference ไม่ได้กำหนดหน้าตา ตัวอย่างด้านล่างเป็นแนวทางนำเสนอเท่านั้น ไม่เพิ่ม business rule ใหม่</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StateCard tone="info" title="กำลังค้นหา…" description="วางสถานะใกล้พื้นที่ผลลัพธ์ และคงบริบทของผู้ใช้ไว้" />
            <StateCard tone="neutral" title="ไม่พบผู้ป่วย" description="บอกว่าการค้นหาเสร็จแล้วและไม่มีผลลัพธ์" />
            <StateCard tone="error" title="ค้นหาไม่สำเร็จ" description="อธิบายปัญหาแบบสั้น พร้อม Action ลองอีกครั้ง" />
            <StateCard tone="validation" title="กรุณาเลือกคลินิก" description="ข้อความอยู่ใกล้ Field และไม่ใช้สีเป็นสัญญาณเพียงอย่างเดียว" />
          </div>
        </Section>

        <Section eyebrow="Proposed · Accessibility + responsive" title="Focus and mobile rules">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-bold">Visible focus</h3>
              <p className="mt-2 text-sm opacity-75">เสนอใช้ outline สี teal ขนาด 2px พร้อม offset กับทุก Control เพื่อรองรับ AC13</p>
              <button type="button" className={`mt-4 rounded-xl border border-black/40 px-5 py-3 font-semibold dark:border-white/40 ${focusClass}`}>กด Tab เพื่อดู Focus</button>
            </div>
            <div>
              <h3 className="font-bold">Narrow viewport</h3>
              <p className="mt-2 text-sm opacity-75">เสนอให้ Panel และ Action เรียงหนึ่งคอลัมน์เมื่อพื้นที่แคบ เพื่อรองรับ AC14 โดยไม่กำหนดลำดับ Flow เพิ่มจาก Requirement</p>
              <div className="mt-4 rounded-xl border border-black/20 p-4 text-sm dark:border-white/25">
                <div className="rounded-lg bg-teal-500/10 p-3">Page header</div>
                <div className="mt-2 rounded-lg bg-teal-500/10 p-3">Search panel</div>
                <div className="mt-2 rounded-lg bg-teal-500/10 p-3">Check-in panel</div>
              </div>
            </div>
          </div>
        </Section>

        <footer className="pb-4 text-sm opacity-70">
          <p>Source of truth: US-001 requirement · Visual direction: OPD check-in reference · Full rationale: DESIGN.md</p>
        </footer>
      </div>
    </main>
  );
}
