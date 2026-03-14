import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goalName, cost, years, inflation, returns, futureValue, sip } = body;

    const savedGoal = await prisma.goal.create({
      data: {
        goalName: goalName || "My Goal",
        currentCost: Number(cost),
        years: Number(years),
        inflation: Number(inflation),
        expectedReturns: Number(returns),
        futureValue: Number(futureValue),
        monthlySIP: Number(sip),
      },
    });

    return NextResponse.json({ message: "Goal Saved Successfully!", data: savedGoal }, { status: 200 });
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ message: "Error saving goal" }, { status: 500 });
  }
}