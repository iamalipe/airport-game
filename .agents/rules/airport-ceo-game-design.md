# Airport CEO - Game Design & Domain Rules

This document specifies the core game design, mechanics, and domain models for the Airport CEO Web simulation. All game features must follow these specifications.

---

## 1. World & Infrastructure Layout

### 1.1 Multi-Floor Tile Grid

The world is organized into a discrete multi-floor grid:

- **Floor -1 (Basement):** Baggage conveyor networks, underground service roads, utility tunnels.
- **Floor 0 (Ground Level):** Main terminal entrance, check-in hall, baggage claim, apron, runways, taxiways, aircraft stands, service roads.
- **Floor 1 (First Floor):** Security checkpoints, departures lounge, boarding gates, duty-free retail, food courts.
- **Floor 2+ (Upper Floors):** Airline VIP lounges, administrative offices, observation decks.

### 1.2 Zoning System

Every walkable tile belongs to a zone:

- `None / Exterior`: Outdoor terrain, parking, drop-off zones.
- `Public Zone`: Unrestricted terminal area (landside).
- `Secure Zone`: Post-security departures area (airside terminal). Requires passing an active security checkpoint.
- `Staff Only`: Accessible only by on-duty employees (breakrooms, maintenance closets, admin offices).
- `Ramp / Airside`: Apron, taxiways, runways, service vehicle roads. Requires Ramp Agent clearance or service vehicles.

### 1.3 Airside Infrastructure

- **Runways:** Small (General Aviation), Medium (Regional jets/narrowbodies e.g. A320/B737), Large (Widebodies e.g. B777/A380). Requires entry/exit taxiway nodes, ILS lighting, and runway direction setup.
- **Taxiways:** Directional path network connecting runways to aircraft stands. Includes taxiway hold-short nodes.
- **Aircraft Stands:**
  - _Small Stand:_ General Aviation and small props (Cessna, ATR 42, CRJ).
  - _Medium Stand:_ Narrowbody airliners (A320, B737, E190).
  - _Large Stand:_ Widebody airliners (A350, B777, B787, A380).
  - Connectors: Optional Jetway (connects directly to Floor 1) or Stairway + Apron Bus/Walk path.
- **Service Road Network:** Dedicated asphalt roads connecting vehicle depots, fuel depots, baggage bays, and stands without interfering with aircraft taxiways.

---

## 2. Flight & Turnaround Operations

### 2.1 Flight Schedule & Contracts

- **Airline Contracts:** Airlines offer flight contracts with requirements (minimum airport rating, required stand sizes, available fuel type).
- **Flight Master Schedule:** 24-hour Gantt chart where player schedules allocated flights into specific stands.
- **Flight Statuses:**
  `Scheduled` -> `Inbound Approach` -> `Landed` -> `Taxi to Stand` -> `On Stand (Turnaround)` -> `Boarding Completed` -> `Pushback` -> `Taxi to Runway` -> `Takeoff` -> `Departed` / `Cancelled`.

### 2.2 Turnaround Workflow (The Core Loop)

When an aircraft parks at a stand, the turnaround sequence begins:

```
[ Aircraft Arrives on Stand ]
          │
          ├──► 1. Passenger Deboarding (Jetway or Stairway -> Terminal Arrival Path)
          ├──► 2. Baggage Unloading (Belt loader + Baggage Tug -> Baggage Bay)
          │
          ▼ (After Deboarding & Unload complete)
          ├──► 3. Cabin Cleaning (Janitor crew / Cleaning service vehicle)
          ├──► 4. In-Flight Catering (Catering Truck loading meals)
          ├──► 5. Refueling (Avgas or Jet A-1 Fuel Truck)
          │
          ▼ (After Cleaning, Catering & Fueling complete)
          ├──► 6. Baggage Loading (Baggage Tug from Bay -> Belt loader -> Cargo Hold)
          ├──► 7. Passenger Boarding (Gate Agent scans passes -> Walk/Bus/Jetway -> Board)
          │
          ▼ (All services complete & doors closed)
[ Pushback Tug Dispatched -> Engine Start -> Taxi to Runway ]
```

Turnaround service requirements scale with aircraft size (e.g. Small GA flights need only refueling; Large international widebodies require all 7 services with multiple service trucks).

---

## 3. Passenger (PAX) Simulation

### 3.1 Departing Passenger Flow

