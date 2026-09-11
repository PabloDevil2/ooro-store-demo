#!/bin/bash

# Ooro Store Demo — Quick Start Script
# This script sets up and runs the dashboard locally

set -e

echo "🚀 Ooro Store Demo — Starting..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
echo "✅ Dependencies installed"
echo ""

# Start dev server
echo "🔥 Starting dev server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Dashboard is running!"
echo ""
echo "📍 Open your browser and navigate to:"
echo "   http://localhost:5173"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Email:    admin@oorostore.com"
echo "   Password: Admin@12345"
echo ""
echo "ℹ️  Running in DEMO MODE (no backend required)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the dev server
npm run dev
