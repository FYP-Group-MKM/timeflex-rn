const uuid = require('uuid');
const {
    addDays,
    setHours,
    setMinutes,
    differenceInCalendarDays,
    addMinutes,
    addWeeks,
    addMonths,
    isBefore,
    isAfter,
} = require('date-fns');

function getFirstDay() {
    let firstDay = new Date();
    if (firstDay.getHours() >= 9) {
        firstDay = addDays(firstDay, 1);
    }
    firstDay = setHours(firstDay, 0);
    firstDay = setMinutes(firstDay, 0);
    return firstDay;
}

function duplicateRecurringAppointments(input, appointments) {
    const recurAppointments = [...appointments];
    appointments.forEach(appointment => {
        let { startDate, endDate, rRule } = appointment;
        const { deadline } = input;

        if (!rRule)
            return;

        while (isBefore(startDate, deadline)) {
            if (rRule === "FREQ=DAILY;INTERVAL=1") {
                startDate = addDays(startDate, 1)
                endDate = addDays(endDate, 1)
            }
            if (rRule.includes("FREQ=WEEKLY")) {
                startDate = addWeeks(startDate, 1)
                endDate = addWeeks(endDate, 1);
            }
            if (rRule.includes("FREQ=MONTHLY")) {
                startDate = addMonths(startDate, 1);
                endDate = addMonths(endDate, 1);
            }
            recurAppointments.push({
                ...appointment,
                startDate: startDate,
                endDate: endDate
            });
        }
    });
    return recurAppointments;
}

function getArrayCalendar(input, appointments) {
    let firstDay = getFirstDay();
    const arrayCalendar = [];
    let availDays = differenceInCalendarDays(input.deadline, firstDay);

    if (availDays <= 0) return arrayCalendar;

    for (let i = 0; i < availDays; i++) {
        const day = [];
        for (j = 0; j < 48; j++) {
            day.push("free");
        }
        arrayCalendar.push(day);
    }

    // This alogrithm does not consider cross-day case e.g. 23:30 15/1 ~ 01:30 16/1
    appointments.forEach(appointment => {
        let dayNum = differenceInCalendarDays(new Date(appointment.startDate), firstDay);

        if (dayNum < 0)
            return;
        if (dayNum > arrayCalendar.length)
            return;

        let { startDate, endDate } = appointment;
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let arrayOccupationStart;
        let arrayOccupationEnd;

        let timeslot = {
            start: setHours(setMinutes(startDate, 0), 0),
            end: setHours(setMinutes(startDate, 30), 0)
        };
        for (let i = 0; i < 48; i++) {
            if (!isBefore(startDate, timeslot.start) && isBefore(startDate, timeslot.end))
                arrayOccupationStart = i;
            if (isAfter(endDate, timeslot.start) && !isAfter(endDate, timeslot.end)) {
                arrayOccupationEnd = i;
                break;
            }
            timeslot = { start: addMinutes(timeslot.start, 30), end: addMinutes(timeslot.end, 30) };
        }

        for (let i = arrayOccupationStart; i <= arrayOccupationEnd; i++) {
            arrayCalendar[dayNum][i] = "occupied";
        }
    });
    return arrayCalendar;
}

function allocate(input, arrayCalendar) {
    const solution = [...arrayCalendar];
    let remaining = input.exDuration * 2;
    let minSlots = input.divisible ? input.minSession * 2 : remaining;
    let maxSlots = input.divisible ? input.maxSession * 2 : remaining;

    for (let i = 0; i < solution.length; i++) {
        day:
        for (let k = maxSlots; k >= minSlots; k--) {
            for (let j = 18; j <= 48 - k; j++) {
                if (solution[i].slice(j, j + k).every((slot) => slot !== "occupied")) {
                    for (let m = j; m < j + k; m++) {
                        solution[i][m] = "picked";
                        remaining -= 1;
                        if (remaining < maxSlots)
                            maxSlots = remaining;
                        if (remaining === 0) {
                            return solution;
                        }
                    }
                    break day;
                }
            }
        }
    }
    return false;
}

function convertToJSON(input, solution) {
    const result = [];
    let firstDay = getFirstDay();

    let lowerTimePointer = new Date(firstDay);
    lowerTimePointer = new Date(lowerTimePointer).setHours(0);
    lowerTimePointer = new Date(lowerTimePointer).setMinutes(0);
    lowerTimePointer = new Date(lowerTimePointer);

    let upperTimePointer = new Date(firstDay);
    upperTimePointer = new Date(upperTimePointer).setHours(0);
    upperTimePointer = new Date(upperTimePointer).setMinutes(30);
    upperTimePointer = new Date(upperTimePointer);

    for (let i = 0; i < solution.length; i++) {
        let startDate = null;
        let endDate = null;
        for (let j = 0; j < 48; j++) {
            if (solution[i][j] === "picked") {
                if (!startDate)
                    startDate = lowerTimePointer;
                endDate = upperTimePointer;
                if (solution[i][j + 1] !== "picked") {
                    const appointment = {
                        googleId: input.googleId,
                        appointmentId: uuid.v4(),
                        title: input.title,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        description: input.description
                    }
                    result.push(appointment);
                }
            }
            lowerTimePointer = new Date(new Date(lowerTimePointer).setMinutes(new Date(lowerTimePointer).getMinutes() + 30));
            upperTimePointer = new Date(new Date(upperTimePointer).setMinutes(new Date(upperTimePointer).getMinutes() + 30));
        }
    }
    return result;
}

function smartPlanning(input, appointments) {
    const recurringAppointments = duplicateRecurringAppointments(input, appointments);
    const arrayCalendar = getArrayCalendar(input, recurringAppointments);
    const solution = allocate(input, arrayCalendar);
    return solution ? convertToJSON(input, solution) : false;
}

module.exports = smartPlanning;