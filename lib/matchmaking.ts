
import { StudentProfile, ProfessionalProfile } from '../types';

export function computeMatchScore(current: StudentProfile, other: StudentProfile): number {
  if (!current || !other) return 0;
  let score = 0;

  // 1. Skill Overlap (60%)
  const skillOverlap = other.skills?.filter(s => current.skills?.includes(s)).length || 0;
  // Prevent division by zero, though a student should have skills
  const currentSkillsLength = current.skills?.length > 0 ? current.skills.length : 1;
  score += (skillOverlap / currentSkillsLength) * 60;

  // 2. Interest Overlap (25%)
  const interestOverlap = other.interests?.filter(i => current.interests?.includes(i)).length || 0;
  const currentInterestsLength = current.interests?.length > 0 ? current.interests.length : 1;
  score += (interestOverlap / currentInterestsLength) * 25;

  // 3. XP/Level Proximity (15%)
  // Logic: 15 - (Difference * 5), clamped at 0.
  const levelDiff = Math.abs((current.level || 1) - (other.level || 1));
  score += Math.max(0, 15 - levelDiff * 5);

  // Cap at 100
  return Math.min(100, Math.round(score));
}

export function computeHiringMatchScore(professional: ProfessionalProfile, student: StudentProfile): number {
    if (!professional.hiringRequirements) return 0;

    const reqs = professional.hiringRequirements;
    let score = 0;

    // 1. Skills Match (65%)
    // Compare student skills against required skills
    const requiredSkills = reqs.requiredSkills || [];
    if (requiredSkills.length > 0) {
        const matches = student.skills.filter(skill => 
            requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
        ).length;
        score += (matches / requiredSkills.length) * 65;
    } else {
        // If no skills specified, give partial credit? Or 0. Let's give 0 strictly.
    }

    // 2. Domain Match (20%)
    // Check if student interests overlap with required domain
    const domain = reqs.domain?.toLowerCase();
    if (domain && student.interests.some(i => i.toLowerCase().includes(domain) || domain.includes(i.toLowerCase()))) {
        score += 20;
    }

    // 3. XP/Experience Match (15%)
    // Professional specifies years needed. Student has XP.
    // Heuristic: 100 XP ~= 1 Year roughly for this logic, or just raw level comparison
    // Let's assume req.experienceNeeded is Level equivalent for simplicity in this gamified app.
    const targetLevel = reqs.experienceNeeded || 1; 
    const studentLevel = student.level || 1;
    
    if (studentLevel >= targetLevel) {
        score += 15;
    } else {
        const diff = targetLevel - studentLevel;
        // Penalize 3 points per level difference
        score += Math.max(0, 15 - (diff * 3));
    }

    return Math.min(100, Math.round(score));
}
