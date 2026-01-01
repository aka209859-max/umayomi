#!/bin/bash

# UMAYOMI API Test Script

echo "🚀 UMAYOMI API Test Starting..."
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Health Check
echo "Test 1: Health Check"
echo "GET $BASE_URL/api/health"
curl -s "$BASE_URL/api/health" | jq '.'
echo ""
echo "---"
echo ""

# Test 2: RGS Calculate
echo "Test 2: RGS Calculate"
echo "POST $BASE_URL/api/rgs/calculate"
curl -s -X POST "$BASE_URL/api/rgs/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "cnt_win": 300,
    "cnt_plc": 250,
    "rate_win_ret": 95,
    "rate_plc_ret": 88
  }' | jq '.'
echo ""
echo "---"
echo ""

# Test 3: AAS Calculate
echo "Test 3: AAS Calculate"
echo "POST $BASE_URL/api/aas/calculate"
curl -s -X POST "$BASE_URL/api/aas/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "horses": [
      {
        "group_id": "202501010101",
        "cnt_win": 300,
        "cnt_plc": 250,
        "rate_win_hit": 35,
        "rate_plc_hit": 55,
        "rate_win_ret": 95,
        "rate_plc_ret": 88
      },
      {
        "group_id": "202501010101",
        "cnt_win": 200,
        "cnt_plc": 180,
        "rate_win_hit": 28,
        "rate_plc_hit": 48,
        "rate_win_ret": 82,
        "rate_plc_ret": 75
      },
      {
        "group_id": "202501010101",
        "cnt_win": 150,
        "cnt_plc": 120,
        "rate_win_hit": 22,
        "rate_plc_hit": 42,
        "rate_win_ret": 68,
        "rate_plc_ret": 65
      }
    ]
  }' | jq '.'
echo ""
echo "---"
echo ""

# Test 4: Factor Test
echo "Test 4: Factor Test"
echo "POST $BASE_URL/api/factor/test"
curl -s -X POST "$BASE_URL/api/factor/test" \
  -H "Content-Type: application/json" \
  -d '{
    "factors": [
      { "name": "RGS基礎値", "weight": 40 },
      { "name": "AAS基礎値", "weight": 60 }
    ],
    "testData": [
      {
        "race_id": "R001",
        "horse_id": "H001",
        "actual_rank": 1,
        "rgs_score": 5.2,
        "aas_score": 8.3
      },
      {
        "race_id": "R001",
        "horse_id": "H002",
        "actual_rank": 2,
        "rgs_score": 4.1,
        "aas_score": 6.7
      },
      {
        "race_id": "R001",
        "horse_id": "H003",
        "actual_rank": 3,
        "rgs_score": 3.8,
        "aas_score": 5.2
      }
    ]
  }' | jq '.'
echo ""
echo "---"
echo ""

echo "✅ All tests completed!"
