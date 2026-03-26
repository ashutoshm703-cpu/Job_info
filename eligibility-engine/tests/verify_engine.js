import fs from 'fs';
import { checkEligibility } from '../src/engine/eligibilityEngine.js';

const initialSchema = JSON.parse(fs.readFileSync('./src/data/masterSchema.json', 'utf8'));

const runTests = () => {
    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
        if (condition) {
            console.log(`✅ PASS: ${testName}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${testName}`);
            failed++;
        }
    };

    console.log("--- RUNNING ELIGIBILITY ENGINE TEST SUITE ---");

    // TEST 1: The Domicile Lock (OBC from UP applying to Uttarakhand)
    const test1Profile = {
        date_of_birth: '1982-01-01', // Age 43 in 2025
        gender: 'Female',
        category: 'OBC',
        domicile: 'Uttar Pradesh', // Outsider
        is_pwbd: false,
        highest_degree: 'B.Sc_Nursing',
        passed_hs_science: true,
        hs_location_state: 'Uttarakhand', // Passed the school location lock
        nursing_council: 'Uttarakhand',
        has_permanent_registration: true,
        employment_exchange: 'Uttarakhand',
        exp_years: 0,
        exp_months: 0,
        hospital_beds: 0,
        has_multiple_spouses: false
    };

    const res1 = checkEligibility(test1Profile, initialSchema);
    // Since locked_to_state is Uttarakhand, UP domicile forces Category to UR.
    // UR Base Max Female is 42. Since they are 43, they exceed 42 (OBC relaxation of 5 is stripped).
    assert(res1.status === 'INELIGIBLE', 'TEST 1: Domicile Override properly strips OBC benefits causing age failure.');
    assert(res1.reasons.some(r => r.includes('exceeds the maximum allowed age of 42')), 'TEST 1: Reason explicitly notes UR Max Age.');

    // TEST 2: The Geographic Schooling Lock
    const test2Profile = { ...test1Profile, domicile: 'Uttarakhand', category: 'UR', date_of_birth: '1995-01-01', hs_location_state: 'Delhi' };
    const res2 = checkEligibility(test2Profile, initialSchema);
    assert(res2.status === 'INELIGIBLE', 'TEST 2: Geographic Schooling Lock properly flags out-of-state schooling.');
    assert(res2.reasons.some(r => r.includes('schooling explicitly inside the state of Uttarakhand')), 'TEST 2: Explicit schooling reason provided.');

    // TEST 3: Perfect Candidate (Should get Caution only for Bonus)
    const test3Profile = { ...test1Profile, domicile: 'Uttarakhand', date_of_birth: '1995-01-01' };
    const res3 = checkEligibility(test3Profile, initialSchema);
    assert(res3.status === 'ELIGIBLE', 'TEST 3: Perfect native Uttarakhand candidate successfully passes the labyrinth.');

    console.log(`\n--- RESULTS: ${passed} Passed, ${failed} Failed ---`);
};

runTests();
