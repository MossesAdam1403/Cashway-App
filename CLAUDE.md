# CashWay — CLAUDE.md

## What is CashWay
CashWay is an on-demand physical cash delivery platform for Tanzania.
The platform allows users to request physical cash to their location 
through nearby verified agents.
CashWay works like Uber, but instead of transporting people, 
it coordinates cash delivery.
First city: Dar es Salaam, Tanzania.
Built as a native mobile app for Android and iOS.

## The Three Users

### Customer
- Opens app and requests a specific amount of cash
- Shares their live location
- Pays via mobile money (M-Pesa, Tigopesa, Airtel Money) or card
- Waits for nearby agent to accept and deliver
- Confirms delivery via OTP code

### Agent
- Receives nearby cash requests on their app
- Accepts the request
- Physically delivers cash to customer location
- Confirms handover via OTP
- Gets paid automatically after confirmed delivery

### Admin
- Monitors all transactions in real time
- Manages and verifies agents
- Views analytics and reports
- Handles disputes and issues

## Revenue Model
- Service fee: 3% of cash requested → 100% to CashWay
- Delivery fee: TSH 2,000 flat per delivery
- Agent gets: 80% of delivery fee (TSH 1,600)
- CashWay gets: 20% of delivery fee (TSH 400) + full service fee

## Tech Stack
- Frontend: React Native + Expo
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Payments: Flutterwave (M-Pesa, Tigopesa, Airtel Money, Card)
- SMS/OTP: Africa's Talking
- Location: MongoDB Geolocation

## Build Phases

### Phase 1 — MVP (Build this first, nothing else)
- User authentication (Customer and Agent)
- Customer cash request flow
- Manual agent assignment
- Payment integration via Flutterwave
- OTP delivery confirmation
- Basic admin dashboard

### Phase 2
- Automatic location based agent matching
- Real time status updates
- Push and SMS notifications
- Agent mobile interface improvements

### Phase 3
- Real time tracking
- Bank integrations
- Full analytics dashboard
- Multi city scaling

## GitHub
https://github.com/MossesAdam1403/Cashway-App.git

## Core Rules
- Backend must always be built before frontend integration
- Never change designs without Moses approval
- Always explain architecture decisions before implementation
- Always remind Moses to test after every major feature
- Prioritize clean, scalable, maintainable code
- Always consider Tanzanian real world conditions
- Focus only on Phase 1 until Moses says otherwise

## Important Instructions for Claude Code
Before writing any code:
1. Analyze the feature request carefully
2. Explain the implementation plan step by step
3. Explain architecture decisions, database structure, 
   API flow, security and scalability considerations
4. Wait for Moses approval before implementation
5. Then implement in clean modular steps

Claude Code must act like a senior software architect, 
not just a code generator.

## Development Philosophy
CashWay is not just a fintech app. It is:
- A liquidity coordination system
- A cash logistics platform
- A real world operational infrastructure

The system must prioritize reliability, security, scalability, 
simplicity and real world usability over flashy features.
CashWay is a real business. Quality matters, not just getting it to work.