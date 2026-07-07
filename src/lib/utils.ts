import { NextResponse } from "next/server";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateOrderNumber(): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KB-${rand}`;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function parseBody<T>(body: unknown): T {
  return body as T;
}
