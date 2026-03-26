import fs from 'fs';
import { checkEligibility } from '../src/engine/eligibilityEngine.js';

// Load Configs
const loadConfig = (name) => JSON.parse(fs.readFileSync(`./tests/configs/${name}.json`, 'utf8'));

const exams = {
   NORCET: loadConfig('norcet'),
   UPPSC: loadConfig('uppsc'),
   BTSC: loadConfig('btsc'),
   UKMSSB: loadConfig('ukmssb'),
   RRB: loadConfig('rrb')
};

const students = [
  {
     name: "Profile A: Standard UR B.Sc (31 Yrs)",
     data: {
        date_of_birth: '1993-01-01', gender: 'Female', category: 'UR', domicile: 'Delhi',
        is_pwbd: false, highest_degree: 'B.Sc_Nursing', passed_hs_science: true,
        hs_location_state: 'Delhi', nursing_council: 'Delhi', has_permanent_registration: true,
        employment_exchange: 'None', exp_years: 0, exp_months: 0, hospital_beds: 0,
        has_multiple_spouses: false
     }
  },
  {
     name: "Profile B: UP Domicile GNM (Age 39, 1 YR Exp)",
     data: {
        date_of_birth: '1985-01-01', gender: 'Male', category: 'OBC', domicile: 'Uttar Pradesh',
        is_pwbd: false, highest_degree: 'GNM', passed_hs_science: true,
        hs_location_state: 'Uttar Pradesh', nursing_council: 'Uttar Pradesh', has_permanent_registration: true,
        employment_exchange: 'None', exp_years: 1, exp_months: 0, hospital_beds: 100,
        has_multiple_spouses: false
     }
  },
  {
     name: "Profile C: Bihar Native SC Female (Age 42)",
     data: {
        date_of_birth: '1982-01-01', gender: 'Female', category: 'SC', domicile: 'Bihar',
        is_pwbd: false, highest_degree: 'Post_Basic_BSc', passed_hs_science: true,
        hs_location_state: 'Bihar', nursing_council: 'Bihar', has_permanent_registration: true,
        employment_exchange: 'Bihar', exp_years: 5, exp_months: 0, hospital_beds: 500,
        has_multiple_spouses: false
     }
  },
  {
     name: "Profile D: Uttarakhand Native UR (Age 41, Non-Science)",
     data: {
        date_of_birth: '1983-01-01', gender: 'Female', category: 'UR', domicile: 'Uttarakhand',
        is_pwbd: false, highest_degree: 'MSc_Nursing', passed_hs_science: false,
        hs_location_state: 'Uttarakhand', nursing_council: 'Uttarakhand', has_permanent_registration: true,
        employment_exchange: 'Uttarakhand', exp_years: 10, exp_months: 0, hospital_beds: 500,
        has_multiple_spouses: false
     }
  }
];

console.log("=== INITIATING COMPREHENSIVE ENGINE SIMULATION ===\n");

students.forEach(student => {
   console.log(`\n======================================================`);
   console.log(`EVALUATING: ${student.name}`);
   console.log(`------------------------------------------------------`);
   
   Object.keys(exams).forEach(examName => {
      const config = exams[examName];
      const result = checkEligibility(student.data, config);
      
      let badge = result.status === 'ELIGIBLE' ? '✅ ELIGIBLE' : result.status === 'CAUTION' ? '⚠️ CAUTION' : '❌ INELIGIBLE';
      console.log(`\n[${examName}] -> ${badge}`);
      
      if (result.status === 'INELIGIBLE') {
          result.reasons.forEach(r => console.log(`   └─ FAIL: ${r}`));
      }
      if (result.warnings.length > 0) {
          result.warnings.forEach(w => console.log(`   └─ WARN: ${w}`));
      }
   });
});

console.log("\n=== SIMULATION COMPLETE ===");
