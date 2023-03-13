import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date no provided" });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User does not exist." });
  }

  const referenceDate = dayjs(String(date));
  const isPasteDate = referenceDate.endOf("day").isBefore(new Date());

  if (isPasteDate) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvaibility = await prisma.userInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvaibility) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvaibility;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.startOf("day").toDate(),
        lte: referenceDate.endOf("day").toDate(),
      },
    },
  });

  const availableTimes = blockedTimes.map((schedules) => {
    return schedules.date;
  });

  return res.json({ possibleTimes, availableTimes });
}
