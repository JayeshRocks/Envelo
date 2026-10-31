import { describe, it, expect } from 'vitest';
import { toPaise, formatINR } from './currency';
import type { AllocationHistoryEntry } from '@/hooks/useEnvelopes';

describe('Envelope Allocation Undo Engine & Invariants', () => {
  it('creates exact allocation history entry with bigint precision', () => {
    const previousPaise = toPaise('2500.50'); // 2,50,050 paise
    const newPaise = toPaise('5000.00'); // 5,00,000 paise

    const entry: AllocationHistoryEntry = {
      id: 'test-undo-1',
      envelopeId: 'env-groceries',
      envelopeName: 'Groceries',
      previousAllocatedPaise: previousPaise,
      newAllocatedPaise: newPaise,
      periodKey: '2026-11',
      timestamp: Date.now(),
    };

    expect(entry.previousAllocatedPaise).toBe(250050n);
    expect(entry.newAllocatedPaise).toBe(500000n);
    expect(formatINR(entry.previousAllocatedPaise)).toContain('2,500.50');
    expect(formatINR(entry.newAllocatedPaise)).toContain('5,000.00');
  });

  it('calculates allocation deltas accurately without IEEE-754 floating point drift', () => {
    const initialPaise = toPaise('1000.10'); // 1,00,010 paise
    const updatedPaise = toPaise('3000.30'); // 3,00,030 paise

    const delta = updatedPaise - initialPaise;
    expect(delta).toBe(200020n); // exactly ₹2,000.20

    const reductionPaise = toPaise('500.00');
    const negativeDelta = reductionPaise - initialPaise;
    expect(negativeDelta).toBe(-50010n);
  });

  it('manages LIFO undo stack correctly for sequential allocations', () => {
    const stack: AllocationHistoryEntry[] = [];

    const pushAllocation = (
      envId: string,
      envName: string,
      prev: bigint,
      next: bigint,
      period: string
    ) => {
      if (prev === next) return;
      stack.unshift({
        id: Math.random().toString(),
        envelopeId: envId,
        envelopeName: envName,
        previousAllocatedPaise: prev,
        newAllocatedPaise: next,
        periodKey: period,
        timestamp: Date.now(),
      });
      if (stack.length > 10) stack.pop();
    };

    // Action 1: Groceries 0 -> 2,000
    pushAllocation('env-1', 'Groceries', 0n, 200000n, '2026-11');
    expect(stack.length).toBe(1);
    expect(stack[0].envelopeName).toBe('Groceries');
    expect(stack[0].previousAllocatedPaise).toBe(0n);

    // Action 2: Utilities 1,000 -> 3,500
    pushAllocation('env-2', 'Utilities', 100000n, 350000n, '2026-11');
    expect(stack.length).toBe(2);
    expect(stack[0].envelopeName).toBe('Utilities');

    // Action 3: No-op allocation (same amount) shouldn't pollute undo stack
    pushAllocation('env-2', 'Utilities', 350000n, 350000n, '2026-11');
    expect(stack.length).toBe(2);

    // Undo 1: Pops Utilities and restores 1,000
    const undone1 = stack.shift();
    expect(undone1?.envelopeName).toBe('Utilities');
    expect(undone1?.previousAllocatedPaise).toBe(100000n);
    expect(stack.length).toBe(1);

    // Undo 2: Pops Groceries and restores 0
    const undone2 = stack.shift();
    expect(undone2?.envelopeName).toBe('Groceries');
    expect(undone2?.previousAllocatedPaise).toBe(0n);
    expect(stack.length).toBe(0);

    // Undo 3: Empty stack returns undefined
    const undone3 = stack.shift();
    expect(undone3).toBeUndefined();
  });

  it('reverses envelope transfer with net-zero balance distortion', () => {
    let spendablePaise = 1000000n; // ₹10,000
    let gymPaise = 200000n; // ₹2,000
    const transferAmount = 150000n; // ₹1,500

    // Forward transfer: Move ₹1,500 from Spendable to Gym
    spendablePaise -= transferAmount;
    gymPaise += transferAmount;
    expect(spendablePaise).toBe(850000n);
    expect(gymPaise).toBe(350000n);

    // Undo transfer: Move ₹1,500 from Gym back to Spendable
    gymPaise -= transferAmount;
    spendablePaise += transferAmount;
    expect(spendablePaise).toBe(1000000n);
    expect(gymPaise).toBe(200000n);
  });
});
