import { PricingModel } from "@/lib/validators/bookingSchema";

export interface DesignerRates {
  rate_hourly?: number;
  rate_project?: number;
  rate_subscription?: number;
}

export interface AvailabilitySchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

/**
 * Calculate total price based on pricing model
 */
export function calculateTotalPrice(
  pricingModel: PricingModel,
  designerRates: DesignerRates,
  durationMinutes?: number,
  tip: number = 0
): number {
  let basePrice = 0;

  switch (pricingModel) {
    case "hourly":
      if (!designerRates.rate_hourly || !durationMinutes) {
        throw new Error("Hourly rate and duration are required for hourly bookings");
      }
      const hours = durationMinutes / 60;
      basePrice = designerRates.rate_hourly * hours;
      break;

    case "project":
      if (!designerRates.rate_project) {
        throw new Error("Project rate is required for project bookings");
      }
      basePrice = designerRates.rate_project;
      break;

    case "subscription":
      if (!designerRates.rate_subscription) {
        throw new Error("Subscription rate is required for subscription bookings");
      }
      basePrice = designerRates.rate_subscription;
      break;

    default:
      throw new Error("Invalid pricing model");
  }

  return basePrice + tip;
}

/**
 * Check if designer is available at a given time
 */
export function checkAvailability(
  schedules: AvailabilitySchedule[],
  targetDate: Date,
  durationMinutes: number = 60
): { available: boolean; reason?: string } {
  const dayOfWeek = targetDate.getDay();
  const targetTime = targetDate.toTimeString().split(" ")[0].substring(0, 5); // HH:mm

  const daySchedules = schedules.filter((s) => s.day_of_week === dayOfWeek && s.is_available);

  if (daySchedules.length === 0) {
    return { available: false, reason: "Designer not available on this day" };
  }

  const endTime = new Date(targetDate.getTime() + durationMinutes * 60000);
  const endTimeStr = endTime.toTimeString().split(" ")[0].substring(0, 5);

  const isAvailable = daySchedules.some((schedule) => {
    return targetTime >= schedule.start_time && endTimeStr <= schedule.end_time;
  });

  if (!isAvailable) {
    return { available: false, reason: "Requested time slot is not available" };
  }

  return { available: true };
}

/**
 * Estimate completion date based on duration and current availability
 */
export function estimateCompletion(
  schedules: AvailabilitySchedule[],
  startDate: Date,
  totalMinutes: number
): Date {
  let remainingMinutes = totalMinutes;
  let currentDate = new Date(startDate);

  while (remainingMinutes > 0) {
    const dayOfWeek = currentDate.getDay();
    const daySchedules = schedules.filter((s) => s.day_of_week === dayOfWeek && s.is_available);

    if (daySchedules.length === 0) {
      // Skip to next day
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    for (const schedule of daySchedules) {
      const [startHour, startMin] = schedule.start_time.split(":").map(Number);
      const [endHour, endMin] = schedule.end_time.split(":").map(Number);

      const slotStart = new Date(currentDate);
      slotStart.setHours(startHour, startMin, 0, 0);

      const slotEnd = new Date(currentDate);
      slotEnd.setHours(endHour, endMin, 0, 0);

      if (slotStart >= currentDate) {
        const availableMinutes = (slotEnd.getTime() - slotStart.getTime()) / (1000 * 60);

        if (availableMinutes >= remainingMinutes) {
          currentDate.setTime(slotStart.getTime() + remainingMinutes * 60000);
          remainingMinutes = 0;
          break;
        } else {
          remainingMinutes -= availableMinutes;
          currentDate = new Date(slotEnd);
        }
      }
    }

    if (remainingMinutes > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }
  }

  return currentDate;
}

/**
 * Calculate days until completion
 */
export function calculateDaysUntilCompletion(completionDate: Date): number {
  const now = new Date();
  const diffMs = completionDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