1. **Arrival:** Arrive via car, bus, or subway at the airport entrance.
2. **Check-in:** Queue at Check-in Desk (staffed by Airport Staff) or Self-Service Kiosk to receive a boarding pass.
3. **Baggage Drop:** Drop checked luggage onto conveyor belt.
4. **Security Screening:** Walk through Security Checkpoint (Metal Detector + Bag Scanner staffed by Security Officers).
5. **Dwell / Shopping:** Explore Secure Zone, satisfy needs (buy food/drink, use restroom, sit on benches, shop in retail).
6. **Gate Boarding:** Proceed to assigned Gate Desk before boarding closes.
7. **Boarding:** Scan pass at Gate Desk and enter aircraft.

### 3.2 Arriving Passenger Flow

1. **Deboard:** Exit aircraft onto Floor 1 Jetway or Ground Walkway.
2. **Baggage Claim:** Proceed to assigned Baggage Carousel on Floor 0.
3. **Luggage Pickup:** Match baggage tag and collect bag from rotating carousel.
4. **Exit:** Pass through exit one-way security doors to public area and leave airport.

### 3.3 Passenger Needs & Stats

- **Needs (0 to 100):**
  - `Hunger` (satisfied by cafes, restaurants, vending machines)
  - `Thirst` (satisfied by drink shops, water fountains)
  - `Bladder` (satisfied by restrooms)
  - `Rest / Energy` (satisfied by terminal seating / lounges)
  - `Boredom` (satisfied by duty-free retail, electronics shops, viewing windows)
  - `Stress / Punctuality` (increases if long queues, missing flights, or low comfort)
- **Satisfaction Rating:** Passengers submit ratings based on queue times, cleanliness, facility availability, and on-time flight departures.

---

## 4. Baggage Handling System

The baggage handling system is a physical and logical directed graph:

- **Conveyor Belt Types:**
  - Standard Conveyor Belt (1 tile/sec).
  - High-Speed Conveyor Belt (3 tiles/sec).
  - Vertical Conveyor Transition (Floor -1 <-> Floor 0 <-> Floor 1).
  - Tilt Tray / Diverter (Routes bags to specific branch lines based on destination tag).
  - Baggage Scanner (Tier 1 X-Ray, Tier 2 Explosive Detector, Tier 3 CT Scanner). Suspicious bags divert to security manual inspection.
  - Baggage Bay / Depots: Sorts bags into baggage carts for specific stands.
  - Baggage Carousel: Recirculating loop for arriving passengers.

---

## 5. Staff & Employee Management

Employees operate on shifts and execute automated task assignments:

1. **Airport Staff:** Operates Check-in desks, Information booths, and Boarding gates.
2. **Security Officers:** Staffs security checkpoint metal detectors and baggage inspection stations.
3. **Ramp Agents:** Drives baggage tugs, operates belt loaders, assists aircraft pushback, and inspects ramps.
4. **Service Technicians:** Repairs degrading infrastructure (runway cracks, broken baggage belts, faulty scanners) and maintains vehicle fleet.
5. **Janitors:** Cleans dirty terminal tiles, empties trash cans, cleans restrooms, and cleans aircraft cabins.
6. **Executives / Administrators:** Hired to unlock procurement projects, negotiate cheaper fuel contracts, and manage airline relations.

---

## 6. Economy, Procurement & Progression

### 6.1 Financial Accounting

- **Revenue:**
  - Aircraft Landing & Takeoff Fees (per flight).
  - Passenger Service Charges (per passenger).
  - Fuel Sales Margin (profit per liter of Avgas / Jet A-1).
  - Retail & Restaurant Franchise Rent / Royalties.
  - Baggage Handling Fees.
- **Expenses:**
  - Hourly Employee Payroll.
  - Infrastructure Maintenance & Repair.
  - Electricity & Heating Utility Bills.
  - Construction & Demolition CapEx.
  - Bank Loan Interest.

### 6.2 Procurement / Research Tree

Progressively unlocks capabilities:

- _Commercial Aviation License_ (Transitions from General Aviation to Commercial Flights).
- _Fuel Supply Contracts_ (Avgas -> Jet A-1 Fuel Tanks and Truck depots).
- _Medium / Large Aircraft Operations_ (Unlocks medium & large stands, asphalt/concrete runways).
- _Advanced Baggage Handling_ (Unlocks multi-tier scanners, high-speed belts, underground routing).
- _Automated Terminal Operations_ (Self-check-in kiosks, automatic e-gates, automated baggage drop).
- _Night Flight Operations_ (Requires runway & taxiway lighting systems).
