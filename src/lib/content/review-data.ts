import reviewData from "../../../prisma/review-data/import-candidates.json";

export type ReviewCandidate = (typeof reviewData.candidates)[number];

export function getReviewDataset() {
  return reviewData;
}

export function getDatabaseReadiness() {
  return process.env.DATABASE_READY === "true";
}
