import { UserProfile } from '../types';

export function computeMatchScore(current: UserProfile, other: UserProfile): number {
  if (!current || !other) return 0;
  let score = 0, total = 0;

  // 1. Skill Overlap (45%)
  // Skills are crucial. If they match, great. But often we want complementary skills too.
  // For this algorithm, we stick to overlap as a proxy for "relevance".
  total += 45;
  const skillOverlap = other.skills?.filter(s => current.skills?.includes(s)).length || 0;
  score += (skillOverlap / (current.skills?.length || 1)) * 45;

  // 2. Interest Overlap (25%)
  // Shared interests keep the team motivated.
  total += 25;
  const interestOverlap = other.interests?.filter(i => current.interests?.includes(i)).length || 0;
  score += (interestOverlap / (current.interests?.length || 1)) * 25;

  // 3. XP/Level Proximity (15%)
  // Similar experience levels often result in smoother collaboration (peer-to-peer).
  total += 15;
  const xpDiff = Math.abs((current.level || 1) - (other.level || 1));
  score += Math.max(0, 15 - xpDiff * 5);

  // 4. Rating Compatibility (15%) - NEW
  // Elo/Rating proximity implies similar competitive capability.
  total += 15;
  const currentRating = current.rating || 1000;
  const otherRating = other.rating || 1000;
  const ratingDiff = Math.abs(currentRating - otherRating);
  // Max score if within 100 points, decreasing after that.
  // 500 points diff = 0 score.
  const ratingScore = Math.max(0, 15 - (ratingDiff / 500) * 15); 
  score += ratingScore;

  return Math.min(100, Math.round((score / total) * 100));
}