# Capstone brief — Clinic availability in US-001

## Situation

The original **US-001 OPD Patient Check-in Lite** prototype has passed review and been merged. OPD staff can already search/select a synthetic patient, choose a clinic, preview, and confirm a mock check-in. This follow-up changes **only the clinic-choice step** of that same flow.

Sometimes a clinic temporarily cannot accept a check-in. Staff must see that status before Preview and be able to choose another clinic without losing the selected patient or optional chief complaint. The prototype must never issue a synthetic queue number for an unavailable clinic or after an availability lookup error.

## Deterministic mock facts

| Clinic code | Label | Availability |
| --- | --- | --- |
| `GEN` | General Medicine | Available |
| `ENT` | Ear, Nose and Throat | Temporarily unavailable; explain this in plain language. The learner chooses the exact UI copy. |

The mock availability lookup also needs a reproducible **Error** scenario. In that scenario, block Preview, explain that availability could not be checked, and offer Retry. The Error scenario is **transient**: the first lookup attempt always fails and a Retry — the next attempt — succeeds, deterministically; without this a fixed error scenario would make every Retry fail and the flow could never continue. After an unavailable `ENT` choice, switching to `GEN` allows the existing flow to continue. After a lookup error, only a successful Retry allows it to continue.

The `GEN`/`ENT` codes are brief labels, not fixed ids — bind them to the clinic ids already in your merged work (for example `gen-med`) and add `ENT`; do not rename merged clinic ids.

## Boundaries

- Keep the original US-001 acceptance criteria working; extend the existing clinic choice instead of rebuilding search, patient selection, or confirmation.
- Use synthetic/mock data only. No backend, database, real clinic status, real queue allocation, authentication, or production integration.
- Show meaningful Available, Unavailable, and Error states in Storybook. The application must remain usable by keyboard and at a narrow mobile width.
- Do not add an end-user scenario switcher to the production page. Storybook can control mock scenarios for review.
- The learner writes a **new issue** linked to the original US-001 issue/MR, then uses a new branch/worktree and MR for this follow-up. Use that new issue number in the branch, commit footer, and MR `Closes` line.

## Learner decisions

Write acceptance criteria and a verification plan before asking the agent to implement. Decide the visible message, focus behavior, component/state boundary, and the smallest tests needed to prove that an unavailable or unknown clinic cannot reach Preview. Record any unresolved decision in the issue rather than letting the agent guess.

## ฉบับย่อภาษาไทย

งานนี้ **ต่อยอด US-001 เดิม** หลัง merge: เพิ่มสถานะคลินิกพร้อมรับ (`GEN`), ไม่พร้อมรับ (`ENT`) และตรวจสถานะไม่สำเร็จ (Error) ด้วย mock ที่ทำซ้ำได้ หากไม่พร้อมหรือเกิด Error ต้องไม่ไปหน้า Preview/ออกเลขคิว มีข้อความและทางเลือก Retry หรือเปลี่ยนคลินิก เมื่อเลือก `GEN` แล้วต้องเดิน flow เดิมต่อได้โดยข้อมูลผู้ป่วยและอาการเบื้องต้นไม่หาย

หมายเหตุ: รหัส `GEN`/`ENT` เป็นชื่อเรียกตาม brief ไม่ใช่ id ตายตัว — ผูกกับ id คลินิกที่มีอยู่ในงาน (เช่น `gen-med`) แล้วเพิ่ม `ENT` อย่า rename id เดิมที่ merge ไปแล้ว · Error scenario เป็นแบบ transient: attempt แรก fail เสมอ Retry = attempt ถัดไปสำเร็จ (deterministic) ไม่งั้น Retry จะไม่มีวันสำเร็จ

ผู้เรียนเปิด Issue ใหม่ที่ลิงก์กลับ US-001, เขียน AC เอง, ใช้ branch/worktree ใหม่, ตรวจ Storybook + flow จริง + regression ของ US-001 และส่ง MR ใหม่พร้อมหลักฐาน ห้ามต่อ backend หรือระบบคิวจริง
