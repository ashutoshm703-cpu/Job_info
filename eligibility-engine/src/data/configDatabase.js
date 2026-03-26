import norcet from '../../tests/configs/norcet.json';
import uppsc from '../../tests/configs/uppsc.json';
import btsc from '../../tests/configs/btsc.json';
import ukmssb from '../../tests/configs/ukmssb.json';
import rrb from '../../tests/configs/rrb.json';

export const initialExams = [
  {
    id: "exam-norcet-25",
    metadata: {
      exam_name: "AIIMS NORCET 8 (2025)",
      image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/All_India_Institute_of_Medical_Sciences%2C_New_Delhi_Logo.png/220px-All_India_Institute_of_Medical_Sciences%2C_New_Delhi_Logo.png",
      total_vacancies: 1500,
      salary_range: "Level 7 (₹44,900 - ₹1,42,400)",
      important_dates: [
         { label: "Online Application Opens", date: "2025-08-01", action_url: "https://aiimsexams.ac.in/apply", cta_text: "Register Now" },
         { label: "Application & Fee Deadline", date: "2025-08-31", action_url: "https://aiimsexams.ac.in/pay", cta_text: "Pay Fee" },
         { label: "Correction Window Begins", date: "2025-09-02", action_url: "https://aiimsexams.ac.in/correction", cta_text: "Edit Form" },
         { label: "Stage I Admit Card Download", date: "2025-09-10", action_url: "https://aiimsexams.ac.in/admit-card", cta_text: "Get Admit Card" },
         { label: "Stage I CBT Exam", date: "2025-09-15", action_url: "", cta_text: "" }
      ],
      notification_url: "https://aiimsexams.ac.in/rules"
    },
    ...norcet
  },
  {
    id: "exam-uppsc-23",
    metadata: {
      exam_name: "UPPSC Staff Nurse Recruitment (2023)",
      image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/UPPSC_Logo.png",
      total_vacancies: 2240,
      salary_range: "Level 7 (₹44,900 - ₹1,42,400)",
      important_dates: [
         { label: "Commencement of Online Application", date: "2023-08-21", action_url: "https://uppsc.up.nic.in", cta_text: "UPPSC Portal" },
         { label: "Last Date for Fee Deposition", date: "2023-09-21", action_url: "https://uppsc.up.nic.in/fee", cta_text: "Submit Fee" },
         { label: "Last Date for Application Submission", date: "2023-09-29", action_url: "", cta_text: "" },
         { label: "Last Date for Hard Copy Delivery", date: "2023-10-15", action_url: "", cta_text: "" }
      ],
      notification_url: "https://uppsc.up.nic.in/notification"
    },
    ...uppsc
  },
  {
    id: "exam-btsc-23",
    metadata: {
      exam_name: "BTSC Bihar Nursing Officer",
      image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Bihar_Government_Logo.svg/1200px-Bihar_Government_Logo.svg.png",
      total_vacancies: 10709,
      salary_range: "Level 7 (₹44,900 - ₹1,42,400)",
      important_dates: [
         { label: "Registration Opens", date: "2023-06-01", action_url: "https://btsc.bihar.gov.in", cta_text: "Apply via BTSC" },
         { label: "Registration Closes", date: "2023-06-30", action_url: "", cta_text: "" }
      ],
      notification_url: "https://btsc.bihar.gov.in"
    },
    ...btsc
  },
  {
    id: "exam-ukmssb-25",
    metadata: {
      exam_name: "Uttarakhand UKMSSB Nursing Officer",
      image_url: "https://ukmssb.org/wp-content/uploads/2016/11/logo.png",
      total_vacancies: 1455,
      salary_range: "Level 7 (₹44,900 - ₹1,42,400)",
      important_dates: [
         { label: "Advertisement Date", date: "2025-02-10", action_url: "https://ukmssb.org/advertisement", cta_text: "View PDF" },
         { label: "Online Application Start", date: "2025-02-15", action_url: "https://ukmssb.org/apply", cta_text: "Portal Link" },
         { label: "Fee Payment Deadline", date: "2025-03-15", action_url: "https://ukmssb.org/pay", cta_text: "Pay Here" }
      ],
      notification_url: "https://ukmssb.org/pdf"
    },
    ...ukmssb
  },
  {
    id: "exam-rrb-25",
    metadata: {
      exam_name: "RRB Staff Nurse Recruitment",
      image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Indian_Railways_Logo.svg/1200px-Indian_Railways_Logo.svg.png",
      total_vacancies: 713,
      salary_range: "Level 7 (₹44,900 - ₹1,42,400)",
      important_dates: [
         { label: "Date of Publication", date: "2024-12-01", action_url: "", cta_text: "" },
         { label: "Opening Date of Application", date: "2025-01-01", action_url: "https://indianrailways.gov.in", cta_text: "Register" },
         { label: "Closing Date for Submission", date: "2025-01-30", action_url: "", cta_text: "" },
         { label: "Dates for Modification Window", date: "2025-02-05", action_url: "https://indianrailways.gov.in/modify", cta_text: "Modify Form" }
      ],
      notification_url: "https://indianrailways.gov.in"
    },
    ...rrb
  }
];

export const getStoredExams = () => {
  const stored = localStorage.getItem('eligibility-exams');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('eligibility-exams', JSON.stringify(initialExams));
  return initialExams;
}

export const saveExams = (exams) => {
  localStorage.setItem('eligibility-exams', JSON.stringify(exams));
}
